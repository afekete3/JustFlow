from pathlib import Path
import librosa, librosa.display
import numpy, scipy, matplotlib.pyplot as plt, sklearn, librosa, mir_eval, IPython.display, urllib

def get_flattened_mfcc(file):
    y, sr = librosa.load(file, duration=10.0)
    mfcc = librosa.feature.mfcc(y, sr=sr).flatten()
    return mfcc

def get_chroma_features(file):
    y, sr = librosa.load(file, duration=10.0)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr).flatten()
    print(chroma)
    return chroma


