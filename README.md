Kinnected
=========

Kinnected is an application to keep all of your perfessional connections in one place. Simple way to allow for viewing the different relationships in your group

###Set up

1. Make sure you have python 3.5 installed on your machine

2. Clone the repo and cd into the directory

3. Create a virtual envorment with the command

    `python3 -m venv flask`

4. Install requirments with

    `flask/bin/pip install -r requirments.txt`


5. Execute the db_crete.py to create the database

    `./db_create.py`

    - if this doesn't execute give it exection permission with

        `chmod a+x db_create.py`

6. Migrate the database by executing

    `./db_migrate.py`

    - same as above if it doesn't execute give it permission with

        `chmod a+x db_migrate.py`
7. Start the server with the command

    `./run.py'

    - follow above steps to make the file executatble
8. Go to port localhost:5000 to view that local app
