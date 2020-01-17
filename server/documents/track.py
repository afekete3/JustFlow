from mongoengine import *

class Track(Document):
    _id = StringField(required=True)
    preview_url = StringField(required=True)
    name = StringField(required=True)
    mfcc = ListField(required=True)
    chroma = ListField(required=True)
    preview = BinaryField(required=True)
    tempo = IntField(required=True)
    meta = {'collection' : 'tracks'}

