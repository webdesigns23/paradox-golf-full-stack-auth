from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import date

from config import db, bcrypt

class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	first_name = db.Column(db.String, nullable=False)
	username = db.Column(db.String, unique=True, nullable=False)
	_password_hash = db.Column(db.String, nullable=False)

	#relationship
	rounds = db.relationship("Round", back_populates = "user", cascade="all, delete-orphan")
	challenges = db.relationship("Challenge", back_populates = "user", cascade="all, delete-orphan")
	
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
		return f'<User: {self.first_name}, {self.username}>'
	
	
class Course(db.Model):
	__tablename__ = 'courses'

	id = db.Column(db.Integer, primary_key=True)
	external_course_id = db.Column(db.Integer)
	name = db.Column(db.String)
	city = db.Column(db.String)
	state = db.Column(db.String)
	par_total = db.Column(db.Integer)
	total_yards = db.Column(db.Integer)
	holes = db.Column(db.Integer)
	course_rating = db.Column(db.Float)
	slope_rating = db.Column(db.Float)

	#relationship
	course_holes = db.relationship("CourseHole", back_populates="course", cascade="all, delete-orphan")
	rounds = db.relationship("Round", back_populates="course")


	def __repr__(self):
		return f'<Course: {self.name}, {self.city}, {self.state}, {self.par_total}, {self.total_yards}, {self.holes}, {self.course_rating}, {self.slope_rating}>'
	
class CourseHole(db.Model):
	__tablename__ = 'course_holes'

	id = db.Column(db.Integer, primary_key=True)
	course_hole_number = db.Column(db.Integer, nullable=False)
	par = db.Column(db.Integer, nullable=False)
	yardage = db.Column(db.Integer, nullable=False)
	course_id = db.Column(db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)

	#relationship
	course = db.relationship("Course", back_populates="course_holes")
	round_holes = db.relationship("RoundHole", back_populates="course_hole")

	def __repr__(self):
		return f'<Course Hole: {self.course_hole_number}, {self.par}, {self.yardage}>'
	
class Round(db.Model):
	__tablename__ = 'rounds'

	id = db.Column(db.Integer, primary_key=True)
	date = db.Column(db.Date, default=date.today,nullable=False)
	tee_box = db.Column(db.String)
	notes = db.Column(db.Text)
	user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
	course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)

	#relationship
	user = db.relationship("User", back_populates="rounds")
	course = db.relationship("Course", back_populates="rounds")
	round_holes = db.relationship("RoundHole", back_populates="round", cascade="all, delete-orphan")

	def __repr__(self):
		return f'<Round: {self.date}, {self.tee_box}, {self.notes}>'
	
class RoundHole(db.Model):
	__tablename__ = 'round_holes'

	id = db.Column(db.Integer, primary_key=True)
	hole_number = db.Column(db.Integer)
	start_distance = db.Column(db.Integer)
	surface = db.Column(db.String)
	penalty = db.Column(db.Integer, default=0)
	round_id = db.Column(db.Integer, db.ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False)
	course_hole_id = db.Column(db.Integer, db.ForeignKey("course_holes.id"), nullable=False)

	#relationship
	round = db.relationship("Round", back_populates="round_holes")
	course_hole = db.relationship("CourseHole", back_populates="round_holes")

	def __repr__(self):
		return f'<Round Hole: {self.hole_number}, {self.start_distance}, {self.surface}, {self.penalty}>'
	
class Challenge(db.Model):
	__tablename__ = 'challenges'

	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String)
	type = db.Column(db.String)
	target_number = db.Column(db.Integer)
	start_date = db.Column(db.Date)
	end_date = db.Column(db.Date)
	status = db.Column(db.String)
	user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

	#relationship
	user = db.relationship("User", back_populates="challenges")

	def __repr__(self):
		return f'<Challenge: {self.title}, {self.type}, {self.target_number}, {self.start_date}, {self.end_date}, {self.status}>'
