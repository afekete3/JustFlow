import requests
import sys
import processor
import os
import json
from pathlib import Path
from pymongo import MongoClient
import librosa
import spotipy
import spotipy.util as util
import spotipy.oauth2 as oauth2
from scipy.spatial import distance
from youtube_downloader import YoutubeDownloader

LOCAL_FILENAME = 'preview.mp3'
def download_preview(url):
    # Creates the file in the working directory
    spotify_preview = requests.get(url)   
    downloaded_preview = open(LOCAL_FILENAME, 'wb')
    for chunk in spotify_preview.iter_content(chunk_size=512 * 1024): 
        if chunk: # filter out keep-alive new chunks
            downloaded_preview.write(chunk)
    downloaded_preview.close()
    return url

def get_bytes_from_file(filename):
    output = []
    with open(filename,'rb') as f:
        output = f.read()  
    return output 

def delete_file(path):
    os.remove(path)

def download(track, song_name, artists):
    if track['preview_url'] is None:
        result = youtube_downloader.download_song(song_name, artists)
        if result == False:
            return False
        else:
            return result
    else:
        return download_preview(track['preview_url'])
          

# start
client = MongoClient("mongodb+srv://JustFlowAdmin:capstone123!@justflow-l8dim.mongodb.net/test?retryWrites=true&w=majority")
db = client.get_database('JustFlow')
client.c
with open('passwords.json', 'r') as file: 
    passwords = json.load(file)
CLIENT_ID = "e82e0eb0f4a846239ea74e71b554d459"
CLIENT_SECRET = passwords['CLIENT_SECRET']

auth = oauth2.SpotifyClientCredentials(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET
)

token = auth.get_access_token()
tracks = db.tracks

youtube_downloader = YoutubeDownloader()

with open('playlists.json', 'r') as file: 
    playlists = json.load(file)

for playlist_id in playlists['playlists']:
    playlist_url = 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks'
    response = requests.get(playlist_url, headers={'Authorization': 'Bearer ' + token}) 
    playlist = json.loads(response.content)
    for item in playlist['items']:
        track = item['track']       
        track_id = track['id']
        song_name = track['name']  
        artists = []
        for artist in track['artists']:
            artists.append(artist['name'])
        if tracks.count_documents({'_id': track_id}) > 0:
            track = tracks.find_one({'_id': track_id}) 
            if "name" not in track:
                tracks.update_one({'_id': track_id}, {"$set": {"name": song_name}}) 
            if "artist" not in track:
                tracks.update_one({'_id': track_id}, {"$set": {"artists": artists}}) 
            # if "euclidean_distance" not in track: 
            if track['preview_url'] is None:
                continue              
            download_preview(track['preview_url'])
            y, sr = librosa.load(LOCAL_FILENAME, duration=10.0)
            if "tempo" not in track:
                tempo = processor.get_tempo(y=y, sr=sr)
                tracks.update_one({'_id': track_id}, {"$set": {"tempo": tempo}})                    
            if "mfcc" not in track:
                mfcc = processor.get_flattened_mfcc(y=y, sr=sr)
                tracks.update_one({'_id': track_id}, {"$set": {"mfcc": mfcc.tolist()}})   
            if "chroma" not in track:
                chroma = processor.get_chroma_features(y=y, sr=sr)
                tracks.update_one({'_id': track_id}, {"$set": {"chroma": chroma.tolist()}})   
        else: 
            preview_url = download(track, song_name, artists)            
            y, sr = librosa.load(LOCAL_FILENAME, duration=10.0)
            mfcc = processor.get_flattened_mfcc(y=y, sr=sr)
            chroma = processor.get_chroma_features(y=y, sr=sr)
            tempo = processor.get_tempo(y=y, sr=sr)
            # storing a byte array of the mp3 file. 
            track_bytes = get_bytes_from_file(LOCAL_FILENAME)
            new_track = {
                '_id' : track_id,
                'preview_url' : preview_url,
                'name' : song_name,
                'artists' : artists, 
                'mfcc' : mfcc.tolist(),
                'chroma' : chroma.tolist(),
                'tempo': tempo,
                'preview' : track_bytes
            }
            tracks.insert_one(new_track)
            delete_file(LOCAL_FILENAME)
client.close()







