import spotipy
import spotipy.util as util
import spotipy.oauth2 as oauth2
import json
import requests
import constant

class SpotifyDownloader:
    def __init__(self):
        with open('passwords.json', 'r') as file: 
            passwords = json.load(file)
        CLIENT_ID = "e82e0eb0f4a846239ea74e71b554d459"
        CLIENT_SECRET = passwords['CLIENT_SECRET']

        auth = oauth2.SpotifyClientCredentials(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET
        )
        self.token = auth.get_access_token()

    def download_preview(self, url):
        # Creates the file in the working directory
        spotify_preview = requests.get(url)   
        downloaded_preview = open(constant.LOCAL_FILENAME, 'wb')
        for chunk in spotify_preview.iter_content(chunk_size=512 * 1024): 
            if chunk: # filter out keep-alive new chunks
                downloaded_preview.write(chunk)
        downloaded_preview.close()
        return url

    def get_playlist(self, playlist_id):
        playlist_url = 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks'
        response = requests.get(playlist_url, headers={'Authorization': 'Bearer ' + self.token}) 
        return json.loads(response.content)

