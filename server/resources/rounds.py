#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime

from config import app, db, api, jwt, GOLFCOURSE_API_BASE, GOLFCOURSE_API_KEY
from models import Round
from schema import RoundSchema


#Round Routes
class RoundIndex(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        rounds = (
            Round.query
            .filter_by(user_id=user_id)
            .order_by(Round.date.desc())
            .all())
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
    def get(self, round_id):
        user_id = int(get_jwt_identity())
        round = Round.query.filter_by(id = round_id, user_id=user_id).first()

        if not round: 
            return {'error': ['No rounds found']}, 404
        
        return RoundSchema().dump(round),200
        
    @jwt_required()
    def patch(self, round_id):
        user_id = int(get_jwt_identity())
        round = Round.query.filter_by(id=round_id, user_id=user_id).first()
        if not round: 
            return {'error': ['No rounds found']}, 404
        
        data = request.get_json() or {}

        try:
            if 'course_name' in data:
                course_name = (data.get('course_name') or "").strip()
                if not course_name:
                    return {'error': 'Course name cannot be empty'}, 422
                if len(course_name) > 35:
                    return {'error': 'Course name cannot be more than 35 characters'}, 422
                round.course_name = course_name

            if 'course_external_id' in data:
                ext_id = data.get('course_external_id')
                if ext_id is not None:
                    try:
                        ext_id = int(ext_id)
                    except (TypeError, ValueError):
                        return {'error': 'course_external_id must be an integer'}, 422
                round.course_external_id = ext_id or None

            if 'date' in data:
                raw = data.get('date')
                try:
                    round.date = datetime.strptime(raw, "%m/%d/%Y").date()
                except (TypeError, ValueError):
                    return {"error": "Invalid date format. Use MM/DD/YYYY."}, 422

            if 'tee' in data:
                tee = (data.get('tee') or "").strip()
                allowed_tees = {'male', 'female'}
                if tee and tee not in allowed_tees:
                    return {'error': 'Invalid Tee, must choose male or female tees.'}, 422
                round.tee = tee 

            if 'tee_name' in data:
                tee_name = (data.get('tee_name') or "").strip()
                if len(tee_name) > 50:
                    return {'error': 'Tee name cannot be more than 50 characters'}, 422
                round.tee_name = tee_name 
    
            if 'notes' in data:
                notes = (data.get('notes')).strip()
                if len(notes) > 100:
                    return {"error": "Notes cannot be more than 100 characters"}, 422     
                round.notes = notes

            db.session.commit()
            return RoundSchema().dump(round), 200
        except IntegrityError:
            db.session.rollback()
            return {'error': ['Could not edit round notes']}, 400
        except Exception as error:
            db.session.rollback()
            return {'error': ['Server error']}, 500

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
        except Exception as error:
            db.session.rollback()
            return {'error': ['Server error']}, 500
        

# API Endpoints
def register_rounds_resources(api):
    api.add_resource(RoundIndex, '/rounds', endpoint='rounds')
    api.add_resource(RoundDetails, '/rounds/<int:round_id>')
