#!/usr/bin/env python3

from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request

from config import app, db, api, jwt
from models import *
from schema import *


# Protected Routes



# Resources



# API Endpoints





if __name__ == '__main__':
    app.run(port=5555, debug=True)