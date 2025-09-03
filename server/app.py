#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime

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
            return RoundSchema().dump(new_round), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unable to proccess']}, 422

class RoundDetails(Resource):
    @jwt_required()
    def patch(self, id):
        user_id = int(get_jwt_identity())
        round = Round.query.filter_by(id = id, user_id=user_id).first()

        if not round: 
            return {'error': ['No rounds found']}, 404
        
        data = request.get_json() or {}

        updatesAllowed = {'course_name', 'course_external_id', 'date', 'tee', 'tee_name', 'holes', 'notes'}

        for key in updatesAllowed:
            if key in data and data[key] is not None:
                if key == 'date':
                    try:
                        round.date = datetime.strptime(data['date'], "%m/%d/%Y").date()
                    except ValueError:
                        return {'error': ['Invalid date format. Use MM/DD/YYYY.']}, 400
                else:
                    setattr(round, key, data[key])

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unable to process']}, 422

        return RoundSchema().dump(r), 200

    @jwt_required()
    def delete(self, round_id):
        user_id = int(get_jwt_identity())
        round = Round.query.filter_by(id = round_id, user_id=user_id).first()

        if not round: 
            return {'error': ['No rounds found']}, 404
        try:
            db.session.delete(round)
            db.session.commit()
            return {}, 204
        except IntegrityError:
            db.session.rollback()
            return {'error': ['Could not delete round']}, 400


#Round Hole Routes
class RoundHoleIndex(Resource):
    @jwt_required()
    def get(self, round_id):
        user_id = int(get_jwt_identity())
        round_info = Round.query.filter_by(id=round_id, user_id=user_id).first()
        if not round_info:
            return {'error': ['Round not found']}, 404
        
        return [RoundHoleSchema().dump(rh) for rh in round_info.round_holes], 200
    
    @jwt_required()
    def post(self, round_id):
        user_id = int(get_jwt_identity())
        round_info = Round.query.filter_by(id=round_id, user_id=user_id).first()
        if not round_info:
            return {'error': ['Round not found']}, 404
        
        data = request.get_json() or {}
        new_hole = RoundHole(
            round_id = round_info.id,
            hole_number = data.get('hole_number'),
            par = data.get('par'),
            score = data.get('score'),
        )

        try:
            db.session.add(new_hole)
            db.session.commit()
            return RoundHoleSchema().dump(new_hole), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unable to process']}, 422
        
#Shot Routes
class ShotIndex(Resource):
    @jwt_required()
    def get(self, round_id, hole_id):
        user_id = int(get_jwt_identity())

        round_info = Round.query.filter_by(id=round_id, user_id=user_id).first()
        if not round_info:
            return {'error': ['Round not found']}, 404
        
        hole = RoundHole.query.filter_by(id=hole_id, round_id=round_info.id).first()
        if not hole:
            return {'error': ['Hole not found']}, 404
        return [ShotSchema().dump(s) for s in hole.shots], 200
    
    @jwt_required()
    def post(self, round_id, hole_id):
        user_id = int(get_jwt_identity())

        round_info = Round.query.filter_by(id=round_id, user_id=user_id).first()
        if not round_info:
            return {'error': ['Round not found']}, 404
        
        hole = RoundHole.query.filter_by(id=hole_id, round_id=round_info.id).first()
        if not hole:
            return {'error': ['Hole not found']}, 404
        
        data = request.get_json() or {}
        new_shot = Shot(
            round_hole_id=hole.id,
            stroke_number = data.get('stroke_number'),
            start_distance = data.get('start_distance'),
            unit = data.get('unit'),
            surface = data.get('surface'),
            penalty = data.get('penalty', 0),
            club = data.get('club'),
            notes = data.get('notes'),
        )
        try:
            db.session.add(new_shot)
            db.session.commit()
            return ShotSchema().dump(new_shot), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': ['422 Unable to add shots']}, 422
      

# API Endpoints
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(WhoAmI, '/me', endpoint='me')
api.add_resource(Login, '/login', endpoint='login')

api.add_resource(RoundIndex, '/rounds', endpoint='rounds')
api.add_resource(RoundDetails, '/rounds/<int:round_id>')
api.add_resource(RoundHoleIndex, '/rounds/<int:round_id>/holes', endpoint='round_holes')

api.add_resource(ShotIndex, '/rounds/<int:round_id>/holes/<int:hole_id>/shots', endpoint='shots')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
