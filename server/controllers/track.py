import pymongo
import sys
sys.path.append(".")
from documents.track import Track 

def create(track):
    Track(track).save()

def update(track):
    Track.update(track)

def delete(track):
    Track.delete(track)

def get(track_id):
    return Track.objects.get(track_id=track_id)

def get_multiple_tracks(track_ids):
    tracks = []
    for id in track_ids:
        print(id)
        tracks.append(get(id))
    return tracks