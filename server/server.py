import json
import requests
# from controllers import track
from documents import track 
from flask import Flask, request, redirect, g, render_template
from urllib.parse import quote
from routes.auth import auth
from flask_cors import CORS


from routes.organize import organize
from flask_pymongo import PyMongo
from flask_mongoengine import MongoEngine
import json

with open('passwords.json', 'r') as file: 
    passwords = json.load(file)
app = Flask(__name__)
cors = CORS(app)



DB_URL = 'mongodb+srv://JustFlowAdmin:'+passwords['db_password']+'@justflow-l8dim.mongodb.net/JustFlow?retryWrites=true&w=majority'
app.config['MONGODB_HOST'] = DB_URL
db = MongoEngine(app)
app.register_blueprint(auth, url_prefix='')
app.register_blueprint(organize, url_prefix='/playlist')
PORT = 8080

if __name__ == "__main__":
    app.run(debug=True, port=PORT)