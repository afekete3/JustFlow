import json
from flask import Flask, request, redirect, g, render_template, Blueprint, Response, jsonify, make_response
import requests
from urllib.parse import quote
import sys
from controllers import track
from models import organize_model
# from documents.track import TrackInfo 


organize = Blueprint('organize', __name__, template_folder='templates')

@organize.route("/organize", methods=["POST"])
def organize_playlist():
    data = request.get_json(force=True)
    if len(data) == 0: 
        return Response(response="please provide a playlist to organize", status=400)
    elif "ids" not in data: 
        return Response(response="incorrect object passed", status=400)
    tracks = track.get_multiple_tracks(data['ids'], data['access_token'])
    # call the organize method with the machine learning
    organized_tracks = organize_model.organize(tracks)
    return make_response({'ordered_ids':organized_tracks})