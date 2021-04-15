import pickle
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


# %%

spotify_client_id = 'e0e51ec7feeb45b89b165ae1007c535d'
spotify_client_secret = 'cf444557e7ad446ebd5c2d4cc6a781cf'

client_credentials_manager = SpotifyClientCredentials(
    spotify_client_id, spotify_client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

# %%


def dropDictKeys(dict, keys):
    for key in keys:
        try:
            del dict[key]
        except Exception as e:
            pass
    return dict


def keepDictKeys(dict, keys):
    new_dict = {}
    if dict:
        for key in keys:
            new_dict[key] = dict[key]
        return new_dict
    return {}

# %%


def get_spotify_data(artist):

    artist_match = sp.search(artist['name'], type='artist')
    artist_match = artist_match['artists']['items'][0]

    keep = ['followers', 'popularity', 'genres']  # 'id', 'name',
    drop = ['external_urls', 'type', 'href', 'uri', 'images']

    artist = {**artist, **keepDictKeys(artist_match, keep)}
    artist['followers'] = artist['followers']['total']
    for i, album in enumerate(artist['albums']):

        album_match = sp.search(album['name'].split(
            '-')[0], type='album')['albums']['items']
        if album_match:
            album_id = album_match[0]['id']
        else:
            album_id = 'None'
        album_match = sp.albums([album_id])['albums'][0]

        # 'name', 'id', 'type', 'tracks'
        keep = ['genres', 'popularity', 'release_date']
        album_match = keepDictKeys(album_match, keep) or {
            'genres': None, 'popularity': None, 'release_date': None}
        artist['albums'][i] = {**album, **album_match}

        for j, track in enumerate(album['tracks']):

            query = f"artist:{artist['name']} track:{track['title']}"
            track_match = sp.search(query, type='track')['tracks']['items']

            if track_match:
                track_id = track_match[0]['id']
            else:
                track_id = 'None'
            track_match = sp.tracks([track_id])['tracks'][0]

            audio_features = sp.audio_features(track_id)[0]
            audio_features = audio_features if audio_features else {}
            drop = ['id', 'uri', 'track_href', 'analysis_url',
                    'duration_ms', 'time_signature', 'type']
            track['audio_features'] = dropDictKeys(audio_features, drop)

            keep = ['popularity', 'duration_ms']  # 'id', 'name'
            track_match = keepDictKeys(track_match, keep) or {
                'popularity': None, 'duration_ms': None, 'audio_features': None}
            artist['albums'][i]['tracks'][j] = {**track, **track_match}
    return artist

# %%


# print([filename[:-4] for filename in os.listdir('./data/documents')])

artist_files = os.listdir('./data/collection')
artists = [pickle.load(open(f'./data/collection/{filename}', 'rb'))
           for filename in artist_files]

for i, artist in enumerate(artists):
    # print(artist['name'])
    print(i, artist['name'])
    if artist['name'] not in [filename[:-4] for filename in os.listdir('./data/documents')]:
        try:
            artist = get_spotify_data(artist)
            pickle.dump(artist,
                        open(f"./data/documents/{artist['name']}.pkl", 'wb'))
        except:
            pass
