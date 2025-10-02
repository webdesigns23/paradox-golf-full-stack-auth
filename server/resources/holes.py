#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime

from config import app, db, api, jwt, GOLFCOURSE_API_BASE, GOLFCOURSE_API_KEY
from models import Round, RoundHole
from schema import RoundSchema, RoundHoleSchema


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
        

# API Endpoints
def register_holes_resources(api):
    api.add_resource(RoundHoleIndex, '/rounds/<int:round_id>/holes', endpoint='round_holes')
