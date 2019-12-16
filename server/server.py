from flask import Flask
import pymongo
from pymongo import MongoClient
app = Flask(__name__)

@app.route('/')
def hello_word():
    
    client = pymongo.MongoClient("mongodb+srv://JustFlowAdmin:<capstone123!>@justflow-l8dim.mongodb.net/test?retryWrites=true&w=majority")
    db = client.test

    return 'Hello world!'