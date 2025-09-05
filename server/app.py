#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime
import requests

from config import app, db, api, jwt, GOLFCOURSE_API_BASE, GOLFCOURSE_API_KEY
from models import *
from schema import *


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
        

#Search for Golf Course(external API)
class CourseSearch(Resource):
    @jwt_required()
    def get(self):
        q = (request.args.get("q") or request.args.get("query") or "").strip()
        if not q:
            return {"results": [], "total": 0}, 200

        url = f"{GOLFCOURSE_API_BASE}/search"
        headers = {
            "Authorization": f"Key {GOLFCOURSE_API_KEY}",
            "Accept": "application/json",
        }

        try:
            resp = requests.get(url, params={"search_query": q}, headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json() if resp.content else {}

            results = (
                data.get("results")
                or data.get("data")
                or data.get("courses")  
                or (data if isinstance(data, list) else [])
            )
            total = data.get("total") or (len(results) if isinstance(results, list) else 0)

            return {"results": results, "total": total}, 200

        except requests.exceptions.HTTPError as e:
            status = e.response.status_code if e.response is not None else 502
            body = e.response.text[:300] if e.response is not None else ""
            return {"error": "Upstream error", "status": status, "body": body}, 502
        except Exception as e:
            return {"error": f"Server error: {e}"}, 500


      

# API Endpoints
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(WhoAmI, '/me', endpoint='me')
api.add_resource(Login, '/login', endpoint='login')

api.add_resource(RoundIndex, '/rounds', endpoint='rounds')
api.add_resource(RoundDetails, '/rounds/<int:round_id>')
api.add_resource(RoundHoleIndex, '/rounds/<int:round_id>/holes', endpoint='round_holes')

api.add_resource(ShotIndex, '/rounds/<int:round_id>/holes/<int:hole_id>/shots', endpoint='shots')

api.add_resource(CourseSearch, '/courses/search')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
