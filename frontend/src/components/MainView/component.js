import React from 'react';
import PropTypes from 'prop-types';
import SongList from '../SongList';
import './MainView.css';
import PlaylistHome from '../PlaylistHome';
import GeneratePlaylist from '../GeneratePlaylist';

const MainView = ({ headerTitle, audioControl, resumeSong, pauseSong }) => {

  return (
    <div>
      {
        headerTitle==='' ?
        (<PlaylistHome  />) :
        headerTitle === 'Home' ?
          (<PlaylistHome  />) :
          headerTitle === 'GeneratePlaylist' ?
          (<GeneratePlaylist/>) :
              ( <SongList resumeSong={ resumeSong } pauseSong={ pauseSong } audioControl={ audioControl } />)
      }
    </div>
  );

};

MainView.propTypes = {
  headerTitle: PropTypes.string,
  audioControl: PropTypes.func,
  resumeSong: PropTypes.func,
  pauseSong: PropTypes.func
};

export default MainView;
