import SongList from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchSongs } from '../../actions/songActions';
import {playSpecificTrack} from '../../actions/spotifyPlayerActions';

const mapStateToProps = (state) => {

  return {
    token: state.tokenReducer.token ? state.tokenReducer.token : '',
    songs: state.songsReducer.songs ? state.songsReducer.songs : '',
    fetchSongsError: state.songsReducer.fetchSongsError,
    fetchSongsPending: state.songsReducer.fetchSongsPending,
    fetchPlaylistSongsPending: state.songsReducer.fetchPlaylistSongsPending,
    songId: state.songsReducer.songId,
    songAddedId: state.userReducer.songId || '',
    viewType: state.songsReducer.viewType,
    headerTitle: state.uiReducer.title,
    playlists: state.playlistReducer.playlists,
    currentPlayerState: state.spotifyPlayerReducer.currentPlayerState
  };

};

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    fetchSongs,
    playSpecificTrack
  }, dispatch);

};
export default connect(mapStateToProps, mapDispatchToProps)(SongList);
