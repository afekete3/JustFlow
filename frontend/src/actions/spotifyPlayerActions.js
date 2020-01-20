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