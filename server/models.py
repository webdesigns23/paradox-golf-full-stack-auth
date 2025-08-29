from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema, fields

from config import db, bcrypt

class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	display_name = db.Columnt(db.String, nullable=False)
	username = db.Column(db.String, unique=True, nullable=False)
	_password_hash = db.Column(db.String, nullable=False)
	
	@validates('username')
	def nomalize_username(self, key, value):
		return value.strip().lower()

	@hybrid_property
	def password_hash(self):
		raise AttributeError('Password hashes may not be viewed')
    
	@password_hash.setter
	def password_hash(self, password):
		password_hash = bcrypt.generate_password_hash(
			password.encode('utf-8'))
		self._password_hash = password_hash.decode('utf-8')
         
	def authenticate(self, password):
		return bcrypt.check_password_hash(
			self._password_hash, password.encode('utf-8'))

	def __repr__(self):
		return f'<User: {self.display_name}, {self.username}>'
	
	
class Course(db.Model):
	__tablename__ = 'courses'

	id = db.Column(db.integer, primary_key=True)
	external_course_id = db.Column(db.integer)
	name = db.Column(db.string)
	city = db.Column(db.string)
	state = db.Column(db.string)
	par_total = db.Column(db.integer)
	total_yards =db.Column(db.integer)
	holes = db.Column(db.integer)
	course_rating = db.Column(db.float)
	slope_rating = db.Column(db.float)

	def __repr__(self):
		return f'<Course: {self.name}, {self.city}, {self.state}, {self.par_total}, {self.total_yards}, {self.holes}, {self.course_rating}, {self.slope_rating}>'
	
class CourseHole(db.Model):
	__tablename__ = 'course-holes'

	id = db.Column(db.integer, primary_key=True)
	course_id = db.Column(db.integer, foreign_key=True)
	course_hole_number = db.Column(db.integer)
	par = db.Column(db.integer)
	yardage = db.Column(db.integer)

	def __repr__(self):
		return f'<Course Hole: {self.course_hole_number}, {self.par}, {self.yardage}>'
	
class Round(db.Model):
	__tablename__ = 'rounds'

	id = db.Column(db.integer, primary_key=True)
	user_id = db.Column(db.integer, foreign_key=True)
	course_id = db.Column(db.integer, foreign_key=True)
	date = db.Column(db.date)
	tee_box = db.Column(db.string)
	notes = db.Column(db.text)

	def __repr__(self):
		return f'<Round: {self.date}, {self.tee_box}, {self.notes}>'
	
class RoundHole(db.Model):
	__tablename__ = 'round-holes'

	id = db.Column(db.integer, primary_key=True)
	round_id = db.Column(db.integer, foreign_key=True)
	course_hole_id = db.Column(db.integer, foreign_key=True)
	hole_number = db.Column(db.integer)
	start_distance = db.Column(db.integer)
	surface = db.Column(db.integer)
	penalty = db.Column(db.integer)

	def __repr__(self):
		return f'<Round Hole: {self.hole_number}, {self.start_distance}, {self.surface}, {self.penalty}>'
	
class Challenge(db.Model):
	__tablename__ = 'challenges'

	id = db.Column(db.integer, primary_key=True)
	user_id = db.Column(db.integer, foreign_key=True)
	title = db.Column(db.string)
	type = db.Column(db.string)
	target_number = db.Column(db.integer)
	start_date = db.Column(db.date)
	end_date = db.Column(db.date)
	status = db.Column(db.string)

	def __repr__(self):
		return f'<Challenge: {self.title}, {self.type}, {self.target_number}, {self.start_date}, {self.end_date}, {self.status}'
