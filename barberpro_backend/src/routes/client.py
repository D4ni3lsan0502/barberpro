from flask import Blueprint, request, jsonify
from src.database import db
from src.models.client import Client
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

client_bp = Blueprint("client_bp", __name__)

@client_bp.route("/clients", methods=["POST"])
def register_client():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    address = data.get("address", {})

    if not all([name, email, password, phone]):
        return jsonify({"message": "Missing required fields"}), 400

    if Client.find_by_email(email):
        return jsonify({"message": "Client with this email already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_client = Client(
        name=name,
        email=email,
        password=hashed_password,
        phone=phone,
        address=address
    )
    new_client.save()

    return jsonify({"message": "Client registered successfully", "client": new_client.to_dict()}), 201

@client_bp.route("/clients/<client_id>", methods=["GET"])
@jwt_required()
def get_client(client_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    client = Client.find_by_id(client_id)
    if not client:
        return jsonify({"message": "Client not found"}), 404
    
    if current_user_role == "client" and str(current_user_id) != str(client._id):
        return jsonify({"message": "Unauthorized access"}), 403
    
    return jsonify({"client": client.to_dict()}), 200

@client_bp.route("/clients/<client_id>", methods=["PUT"])
@jwt_required()
def update_client(client_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    client = Client.find_by_id(client_id)
    if not client:
        return jsonify({"message": "Client not found"}), 404
    
    if current_user_role == "client" and str(current_user_id) != str(client._id):
        return jsonify({"message": "Unauthorized access"}), 403

    data = request.get_json()
    client.name = data.get("name", client.name)
    client.email = data.get("email", client.email)
    client.phone = data.get("phone", client.phone)
    client.address = data.get("address", client.address)

    client.save()
    return jsonify({"message": "Client updated successfully", "client": client.to_dict()}), 200

@client_bp.route("/clients/<client_id>", methods=["DELETE"])
@jwt_required()
def delete_client(client_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get("role")
    
    client = Client.find_by_id(client_id)
    if not client:
        return jsonify({"message": "Client not found"}), 404
    
    if current_user_role == "client" and str(current_user_id) != str(client._id):
        return jsonify({"message": "Unauthorized access"}), 403

    if Client.delete_by_id(client_id):
        return jsonify({"message": "Client deleted successfully"}), 204
    return jsonify({"message": "Failed to delete client"}), 500


