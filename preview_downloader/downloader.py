import requests
import sys
import processor
import os
from pathlib import Path
from pymongo import MongoClient

def download_preview(url, name):
    # Creates the file in the working directory
    local_filename = name + '.mp3'
    spotify_preview = requests.get(url)   
    downloaded_preview = open(local_filename, 'wb')
    for chunk in spotify_preview.iter_content(chunk_size=512 * 1024): 
        if chunk: # filter out keep-alive new chunks
            downloaded_preview.write(chunk)
    downloaded_preview.close()
    return local_filename

def get_bytes_from_file(filename):
    output = []
    with open(filename,'rb') as f:
        output = f.read()  
    return output 

def delete_file(path):
    os.remove(path)


# start
client = MongoClient("mongodb+srv://JustFlowAdmin:capstone123!@justflow-l8dim.mongodb.net/test?retryWrites=true&w=majority")
db = client.get_database('track_db')

records = db.track_info
song_name = sys.argv[2]
url = sys.argv[1]
path = download_preview(url, song_name)
mfcc = processor.get_flattened_mfcc(file = path, name = song_name)

# storing a byte array of the mp3 file. 
track_bytes = get_bytes_from_file(path)

new_track = {
    'url' : url,
    'name' : song_name,
    'mfcc' : mfcc.tolist(),
    'preview' : track_bytes
}

records.insert_one(new_track)
delete_file(path)


