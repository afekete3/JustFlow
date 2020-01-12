from pathlib import Path
import librosa, librosa.display
import numpy, scipy, matplotlib.pyplot as plt, sklearn, librosa, mir_eval, IPython.display, urllib

def get_flattened_mfcc(file, name):
    y, sr = librosa.load(file, duration=10.0)
    mfcc = librosa.feature.mfcc(y, sr=sr)
    return mfcc.flatten()


