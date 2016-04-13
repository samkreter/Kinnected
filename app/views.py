from app import app
from flask.ext.login import LoginManager, login_required, UserMixin, login_user, logout_user,current_user
from flask import redirect, url_for, render_template,request,jsonify
from sqlalchemy.exc import IntegrityError
from app.models import User
from app import db, lm
import bcrypt


@app.route('/')
@app.route('/index')
@app.route('/home')
@app.route('/test')
def index():
    return app.send_static_file('base.html')


##############
# User routes#
##############
@app.route('api/users/json/<int:id>')
def user_json(id):
    user = User.query.filter_by(id=id).first()
    if user is not None:
        print(user.__table__.columns)
        return jsonify({**user.toJson,**user.profile.toJson})
    else:
        return "User not found"


@app.route('api/users/create', methods = ['POST'])
def create_user():
    error = "User Created"
    user = User(first_name=request.form['first_name'],
        last_name=request.form['last_name'],
        email=request.form['email'],
        password=bcrypt.hashpw(request.form['password'] \
            .encode('UTF_8'),bcrypt.gensalt(14)))
    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        error = "User email already exists"
    return error

@app.route('api/users/<int:id>')
def get_user(id):
    user = User.query.filter_by(id=id).first()
    if user is not None:
        error = "all good"
    else:
        error = "User not found"
    print(error)
    return redirect('/index')

@app.route('api/users/delete/<int:id>')
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

@app.route("api/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.get(form.email.data)
        if user:
            if bcrypt.hashpw(form.password.data,user.password) == user.password:
                user.authenticated = True
                db.session.add(user)
                db.session.commit()
                login_user(user, remember=True)
                return redirect(url_for("current_login"))
    return "not good"


#to log out the current user jsut send them to this route
@app.route('api/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

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