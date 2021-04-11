# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import pickle
import json
import os
import numpy as np
import pandas as pd
from datetime import datetime

import lyricsgenius
import json
import time

import requests
from bs4 import BeautifulSoup


# %%
genius_client_access_token = 'fB4ldLe2jlKTIM7rNpHEFDozmXC-ipojy2wYZPS3rICuruFr7TH0Q9eED3CkewS8'
genius = lyricsgenius.Genius(genius_client_access_token)

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
    for key in keys:
        new_dict[key] = dict[key]
    return new_dict


# %%
def getArtistData(artist_name):

    # print starting time
    print(f"Starting: {datetime.now()}")

    #  get an artist's Id
    try:
        # try to get an artist's Id.
        artist = genius.search_artist(artist_name, 0)
        # the response is an artist's information. We only want Id for now.
        artist_id = json.loads(artist.to_json())['id']
        # If this fails print the Exception
    except Exception as e:
        artist_id = None
        print(f"Exception: {e}")

    if artist_id:

        # We also get the name to check if we already have the artist's data in the collection
        artist_api_name = json.loads(artist.to_json())['name']
        artist_files = os.listdir('collection')

        #  Each artist's file is stored as a pickle.
        # To get the artist's name we split the string and get the first value, the name
        # The next code blocks will exute only if we don't already have the artist's data
        if artist_api_name not in [artist_name.split('.')[0] for artist_name in artist_files] + ['T.I.', 'R. Kelly', 'Mary J. Blige', '​fun.', 'J. Cole', 'J. Holiday', 'Portugal. The Man', 'Mr. Probz', 'N.O.R.E.', '*NSYNC']:

            # get the artist's albums.
            # We set while True here so we can try again if the 'try fetch' fails
            while True:
                # 'try fetch
                try:
                    artist_albums = genius.artist_albums(artist_id)['albums']
                # if the fetch is unsuccessful we try again
                except Exception:
                    continue
                # if the fetch is successful we break the loop and move on
                break

            # Now we have the artist's albums in a list
            # with a Dictionary for each album's information
            # We take the first one to get the artist's information
            # Note that this below declare Dictionary will be the main object for an artist
            # It is what the function evenually return
            artist = artist_albums[0]['artist']

            # Below is a list of key we would like to drop from
            # the artist's information
            drop_keys = ['_type', 'api_path',
                         'index_character', 'is_meme_verified', 'slug']

            # Here we utilise a custom function that drops the specified keys
            # see function signature above
            artist = dropDictKeys(artist, drop_keys)

            # We go back to the response we got from the album request
            # This time we get the actual album's information.
            # It's a list of Dictionaries for each album

            # Below we initialise an empty list inside the artist's main object
            artist['albums'] = []

            # Iterate through the albums list
            for j, album in enumerate(artist_albums):

                # drop the artist key, we already collected that information
                album = dropDictKeys(album, ['artist'])

                # print the album number and name for tracking purposes on the log
                print(f"\n {j}: {album['name']} \n")

                # the release date components of each album are store in a Dictionary
                # Sometimes an album may not have that key though. However,
                # if it exists restructure the component into actual date format
                if album['release_date_components']:

                    # step 1 - get the dictionary object and make it a string
                    # If there is an undefined field for the date, it will be the string 'None'
                    #  replace this with '01'. e.g if month is undefined it will default to January.
                    date_comps = album['release_date_components']
                    date_string = f"{date_comps['year']}-{date_comps['month']}-{date_comps['day']}".replace(
                        'None', '01')

                    # If every date field is defined convert the date string to python datetime object
                    if 'None' not in date_string.split('-'):
                        album['date'] = datetime.strptime(
                            date_string, '%Y-%m-%d').date()

                    # if not we'll forefeit the album's release date information (TO BE REVIEWED)
                    else:
                        album['date'] = np.nan

                # Below we define key and drop we would like to drop in each albums's dictionary
                # Note that we include the 'release_date_components' as we have collected this info
                # into a structured date field
                drop_cols = ['api_path', 'release_date_components']
                album = dropDictKeys(album, drop_cols)

                # Finally store the albums dictionary inside the main artist object
                artist['albums'].append(album)

                # Now we go inside the albums Dictionary and create a new key, value field for
                # storing tracks and related information
                album['tracks'] = []

                # For each artist we get a maximum of 50 albums. That is also the genius APIs limit
                max_albums = 50

                # get the album's id
                album_id = album['id']

                # Fetch the album's tracks. We use While True for the same reason as above
                while True:
                    try:
                        # We get the tracks in a list of Dictionaries
                        album_tracks = genius.album_tracks(
                            album_id, max_albums)['tracks']
                    except Exception as e:
                        continue
                    break

                # For each track's Dictionary, DO THE FOLLOWING:
                for i, track in enumerate(album_tracks):

                    # initialise track_data dictionary
                    track_data = {}

                    # get the track's number in the album
                    track_data['number'] = track['number']

                    # the value for the key "song" in the dictionary has most of the info we need
                    # but we don't need it nested. UnNest that dictionary
                    for k, v in track['song'].items():
                        track_data[k] = v

                    # Log in the console for tracking purposes
                    print(f"{i}: {track_data['title']}")

                    # Here we define the list of keys/field we would like to drop in the tracks Dictionary
                    # See that we drop 'primary' artist cause we already have all the information present there
                    drop_cols = ['annotation_count', 'api_path', 'instrumental',
                                 'lyrics_owner_id', 'lyrics_updated_at', 'path',
                                 'pyongs_count', 'updated_by_human_at', 'primary_artist']

                    # drop the specified fields
                    track_data = dropDictKeys(track_data, drop_cols)

                    # To get more information about the track we need the track's id
                    track_id = track_data['id']

                    # Set a counter to 0. We are going to try and fetch each track's information from the API.
                    # We'll use a while loop again to try and fetch for the same reasons as above. However,
                    # we only want to limit our number of tries this time. Thus the counter. This will increase
                    # every Iteration and stop the tries at 3

                    counter = 0
                    max_tries = 3
                    while True:

                        # after 3 tries we'll break the loop and get the previous song
                        # data. This will result in duplicates in our DB but we'll deal with it there.
                        if counter > max_tries:
                            song = song
                            break

                        try:
                            # fetch additional song information (metadata, lyrics etc)
                            song = genius.song(track_id)['song']
                            song['lyrics'] = genius.lyrics(track_id)
                        except Exception:
                            # after a failed try we increase counter by 1 and continue the loop.
                            # Until after 3 tries remember
                            counter += 1
                            continue
                        break

                    # If the fetch was successful we get a lot of data than we need.
                    # We keep only the following keys
                    keep_cols = ['lyrics', 'description', 'embed_content', 'featured_video',
                                 'recording_location', 'apple_music_id', 'apple_music_player_url',
                                 'release_date', 'release_date_for_display', 'featured_artists',
                                 'producer_artists', 'writer_artists', 'custom_performances',
                                 'song_relationships']
                    song = keepDictKeys(song, keep_cols)

                    # Unnest some of the keys in the response dictionary
                    for k, v in song.items():
                        track_data[k] = v

                    # Nest tracks data inside it's album
                    album['tracks'].append(track_data)

            print(f"Starting: {datetime.now()}")

            return artist

