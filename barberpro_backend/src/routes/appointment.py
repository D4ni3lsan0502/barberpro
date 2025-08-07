from flask import Blueprint, request, jsonify
from src.database import db
from src.models.appointment import Appointment
from src.models.client import Client
from src.models.barber import Barber
from src.models.service import Service
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from bson.objectid import ObjectId

appointment_bp = Blueprint("appointment_bp", __name__)

@appointment_bp.route("/appointments", methods=["POST"])
@jwt_required()
def create_appointment():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")

    if current_user_role != "client":
        return jsonify({"message": "Unauthorized: Only clients can create appointments"}), 403

    data = request.get_json()
    client_id = current_user_id
    barber_id = data.get("barber_id")
    date_str = data.get("date")
    time_str = data.get("time")
    duration = data.get("duration")
    total_price = data.get("total_price")
    appointment_type = data.get("appointment_type")
    service_ids = data.get("service_ids", [])
    payment_method = data.get("payment_method")
    payment_status = data.get("payment_status")
    address = data.get("address", {})

    if not all([barber_id, date_str, time_str, duration, total_price, appointment_type, payment_method, payment_status]):
        return jsonify({"message": "Missing required fields"}), 400

    client = Client.find_by_id(client_id)
    barber = Barber.find_by_id(barber_id)
    if not client or not barber:
        return jsonify({"message": "Client or Barber not found"}), 404

    new_appointment = Appointment(
        client_id=client_id,
        barber_id=barber_id,
        date=date_str,
        time=time_str,
        duration=duration,
        total_price=total_price,
        status='pending',
        appointment_type=appointment_type,
        service_ids=service_ids,
        payment_method=payment_method,
        payment_status=payment_status,
        address=address
    )
    new_appointment.save()

    return jsonify({"message": "Appointment created successfully", "appointment": new_appointment.to_dict()}), 201

@appointment_bp.route("/appointments", methods=["GET"])
@jwt_required()
def get_appointments():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")

    query = {}
    if current_user_role == "client":
        query["client_id"] = str(current_user_id)
    elif current_user_role == "barber":
        query["barber_id"] = str(current_user_id)
    else:
        return jsonify({"message": "Unauthorized: Invalid role"}), 403

    status = request.args.get("status")
    date = request.args.get("date")

    appointments = Appointment.find_all(barber_id=query.get("barber_id"), client_id=query.get("client_id"), status=status, date=date)
    
    # Fetch client and service details for each appointment
    appointments_with_details = []
    for appt in appointments:
        appt_dict = appt.to_dict()
        client = Client.find_by_id(appt.client_id)
        if client:
            appt_dict["client_name"] = client.name
            appt_dict["client_email"] = client.email
        
        services = []
        for service_id in appt.service_ids:
            service = Service.find_by_id(service_id)
            if service:
                services.append(service.to_dict())
        appt_dict["services_details"] = services
        appointments_with_details.append(appt_dict)

    return jsonify({"appointments": appointments_with_details}), 200

@appointment_bp.route("/appointments/<appointment_id>", methods=["GET"])
@jwt_required()
def get_appointment(appointment_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")

    appointment = Appointment.find_by_id(appointment_id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404
    
    if current_user_role == "client" and str(appointment.client_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized access"}), 403
    if current_user_role == "barber" and str(appointment.barber_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized access"}), 403

    return jsonify({"appointment": appointment.to_dict()}), 200

@appointment_bp.route("/appointments/<appointment_id>", methods=["PUT"])
@jwt_required()
def update_appointment(appointment_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")

    appointment = Appointment.find_by_id(appointment_id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404

    if current_user_role == "client" and str(appointment.client_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized access"}), 403
    if current_user_role == "barber" and str(appointment.barber_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized access"}), 403

    data = request.get_json()
    appointment.date = data.get("date", appointment.date)
    appointment.time = data.get("time", appointment.time)
    appointment.duration = data.get("duration", appointment.duration)
    appointment.total_price = data.get("total_price", appointment.total_price)
    appointment.status = data.get("status", appointment.status)
    appointment.appointment_type = data.get("appointment_type", appointment.appointment_type)
    appointment.service_ids = data.get("service_ids", appointment.service_ids)
    appointment.payment_method = data.get("payment_method", appointment.payment_method)
    appointment.payment_status = data.get("payment_status", appointment.payment_status)
    appointment.address = data.get("address", appointment.address)

    appointment.save()
    return jsonify({"message": "Appointment updated successfully", "appointment": appointment.to_dict()}), 200

@appointment_bp.route("/appointments/<appointment_id>", methods=["DELETE"])
@jwt_required()
def delete_appointment(appointment_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")

    appointment = Appointment.find_by_id(appointment_id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404

    if current_user_role == "client" and str(appointment.client_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized access"}), 403
    if current_user_role == "barber" and str(appointment.barber_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized access"}), 403

    if Appointment.delete_by_id(appointment_id):
        return jsonify({"message": "Appointment deleted successfully"}), 204
    return jsonify({"message": "Failed to delete appointment"}), 500

@appointment_bp.route("/appointments/available_times/<barber_id>/<date>", methods=["GET"])
def get_available_times(barber_id, date):
    available_times = Appointment.get_available_times(barber_id, date)
    return jsonify({"available_times": available_times}), 200


