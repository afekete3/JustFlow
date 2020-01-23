
  
export const playlistOrganizeReducer = (state = { }, action) => {
switch (action.type) {

case "UPDATE_ORGANIZING_STATE":
    return {
    ...state,
    isOrganizing: action.isOrganizing
    };

default:
    return state;
}

};

export default playlistOrganizeReducer;