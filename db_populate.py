#!flask/bin/python3
from app import db, models
import numpy as np
import pandas as pd
from faker import Faker
import bcrypt





fake = Faker()
data =  pd.read_csv('companies.csv')

for comName in data.columns:
    name = fake.name().split()
    u = models.User(first_name=name[0],last_name=name[1],email=fake.email(),password=bcrypt.hashpw('heythere'.encode('UTF_8'),bcrypt.gensalt(14)))
    p = models.Profile(user=u)
    c = models.Company(owner=u,name=comName,address=fake.address())
    db.session.add(u)
    db.session.add(p)
    db.session.add(c)
    db.session.commit()
    for job in data[comName]:
        if pd.isnull(job):
            break
        db.session.add(models.Job(title=job,company=c))
    db.session.commit()



# for i in range(data[0,:].size):
#     name = fake.name().split()
#     u = models.User(first_name=name[0],last_name=name[1],email=fake.email(),password=bcrypt.hashpw('heythere'.encode('UTF_8'),bcrypt.gensalt(14)))
#     p = models.Profile(user=u)
#     c = models.Company(owner=u,name=data[0,i],address=fake.address())
#     db.session.add(u)
#     db.session.add(p)
#     db.session.add(c)
#     for job in data[:,i]:
#         db.session.add(models.Job(title=job,company=c))

#     db.session.commit()
