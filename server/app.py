#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request, jwt_required

from config import app, db, api, jwt
from models import *
from schema import *


# # Protected Routes
# @app.before_request
# def check_if_logged_in():
#     open_access_list = ['signup', 'login']
#     if (request.endpoint) not in open_access_list and (not verify_jwt_in_request()):
#         return {'error': '401 Unauthorized'}, 401

# Resources
class Signup(Resource):
    def post(self):
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')
        display_name = data.get('display_name')

        user = User(
            username=username,
            display_name=display_name
        )
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()

            access_token = create_access_token(identity=user.id)
            return make_response(
                jsonify(token=access_token, user=UserSchema().dump(user)),200)
        
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unprocessable Entity']}, 422
        
class WhoAmI(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        return UserSchema().dump(user), 200
    
class Login(Resource):
    def post(self):
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            access_token = create_access_token(identity=user.id)
            return make_response(jsonify(token=access_token, user=UserSchema().dump(user)), 200)
        
        return {'error': ['401 Unauthorized']}, 401

# API Endpoints
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(WhoAmI, '/me', endpoint='me')
api.add_resource(Login, '/login', endpoint='login')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
