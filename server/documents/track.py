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
    meta = {'collection' : 'tracks'}
    genres = ListField()
    neighbors = ListField()
    euclidean_dist = ListField()

