from mongoengine import *

class Track(Document):
    _id = StringField(required=True)
    preview_url = StringField
    name = StringField
    mfcc = ListField
    chroma = ListField
    preview = BinaryField
    tempo = IntField
    artists = StringField
    spotify_download = BooleanField
    meta = {'collection' : 'tracks'}

