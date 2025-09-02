#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request, jwt_required

from config import app, db, api, jwt
from models import *
from schema import *


#User Auth Routes
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

            access_token = create_access_token(identity=str(user.id))
            return make_response(
                jsonify(token=access_token, user=UserSchema().dump(user)),200)
        
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unprocessable Entity']}, 422
        
class WhoAmI(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        user = User.query.filter_by(id=user_id).first()
        return UserSchema().dump(user), 200
    
class Login(Resource):
    def post(self):
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            access_token = create_access_token(identity=str(user.id))
            return make_response(jsonify(token=access_token, user=UserSchema().dump(user)), 200)
        
        return {'error': ['401 Unauthorized']}, 401

#Round Routes
class RoundIndex(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        rounds = Round.query.filter_by(user_id=user_id).all()
        return [RoundSchema().dump(r) for r in rounds], 200
    
    @jwt_required()
    def post(self):
        data = request.get_json() or {}
        user_id = int(get_jwt_identity())

        new_round = Round(
            user_id = user_id,
            course_name = data.get('course_name'),
            course_external_id = data.get('course_external_id'),
            date = data.get('date'),
            tee = data.get('tee'),
            tee_name = data.get('tee_name'),
            holes = data.get('holes'),
            notes = data.get('notes'),
        )

        try:
            db.session.add(new_round)
            db.session.commit()
            return RoundSchema().dump(round), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unable to proccess']}, 422
        
#Shot Routes
class ShotIndex(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        rounds = Round.query.filter_by(user_id=user_id).all()
        return [RoundSchema().dump(r) for r in rounds], 200
    
    @jwt_required()
    def post(self):
        data = request.get_json() or {}
        user_id = int(get_jwt_identity())

        new_shot = Shot(
            user_id = user_id,
            course_name = data.get('course_name'),
            course_external_id = data.get('course_external_id'),
            date = data.get('date'),
            tee = data.get('tee'),
            tee_name = data.get('tee_name'),
            holes = data.get('holes'),
            notes = data.get('notes'),
        )

        try:
            db.session.add(new_shot)
            db.session.commit()
            return ShotSchema().dump(round), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unable to proccess']}, 422


# API Endpoints
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(WhoAmI, '/me', endpoint='me')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(RoundIndex, '/rounds', endpoint='rounds')
api.add_resource(ShotIndex, '/shots', endpoint="shots")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
