import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TrackSearch from '../TrackSearch';
import './MainHeader.css';


class MainHeader extends Component{

  constructor(props){
    super(props);
    this.state = {
      currentPlaylist: null
    };
  }


  organizePlaylist=() =>{
    console.log("current playlist", this.state.currentPlaylist)

    fetch("http://localhost:8080/playlist/organize", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
        },
		  body: JSON.stringify({
        access_token: this.props.token,
        ids:["4ut5G4rgB1ClpMTMfjoIuy", "0nbXyq5TXYPCO7pr3N8S4I", "1xEcsGNqeAeeB5Yx2gmFRJ", "4Hqh0dS4x07zuRw6eBTO7p", 
        "6LcauUZjF1eXQrgqMUecHX"]
		  }),
		}).then(res => {
      return res.json();
    });
  }

  render(){
    

    if(this.props.viewType === 'playlist') {
      let tempPlaylist = this.props.playlists.filter(playlist => {
        return playlist.name === this.props.headerTitle;
      })[0];
      if(this.state.currentPlaylist===null || this.state.currentPlaylist.name!==tempPlaylist.name){
        this.setState({currentPlaylist: tempPlaylist})
      }
      
    }

    return (

      <div className='section-title'>

        { this.props.headerTitle==='Home' && (
          <div>
            <h3>Your Library</h3>
          </div>
        )}

        { this.props.headerTitle === 'GeneratePlaylist' &&(
          <div>
            <h3>Generate Playlist</h3>
            <TrackSearch />
          </div>
        )}
        {this.props.viewType === 'playlist' && this.state.currentPlaylist!==null && (
          <div className='playlist-title-container'>
            <div className='playlist-image-container'>
              <img className='playlist-image' src={this.state.currentPlaylist.images[0] ? this.state.currentPlaylist.images[0].url : null} />
            </div>
            <div className='playlist-info-container'>
              <p className='playlist-text'>PLAYLIST</p>
              <h3 className='header-title'>{this.props.headerTitle}</h3>
              <p className='created-by'>Created By: <span className='lighter-text'>{this.state.currentPlaylist.owner.display_name}</span> - {this.state.currentPlaylist.tracks.total} songs</p>
              <button
                onClick={!this.props.songPaused ? this.props.pauseSong : this.props.resumeSong}
                className='main-pause-play-btn'>
                {this.props.songPaused ? 'PLAY' : 'PAUSE'}
              </button>
              <button onClick={this.organizePlaylist} className='organize-btn'>ORGANIZE</button>

            </div>
          </div>
        )}
      </div>

    );
  }
}

MainHeader.propTypes = {
  pauseSong: PropTypes.func,
  resumeSong: PropTypes.func,
  updateHeaderTitle: PropTypes.func,
  updateViewType: PropTypes.func,
  songPaused: PropTypes.bool,
  headerTitle: PropTypes.string,
  viewType: PropTypes.string,
  playlists: PropTypes.array,
  playlistMenu: PropTypes.array,
  token: PropTypes.string,
};

export default MainHeader;
