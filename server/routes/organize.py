import json
from flask import Flask, request, redirect, g, render_template, Blueprint, Response
import requests
from urllib.parse import quote
import sys
from controllers import track
# from documents.track import TrackInfo 


organize = Blueprint('organize', __name__, template_folder='templates')

@organize.route("/organize", methods=["GET"])
def organize_playlist():
    data = request.get_json(force=True)
    if len(data) == 0: 
        return Response(response="please provide a playlist to organize", status=400)
    elif "ids" not in data: 
        return Response(response="incorrect object passed", status=400)
    order = {}
    songs = track.get_multiple_tracks(data['ids'])
    # call the organize method with the machine learning
    return Response(order, status=200)