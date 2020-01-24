import heapq
from scipy.spatial import distance
import sys
sys.path.append(".")
from cache import cache

@cache.memoize(timeout=300)
def generate(seed_song, all_tracks, num_of_songs):
    playlist = []
    euclidean = {}
    for track in all_tracks: 
        dis = -distance.euclidean(seed_song['chroma'], track['chroma'])
        euclidean[track['_id']] = dis
        heapq.heappush(playlist, (dis, track))
        if len(playlist) > int(num_of_songs): 
            heapq.heappop(playlist)
    # making the list of songs not a tuple 
    new_playlist = []
    for track in playlist:
        new_playlist.append(track[1]['_id'])
    return new_playlist


    