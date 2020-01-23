from flask import Flask, request, Blueprint, Response, make_response
from controllers import track
from models import generate_model, organize_model
# import timeit

generate = Blueprint('generate', __name__, template_folder='templates')

@generate.route("/generate", methods=["POST"])
def generate_playlist():
    data = request.get_json(force=True)
    if len(data) == 0: 
        return Response(response="please provide a playlist to organize", status=400)
    elif "ids" not in data: 
        return Response(response="incorrect object passed", status=400)

    given_track = track.get_multiple_tracks(data['ids'], data['access_token'])
    all_tracks = track.get_all()
    # call the generate method with the machine learning
    generated_playlist = generate_model.generate(given_track[0], all_tracks, data['num_of_songs'])
    return make_response({'generated_playlist_ids':generated_playlist})
