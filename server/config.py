from flask import Flask
from dotenv import load_dotenv
from flask_bcrypt import bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

app.json.compact = False

# So front can talk to back with React
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

metadata = MetaData(naming_convention={
	"ix": "ix_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
	"pk": "pk_%(table_name)s",
})
db = SQLAlchemy(metadata=metadata)

db.init_app(app)
bcrypt.init_app(app)

migrate = Migrate(app, db)
api = Api(app)
jwt = JWTManager(app)

