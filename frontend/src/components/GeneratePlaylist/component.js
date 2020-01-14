import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './GeneratePlaylist.css'


class GeneratePlaylist extends Component{

    renderSongs(){

        return this.props.songs.map((song, i) => {
            console.log(song);

            return(
                <li>
                    {song.track.name}
                </li>
            );
            
        });
        
    }

    render(){
        return(
            <div>
                <ul>
                    {this.renderSongs()}
                </ul>
            </div>
        );
    };
};

GeneratePlaylist.PropTypes={
    songId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      songs: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
      ]),
};

export default GeneratePlaylist;