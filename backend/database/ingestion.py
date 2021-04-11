import pickle
import os

from mongoengine.connection import connect
from models import (
    Artist,
    Album,
    Track, Producer, Writer, Contributor, Feature
)

connect('lytics_db')

for model in [Artist, Album, Track, Producer, Writer, Contributor, Feature]:
    res = model.objects()
    res.delete()

artist_files = os.listdir('../data/collection')
# print(artist_files)
artists = [pickle.load(open(f'../data/collection/{filename}', 'rb'))
           for filename in artist_files]
# print(artists[0].keys())

# %%


def dropDictKeys(dict, keys):
    for key in keys:
        try:
            del dict[key]
        except Exception as e:
            pass
    return dict

# %%


def upsert_other_artists(other_artists, Model):
    artists = []
    for artist in other_artists:
        to_drop = ['api_path', 'is_meme_verified', 'is_verified', 'iq']
        artist = dropDictKeys(artist, to_drop)
        # print(artist)
        artist = Model(**artist).save()
        artists.append(artist)
    return artists

# %%


for i, artist in enumerate(artists):

    albums = artist['albums']
    to_drop = ['albums', 'is_verified', 'iq']
    artist = dropDictKeys(artist, to_drop)

    all_albums = []
    for album in albums:
        tracks = album['tracks']

        album = dropDictKeys(album, ['tracks'])

        album['type'] = album.pop('_type')

        if album.get('date'):
            album['release_date'] = str(album.pop('date'))
        else:
            album['release_date'] = None

        all_tracks = []
        for track in tracks:

            track['description'] = track['description']['plain']

            producer_artists = track['producer_artists']
            writer_artists = track['writer_artists']
            featured_artists = track['featured_artists']
            custom_performances = track['custom_performances']

            to_drop = ['stats', 'release_date_for_display', 'song_relationships',
                       'producer_artists', 'writer_artists', 'featured_artists', 'custom_performances']
            track = dropDictKeys(track, to_drop)

            producers = upsert_other_artists(producer_artists, Producer)
            writers = upsert_other_artists(writer_artists, Writer)
            features = upsert_other_artists(featured_artists, Feature)

            contributor_artists = []
            # print(track['title'], len(custom_performances))
            for perfomance in custom_performances:
                _artists = perfomance['artists']
                # _artists['label'] = perfomance['label']
                # print(perfomance['label'])
                for art in _artists:
                    # print(art)
                    art['label'] = perfomance['label']
                    contributor_artists.append(art)
                # print(' ')
            # print(contributor_artists)
            contributors = upsert_other_artists(
                contributor_artists, Contributor)

            track['producers'] = producers
            track['features'] = features
            track['writers'] = writers
            track['contributors'] = contributors
            # print(track.keys())
            track = Track(**track).save()
            all_tracks.append(track)

        album['tracks'] = all_tracks
        album = Album(**album).save()
        all_albums.append(album)

    artist['albums'] = all_albums
    Artist(**artist).save()
    print(i, artist['name'])
