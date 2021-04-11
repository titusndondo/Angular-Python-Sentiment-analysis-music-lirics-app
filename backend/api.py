import uuid
from flask import Flask, request, jsonify, make_response, redirect
from flask.helpers import url_for
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from mongoengine.connection import disconnect
from werkzeug.security import generate_password_hash
from database.models import (
    Artist,
    Album,
    Track, Producer, Writer, Contributor, Feature
)
import datetime
import jwt
from functools import wraps
import json

app = Flask(__name__)

disconnect('lytics_db')

app.config['SECRET_KEY'] = 'thisisthekey'
app.config['MONGODB_SETTINGS'] = {
    'host': 'mongodb://localhost/lytics_db'
}

db = MongoEngine()


def initialize_db(app):
    db.init_app(app)
    CORS(app)


initialize_db(app)


@app.route('/')
def index():
    return redirect(url_for('api'))


@app.route('/api')
def api():
    return {'API': 'Documentation'}


@app.route('/api/artist/<id>')
def recipe(id):
    artist = Artist.objects().get(id=id)
    return jsonify(artist.artistDoc())


if __name__ == '__main__':
    app.run(debug=True)
