export const updateSpotifyPlayer = (spotifyPlayer) => {
    return {
      type: 'UPDATE_PLAYER',
      spotifyPlayer
    };
  };

export const updateCurrentState = (currentState)=>{
  return{
    type: 'UPDATE_CURRENT_STATE',
    currentState
  }
}