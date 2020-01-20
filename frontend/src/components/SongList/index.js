import SongList from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchSongs, setSelectedSongs, clearSongs } from '../../actions/songActions';

const mapStateToProps = (state) => {

  return {
    token: state.tokenReducer.token ? state.tokenReducer.token : '',
    songs: state.songsReducer.songs ? state.songsReducer.songs : '',
    fetchSongsError: state.songsReducer.fetchSongsError,
    fetchSongsPending: state.songsReducer.fetchSongsPending,
    fetchPlaylistSongsPending: state.songsReducer.fetchPlaylistSongsPending,
    songPlaying: state.songsReducer.songPlaying,
    songPaused: state.songsReducer.songPaused,
    songId: state.songsReducer.songId,
    songAddedId: state.userReducer.songId || '',
    viewType: state.songsReducer.viewType,
    headerTitle: state.uiReducer.title
  };

};

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    fetchSongs,
    setSelectedSongs, 
    clearSongs, 
  }, dispatch);

};
export default connect(mapStateToProps, mapDispatchToProps)(SongList);
