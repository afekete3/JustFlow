import sys
import youtube_dl
import os
import googleapiclient.discovery
import json

class YoutubeDownloader:
    API_SERVICE_NAME = "youtube"
    API_VERSIONE = "v3"
    YDL_OPTS = {
        'outtmpl': 'preview.mp3', 
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }]
    }
    
    def __init__(self):
        with open('api_key.json') as f:
            data = json.load(f)
        developer_key = data['api-key']
        self.youtube = googleapiclient.discovery.build(self.API_SERVICE_NAME, self.API_VERSIONE, developerKey = developer_key)

    def download_song(self, name, artists):
        try:
            print (artists)
            # can make cleaner
            search_name = name + ' ' + ' '.join(artists) + ' audio'
            print(search_name)

            request = self.youtube.search().list(
                q = search_name,
                part="id",
                maxResults=5
                )
            response = request.execute()
            # getting the specific video id for each video in the playlist
            song = response['items'][0]
            print(song)
            # downloading a specific youtube video
            url = 'https://www.youtube.com/watch?v='+song['id']['videoId']
            youtube_dl.YoutubeDL(self.YDL_OPTS).download([url])
            return url
        except youtube_dl.utils.DownloadError:
            return False 

