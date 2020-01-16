import pymongo
import sys
sys.path.append(".")
from documents.track import Track 
import requests
import json
import os
import librosa

def create(track):
    Track(track).save()

def add_new_track(track_id):
    # when adding a new track we need the authorization token 
    # need to work on this 
    print(track_id + ' being added to the db')
    track_url = 'https://api.spotify.com/v1/tracks/' + track_id
    response = requests.get(track_url)
    track = json.loads(response.content)
    if 'preview_url' not in track or track['preview_url'] is None:
        raise LookupError(track_id + ' has no preview url')
    id = track['id']
    name = track['name']
    preview_url = track['preview_url']
    path = download_preview(preview_url, name)
    preview = get_bytes_from_file(path)
    y, sr = librosa.load(path, duration=10.0)
    mfcc = librosa.feature.mfcc(y, sr=sr).flatten()
    chroma = librosa.feature.chroma_stft(y=y, sr=sr).flatten()
    tempo = librosa.beat.beat_track(y, sr=sr, units='time')

    new_track = {
        '_id' : id,
        'preview_url' : preview_url,
        'name' : name,
        'mfcc' : mfcc.tolist(),
        'chroma' : chroma.tolist(),
        'preview' : preview, 
        'tempo' : tempo
    }

    delete_file(path)
    create(new_track)
    print(track['_id'])
    return new_track

def update(track):
    Track.update(track)

def delete(track):
    Track.delete(track)

def get_track_by_id(track_id):
    return Track.objects.get(_id=track_id)

def get_multiple_tracks(track_ids):
    tracks = []
    for id in track_ids:
        try:
            track = get_track_by_id(id)
            tracks.append(track)
        except Exception as err: 
            # print('id: ' + id + ' not found, failed with type: ' + str(type(err)))
            try: 
                # add track is still not working need to use auth token
                track = add_new_track(id)
                tracks.append(track) 
            except LookupError as err: 
                print(err)
                continue
                
    return tracks

def get_bytes_from_file(filename):
    output = []
    with open(filename,'rb') as f:
        output = f.read()  
    return output 

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
