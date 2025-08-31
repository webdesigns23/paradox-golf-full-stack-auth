from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import date

from config import db, bcrypt

class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	display_name = db.Column(db.String, nullable=False)
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
		return f'<User: {self.display_name}, {self.username}>'
	
	
class Round(db.Model):
	__tablename__ = 'rounds'

	id = db.Column(db.Integer, primary_key=True)
	course_name = db.Column(db.String, nullable=False)
	course_external_id = db.Column(db.Integer)
	date = db.Column(db.Date, nullable=False)
	tee = db.Column(db.String)
	tee_name = db.Column(db.String)
	holes = db.Column(db.String)
	notes = db.Column(db.Text)

	user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"))
	

	#relationship
	user = db.relationship("User", back_populates="rounds")
	round_holes = db.relationship("RoundHole", back_populates="round", cascade="all, delete-orphan", order_by="RoundHole.hole_number")

	def __repr__(self):
		return f'<Round: {self.date}, {self.tee}, {self.tee_name}, {self.holes}, {self.notes}>'
	
class RoundHole(db.Model):
	__tablename__ = 'round_holes'

	id = db.Column(db.Integer, primary_key=True)
	hole_number = db.Column(db.Integer, nullable=False)
	par = db.Column(db.Integer)
	score = db.Column(db.Integer)

	round_id = db.Column(db.Integer, db.ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False)

	#relationship
	round = db.relationship("Round", back_populates="round_holes")
	shots = db.relationship("Shot", back_populates="round_hole", cascade="all, delete-orphan", order_by="Shot.stroke_number")
	
	def __repr__(self):
		return f'<Round Hole: {self.hole_number}, {self.par}, {self.score}>'
	

class Shot(db.Model):
	__tablename__ = 'shots'

	id = db.Column(db.Integer, primary_key=True)
	stroke_number = db.Column(db.Integer)	
	start_distance = db.Column(db.Integer)
	unit = db.Column(db.String)
	surface = db.Column(db.String)
	penalty = db.Column(db.Integer, default=0)
	club = db.Column(db.String)
	notes = db.Column(db.Text)

	round_hole_id = db.Column(db.Integer, db.ForeignKey("round_holes.id", ondelete="CASCADE"), nullable=False)

	#relationship
	round_hole = db.relationship("RoundHole", back_populates="shots")

	def __repr__(self):
		return f'<Shot: {self.stroke_number}, {self.start_distance}, {self.unit}, {self.surface}, {self.penalty}, {self.club}, {self.notes}>'

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
