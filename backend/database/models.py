from mongoengine import *
from mongoengine.fields import (
    BooleanField, DateField, DictField, FloatField, IntField, ListField, ReferenceField, StringField
)
from difflib import get_close_matches
from flask_mongoengine import MongoEngine

db = MongoEngine()


class Artist(db.DynamicDocument):
    header_image_url = StringField()
    id = IntField(primary_key=True)
    image_url = StringField()
    name = StringField()
    url = StringField()
    followers = FloatField()
    popularity = FloatField()
    genres = ListField()
    albums = ListField(ReferenceField('Album'))

    meta = {'collection': 'artist'}

    def artist_doc(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'header_image_url': self.header_image_url,
            'image_url': self.image_url,
            'followers': self.followers,
            'popularity': self.popularity,
            'genres': self.genres,
            'albums': [album.album_doc() for album in self.albums]
        }

    def is_matching_artist(self, name):
        print(name, self.name)
        return get_close_matches(name.lower(), [self.name.lower()])


class Album(db.DynamicDocument):
    id = IntField(primary_key=True)
    type = StringField()
    full_title = StringField(required=True)
    name = StringField()
    name_with_artist = StringField()
    release_date = DateField()
    url = StringField()
    cover_art_thumbnail_url = StringField()
    cover_art_url = StringField()
    tracks = ListField(ReferenceField('Track'))
    genres = ListField()
    popularity = FloatField()

    meta = {'collection': 'album'}

    def album_doc(self):
        return {
            'id': self.id,
            'name': self.name,
            'name_with_artist': self.name_with_artist,
            'full_title': self.full_title,
            'type': self.type,
            'release_date': self.release_date,
            'url': self.url,
            'cover_art_thumbnail_url': self.cover_art_thumbnail_url,
            'cover_art_url': self.cover_art_url,
            'tracks': [track.track_doc() for track in self.tracks],
            'genres': self.genres,
            'popularity': self.popularity
        }


class Track(db.DynamicDocument):
    id = IntField(primary_key=True)
    apple_music_id = StringField()
    number = IntField()
    type = StringField()
    full_title = StringField()
    title = StringField()
    popularity = FloatField()
    duration_ms = IntField()
    description = StringField()
    release_date = StringField()
    url = StringField()
    header_image_thumbnail_url = StringField()
    header_image_url = StringField()
    song_art_image_thumbnail_url = StringField()
    song_art_image_url = StringField()
    lyrics = StringField()
    sentiment = DictField(default={'lyrics': None, 'sentiment': None})
    lyrics_state = StringField()
    embed_content = StringField()
    recording_location = StringField()
    featured_video = BooleanField()  # Remember to make a request to youtube if True
    producers = ListField(ReferenceField('Producer'))
    writers = ListField(ReferenceField('Writer'))
    features = ListField(ReferenceField('Feature'))
    contributors = ListField(ReferenceField('Contributor')),
    audio_features = DictField(default={
        'danceability': None,
        'energy': None,
        'key': None,
        'loudness': None,
        'mode': None,
        'speechiness': None,
        'acousticness': None,
        'instrumentalness': None,
        'liveness': None,
        'valence': None,
        'tempo': None
    })

    meta = {'collection': 'track'}

    def track_doc(self):
        return {
            'id': self.id,
            'apple_music_id': self.apple_music_id,
            'number': self.number,
            'type': self.type,
            'full_title': self.full_title,
            'title': self.title,
            'popularity': self.popularity,
            'duration_ms': self.duration_ms,
            'description': self.description,
            'release_date': self.release_date,
            'url': self.url,
            'header_image_thumbnail_url': self.header_image_thumbnail_url,
            'header_image_url': self.header_image_url,
            'song_art_image_thumbnail_url': self.song_art_image_thumbnail_url,
            'song_art_image_url': self.song_art_image_url,
            'lyrics': self.lyrics,
            'sentiment': self.sentiment,
            'lyrics_state': self.lyrics_state,
            'embed_content': self.embed_content,
            'recording_location': self.recording_location,
            'featured_video': self.featured_video,
            'producers': [producer.producer_doc() for producer in self.producers],
            'writers': [writer.writer_doc() for writer in self.writers],
            'features': [feature.feature_doc() for feature in self.features],
            'contributors': [contributor.contributor_doc() for contributor in self.contributors],
            'audio_features': self.audio_features
        }


class Feature(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'feature'}

    def feature_doc(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'header_image_url': self.header_image_url,
            'image_url': self.image_url
        }


class Producer(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'producer'}

    def producer_doc(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'header_image_url': self.header_image_url,
            'image_url': self.image_url
        }


class Writer(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'writer'}

    def writer_doc(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'header_image_url': self.header_image_url,
            'image_url': self.image_url
        }


class Contributor(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    label = StringField()
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'contributor'}

    def contributor_doc(self):
        return {
            'id': self.id,
            'name': self.name,
            'label': self.label,
            'url': self.url,
            'header_image_url': self.header_image_url,
            'image_url': self.image_url
        }
