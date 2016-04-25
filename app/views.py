from app import app
from flask.ext.login import LoginManager, login_required, UserMixin, login_user, logout_user,current_user
from flask import redirect, url_for, render_template,request,jsonify
from sqlalchemy.exc import IntegrityError
from app.models import User, Profile, Job
from app import db, lm
import json
import bcrypt
import datetime


@app.route('/')
@app.route('/home')
def index():
    return app.send_static_file('index.html')

@app.route('/api/users/display')
def get_display_links():
    user = User.query.filter_by(email=request.args.get("email")).first()
    conns = user.connections
    nodes = []
    links = []
    userName = user.first_name + " " + user.last_name
    nodes.append(dict({"name":userName,"group":1}))
    #create the node list
    for conn in conns:
        name = conn.first_name + " " + conn.last_name
        nodes.append(dict({"name":name,"group":1}))

    for i in range(len(nodes)):
        links.append(dict({"source":i,"target":0,"value":1}))

    target = 1
    group = 2
    count = len(nodes) - 1
    for conn in conns:
        for nconn in conn.connections:
            name = nconn.first_name + " " + conn.last_name
            ndoes.append(dict("name":name,"group":group))
            links.append(dict({"source":count,"target":target,"value":1}))
            count = count + 1
        target = target + 1
        group = group + 1

    return json.dumps({"nodes":nodes,"links":links})

@app.route('/api/jobs/add')
def add_job():
    user = User.query.filter_by(email=request.args.get("email")).first()
    job = Job(title=request.args.get("jobTitle"),description=request.args.get("jobDes"))
    job.users.append(user.profile)
    db.session.add(job)
    db.session.commit()
    return jsonify({'result':True})


##############
# User routes#
##############
@app.route('/api/users/getconn')
def get_connections():
    user = User.query.filter_by(email=request.args.get("email")).first()
    if user:
        conns = user.connections
        connsList = []

        for i in range(len(conns)):
            print(conns[i])
            connsList.append(conns[i].toJson)
            connsList[i].pop("password",None)
        return json.dumps(connsList)
    else:
        return False

@app.route('/api/users/connect')
def make_connection():
    main = User.query.filter_by(email=request.args.get("main-email")).first()
    conn = User.query.filter_by(email=request.args.get("connect-email")).first()
    print(request.args.get("main-email"))
    print(request.args.get("connect-email"))
    if main and conn:
        main.connections.append(conn)
        db.session.commit()
        return jsonify({"result":True})
    else:
        return jsonify({'result':False})


@app.route('/api/users/all')
def get_all_users():
    users = User.query.all()
    for i in range(len(users)):
        users[i] = users[i].toJson
        users[i].pop("password",None)
    return json.dumps(users)


@app.route('/api/users/update')
def update_user():
    print(request.args)
    user = User.query.filter_by(email=request.args.get("Useremail")).first()
    columns = user.columns
    columns.remove("password")
    for column in columns:
        setattr(user,column,request.args.get(column))

    user.profile.gradyear = request.args.get("gradyear")
    user.profile.major = request.args.get("major")
    db.session.commit()
    return "all good"


@app.route('/api/users/json')
def user_json():
    user = User.query.filter_by(email=request.args.get("email")).first()

    if user is not None:
        temp = user.toJson
        profile = user.profile.toJson
        temp.pop("password",None)
        jobs = user.profile.jobs
        jobList = []
        for job in jobs:
            jobList.append(job.toJson)

        #the ** just unraps the dicts so we can make them one amazing json object
        return jsonify({**temp,'result':'success',**profile,'jobs':jobList})
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
        status = True
    except IntegrityError:
        status = False
    return jsonify({'result': status})



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
