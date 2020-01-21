import requests
import sys
import os
from pathlib import Path
from pymongo import MongoClient
import librosa
import json
from scipy.spatial import distance
from youtube_downloader import YoutubeDownloader
from spotify_downloader import SpotifyDownloader
from processor import Processor
import constant

def delete_file(path):
    os.remove(path)

def get_artists(track_artists):
    artists = []
    for artist in track_artists:
        artists.append(artist['name'])
    return artists

def update_track(track, song_name, artists, processor, tracks):
    if "name" not in track:
        tracks.update_one({'_id': track_id}, {"$set": {"name": song_name}}) 
    if "artist" not in track:
        tracks.update_one({'_id': track_id}, {"$set": {"artists": artists}})   
    if "tempo" not in track or "mfcc" not in track or "chroma" not in track:
        spotify_downloader.download_preview(track['preview_url']) 
        processor.load_track()
    else:
        return
    if "tempo" not in track:
        tempo = processor.get_tempo()
        tracks.update_one({'_id': track_id}, {"$set": {"tempo": tempo}})                    
    if "mfcc" not in track:
        mfcc = processor.get_flattened_mfcc()
        tracks.update_one({'_id': track_id}, {"$set": {"mfcc": mfcc.tolist()}})   
    if "chroma" not in track:
        chroma = processor.get_chroma_features()
        tracks.update_one({'_id': track_id}, {"$set": {"chroma": chroma.tolist()}})
    delete_file(constant.LOCAL_FILENAME)

def create_track(processor, preview_url, spotify_download):             
    mfcc = processor.get_flattened_mfcc()
    chroma = processor.get_chroma_features()
    tempo = processor.get_tempo()
    return  {
        '_id' : track_id,
        'preview_url' : preview_url,
        'name' : song_name,
        'artists' : artists, 
        'mfcc' : mfcc.tolist(),
        'chroma' : chroma.tolist(),
        'tempo': tempo,
        'spotify_download' : spotify_download
    }

def create_missing_track(track_id, song_name):
    return {
        '_id' : track_id,
        'name' : song_name
    }

# start
with open('passwords.json', 'r') as file: 
    passwords = json.load(file)
with MongoClient("mongodb+srv://JustFlowAdmin:"+passwords['db_password']+"@justflow-l8dim.mongodb.net/JustFlow?retryWrites=true&w=majority") as client:
    db = client.get_database('JustFlow')
    tracks = db.tracks
    missing_tracks = db.missing_tracks

    spotify_downloader = SpotifyDownloader()
    processor = Processor()

    with open('playlists.json', 'r') as file: 
        playlists = json.load(file)

    for playlist_id in playlists['playlists']:
        playlist = spotify_downloader.get_playlist(playlist_id)
        for item in playlist['items']:
            track = item['track']       
            track_id = track['id']
            song_name = track['name']  
            artists = get_artists(track['artists'])           
            if tracks.find_one({'_id': track_id}) is not None:
                print("updating :" + track_id)
                update_track(tracks.find_one({'_id': track_id}), song_name, artists, processor, tracks)        
            else: 
                print("creating track: " + track_id)
                if track['preview_url'] is not None:
                    preview_url = spotify_downloader.download_preview(track['preview_url']) 
                    spotify_download = True
                else:
                    if missing_tracks.find_one({'_id': track_id}) is None:
                        print('missing track: ' + song_name + ' ' + track_id)
                        missing_tracks.insert_one(create_missing_track(track_id, song_name))
                    continue
                processor.load_track()
                new_track = create_track(processor, preview_url, spotify_download)
                tracks.insert_one(new_track)
                delete_file(constant.LOCAL_FILENAME)









