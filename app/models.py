from app import db
from flask.ext.login import LoginManager, UserMixin

lm = LoginManager(app)

class User(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(64), index=True, unique=True)
    last_name = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    projects = db.relationship('Project', backref='owner', lazy='dynamic')

    def __init__(self, email, first_name=None, last_name=None):
        self.email = email.lower()
        self.first_name = first_name
        self.last_name = last_name

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return '<User %r>' % (self.nickname)


@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

class Project(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Project %r>' % (self.body)