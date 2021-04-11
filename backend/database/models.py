import pickle
from mongoengine import *
from mongoengine.connection import connect
from mongoengine.document import Document, DynamicDocument
from mongoengine.fields import BooleanField, DateField, IntField, ListField, ReferenceField, StringField


class Artist(Document):
    header_image_url = StringField()
    id = IntField(primary_key=True)
    image_url = StringField()
    name = StringField()
    url = StringField()
    albums = ListField(ReferenceField('Album'))


class Album(Document):
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


class Track(DynamicDocument):
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


class Feature(DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()


class Producer(DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()


class Writer(DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()


class Contributor(DynamicDocument):
    name = StringField()
    id = IntField(primary_key=True)
    label = StringField()
    url = StringField()
    header_image_url = StringField()
    image_url = StringField()


# artists = pickle.load(open('../collection/Nicki Minaj.pkl', 'rb'))
# # print(len(artists['albums'][1]['tracks'][0]['custom_performances']))
# print(artists['albums'][1]['tracks'][0]['title'])
