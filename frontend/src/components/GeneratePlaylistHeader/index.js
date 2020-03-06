import TrackSearch from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { searchSongs, updateViewType } from '../../actions/songActions';
import {updateHeaderTitle} from '../../actions/uiActions';
import { fetchPlaylistSongs, fetchPlaylistsMenu, addPlaylistItem,updateGenerateState } from '../../actions/playlistActions';

const mapStateToProps = (state) => {

  return {
    token: state.tokenReducer.token, 
    selectedSongs : state.songsReducer.selectedSongs, 
    userId: state.userReducer.user ? state.userReducer.user.id : '',
    isGenerating: state.playlistReducer.isGenerating
  };

};

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    searchSongs,
    updateHeaderTitle, 
    updateViewType, 
    fetchPlaylistSongs, 
    fetchPlaylistsMenu, 
    addPlaylistItem,
    updateGenerateState
  }, dispatch);

};
export default connect(mapStateToProps, mapDispatchToProps)(TrackSearch);
