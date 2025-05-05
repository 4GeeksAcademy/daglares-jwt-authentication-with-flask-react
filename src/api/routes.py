"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
import traceback

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


# Allow CORS requests to this API
# CORS(api)

def password_match(user, password):
    return user.password == password

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# @api.route("/token", methods=["POST"])
# def create_token():
#     # …autenticas al user…
#     user = User.query.filter_by(email=email).first()
#     access_token = create_access_token(identity=user.id)
#     return jsonify({
#       "access_token": access_token,
#       "id":          user.id,
#       "email":       user.email,
#       "name":        user.name,
#       "last_name":   user.last_name
#     }), 200


@api.route("/token", methods=["POST"])
def create_token():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token,
      id=user.id,
      email=user.email,
      name=user.name,
      last_name=user.last_name), 200

@api.route('/user', methods=['POST'])
def create_user():
    try:
        data = request.get_json() or {}
        name      = data.get('name')
        last_name = data.get('last_name')   # corrige aquí el typo
        email     = data.get('email')
        password  = data.get('password')

        if not name or not email or not password:
            return jsonify({"msg": "Name, email and password are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "Email already registered"}), 409

        hashed_pw = generate_password_hash(password)

        user = User(name=name, last_name=last_name, email=email, password=hashed_pw, is_active=True)

        db.session.add(user)
        db.session.commit()

        return jsonify(user.serialize()), 201

    except Exception as e:
        # Esto imprime la traza completa en la consola de Flask
        traceback.print_exc()
        # Y devuelve un JSON para que el frontend no trate de parsear HTML
        return jsonify({"msg": "Internal server error", "error": str(e)}), 500


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200