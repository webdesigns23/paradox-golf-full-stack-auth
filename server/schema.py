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
	course_external_id = fields.Integer()
	date = fields.Date(required=True)
	tee = fields.String()
	tee_name = fields.String()
	holes = fields.String()
	notes = fields.String()

	user_id = fields.Integer(required=True, load_only=True)
	
	#relationship
	user = fields.Nested(lambda: UserSchema(exclude=("rounds","challenges")),dump_only=True)
	round_holes = fields.Nested(lambda: RoundHoleSchema(exclude=("rounds",)), many=True, dump_only=True)
	
class RoundHoleSchema(Schema):
	id = fields.Integer(dump_only=True)
	hole_number = fields.Integer(validate=validate.Range(min=1, max=18, error="hole_number must be between 1 and 18"))
	par = fields.Integer(validate=validate.OneOf([3,4,5], error="par must be 3, 4, or 5"))
	score = fields.Integer()

	round_id = fields.Integer(required=True, load_only=True)

	#relationship
	round = fields.Nested(lambda: RoundSchema(exclude=("round_holes",)),dump_only=True)
	shots = fields.Nested(lambda: ShotSchema(exclude=("round_holes",)),many=True, dump_only=True)


class ShotSchema(Schema):
	id = fields.Integer(dump_only=True)
	stroke_number = fields.Integer()	
	start_distance = fields.Integer()	
	unit = fields.String(validate=validate.OneOf(["yds", "ft", "m"], error="unit must be yds, ft, or m"))
	surface = fields.String()
	penalty = fields.Integer(validate=validate.Range(min=0, max=25, error="penalty mush be between 0 and 25"))
	club = fields.String()
	notes = fields.String()

	round_hole_id = fields.Integer(required=True, load_only=True)

	#relationship
	round_hole = fields.Nested(lambda: RoundHoleSchema(exclude=("shots",)),dump_only=True)


class ChallengeSchema(Schema):
	id = fields.Integer(dump_only=True)
	title = fields.String()
	type = fields.String()
	target_number = fields.Integer()
	start_date = fields.Date()
	end_date = fields.Date()
	status = fields.String(validate=validate.OneOf(["active", "achieved", "failed"]))

	user_id = fields.Integer(required=True)
	
	#relationship
	user = fields.Nested(lambda: UserSchema(exclude=("challenges", "rounds")),dump_only=True)
