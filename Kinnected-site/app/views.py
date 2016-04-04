from app import app
from flask.ext.login import LoginManager, login_required, UserMixin, login_user, logout_user,current_user
from flask import redirect, url_for, render_template,request
from oauth import OAuthSignIn
from sqlalchemy.exc import IntegrityError
from app.models import User
from app import db, lm


@app.route('/')
@app.route('/index')
def index():
    return app.send_static_file('base.html')


@app.route('/users/create', methods = ['POST'])
def create_user():
    print(request.form['email'])
    user = User(first_name=request.form['first_name'],last_name=request.form['last_name'],email=request.form['email'],password=request.form['password'])
    try:
        db.session.add(user)
        db.session.commit()
        error = "User added"
    except IntegrityError:
        error = "Something went wrong here man"
    print(error)
    return redirect('/index')

@app.route('/users/<int:id>')
def get_user(id):
    user = User.query.filter_by(id=id).first()
    if user is not None:
        error = "all good"
    else:
        error = "User not found"
    print(error)
    return redirect('/index')

@app.route('/users/delete/<int:id>')
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

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.get(form.email.data)
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                user.authenticated = True
                db.session.add(user)
                db.session.commit()
                login_user(user, remember=True)
                return redirect(url_for("bull.reports"))
    return render_template("login.html", form=form)


#to log out the current user jsut send them to this route
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

#users hit this if they are not loggin in, we'll fill in cool stuff later
@lm.unauthorized_handler
def unauthorized():
    # do stuff
    return redirect(url_for('index'))

#userd for login to check, authenticate and create a user if nesseary
@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('current_login'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()

#the call back to get all of the information from the provider, probably sticking with facebook
@app.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('current_login'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email = oauth.callback()
    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('index'))
    user = User.query.filter_by(social_id=social_id).first()
    if not user:
        user = User(social_id=social_id, nickname=username, email=email)
        db.session.add(user)
        db.session.commit()
    login_user(user, True)
    return redirect(url_for('current_login'))