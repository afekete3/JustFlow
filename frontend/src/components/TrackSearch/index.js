import TrackSearch from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { searchSongs } from '../../actions/songActions';
import { updateGenerateState } from '../../actions/playlistActions';

const mapStateToProps = (state) => {

  return {
    token: state.tokenReducer.token,
    isGenerating: state.playlistReducer.isGenerating

  };

};

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    searchSongs,
    updateGenerateState
  }, dispatch);

};
export default connect(mapStateToProps, mapDispatchToProps)(TrackSearch);
