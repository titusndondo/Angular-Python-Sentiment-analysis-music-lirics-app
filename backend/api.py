from os import write
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
    Track, Producer, Writer, Contributor, Feature,
    db
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


def initialize_db(app):
    db.init_app(app)
    CORS(app)


initialize_db(app)


@app.route('/')
def index():
    return redirect(url_for('api'))


@app.route('/api')
def api():
    return {'API': 'Running'}


@app.route('/api/artists/page/<number>')
def get_artists(number):
    artists = Artist.objects.paginate(page=int(number), per_page=5)
    return jsonify([artist.artist_doc() for artist in artists.items])


@app.route('/api/artist/<id>')
def get_artist(id):
    artist = Artist.objects.get(id=id)
    return jsonify(artist.artist_doc())


@app.route('/api/album/<id>')
def get_album(id):
    album = Album.objects.get(id=id)
    return jsonify(album.album_doc())


@app.route('/api/track/<id>')
def get_track(id):
    track = Track.objects.get(id=id)
    return jsonify(track.track_doc())


@app.route('/api/producer/<id>')
def get_producer(id):
    producer = Producer.objects.get(id=id)
    return jsonify(producer.producer_doc())


@app.route('/api/writer/<id>')
def get_writer(id):
    writer = Writer.objects.get(id=id)
    return jsonify(writer.writer_doc())


@app.route('/api/feature/<id>')
def get_feature(id):
    feature = Feature.objects.get(id=id)
    return jsonify(feature.feature_doc())


@app.route('/api/contributor/<id>')
def get_contributor(id):
    contributor = Contributor.objects.get(id=id)
    return jsonify(contributor.contributor_doc())


if __name__ == '__main__':
    app.run(debug=True)
