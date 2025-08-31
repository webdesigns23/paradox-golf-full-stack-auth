#!/usr/bin/env python3
from config import app, db
from datetime import date
from models import User, Round, RoundHole, Shot, Challenge


with app.app_context():
	# Delete Records
	print('Deleting All Records...')	
	Shot.query.delete()
	RoundHole.query.delete()
	Round.query.delete()
	Challenge.query.delete()
	User.query.delete()
	db.session.commit()

	# Create USERS: unique username, pw hashed before stored!
	print('Creating Users...')
	u1 = User(username = 'luna', display_name='looneyluna') 
	u1.password_hash = 'kitten123'

	u2 = User(username = 'pew', display_name='bertiebotts')
	u2.password_hash = 'cat456'
	
	u3 = User(username = 'bryan', display_name='bear96')
	u3.password_hash = 'pw102030'

	db.session.add_all([u1,u2,u3])
	db.session.commit()

	# Round:
	print('Creating Round Records...')
	r1 = Round(
		user_id = u3.id,
		course_name = 'Walnut Creek Golf Preserve',
		course_external_id = 19103,
		date = date(2025, 8, 8),
		tee = 'male',
		tee_name = '1',
		holes = 'Front 9',
		notes = "Windy day with occational light rain")
	
	r2 = Round(
		user_id = u1.id,
		course_name = 'Indian Tree Golf Course',
		course_external_id = 19218,
		date = date(2025, 8, 6),
		tee = 'female',
		tee_name = 'Gold',
		holes = 'Back 9',
		notes = "Perfect Weather, evening tee-time was great!")
			
	db.session.add_all([r1, r2])
	db.session.commit()

	#RoundHole:
	print('Creating Round Hole Records...')
	rh1_hole1 = RoundHole(round_id = r1.id, hole_number = 1, par = 4, score = 4)
	rh1_hole2 = RoundHole(round_id = r1.id, hole_number = 2, par = 4, score= 4 )
	rh1_hole3 = RoundHole(round_id = r1.id, hole_number = 3, par = 5, score = 5)
	rh1_hole4 = RoundHole(round_id = r1.id, hole_number = 4, par = 3, score = 4)
	rh1_hole5 = RoundHole(round_id = r1.id, hole_number = 5, par = 4, score = 4)
	rh1_hole6 = RoundHole(round_id = r1.id, hole_number = 6, par = 5, score = 4)
	rh1_hole7 = RoundHole(round_id = r1.id, hole_number = 7, par = 3, score = 3)
	rh1_hole8 = RoundHole(round_id = r1.id, hole_number = 8, par = 4, score = 4)
	rh1_hole9 = RoundHole(round_id = r1.id, hole_number = 9, par = 4, score = 5)
		
	rh2_hole1 = RoundHole(round_id = r2.id, hole_number = 1, par = 4, score = 4)	
	rh2_hole2 = RoundHole(round_id = r2.id, hole_number = 2, par = 4, score = 3)	
	rh2_hole3 = RoundHole(round_id = r2.id, hole_number = 3, par = 3, score = 3)	
	rh2_hole4 = RoundHole(round_id = r2.id, hole_number = 4, par = 5, score = 4)
	rh2_hole5 = RoundHole(round_id = r2.id, hole_number = 5, par = 5, score = 5)	
	rh2_hole6 = RoundHole(round_id = r2.id, hole_number = 6, par = 4, score = 3)	
	rh2_hole7 = RoundHole(round_id = r2.id, hole_number = 7, par = 4, score = 3)	
	rh2_hole8 = RoundHole(round_id = r2.id, hole_number = 8, par = 3, score = 4)	
	rh2_hole9 = RoundHole(round_id = r2.id, hole_number = 9, par = 5, score = 4)	
		
			
	db.session.add_all([
			rh1_hole1, rh1_hole2, rh1_hole3, rh1_hole4, rh1_hole5, rh1_hole6, rh1_hole7, rh1_hole8, rh1_hole9, 
   			rh2_hole1, rh2_hole2, rh2_hole3, rh2_hole4, rh2_hole5, rh2_hole6, rh2_hole7, rh2_hole8, rh2_hole9
		])
	db.session.commit()

	print('Creating Shot Data...')
	#Bryan Shots:
	sr1_h1 = [
		Shot(round_hole_id = rh1_hole1.id, stroke_number= 1, start_distance= 392, unit= 'yd', surface = 'tee', penalty= 0, club= '5 Wood'),
		Shot(round_hole_id = rh1_hole1.id, stroke_number= 2, start_distance= 145, unit= 'yd', surface= 'fairway', penalty= 0, club= 'pitching wedge'),
		Shot(round_hole_id = rh1_hole1.id, stroke_number= 3, start_distance= 30, unit= 'ft', surface= 'green', penalty= 0, club= 'putter'),
		Shot(round_hole_id = rh1_hole1.id, stroke_number= 4, start_distance= 1,	unit= 'ft', surface= 'green', penalty= 0, club= 'putter')
		] 

	sr1_h2 = [
		Shot(round_hole_id = rh1_hole2.id, stroke_number= 1, start_distance= 440, unit= 'ft', surface= 'tee', penalty= 0,club= 'driver'),
		Shot(round_hole_id = rh1_hole2.id, stroke_number= 2, start_distance= 142, unit= 'ft', surface= 'fairway', penalty= 0, club= 'gap wedge'),
		Shot(round_hole_id = rh1_hole2.id, stroke_number= 3, start_distance= 35,	unit= 'ft', surface= 'green', penalty= 0, club= 'putter'),
		Shot(round_hole_id = rh1_hole2.id, stroke_number= 4, start_distance= 4, unit= 'ft', surface= 'green', penalty= 0, club= 'putter'),
	]	
	
	sr1_h3 = [
		Shot(round_hole_id = rh1_hole3.id, stroke_number= 1, start_distance= 440, unit= 'ft', surface= 'tee', penalty= 0,club= 'driver'),
		Shot(round_hole_id = rh1_hole3.id, stroke_number= 2, start_distance= 142, unit= 'ft', surface= 'fairway', penalty= 0, club= 'gap wedge'),
		Shot(round_hole_id = rh1_hole3.id, stroke_number= 3, start_distance= 35,	unit= 'ft', surface= 'green', penalty= 0, club= 'putter'),
		Shot(round_hole_id = rh1_hole3.id, stroke_number= 4, start_distance= 4, unit= 'ft', surface= 'green', penalty= 0, club= 'putter')
	]
	
	#Luna Shots
	sr2_h1 = [
		Shot(round_hole_id = rh2_hole1.id, stroke_number= 1, start_distance= 392, unit= 'yd', surface= 'tee', penalty= 0, club= '5 Wood'),
		Shot(round_hole_id = rh2_hole1.id, stroke_number= 2, start_distance= 145, unit= 'yd', surface= 'fairway', penalty= 0, club= 'pitching wedge'),
		Shot(round_hole_id = rh2_hole1.id, stroke_number= 3, start_distance= 30, unit= 'ft', surface= 'green', penalty= 0, club= 'putter'),
		Shot(round_hole_id = rh2_hole1.id, stroke_number= 4, start_distance= 1,	unit= 'ft', surface= 'green', penalty= 0, club= 'putter')
	]
	
	db.session.add_all(sr1_h1 + sr1_h2 + sr1_h3 + sr2_h1)
	db.session.commit()

	#Challenge:
	print('Creating Challenge Records...')
	ch1 = Challenge(user_id= u3.id, title= "Par 3 Bogey Free", type="bogey", target_number= 0, start_date= date(2025,8,3), end_date= date(2025,8,9), status= 'failed')
	ch2 = Challenge( user_id= u1.id, title= "Make 3 Birdies", type="birdie", target_number= 3, start_date= date(2025,8,3), end_date= date(2025,8,9), status= 'achieved')

	db.session.add_all([ch1,ch2])
	db.session.commit()

	print('⛳Database seeded successfully!')

