import requests
import sys
import processor
import os
import json
from pathlib import Path
from pymongo import MongoClient

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
db = client.get_database('track_db')

# This needs to be updated a lot. Get a new one here: https://developer.spotify.com/console/get-playlist/?playlist_id=37i9dQZF1DXarRysLJmuju&market=&fields=
auth_token = 'BQDEY-nzM8KEMQWd1s5hgoQ712y3l4pEvADBF0pFIMQXQvv7zhTiU5owtDnfEuFmj4x-XnYJd_Gpke5cGbAMG2nZi9ceXzjSZlJYFQdIU_uQ-w7QIFQyMBBXKpqee6nU4fOMG1tLDTFQcL5oBYumuo_Kb9ldJdOJAu4GcvS6Iau0'
playlist_url = 'https://api.spotify.com/v1/playlists/37i9dQZF1DXarRysLJmuju/tracks'
response = requests.get(playlist_url, headers={'Authorization': 'Bearer ' + auth_token}) 
playlist = json.loads(response.content)
records = db.track_info
for item in playlist['items']:
    track = item['track']
    if track['preview_url'] is None:
        print(track['name'])
        continue
    song_name = track['name']
    track_id = track['id']
    preview_url = track['preview_url']
    path = download_preview(preview_url, song_name)
    mfcc = processor.get_flattened_mfcc(file = path, name = song_name)

    # storing a byte array of the mp3 file. 
    track_bytes = get_bytes_from_file(path)

    new_track = {
        'track_id' : track_id,
        'preview_url' : preview_url,
        'name' : song_name,
        'mfcc' : mfcc.tolist(),
        'preview' : track_bytes
    }

    records.insert_one(new_track)
    delete_file(path)






