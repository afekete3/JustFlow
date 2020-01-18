import SongControls from "./component";
import { connect } from "react-redux";

const mapStateToProps = (state) => {

  return {
    albumImage: state.spotifyPlayerReducer.currentState ? state.spotifyPlayerReducer.currentState.track_window.current_track.album.images[0].url : ''
  };

};

export default connect(mapStateToProps)(SongControls);
