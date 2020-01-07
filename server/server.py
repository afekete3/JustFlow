import json
import requests
import sys
from flask import Flask, request, redirect, g, render_template
from urllib.parse import quote
from routes.auth import auth

app = Flask(__name__)
app.register_blueprint(auth, url_prefix='')

PORT = 8080

if __name__ == "__main__":
    app.run(debug=True, port=PORT)