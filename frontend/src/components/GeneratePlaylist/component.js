import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SongList from '../SongList';
import './GeneratePlaylist.css';
import TrackSearch from '../TrackSearch';


class GeneratePlaylist extends Component{

    componentWillUnmount(){
        // clear the selected songs 
        this.props.setSelectedSongs([])
    }

    generatePlaylist() {

    }

    render(){
        
        return(
            <div>
                <TrackSearch />
                {this.props.songs.length != 0 && <SongList checkBoxVisible={true}/>}
            </div>
        );
    };

};

GeneratePlaylist.propTypes={
      songs: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
      ]),
      selectedSongs : PropTypes.array, 
      setSelectedSongs : PropTypes.func, 
};

export default GeneratePlaylist;