from app import app
from flask.ext.login import LoginManager, login_required, UserMixin, login_user, logout_user,current_user
from flask import redirect, url_for, render_template,request,jsonify
from sqlalchemy.exc import IntegrityError
from app.models import User, Profile
from app import db, lm
import bcrypt


@app.route('/')
@app.route('/home')
def index():
    return app.send_static_file('index.html')

##############
# User routes#
##############
@app.route('/api/users/update')
def update_user():
    print(request.args)
    return "hell yes"

@app.route('/api/users/json')
def user_json():
    user = User.query.filter_by(email=request.args.get("email")).first()

    if user is not None:
        temp = user.toJson
        profile = user.profile.toJson
        temp.pop("password",None)
        #the ** just unraps the dicts so we can make them one amazing json object
        return jsonify({**temp,'result':'success',**profile})
    else:
        return "User not found"


@app.route('/api/users/create', methods = ['POST'])
def create_user():
    user = User(first_name=request.json['first_name'],
        last_name=request.json['last_name'],
        email=request.json['email'],
        password=bcrypt.hashpw(request.json['password'] \
            .encode('UTF_8'),bcrypt.gensalt(14)))
    p = Profile(user=user)
    try:
        db.session.add(user)
        db.session.add(p)
        db.session.commit()
        status = 'success'
    except IntegrityError:
        status = "this user is already registered"
    return jsonify({'result': status})

@app.route('/api/users/<int:id>')
def get_user(id):
    user = User.query.filter_by(id=id).first()
    if user is not None:
        error = "all good"
    else:
        error = "User not found"
    print(error)
    return redirect('/index')

@app.route('/api/users/delete/<int:id>')
def delete_user(id):
    user = User.query.filter_by(id=id).first()
    if user is not None:
        try:
            db.session.delete(user)
            db.session.commit()
            error = "User deleted"
        except IntegrityError:
            error = "Something went wrong here man"
    else:
        error = "User not found"
    print(error)
    return redirect('/index')


#just a holder route that users hit when their logged in, we can change this later
@app.route('/current')
@login_required
def current_login():
    return "your loggin in yea"


###################
# Login/out routes#
###################

@app.route("/api/login", methods=["GET", "POST"])
def login():
    print(request.json['email'])
    user = User.query.filter_by(email=request.json['email']).first()
    status = False
    if user:
        if bcrypt.hashpw(request.json['password'].encode('UTF_8'),user.password) == user.password:
            user.authenticated = True
            db.session.add(user)
            db.session.commit()
            login_user(user, remember=True)
            status = True

    return jsonify({'result': status})


#to log out the current user jsut send them to this route
@app.route('/api/logout')
def logout():
    logout_user()
    return jsonify({'result': 'success'})


#users hit this if they are not loggin in, we'll fill in cool stuff later
@lm.unauthorized_handler
def unauthorized():
    # do stuff
    return redirect(url_for('index'))

# #userd for login to check, authenticate and create a user if nesseary
# @app.route('/authorize/<provider>')
# def oauth_authorize(provider):
#     if not current_user.is_anonymous:
#         return redirect(url_for('current_login'))
#     oauth = OAuthSignIn.get_provider(provider)
#     return oauth.authorize()

# #the call back to get all of the information from the provider, probably sticking with facebook
# @app.route('/callback/<provider>')
# def oauth_callback(provider):
#     if not current_user.is_anonymous:
#         return redirect(url_for('current_login'))
#     oauth = OAuthSignIn.get_provider(provider)
#     social_id, username, email = oauth.callback()
#     if social_id is None:
#         flash('Authentication failed.')
#         return redirect(url_for('index'))
#     user = User.query.filter_by(social_id=social_id).first()
#     if not user:
#         user = User(social_id=social_id, nickname=username, email=email)
#         db.session.add(user)
#         db.session.commit()
#     login_user(user, True)
#     return redirect(url_for('current_login'))