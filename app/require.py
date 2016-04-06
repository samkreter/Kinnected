'''
APP REQUIRE
'''

import os

from flask import Flask, request, Response, session, jsonify
from flask import render_template, send_from_directory, url_for
from flask import redirect, send_file, make_response, abort

from flask.ext.bcrypt import Bcrypt
from flask.ext.httpauth import HTTPBasicAuth
from flask.ext.restless import APIManager, ProcessingException
from flask.ext.sqlalchemy import SQLAlchemy

from sqlalchemy import sql
