from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from config import app, db, api, jwt
from models import User
from schema import UserSchema

#User Auth Routes
class Signup(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip().lower()
        password = data.get("password") or ""
        password_confirmation = data.get("password_confirmation") or ""
        display_name = (data.get("display_name") or "").strip()

        errors = {}

        # Basic validation
        if not username:
            errors["username"] = "Username is required."
        elif len(username) < 3:
            errors["username"] = "Username must be at least 3 characters."

        if not password:
            errors["password"] = "Password is required."
        elif len(password) < 6:
            errors["password"] = "Password must be at least 6 characters."

        if password != password_confirmation:
            errors["password_confirmation"] = "Passwords do not match."

        if not display_name:
            errors["display_name"] = "Display name is required."

        if errors:
            return make_response(jsonify(errors=errors), 400)

        # check duplicates
        if User.query.filter_by(username=username).first():
            return make_response(jsonify(errors={"username": "Username is already taken."}), 409)

        user = User(username=username, display_name=display_name)
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify(errors={"username": "Username is already taken."}), 409)

        access_token = create_access_token(identity=str(user.id))
        return make_response(
            jsonify(token=access_token, user=UserSchema().dump(user)),
            201
        )
        
class WhoAmI(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        user = User.query.filter_by(id=user_id).first()
        return UserSchema().dump(user), 200
    
class Login(Resource):
    def post(self):
        data = request.get_json() or {}
        username = (data.get('username') or "").strip()
        password = data.get('password')

        if not username:
            return {'error': ['Username required to enter portal']}, 400
        
        if not password: 
            return {'error': ['Password required to enter portal']}, 400

        user = User.query.filter_by(username=username).first()
        
        if not user:
            return {'error': ['Username not found']}, 401
        
        if not user.authenticate(password):
            return {'error': ['Incorrect password']}, 401

        if user and user.authenticate(password):
            access_token = create_access_token(identity=str(user.id))
            return make_response(jsonify(token=access_token, user=UserSchema().dump(user)), 200)
        
        return {'error': ['Unauthorized: invalid credentials']}, 401
    

# API Endpoints
def register_auth_resources(api):
    api.add_resource(Signup, '/signup', endpoint='signup')
    api.add_resource(WhoAmI, '/me', endpoint='me')
    api.add_resource(Login, '/login', endpoint='login')