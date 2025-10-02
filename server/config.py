from flask import Flask, request
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from datetime import timedelta

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

app.json.compact = False

#GolfCourseAPI
GOLFCOURSE_API_BASE = "https://api.golfcourseapi.com/v1"
GOLFCOURSE_API_KEY = os.getenv("GOLFCOURSE_API_KEY", "")

ALLOWED_ORIGINS = {"http://localhost:5173", "http://127.0.0.1:5173"}

# connect react to flask
CORS(app,
	resources={r"/*": {"origins": list(ALLOWED_ORIGINS)}}, 
	supports_credentials=False,
	allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	)

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"  
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    return response

metadata = MetaData(naming_convention={
	"ix": "ix_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
	"pk": "pk_%(table_name)s",
})
db = SQLAlchemy(metadata=metadata)

db.init_app(app)
bcrypt = Bcrypt(app)

migrate = Migrate(app, db)
api = Api(app)
jwt = JWTManager(app)

