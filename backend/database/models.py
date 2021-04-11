from mongoengine import *
from mongoengine.connection import connect
from mongoengine.document import Document, DynamicDocument
from mongoengine.fields import (
    BooleanField, DateField, IntField, ListField, ReferenceField, StringField
)

from flask_mongoengine import MongoEngine

db = MongoEngine()


class Artist(db.Document):
    header_image_url = StringField()
    id = IntField(primary_key=True)
    image_url = StringField()
    name = StringField()
    url = StringField()
    albums = ListField(ReferenceField('Album'))

    meta = {'collection': 'artist'}

    def artist_doc(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'header_image_url': self.header_image_url,
            'image_url': self.image_url,
            'albums': [
                {
                    'id': album.id,
                    'name': album.name,
                    'name_with_artist': album.name_with_artist,
                    'full_title': album.full_title,
                    'type': album.type,
                    'release_date': album.release_date,
                    'url': album.url,
                    'cover_art_thumbnail_url': album.cover_art_thumbnail_url,
                    'cover_art_url': album.cover_art_url,
                    'tracks': [
                        {
                            'id': track.id,
                            'apple_music_id': track.apple_music_id,
                            'number': track.number,
                            'type': track.type,
                            'full_title': track.full_title,
                            'title': track.title,
                            'description': track.description,
                            'release_date': track.release_date,
                            'url': track.url,
                            'header_image_thumbnail_url': track.header_image_thumbnail_url,
                            'header_image_url': track.header_image_url,
                            'song_art_image_thumbnail_url': track.song_art_image_thumbnail_url,
                            'song_art_image_url': track.song_art_image_url,
                            'lyrics': track.lyrics,
                            'lyrics_state': track.lyrics_state,
                            'embed_content': track.embed_content,
                            'recording_location': track.recording_location,
                            'featured_video': track.featured_video,
                            'producers': [
                                {
                                    'id': producer.id,
                                    'name': producer.name,
                                    'url': producer.url,
                                    'header_image_url': producer.header_image_url,
                                    'image_url': producer.image_url
                                } for producer in track.producers],
                            'writers': [
                                {
                                    'id': writer.id,
                                    'name': writer.name,
                                    'url': writer.url,
                                    'header_image_url': writer.header_image_url,
                                    'image_url': writer.image_url
                                } for writer in track.writers],
                            'features': [
                                {
                                    'id': feature.id,
                                    'name': feature.name,
                                    'url': feature.url,
                                    'header_image_url': feature.header_image_url,
                                    'image_url': feature.image_url
                                } for feature in track.features],
                            'contributors': [
                                {
                                    'id': contributor.id,
                                    'name': contributor.name,
                                    'label': contributor.label,
                                    'url': contributor.url,
                                    'header_image_url': contributor.header_image_url,
                                    'image_url': contributor.image_url
                                } for contributor in track.contributors]
                        } for track in album.tracks]
                } for album in self.albums]
        }


class Album(db.Document):
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
            'tracks': [
                {
                    'id': track.id,
                    'apple_music_id': track.apple_music_id,
                    'number': track.number,
                    'type': track.type,
                    'full_title': track.full_title,
                    'title': track.title,
                    'description': track.description,
                    'release_date': track.release_date,
                    'url': track.url,
                    'header_image_thumbnail_url': track.header_image_thumbnail_url,
                    'header_image_url': track.header_image_url,
                    'song_art_image_thumbnail_url': track.song_art_image_thumbnail_url,
                    'song_art_image_url': track.song_art_image_url,
                    'lyrics': track.lyrics,
                    'lyrics_state': track.lyrics_state,
                    'embed_content': track.embed_content,
                    'recording_location': track.recording_location,
                    'featured_video': track.featured_video,
                    'producers': [
                        {
                            'id': producer.id,
                            'name': producer.name,
                            'url': producer.url,
                            'header_image_url': producer.header_image_url,
                            'image_url': producer.image_url
                        } for producer in track.producers],
                    'writers': [
                        {
                            'id': writer.id,
                            'name': writer.name,
                            'url': writer.url,
                            'header_image_url': writer.header_image_url,
                            'image_url': writer.image_url
                        } for writer in track.writers],
                    'features': [
                        {
                            'id': feature.id,
                            'name': feature.name,
                            'url': feature.url,
                            'header_image_url': feature.header_image_url,
                            'image_url': feature.image_url
                        } for feature in track.features],
                    'contributors': [
                        {
                            'id': contributor.id,
                            'name': contributor.name,
                            'label': contributor.label,
                            'url': contributor.url,
                            'header_image_url': contributor.header_image_url,
                            'image_url': contributor.image_url
                        } for contributor in track.contributors]
                } for track in self.tracks]
        }


class Track(db.DynamicDocument):
    id = IntField(primary_key=True)
    apple_music_id = StringField()
    number = IntField()
    type = StringField()
    full_title = StringField()
    title = StringField()
    description = StringField()
    release_date = StringField()
    url = StringField()
    header_image_thumbnail_url = StringField()
    header_image_url = StringField()
    song_art_image_thumbnail_url = StringField()
    song_art_image_url = StringField()
    lyrics = StringField()
    lyrics_state = StringField()
    embed_content = StringField()
    recording_location = StringField()
    featured_video = BooleanField()  # Remember to make a request to youtube if True
    producers = ListField(ReferenceField('Producer'))
    writers = ListField(ReferenceField('Writer'))
    features = ListField(ReferenceField('Feature'))
    contributors = ListField(ReferenceField('Contributor'))

    meta = {'collection': 'track'}


class Feature(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'feature'}


class Producer(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'producer'}


class Writer(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'writer'}


class Contributor(db.DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    label = StringField()
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()

    meta = {'collection': 'contributor'}


# out = Artist.objects().paginate(2, 10)
# print(out)
