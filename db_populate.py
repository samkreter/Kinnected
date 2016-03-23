from app import db, models

u = models.User(first_name="tim",last_name="kreter",email="samkreter@gmai.com",password="heythere",social_id="hey")

p = models.Profile(resume="test/this/folder",user=u)