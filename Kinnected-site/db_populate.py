#!flask/bin/python3
from app import db, models
from faker import Faker


fake = Faker()

for i in range(10):
    name = fake.name().split()
    u = models.User(first_name=name[0],last_name=name[1],email=fake.email(),password="heythere")

    p = models.Profile(resume="test/this/folder",user=u)

    db.session.add(u)
    db.session.add(p)
    db.session.commit()
