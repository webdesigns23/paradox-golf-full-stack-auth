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
	name = db.Column(db.varchar)
	city = db.Column(db.varchar)
	state = db.Column(db.varchar)
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

	def __repr__(self):
		return f'<User: {self}, {self}>'
	
class RoundHole(db.Model):
	__tablename__ = 'round-holes'

	def __repr__(self):
		return f'<User: {self}, {self}>'