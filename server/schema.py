from models import *
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
	id = fields.Integer()
	display_name = fields.String()
	username = fields.String()
	

class Course(Schema):
	id = fields.Integer()
	external_course_id = fields.Integer()
	name = fields.String()
	city = fields.String()
	state = fields.String()
	par_total = fields.Integer()
	total_yards = fields.Integer()
	holes = fields.Integer()
	course_rating = fields.Float()
	slope_rating = fields.Float()


class CourseHole(Schema):
	id = fields.Integer()
	course_id = fields.Integer()
	course_hole_number = fields.Integer()
	par = fields.Integer()
	yardage = fields.Integer()

	
class Round(Schema):
	id = fields.Integer()
	user_id = fields.Integer()
	course_id = fields.Integer()
	date = fields.Date()
	tee_box = fields.String()
	notes = fields.String()

	
class RoundHole(Schema):
	id = fields.Integer()
	round_id = fields.Integer()
	course_hole_id = fields.Integer()
	hole_number = fields.Integer()
	start_distance = fields.Integer()
	surface = fields.Integer()
	penalty = fields.Integer()


class Challenge(Schema):
	id = fields.Integer()
	user_id = fields.Integer()
	title = fields.String()
	type = fields.String()
	target_number = fields.Integer()
	start_date = fields.Date()
	end_date = fields.Date()
	status = fields.String()

