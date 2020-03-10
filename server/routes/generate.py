from flask import Flask, request, Blueprint, Response, make_response
from controllers import track
from models import generate_model, organize_model, model_visualization
# import timeit

TEMPO_RANGE = 10

generate = Blueprint('generate', __name__, template_folder='templates')

@generate.route("/generate", methods=["POST"])
def generate_playlist():
    data = request.get_json(force=True)
    if len(data) == 0: 
        return Response(response="please provide a playlist to organize", status=400)
    elif "ids" not in data: 
        return Response(response="incorrect object passed", status=400)

    given_track = track.get_multiple_tracks(data['ids'], data['access_token'])
    # tempo = given_track[0]['tempo']
    # all_tracks = track.get_tempo_range(tempo -TEMPO_RANGE, tempo + TEMPO_RANGE)
    # call the generate method with the machine learning
    generated_playlist = generate_model.generate(given_track[0], data['num_of_songs'])
    model_visualization.visualize_playlist(generated_playlist)
    return make_response({'generated_playlist_ids':generated_playlist})
