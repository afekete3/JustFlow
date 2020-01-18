export const spotifyPlayerReducer = (state = { }, action) => {
    switch (action.type) {
    case "UPDATE_PLAYER":
      return {
          ...state,
        spotifyPlayer: action.spotifyPlayer
      };

    case "UPDATE_CURRENT_STATE":
      return{
        ...state,
        currentState: action.currentState
      }
  
    default:
      return state;
    }
  
  };
  
  export default spotifyPlayerReducer;