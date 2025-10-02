#!/usr/bin/env python3
from config import app, db, api, jwt

#Register Resources
from resources.auth import register_auth_resources
from resources.rounds import register_rounds_resources
from resources.holes import register_holes_resources
from resources.shots import register_shots_resources
from resources.courses import register_courses_resources

register_auth_resources(api)
register_rounds_resources(api)
register_holes_resources(api)
register_shots_resources(api)
register_courses_resources(api)

if __name__ == '__main__':
    app.run(port=5555, debug=True)

