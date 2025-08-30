from models import *
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
	id = fields.Integer(dump_only=True)
	display_name = fields.String(required=True)
	username = fields.String(required=True)
	
	#relationship
	rounds = fields.List(fields.Nested(lambda: RoundSchema(exclude=("user",))), dump_only=True)
	challenges = fields.List(fields.Nested(lambda: ChallengeSchema(exclude=("user",))), dump_only=True)

class CourseSchema(Schema):
	id = fields.Integer(dump_only=True)
	external_course_id = fields.Integer()
	name = fields.String()
	city = fields.String()
	state = fields.String()
	par_total = fields.Integer()
	total_yards = fields.Integer()
	holes = fields.Integer()
	course_rating = fields.Float()
	slope_rating = fields.Float()

	#relationship
	course_holes = fields.List(fields.Nested(lambda: CourseHoleSchema(exclude=("course",))),dump_only=True)
	rounds = fields.List(fields.Nested(lambda: RoundSchema(exclude=("course",))), dump_only=True)

class CourseHoleSchema(Schema):
	id = fields.Integer(dump_only=True)
	course_id = fields.Integer(required=True)
	course_hole_number = fields.Integer(required=True)
	par = fields.Integer(required=True, validate=validate.OneOf([3,4,5]))
	yardage = fields.Integer(required=True)

	#relationship
	courses = fields.Nested(lambda: CourseSchema(exclude=("course_holes", "rounds")), dump_only=True)
	round_holes = fields.Nested(lambda: RoundHoleSchema(exclude=("course_holes",)), dump_only=True)
	
class RoundSchema(Schema):
	id = fields.Integer(dump_only=True)
	user_id = fields.Integer(required=True)
	course_id = fields.Integer(required=True)
	date = fields.Date(required=True)
	tee_box = fields.String()
	notes = fields.String()

	#relationship
	user = fields.Nested(lambda: UserSchema(exclude=("rounds","challenges")),dump_only=True)
	course = fields.Nested(lambda: CourseSchema(exclude=("rounds","course_holes")), dump_only=True)
	round_holes = fields.List(fields.Nested(lambda: RoundHoleSchema(exclude=("rounds",))),dump_only=True)
	
class RoundHoleSchema(Schema):
	id = fields.Integer(dump_only=True)
	round_id = fields.Integer(required=True)
	course_hole_id = fields.Integer(required=True)
	hole_number = fields.Integer()
	start_distance = fields.Integer()
	surface = fields.String()
	penalty = fields.Integer()

	#relationship
	round = fields.Nested(lambda: RoundSchema(exclude=("round_holes",)),dump_only=True)
	course_hole = fields.Nested(lambda: CourseHoleSchema(exclude=("round_holes",)),dump_only=True)


class ChallengeSchema(Schema):
	id = fields.Integer(dump_only=True)
	user_id = fields.Integer(required=True)
	title = fields.String()
	type = fields.String()
	target_number = fields.Integer()
	start_date = fields.Date()
	end_date = fields.Date()
	status = fields.String(validate=validate.OneOf(["active", "achieved", "failed"]))

	#relationship
	user = fields.Nested(lambda: UserSchema(exclude=("challenges", "rounds")),dump_only=True)
