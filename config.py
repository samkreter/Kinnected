import os
basedir = os.path.abspath(os.path.dirname(__file__))


#I really don't know why I have to put this but I really do
SECRET_KEY = 'top secret! man'

#you get a really studpid error if you don't put this
SQLALCHEMY_TRACK_MODIFICATIONS = True

#right now just using a sqlite database for this, well change that later
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

#tracks all the database changes
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

#this will be our oauth stuff
OAUTH_CREDENTIALS = {
                    'facebook': {
                        'id': '516651338514853',
                        'secret': '0089733e47a79e57687c08a9de61ab0d'
                    }
                    }