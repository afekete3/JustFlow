import MainHeader from "./component";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateHeaderTitle } from '../../actions/uiActions';
import { updateViewType } from '../../actions/songActions';

const mapStateToProps = (state) => {

  return {
    songPaused: state.songsReducer.songPaused,
    headerTitle: state.uiReducer.title,
    viewType: state.songsReducer.viewType,
    playlists: state.playlistReducer.playlists,
    token: state.tokenReducer.token
  };

};

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    updateHeaderTitle,
    updateViewType,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(MainHeader);
