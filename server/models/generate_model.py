import heapq
from scipy.spatial import distance
import sys
sys.path.append(".")

def generate(seed_song, num_of_songs):
    playlist = [seed_song['_id']]
    print(seed_song['name'])
    neighbor_ids = list(seed_song['combined_neighbors'].keys())
    for id in neighbor_ids[:int(num_of_songs) - 1]:
        playlist.append(id)
    return playlist


    