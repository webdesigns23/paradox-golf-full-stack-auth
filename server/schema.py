from models import *
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
	id = fields.Integer()
	display_name = fields.String()
	username = fields.String()
	