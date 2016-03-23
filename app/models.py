from app import db,lm
from flask.ext.login import LoginManager, UserMixin



class User(UserMixin,db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))

    #nickname = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    password = db.Column(db.String(64),nullable=False)

    craeted = db.Column(db.DateTime)
    updated = db.Column(db.DateTime)

    #relationships
    #projects = db.relationship('Project', backref='owner', lazy='dynamic')
    companies = db.relationship('Company', backref='owner', lazy='dynamic')
    profile = db.relationship('Profile', uselist=False, back_populates='user')

    # def __init__(self, email, first_name=None, last_name=None):
    #     self.email = email.lower()
    #     self.first_name = first_name
    #     self.last_name = last_name

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
        return '<User %r>' % (self.email)


@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

class Company(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(120))
    #nickname = db.Column(db.String(64), index=True, unique=True)
    address = db.Column(db.String(120), index=True, unique=True)


profile_skill_assoc_table = Table('association', Base.metadata,
    Column('profile_id', Integer, ForeignKey('skill.id')),
    Column('skill_id', Integer, ForeignKey('profile.id'))
)

class Skill(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    users = relationship("Profile",secondary=profile_skill_assoc_table,back_populates="skills")



class Profile(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    resume = db.Column(db.String(120))
    user = db.relationship('User', back_populates='profile')
    jobs = db.relationship('Job', backref='employee', lazy='dynamic')
    skills = relationship("Skill",secondary=profile_skill_assoc_table,back_populates="users")
    #nickname = db.Column(db.String(64), index=True, unique=True)
    #address = db.Column(db.String(120), index=True, unique=True)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(140))
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'))
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))

    def __repr__(self):
        return '<Project %r>' % (self.body)