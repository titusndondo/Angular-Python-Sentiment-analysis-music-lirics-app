import pickle
from mongoengine import *
from mongoengine.connection import connect
from models import Artist, AudioFeatures

connect('lytics_db')

artist = Artist.objects().get(id=14325)
print(artist.artist_doc()['albums'][0]['tracks'][0]['id'])


# artist = pickle.load(open('../data/documents/Ace Hood.pkl', 'rb'))
# print(artist['albums'][0]['tracks'][0]['audio_features'])

# for model in [Artist, AudioFeatures]:
#     res = model.objects()
#     res.delete()

# AudioFeatures(**artist['albums'][0]['tracks'][0]['audio_features']).save()
