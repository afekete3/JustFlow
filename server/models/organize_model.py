import librosa, librosa.display
import sklearn

def organize(tracks):
    # normalize the chroma features 
    chromas = []
    for track in tracks: 
        chromas.append(track['chroma'])
    scaler = sklearn.preprocessing.StandardScaler()
    scaler.fit(chromas)
    features_scaled = scaler.transform(chromas)

    # cluster the chroma features 
    model = sklearn.cluster.AffinityPropagation()
    labels = model.fit_predict(features_scaled)

    # rearrange based on the clustered group and tempo 
    grouped_tracks = {}
    for i in range(len(labels)):
        if labels[i] in grouped_tracks:
            grouped_tracks[labels[i]].append(tracks[i])
        else:
            grouped = [tracks[i]]
            grouped_tracks[labels[i]] = grouped

    clustered_order = []

    for key,val in grouped_tracks.items():
        print('key',key)
        count = 0
        increament = int(len(val) / 3)
        # some fucky logic here for the ordering an im not sure it works
        if increament % 2 == 0: 
            if len(val) % (increament + 1) == 0:
                increament -= 1
            else:
                increament += 1
            
        current = 0
        val.sort(key=lambda track: track['tempo'])
        while count != len(val):
            print(current, val[current][2])
            clustered_order.append(val[current])
            current = (current + increament) % len(val)
            count += 1
    
    return clustered_order

    