from flask import Blueprint, request, jsonify
from src.database import db
from src.models.barber import Barber
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

barber_bp = Blueprint("barber_bp", __name__)

@barber_bp.route("/barbers", methods=["POST"])
def register_barber():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    specialty = data.get("specialty")

    if not all([name, email, password]):
        return jsonify({"message": "Missing required fields"}), 400

    if Barber.find_by_email(email):
        return jsonify({"message": "Barber with this email already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_barber = Barber(
        name=name,
        email=email,
        password=hashed_password,
        phone=phone,
        specialty=specialty
    )
    new_barber.save()

    return jsonify({"message": "Barber registered successfully", "barber": new_barber.to_dict()}), 201

@barber_bp.route("/barbers/<barber_id>", methods=["GET"])
@jwt_required()
def get_barber(barber_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    barber = Barber.find_by_id(barber_id)
    if not barber:
        return jsonify({"message": "Barber not found"}), 404
    
    if current_user_role == "barber" and str(current_user_id) != str(barber._id):
        return jsonify({"message": "Unauthorized access"}), 403
    
    return jsonify({"barber": barber.to_dict()}), 200

@barber_bp.route("/barbers/<barber_id>", methods=["PUT"])
@jwt_required()
def update_barber(barber_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    barber = Barber.find_by_id(barber_id)
    if not barber:
        return jsonify({"message": "Barber not found"}), 404
    
    if current_user_role == "barber" and str(current_user_id) != str(barber._id):
        return jsonify({"message": "Unauthorized access"}), 403

    data = request.get_json()
    barber.name = data.get("name", barber.name)
    barber.email = data.get("email", barber.email)
    barber.phone = data.get("phone", barber.phone)
    barber.specialty = data.get("specialty", barber.specialty)

    barber.save()
    return jsonify({"message": "Barber updated successfully", "barber": barber.to_dict()}), 200

@barber_bp.route("/barbers/<barber_id>", methods=["DELETE"])
@jwt_required()
def delete_barber(barber_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    barber = Barber.find_by_id(barber_id)
    if not barber:
        return jsonify({"message": "Barber not found"}), 404
    
    if current_user_role == "barber" and str(current_user_id) != str(barber._id):
        return jsonify({"message": "Unauthorized access"}), 403

    if Barber.delete_by_id(barber_id):
        return jsonify({"message": "Barber deleted successfully"}), 204
    return jsonify({"message": "Failed to delete barber"}), 500


