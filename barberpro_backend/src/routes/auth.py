from flask import Blueprint, request, jsonify
from src.models.client import Client
from src.models.barber import Barber
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth_bp", __name__)

# Setup the Flask-JWT-Extended extension
jwt = JWTManager()

@jwt.user_identity_loader
def user_identity_lookup(user_id):
    # This function is used to load a user from your database
    # It can return any data that is json-serializable
    # Here, we are returning the user_id itself
    return user_id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    claims = jwt_data.get("claims")
    role = claims.get("role")

    if role == "client":
        return Client.find_by_id(identity)
    elif role == "barber":
        return Barber.find_by_id(identity)
    return None

@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    role = request.json.get("role", None)

    if not email or not password or not role:
        return jsonify({"msg": "Missing email, password or role"}), 400

    user = None
    if role == "client":
        user = Client.find_by_email(email)
    elif role == "barber":
        user = Barber.find_by_email(email)
    else:
        return jsonify({"msg": "Invalid role"}), 400

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=str(user._id), additional_claims={"role": role})
    return jsonify(access_token=access_token, user=user.to_dict()), 200

@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id), 200


