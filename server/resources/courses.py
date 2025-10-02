#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import requests

from config import app, db, api, jwt, GOLFCOURSE_API_BASE, GOLFCOURSE_API_KEY

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
def register_courses_resources(api):
    api.add_resource(CourseSearch, '/courses/search')

