import mongoengine as me

class TrackInfo(me.Document):
    track_id = me.StringField(required=True)
    preview_url = me.StringField(required=True)
    name = me.StringField(required=True)
    mfcc = me.ListField(required=True)
    chroma = me.ListField(required=True)
    preview = me.BinaryField(required=True)

