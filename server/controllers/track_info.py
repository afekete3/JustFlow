import pymongo
import sys
sys.path.append(".")
from documents.track import TrackInfo 

def create(track_info):
    TrackInfo(track_info).save()

def update(track_info):
    TrackInfo.update(track_info)

def delete(track_info):
    TrackInfo.delete(track_info)

def get(track_id):
   return TrackInfo.objects.get(track_id=track_id)