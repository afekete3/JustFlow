export const spotifyPlayerReducer = (state = { }, action) => {
    switch (action.type) {
    case "UPDATE_PLAYER":
      return {
          ...state,
        spotifyPlayer: action.spotifyPlayer
      };

    case "UPDATE_PLAYER_CURRENT_STATE":
      return{
        ...state,
        currentPlayerState: action.currentPlayerState
      }

    case "PLAY_SPECIFIC_TRACK_ERROR":
      return{
        ...state
      }

    case "PLAY_SPECIFIC_TRACK_SUCCESS":
      return{
        ...state
      }
  
    default:
      return state;
    }
  
  };
  
  export default spotifyPlayerReducer;