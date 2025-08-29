# Paradox Golf

A Meeseeks themed golf tracker application that provides players with a fun and engaging way to track rounds, monitor progress, and challenge themselves without feeling weighed down by golf’s frustrations. Full-stack application built with Python Flask backend and React frontend.

# Features:
1. Users are able to create an account to personally manage their wine collection.
	- User can Sign up by creating a username, password, and choose from a rick and morty character image.
	- Users are able to Login/Logout

2. Once logged in, they are able to view, update, create, or delete their golf stats. 

3. Users record the following info about their round:
	- Course

# Tools and Resources Featured in this Project:
- [GitHub Repo](https://github.com/webdesigns23/paradox-golf-full-stack-auth.git)
- Python 3.8.13+
- Text Editor or IDE (e.g., VS Code)
- Git + GitHub
- Virtualenv
- Python Packages listed in requirements.txt
- React
- React-Router
- Node.js

# Set Up and Installation:
1. Fork and clone the GitHub Repo
```bash
git clone <repo_url>

```
2. Set up your virtual environment of choice (virtualenv prefered)
```bash
virtualenv env1
source env1/bin/activate
```
3. Install PyPi dependencies using requiements.txt
```bash
pip install -r requirements.txt
```
4. Navigate into the server/ directory and set environment variables:
```bash
cd server
export FLASK_APP=app.py
export FLASK_RUN_PORT=5555
```
5. Create a migrations folder, run initial migration and update
```bash
cd server
flask db init
flask db migrate -m "initial migration"
flask db upgrade
```
6. Populate database with initial data
```bash
python seed.py
```
# Running Back-end of Application:
Should run on port 5555 to match proxy in package.json
You can run the Flask server with:
```bash
python app.py
```

# Running Front-end of Application:
To run the React application
1. Install dependencies
```bash
npm install
```
2. Start the application
```bash
npm start
```

# API Endpoints and Functionality:
## Authorization/ Authentication:
`POST /signup`
* Registers a new user and creates account

`POST /login`
* Authenticates user when they enter username and password
* Generates a JWT 
* embeds the user’s ID or role

## Resource:
`GET /`
* 

`POST /`
* 

`PATCH //<id>`
* Search by id
* Update 

`DELETE //<id>`
* Delete

# Testing: 
- Does not contain test files.
- Test in Postman or by using application in browser and inspect

# Commit and Push Git History if any adjustments to this code are made
1. Add your changes to the staging area by executing
2. Create a commit by executing 
3. Push your commits to GitHub by executing 
4. If you created a separate feature branch, remember to open a PR on main and merge.
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