# %%


def getWikiTable(year, columns):
    """
    Get top 100 Billboards songs per given year

    """

    url = url = f'https://en.wikipedia.org/wiki/Billboard_Year-End_Hot_100_singles_of_{year}'
    request = requests.get(url)
    website = request.text

    soup = BeautifulSoup(website, features="lxml")
    table = soup.find('table', {'class': 'wikitable'})

    columns = columns
    rows = len(table.findAll('tr'))

    col_names = list()
    for node in range(columns):
        col_names.append(', '.join(table.findAll('th')[node].text.split()))

    df = pd.DataFrame(index=range(rows))

    for column in range(columns):
        values = list()
        for each_row in range(rows):
            row = table.findAll('tr')[each_row].findAll('td')
            if len(row) == columns:
                value = ', '.join(row[column].text.split('[')[0].split())
                value = value.replace(',', '')
                values.append(value)

                df[f'{column}'] = pd.Series(values)
    df.columns = col_names
    df['Year'] = year
    return df


# %%
# top_100_songs = pd.DataFrame()
# for year in range(2000, 2020):
#     print(year)
#     out = getWikiTable(year, 3).iloc[:100]
#     out['Title'] = [title.replace('"', '') for title in out['Title']]
#     top_100_songs = pd.concat([top_100_songs, out])
# pickle.dump(top_100_songs, open('top_100_songs.pkl', 'wb'))
top_100_songs = pickle.load(open('top_100_songs.pkl', 'rb'))

# %%
top_artists = top_100_songs['Artist(s)'].map(lambda x: x.split('featuring')[0]).value_counts().sort_values(
    ascending=False).index.tolist()
# %%
for i, artist_name in enumerate(['Tatiana Manaois', 'Nicki Minaj', 'Jhene Aiko'] + top_artists):
    print(i + 1, artist_name)
    try:
        artist = getArtistData(artist_name)

        try:
            pickle.dump(artist, open(
                f"collection/{artist['name'].replace('*', '')}.pkl", 'wb'))
        except Exception as e:
            print(e)

    except Exception as e:
        print(e)
