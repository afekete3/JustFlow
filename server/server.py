import json
import requests
import sys
from flask import Flask, request, redirect, g, render_template
from urllib.parse import quote
from routes.auth import auth
from flask_cors import CORS



app = Flask(__name__)
cors = CORS(app)
app.register_blueprint(auth, url_prefix='')



PORT = 8080

if __name__ == "__main__":
    app.run(debug=True, port=PORT)