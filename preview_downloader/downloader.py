import requests
import sys
import processor
import os
import json
from pathlib import Path
from pymongo import MongoClient
import spotipy
import spotipy.util as util
import spotipy.oauth2 as oauth2


def download_preview(url, name):
    # Creates the file in the working directory
    local_filename = name + '.mp3'
    spotify_preview = requests.get(url)   
    downloaded_preview = open(local_filename, 'wb')
    for chunk in spotify_preview.iter_content(chunk_size=512 * 1024): 
        if chunk: # filter out keep-alive new chunks
            downloaded_preview.write(chunk)
    downloaded_preview.close()
    return local_filename

def get_bytes_from_file(filename):
    output = []
    with open(filename,'rb') as f:
        output = f.read()  
    return output 

def delete_file(path):
    os.remove(path)


# start

client = MongoClient("mongodb+srv://JustFlowAdmin:capstone123!@justflow-l8dim.mongodb.net/test?retryWrites=true&w=majority")
db = client.get_database('JustFlow')

with open('passwords.json', 'r') as file: 
    passwords = json.load(file)
CLIENT_ID = "e82e0eb0f4a846239ea74e71b554d459"
CLIENT_SECRET = passwords['CLIENT_SECRET']

auth = oauth2.SpotifyClientCredentials(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET
)

token = auth.get_access_token()
playlist_url = 'https://api.spotify.com/v1/playlists/37i9dQZF1DXarRysLJmuju/tracks'
response = requests.get(playlist_url, headers={'Authorization': 'Bearer ' + token}) 
playlist = json.loads(response.content)
tracks = db.tracks

for item in playlist['items']:
    track = item['track']
    track_id = track['id']
    if tracks.find({'_id': track_id}) != 'null':
        break
    if track['preview_url'] is None:
        print(track['name'])
        continue
    song_name = track['name']
    
    preview_url = track['preview_url']
    path = download_preview(preview_url, song_name)
    mfcc = processor.get_flattened_mfcc(file = path)
    chroma = processor.get_chroma_features(file = path)

    # storing a byte array of the mp3 file. 
    track_bytes = get_bytes_from_file(path)
    print(track_id)

    new_track = {
        '_id' : track_id,
        'preview_url' : preview_url,
        'name' : song_name,
        'mfcc' : mfcc.tolist(),
        'chroma' : chroma.tolist(),
        'preview' : track_bytes
    }
    tracks.insert_one(new_track)
    delete_file(path)
    break







