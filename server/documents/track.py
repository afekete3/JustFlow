from mongoengine import *

class Track(Document):
    _id = StringField(required=True)
    preview_url = StringField(required=True)
    name = StringField(required=True)
    artists = ListField(required=True)
    mfcc = ListField(required=True)
    chroma = ListField(required=True)
    tempo = FloatField(required=True)
    spotify_download = BooleanField(required=True)
    meta = {'collection' : 'tracks'}

