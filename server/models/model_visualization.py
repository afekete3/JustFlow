import numpy as np
from pymongo import MongoClient
import json

def visualize_playlist(playlist):
    print('-------------------------------------')
    print(playlist)

# start
# with open('passwords.json', 'r') as file: 
#     passwords = json.load(file)
# with MongoClient("mongodb+srv://JustFlowAdmin:"+passwords['db_password']+"@justflow-l8dim.mongodb.net/JustFlow?retryWrites=true&w=majority") as client:
#     db = client.get_database('JustFlow')
#     tracks = db.tracks
#     tracks.find_one({
#         '_id': "x"
#     })