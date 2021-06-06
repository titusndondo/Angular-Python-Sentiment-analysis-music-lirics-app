from difflib import get_close_matches
import pickle
from mongoengine import *
from mongoengine.connection import connect
from models import Artist

connect('lytics_db')


def find_matching_artists(string, words):
    return get_close_matches(string.lower(), [word.lower() for word in words], n=5)


names = {}
artists = Artist.objects().all()
for artist in artists:
    # print(artist['name'], artist['id'])
    names[artist['name']] = artist['id']
# print(list(names.keys()))
print(find_matching_artists(
    'Jhenea', [''.join(name.split(' ')) for name in names.keys()]))
# print(names['u2'])


# artist = pickle.load(open('../data/documents/Ace Hood.pkl', 'rb'))
# print(artist['albums'][0]['tracks'][0]['audio_features'])

# for model in [Artist, AudioFeatures]:
#     res = model.objects()
#     res.delete()

# AudioFeatures(**artist['albums'][0]['tracks'][0]['audio_features']).save()


# print(Artist.find_matching_artists(name='tito'))
