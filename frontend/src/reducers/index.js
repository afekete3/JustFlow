import { combineReducers } from "redux";
import userReducer from './userReducer';
import tokenReducer from './tokenReducer';
import playlistReducer from './playlistReducer';
import songsReducer from './songsReducer';
import uiReducer from './uiReducer';
import soundReducer from './soundReducer';
import spotifyPlayerReducer from './spotifyPlayerReducer';
import playlistOrganizeReducer from './playlistOrganizeReducer';

export default combineReducers({
  userReducer,
  tokenReducer,
  playlistReducer,
  songsReducer,
  uiReducer,
  soundReducer,
  spotifyPlayerReducer,
  playlistOrganizeReducer
});
