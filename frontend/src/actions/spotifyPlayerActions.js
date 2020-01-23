export const updateSpotifyPlayer = (spotifyPlayer) => {
    return {
      type: 'UPDATE_PLAYER',
      spotifyPlayer
    };
  };

export const updateCurrentPlayerState = (currentPlayerState)=>{
  return{
    type: 'UPDATE_PLAYER_CURRENT_STATE',
    currentPlayerState
  }
}

export const playSpecificTrackSucess= () =>{
  return{
    type: 'PLAY_SPECIFIC_TRACK_SUCCESS'
  }
}

export const playSpecificTrackError= () =>{
  return{
    type: 'PLAY_SPECIFIC_TRACK_ERROR'
  }
}

export const playSpecificTrack = (accessToken, track_uri, offset, context_uri)=>{
  return dispatch => {
    console.log('-----------------------')
    console.log(track_uri);
    console.log(offset)
    console.log(context_uri)
    console.log('------------------------')
    var body_params = JSON.stringify({
      uris: track_uri
    })
    if(offset!==undefined){
      body_params = JSON.stringify({
        context_uri: context_uri,
        offset: {
          uri: offset
        }
      })
      
    }
    else if(context_uri!==undefined){
      body_params = JSON.stringify({
        context_uri: context_uri,
      })
    }
    const request = new Request(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: new Headers({
        'Authorization': 'Bearer ' + accessToken
      }),
      body: body_params
    });

    fetch(request).then(res => {
      if(res.statusText === "Unauthorized") {
        window.location.href = './';
      }
      return res.json();
    }).then(res => {

      dispatch(playSpecificTrackSucess());
    }).catch(err => {
      dispatch(playSpecificTrackError(err));
    });
  };
}