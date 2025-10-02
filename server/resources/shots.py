#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from config import app, db, api, jwt, GOLFCOURSE_API_BASE, GOLFCOURSE_API_KEY
from models import Round, RoundHole, Shot
from schema import RoundSchema, RoundHoleSchema, ShotSchema


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
def register_shots_resources(api):
    api.add_resource(ShotIndex, '/rounds/<int:round_id>/holes/<int:hole_id>/shots', endpoint='shots')
