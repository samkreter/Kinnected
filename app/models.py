from app import db,lm
from flask.ext.login import LoginManager, UserMixin
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()



class User(db.Model,Base,UserMixin):
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
    companies = db.relationship("Company", back_populates="owner")
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

class Company(db.Model,Base):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship("User", back_populates="companies")
    jobs = db.relationship("Job", back_populates="company")
    name = db.Column(db.String(120))
    #nickname = db.Column(db.String(64), index=True, unique=True)
    address = db.Column(db.String(120), index=True, unique=True)

    def __repr__(self):
        return '<Company %r>' % (self.name)


class Profile_job_assoc_table(db.Model,Base):
    __tablename__ = 'profile_job_assoc_table'
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'), primary_key=True)

class Profile_skill_assoc_table(db.Model,Base):
    __tablename__ = 'profile_skill_assoc_table'
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skill.id'), primary_key=True)


class Job(db.Model,Base):
    __tablename__ = 'job'
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(140))

    users = db.relationship("Profile",secondary=Profile_job_assoc_table.__table__,back_populates="jobs")

    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company = db.relationship("Company", back_populates="jobs")

    def __repr__(self):
        return '<Job %r>' % (self.title)


class Profile(db.Model,Base):
    __tablename__ = 'profile'
    id = db.Column(db.Integer, primary_key=True)
    resume = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', back_populates='profile')

    jobs = db.relationship("Job",secondary=Profile_job_assoc_table.__table__,back_populates="users")
    skills = db.relationship("Skill",secondary=Profile_skill_assoc_table.__table__,back_populates="users")

    def __repr__(self):
        return '<Profile %r>' % (self.id)



class Skill(db.Model,Base):
    id = db.Column(db.Integer, primary_key=True)
    users = db.relationship("Profile",secondary=Profile_skill_assoc_table.__table__,back_populates="skills")
    name = db.Column(db.String(120))

    def __repr__(self):
        return '<Skill %r>' % (self.name)




