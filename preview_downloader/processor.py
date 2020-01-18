from pathlib import Path
import librosa, librosa.display
import numpy, scipy, matplotlib.pyplot as plt, sklearn, librosa, mir_eval, IPython.display, urllib

def get_flattened_mfcc(y, sr):
    return librosa.feature.mfcc(y, sr=sr).flatten()

def get_chroma_features(y, sr):
    return librosa.feature.chroma_stft(y=y, sr=sr).flatten()

def get_tempo(y, sr):
    return  round(librosa.beat.beat_track(y, sr=sr, units='time')[0])




