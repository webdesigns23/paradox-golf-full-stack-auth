from models import *
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
	id = fields.Integer(dump_only=True)
	display_name = fields.String(required=True)
	username = fields.String(required=True)
	
	#relationship
	rounds = fields.Nested(lambda: RoundSchema(exclude=("user",)), many=True, dump_only=True)
	challenges = fields.Nested(lambda: ChallengeSchema(exclude=("user",)), many=True, dump_only=True)


class RoundSchema(Schema):
	id = fields.Integer(dump_only=True)
	course_name = fields.String(required=True)
	course_external_id = fields.Integer(allow_none=True)
	date = fields.Date(required=True)
	tee = fields.String(allow_none=True)
	tee_name = fields.String(allow_none=True)
	holes = fields.String(allow_none=True)
	notes = fields.String(allow_none=True)

	user_id = fields.Integer(required=True, load_only=True)
	
	#relationship
	user = fields.Nested(lambda: UserSchema(exclude=("rounds","challenges")),dump_only=True)
	round_holes = fields.Nested(lambda: RoundHoleSchema(exclude=("round",)), many=True, dump_only=True)
	
class RoundHoleSchema(Schema):
	id = fields.Integer(dump_only=True)
	hole_number = fields.Integer(required=True, validate=validate.Range(min=1, max=18, error="hole_number must be between 1 and 18"))
	par = fields.Integer(allow_none=True, validate=validate.OneOf([3,4,5], error="par must be 3, 4, or 5"))
	score = fields.Integer(allow_none=True, validate=validate.Range(min=1))

	round_id = fields.Integer(required=True, load_only=True)

	#relationship
	round = fields.Nested(lambda: RoundSchema(exclude=("round_holes",)),dump_only=True)
	shots = fields.Nested(lambda: ShotSchema(exclude=("round_hole",)),many=True, dump_only=True)


class ShotSchema(Schema):
	id = fields.Integer(dump_only=True)
	stroke_number = fields.Integer(required=True, validate=validate.Range(min=1))	
	start_distance = fields.Integer(allow_none=True, validate=validate.Range(min=0))	
	unit = fields.String(allow_none=True, validate=validate.OneOf(["yd", "ft", "m"], error="unit must be yd, ft, or m"))
	surface = fields.String(allow_none=True)
	penalty = fields.Integer(load_default=0, validate=validate.Range(min=0, max=25, error="penalty must be between 0 and 25"))
	club = fields.String(allow_none=True)
	notes = fields.String(allow_none=True)	

	round_hole_id = fields.Integer(required=True, load_only=True)

	#relationship
	round_hole = fields.Nested(lambda: RoundHoleSchema(exclude=("shots",)),dump_only=True)


class ChallengeSchema(Schema):
	id = fields.Integer(dump_only=True)
	title = fields.String(required=True)
	type = fields.String(allow_none=True)
	target_number = fields.Integer(allow_none=True)
	start_date = fields.Date(allow_none=True)
	end_date = fields.Date(allow_none=True)
	status = fields.String(allow_none=True, validate=validate.OneOf(["active", "achieved", "failed"]))

	user_id = fields.Integer(required=True)
	
	#relationship
	user = fields.Nested(lambda: UserSchema(exclude=("challenges", "rounds")),dump_only=True)
