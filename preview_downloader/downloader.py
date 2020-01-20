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

LOCAL_FILENAME = 'preview.mp3'

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
        return spotify_downloader.download_preview(track['preview_url'])

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
        if download(track, song_name, artists) == False:
            return
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
    delete_file(LOCAL_FILENAME)

def create_track(processor, preview_url):             
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
        'tempo': tempo
    }


# start
with MongoClient("mongodb+srv://JustFlowAdmin:capstone123!@justflow-l8dim.mongodb.net/test?retryWrites=true&w=majority") as client:
    db = client.get_database('JustFlow')
    tracks = db.tracks

    youtube_downloader = YoutubeDownloader()
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
            if tracks.count_documents({'_id': track_id}) > 0:
                update_track(tracks.find_one({'_id': track_id}), song_name, artists, processor, tracks)        
            else: 
                preview_url = download(track, song_name, artists) 
                if preview_url == False:
                    continue
                processor.load_track()
                new_track = create_track(processor, preview_url)
                tracks.insert_one(new_track)
            delete_file(LOCAL_FILENAME)









