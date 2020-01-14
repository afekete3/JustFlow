import json
import requests
from controllers import track_info
from documents import track 
from flask import Flask, request, redirect, g, render_template
from urllib.parse import quote
from routes.auth import auth
from flask_pymongo import PyMongo
from flask_mongoengine import MongoEngine

DB_URL = 'mongodb+srv://JustFlowAdmin:capstone123!@justflow-l8dim.mongodb.net/track_db?retryWrites=true&w=majority'
app = Flask(__name__)
app.config['MONGODB_HOST'] = DB_URL
db = MongoEngine(app)
app.register_blueprint(auth, url_prefix='')
PORT = 8080

if __name__ == "__main__":
    # testing the controllers
    # item = track_info.get('4vUmTMuQqjdnvlZmAH61Qk')
    # print(item.name)
    app.run(debug=True, port=PORT)