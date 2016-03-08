from app import app
from flask.ext.login import LoginManager, UserMixin, login_user, logout_user,current_user
from flask import redirect, url_for, render_template
from oauth import OAuthSignIn
from app.models import User
from app import db



@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/current')
def current_login():
    if current_user.is_anonymous:
        return redirect(url_for('index'))
    return "your loggin in yea"


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('current_login'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


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