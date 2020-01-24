import GeneratePlaylist from './component';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSelectedSongs } from '../../actions/songActions';

const mapStateToProps = (state) => {

    return {
      songs: state.songsReducer.songs ? state.songsReducer.songs : '',
      selectedSongs : state.songsReducer.selectedSongs
    };
  
  };
  
  const mapDispatchToProps = (dispatch) => {
  
    return bindActionCreators({
      setSelectedSongs
    }, dispatch);
  
  };
  export default connect(mapStateToProps, mapDispatchToProps)(GeneratePlaylist);