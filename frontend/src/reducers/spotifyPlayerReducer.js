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
  
    default:
      return state;
    }
  
  };
  
  export default spotifyPlayerReducer;