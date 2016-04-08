# Retrieve a user from the database in Json
def user_json(id):
    user = User.query.filter_by(id=id).first()
    if user is not None:
        print(user.__table__.columns)
        return jsonify({**user.toJson,**user.profile.toJson})
    else:
        return "User not found"


# Create a user in the database
def create_user():
user = User(first_name=request.form['first_name'],
        last_name=request.form['last_name'],
        email=request.form['email'],
        password=bcrypt.hashpw(request.form['password'] \
            .encode('UTF_8'),bcrypt.gensalt(14)))
    try:
        db.session.add(user)
        db.session.commit()
        error = "User added"
    except IntegrityError:

#update all the information for the database from the form`
def update_user(id):
    user = User.query.filter_by(id=id).first()
    user.insert(first_name=request.form['first_name'],
        last_name=request.form['last_name'],
        email=request.form['email'],
        password=bcrypt.hashpw(request.form['password'] \
            .encode('UTF_8'),bcrypt.gensalt(14)))
    try:
        db.session.add(user)
        db.session.commit()
        error = "User updated"
    except IntegrityError:

#delete a user in the database
def delete_user(id):
    user = User.query.filter_by(id=id).first()
    if user is not None:
        try:
            db.session.delete(user)
            db.session.commit()
            error = "User deleted"
        except IntegrityError:
            error = "Something went wrong here man"