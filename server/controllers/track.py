import pymongo
import sys
sys.path.append(".")
from documents.track import Track 
from flask import jsonify
import requests
import json
import os
import librosa

def create(track):
    new_track = Track()
    for key in track: 
        new_track[key] = track[key]
    return new_track.save()

def add_new_track(track_id, access_token):
    # when adding a new track we need the authorization token 
    # need to work on this 
    try:
        track_url = 'https://api.spotify.com/v1/tracks/' + track_id
        # im not sure if this is the right way to use the access token
        response = requests.get(track_url, headers={'Authorization': 'Bearer ' + access_token})
        track = json.loads(response.content)
        if 'preview_url' not in track or track['preview_url'] is None:
            # might want to do this another way 
            return 'NoPreviewUrl'
        id = track['id']
        artists = track['artists']
        name = track['name']
        preview_url = track['preview_url']
        path = download_preview(preview_url, 'default')
        y, sr = librosa.load(path, duration=10.0)
        mfcc = librosa.feature.mfcc(y, sr=sr).flatten()
        chroma = librosa.feature.chroma_stft(y=y, sr=sr).flatten()
        tempo = librosa.beat.beat_track(y, sr=sr, units='time')
        spotify_download = 'preview_url' in track

        new_track = {
            '_id' : id,
            'preview_url' : preview_url,
            'artists' : artists, 
            'name' : name,
            'mfcc' : mfcc.tolist(),
            'chroma' : chroma.tolist(),
            'tempo' : tempo[0], 
            'spotify_download' : spotify_download
        }

        delete_file(path)
        return create(new_track)

    except Exception as err:
        # probably will change
        print(err)
        print('in add_new_track method')
        return 'InternalServerError'

def update(track):
    Track.update(track)

def delete(track):
    Track.delete(track)

def get_by_id(track_id, access_token):
    try: 
        return  Track.objects.get(_id=track_id)
    except Exception as err: 
        print(err)
        print('in get_by_id method')
        return add_new_track(track_id, access_token)

def get_all():
    all_tracks = Track.objects
    return all_tracks

def get_tempo_range(low, high):
    tracks_in_range = Track.objects(tempo__gt=low, tempo__lt=high)
    return tracks_in_range

def get_multiple_tracks(track_ids, access_token):
    tracks = []
    for id in track_ids:
        track = get_by_id(id, access_token)
        if track == 'InternalServerError' or track == "NoPreviewUrl":
            continue
        tracks.append(track)
    return tracks

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

def delete_file(path):
    os.remove(path)
