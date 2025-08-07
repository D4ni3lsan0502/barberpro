from flask import Blueprint, request, jsonify
from src.database import db
from src.models.service import Service
from src.models.barber import Barber
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from bson.objectid import ObjectId

service_bp = Blueprint("service_bp", __name__)

@service_bp.route("/services", methods=["POST"])
@jwt_required()
def create_service():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    if current_user_role != "barber":
        return jsonify({"message": "Unauthorized: Only barbers can create services"}), 403

    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    price = data.get("price")
    duration = data.get("duration")
    barber_id = current_user_id # Automatically assign barber_id from token

    if not all([name, price, duration]):
        return jsonify({"message": "Missing required fields"}), 400

    new_service = Service(
        name=name,
        description=description,
        price=price,
        duration=duration,
        barber_id=barber_id
    )
    new_service.save()

    return jsonify({"message": "Service created successfully", "service": new_service.to_dict()}), 201

@service_bp.route("/services", methods=["GET"])
def get_services():
    services = Service.find_all()
    return jsonify({"services": [service.to_dict() for service in services]}), 200

@service_bp.route("/services/<service_id>", methods=["GET"])
def get_service(service_id):
    service = Service.find_by_id(service_id)
    if not service:
        return jsonify({"message": "Service not found"}), 404
    return jsonify({"service": service.to_dict()}), 200

@service_bp.route("/services/<service_id>", methods=["PUT"])
@jwt_required()
def update_service(service_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    service = Service.find_by_id(service_id)
    if not service:
        return jsonify({"message": "Service not found"}), 404
    
    if current_user_role != "barber" or str(service.barber_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized: You can only update your own services"}), 403

    data = request.get_json()
    service.name = data.get("name", service.name)
    service.description = data.get("description", service.description)
    service.price = data.get("price", service.price)
    service.duration = data.get("duration", service.duration)

    service.save()
    return jsonify({"message": "Service updated successfully", "service": service.to_dict()}), 200

@service_bp.route("/services/<service_id>", methods=["DELETE"])
@jwt_required()
def delete_service(service_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    service = Service.find_by_id(service_id)
    if not service:
        return jsonify({"message": "Service not found"}), 404
    
    if current_user_role != "barber" or str(service.barber_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized: You can only delete your own services"}), 403

    if Service.delete_by_id(service_id):
        return jsonify({"message": "Service deleted successfully"}), 204
    return jsonify({"message": "Failed to delete service"}), 500


