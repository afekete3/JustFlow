import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SongList from '../SongList';
import './GeneratePlaylist.css'


class GeneratePlaylist extends Component{

    renderSongs(){

        return this.props.songs.map((song, i) => {
            console.log(song);

            return(
                <div>

                </div>
            );
            
        });
        
    }

    selectSong(){
        if(this.props.selectedSongs.length > 0){
            return  (<div>
                    <div className='playlist-title-container'>
                    <div className='playlist-image-container'>
                        <img className='playlist-image' src={this.props.selectedSongs[0].track.album.images[0] ? this.props.selectedSongs[0].track.album.images[0].url : null} />
                    </div>
                    
                    <div className='playlist-info-container'>
                        <p className='playlist-text'>SELECTED SONG</p>
                        <h3 className='header-title'>{this.props.selectedSongs[0].track.name}</h3>
                        <p className='created-by'>Artist: <span className='lighter-text'>{this.props.selectedSongs[0].track.artists[0].name}</span> </p>
                        {/* <button onClick={this.generatePlaylist} className='generate-btn generate-btn-container'>GENERATE</button> */}
                        {/* <p className='created-by'>Artist: <span className='lighter-text'>{this.props.selectedSongs[0].track.artists[0].name}</span> - {this.msToMinutesAndSeconds(this.state.selectedSong.track.duration_ms)}</p> */}
            
                    </div>
                    </div>
                </div>)
        }
        return <div/>
        
      }

    generatePlaylist() {

    }

    render(){
        
        return(
            <div>
                {/* <ul>
                    {this.renderSongs()}
                </ul> */}
                
                {/* <button onClick={this.generatePlaylist} className='generate-btn generate-btn-container'>GENERATE</button> */}
                {this.props.selectedSongs!==null && (
                    <div>
                        {this.selectSong()}
                    </div>
                )}
                <SongList checkBoxVisible={true}/>
            </div>
        );
    };

};

GeneratePlaylist.propTypes={
    songId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      songs: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
      ]),
      selectedSongs : PropTypes.array
};

export default GeneratePlaylist;