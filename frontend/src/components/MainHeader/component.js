import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratePlaylistHeader from '../GeneratePlaylistHeader'; 
import './MainHeader.css';


class MainHeader extends Component{

  constructor(props){
    super(props);
    this.state = {
      currentPlaylist: null
    };
  }

  reorderPlaylist(ordered_ids){
    var sortedSongs = [];
    for (var i =0; i< ordered_ids.length; i++){
      var index = 0;
      for (var j =0; j< this.props.songs.length; j++){
        if(this.props.songs[j].track.id===ordered_ids[i]){
          index = j;
          break;
        }       
      }
      console.log("Original", index);
      console.log('new', i);

      const request = new Request(`https://api.spotify.com/v1/playlists/${this.state.currentPlaylist.id}/tracks`, {
      method: "PUT",
      headers: new Headers({
        'Authorization': 'Bearer ' + this.props.token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        range_start: index,
        insert_before: i
      })
    })
    fetch(request).then(res =>{
      console.log("before",this.props.songs);
      sortedSongs = res
      this.props.fetchPlaylistSongs(this.state.currentPlaylist.owner.id, this.state.currentPlaylist.id, this.props.token);
      console.log("after",this.props.songs);

    });


      // this.props.reorderPlaylistTrack(this.state.currentPlaylist.id, this.props.token, index, i);
    }
    this.props.updateOrganizingState(false);
    console.log("ORDERED!!!!")
  }


  organizePlaylist=() =>{
    this.props.updateOrganizingState(true);
    console.log("current playlist", this.state.currentPlaylist)

    var unordered_ids = [];
    for (var i =0; i< this.props.songs.length; i++){
      unordered_ids.push(this.props.songs[i].track.id)       
    }

    fetch("http://localhost:8080/playlist/organize", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
        },
		  body: JSON.stringify({
        access_token: this.props.token,
        ids:unordered_ids
		  }),
		}).then(res => {
      res.json().then(parsed=>{
        console.log("Parsed",parsed.ordered_ids)
        console.log(this)
        this.reorderPlaylist(parsed.ordered_ids)
      })
      //return res.json();
    });
  }

  startPlaylist=()=>{
    if(this.props.currentPlayerState!==undefined && this.state.currentPlaylist!==null){
      console.log("currentPlaylist", this.state.currentPlaylist)
      var playlist_uri = this.state.currentPlaylist.uri;
      this.props.playSpecificTrack(this.props.token, undefined, undefined, playlist_uri)
    }
  }

  render(){
    

    if(this.props.viewType === 'playlist') {
      let tempPlaylist = this.props.playlists.filter(playlist => {
        return playlist.name === this.props.headerTitle;
      })[0];
      if(tempPlaylist !== undefined && (this.state.currentPlaylist===null || this.state.currentPlaylist.name!==tempPlaylist.name)){
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
            <GeneratePlaylistHeader/>
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
                onClick={this.startPlaylist}
                className='main-pause-play-btn'>
                {/* {this.props.songPaused ? 'PLAY' : 'PAUSE'} */}
                PLAY
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
  token: PropTypes.string,
  songs: PropTypes.array,
  reorderPlaylistTrack: PropTypes.func,
  fetchPlaylistSongs: PropTypes.func,
  currentPlayerState: PropTypes.object,
  updateOrganizingState: PropTypes.func
};

export default MainHeader;
