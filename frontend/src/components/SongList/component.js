import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './SongList.css';

import {Icon} from 'semantic-ui-react';

class SongList extends Component {

  constructor(props){
    super(props)
    this.state= {
      selectedSong: null,
      currentPlaylist: null
    }
  }

  playSong(song) {
    if(this.props.headerTitle==='GeneratePlaylist'){
      var track_uris = [song.track.uri];
      this.props.playSpecificTrack(this.props.token, track_uris, undefined, undefined)
    }
    else{
      console.log("playlist")
      let tempPlaylist = this.props.playlists.filter(playlist => {
        return playlist.name === this.props.headerTitle;
      })[0];
      if(this.state.currentPlaylist===null || this.state.currentPlaylist.name!==tempPlaylist.name){
        this.setState({currentPlaylist: tempPlaylist}, ()=>{
          console.log(this.state.currentPlaylist.uri)
          var playlist_uri = this.state.currentPlaylist.uri;
          var offset = song.track.uri;
          this.props.playSpecificTrack(this.props.token, undefined, offset, playlist_uri)
        })
      }
      else{
          var playlist_uri = this.state.currentPlaylist.uri;
          var offset = song.track.uri;
          this.props.playSpecificTrack(this.props.token, undefined, offset, playlist_uri)
      }
      
    }
    console.log(song.track.uri)
    
    // (song.track.id === this.props.songId) && this.props.songPlaying && this.props.songPaused ? this.props.resumeSong() :
    //         this.props.songPlaying && !this.props.songPaused && (song.track.id === this.props.songId)  ? this.props.pauseSong() :
    //           this.props.audioControl(song);
  }

  generatePlaylist = () =>{

  }



  selectSong(){
    console.log(this.state.selectedSong)

    return(
      <div>
        <div className='playlist-title-container'>
          <div className='playlist-image-container'>
            <img className='playlist-image' src={this.state.selectedSong.track.album.images[0] ? this.state.selectedSong.track.album.images[0].url : null} />
          </div>
          
          <div className='playlist-info-container'>
            <p className='playlist-text'>SELECTED SONG</p>
            <h3 className='header-title'>{this.state.selectedSong.track.name}</h3>
            <p className='created-by'>Artist: <span className='lighter-text'>{this.state.selectedSong.track.artists[0].name}</span> </p>
            <button onClick={this.generatePlaylist} className='generate-btn generate-btn-container'>GENERATE</button>
            {/* <p className='created-by'>Artist: <span className='lighter-text'>{this.state.selectedSong.track.artists[0].name}</span> - {this.msToMinutesAndSeconds(this.state.selectedSong.track.duration_ms)}</p> */}

          </div>
        </div>
      </div>
      
    )
    
  }


  msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  renderSongs() {
    return this.props.songs.map((song, i) => {
      const currentlyPlayingClass = this.props.currentPlayerState!==undefined && song.track.id === this.props.currentPlayerState.track_window.current_track.id ? "fa-pause-circle-o greenText" : "fa-play-circle-o";

      return (
        <li onClick={()=>{
          this.setState({selectedSong: song})
        }} className={song.track.id === this.props.songId ? `active user-song-item greenText ${currentlyPlayingClass}` : `user-song-item`} key={ i }>
          <div onClick={() => {this.playSong(song) } } className='play-song'>
            <Icon circular name='play' inverted color='grey'  link/>
          </div>

          <div className='song-title'>
            <p className={`${currentlyPlayingClass}`}>{ song.track.name }</p>
          </div>

          <div className='song-artist'>
            <p className={`${currentlyPlayingClass}`}>{ song.track.artists[0].name }</p>
          </div>

          <div className='song-album'>
            <p className={`${currentlyPlayingClass}`}>{ song.track.album.name }</p>
          </div>

          <div className='song-added'>
            <p className={`${currentlyPlayingClass}`}>{ moment(song.added_at).format('YYYY-MM-DD')}</p>
          </div>

          <div className='song-length'>
            <p className={`${currentlyPlayingClass}`}>{ this.msToMinutesAndSeconds(song.track.duration_ms) }</p>
          </div>
        </li>
      );
    });
  }

  render() {



    return (
      <div>
        {this.state.selectedSong!==null && this.props.headerTitle==='GeneratePlaylist' && (
          <div>
            {this.selectSong()}
          </div>
        )}
        <div className='song-header-container'>
          <div className='song-title-header'>
            <p>Title</p>
          </div>
          <div className='song-artist-header'>
            <p>Artist</p>
          </div>
          <div className='song-album-header'>
            <p>Album</p>
          </div>
          <div className='song-added-header'>
            <i className="fa fa-calendar-plus-o" aria-hidden="true"/>
          </div>
          <div className='song-length-header'>
            <p><i className="fa fa-clock-o" aria-hidden="true" /></p>
          </div>
          <div className='song-length-header'>
            <p><i className="fa fa-clock-o" aria-hidden="true" /></p>
          </div>
        </div>
        {
          this.props.songs && !this.props.fetchPlaylistSongsPending && this.renderSongs()
        }

      </div>
    );
  }
}

SongList.propTypes = {
  viewType: PropTypes.string,
  token: PropTypes.string,
  songAddedId: PropTypes.string,
  songId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  songs: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  fetchSongsError: PropTypes.bool,
  fetchSongsPending: PropTypes.bool,
  fetchPlaylistSongsPending: PropTypes.bool,
  fetchSongs: PropTypes.func,
  addSongToLibrary: PropTypes.func,
  headerTitle: PropTypes.string,
  playSpecificTrack: PropTypes.func,
  playlists: PropTypes.array,
  currentPlayerState: PropTypes.object
};

export default SongList;
