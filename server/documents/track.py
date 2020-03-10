from mongoengine import *

class Track(Document):
    _id = StringField(required=True)
    preview_url = StringField()
    name = StringField()
    artists = ListField()
    mfcc = ListField()
    chroma = ListField()
    tempo = FloatField()
    spotify_download = BooleanField()
    genres = ListField()
    combined_neighbors = ListField()
    mfcc_neighbors = ListField()
    meta = {'collection' : 'test_tracks'}

