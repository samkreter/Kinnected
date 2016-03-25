from require import *
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager

# Base Directory
basedir = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..')


app = Flask(__name__)
app.config.from_object('app.config')
db = SQLAlchemy(app)
lm = LoginManager(app)

# Bcrypt for password encryption
flask_bcrypt = Bcrypt(app)

# HTTPAuth
auth = HTTPBasicAuth()

# Post Request Response
@app.after_request
def after_resquest(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  return response

from app import views,models
from models import *
import controller