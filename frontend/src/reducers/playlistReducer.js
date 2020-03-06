import { CommentActions } from "semantic-ui-react";

const defaultState = {
  playlists: [],
  fetchPlaylistError: false,
  fetchPlaylistPending: false,
  reorderPlaylistTrackPending: false, 
  reorderPlaylistTrackError : false, 
  isGenerating: false
};

export const playlistReducer = (state = {}, action) => {
  switch (action.type) {

  case "FETCH_PLAYLIST_MENU_PENDING":
    return {
      fetchPlaylistPending: true,
      ...state
    };

  case "FETCH_PLAYLIST_MENU_SUCCESS":
    return {
      playlists: action.playlists,
      fetchPlaylistError: false,
      fetchPlaylistPending: false,
      ...state, 
    };

  case "ADD_PLAYLIST_ITEM":
    return {
      ...state,
      playlists: [
        ...state.playlists,
        action.playlist
      ]
    };

  case "FETCH_PLAYLIST_MENU_ERROR":
    return {
      fetchPlaylistError: true,
      fetchPlaylistPending: false,
      ...state
    };

  case "REORDER_PLAYLIST_TRACK_PENDING":
    return{
      reorderPlaylistTrackPending: true
    }

  case "REORDER_PLAYLIST_TRACK_SUCCESS":
    return{
      ...state,
      reorderPlaylistTrackPending: false,
      songs: action.songs
    }

  case "REORDER_PLAYLIST_TRACK_ERROR":
    return{
      reorderPlaylistTrackPending: false,
      reorderPlaylistTrackError: true
    }

  case "UPDATE_GENERATE_STATE_TRUE":
    return{
      ...state,
      isGenerating: true
    }
    case "UPDATE_GENERATE_STATE_FALSE":
      return{
        ...state,
        isGenerating: false
      }

  default:
    return state;
  }
};

export default playlistReducer;
