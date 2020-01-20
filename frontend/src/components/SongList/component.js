import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './SongList.css';

import {Icon} from 'semantic-ui-react';

class SongList extends Component {

  constructor(props){
    super(props)
  }

  componentWillUnmount(){
    // just want to remove the songs from the list
    this.props.clearSongs()
  }

  playSong = (song) =>{
    (song.track.id === this.props.songId) && this.props.songPlaying && this.props.songPaused ? this.props.resumeSong() :
            this.props.songPlaying && !this.props.songPaused && (song.track.id === this.props.songId)  ? this.props.pauseSong() :
              this.props.audioControl(song);
  }
    


  msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  renderSongs() {
    return this.props.songs.map((song, i) => {
      const buttonClass = song.track.id === this.props.songId && !this.props.songPaused ? "fa-pause-circle-o" : "fa-play-circle-o";

      return (
        <li onClick={()=>{
          console.log("song", song)
          this.props.setSelectedSongs([song])
        }} className={song.track.id === this.props.songId ? 'active user-song-item' : 'user-song-item'} key={ i }>
          <div onClick={() => {this.playSong(song) } } className='play-song'>
            <i className={`fa ${buttonClass} play-btn`} aria-hidden="true"/>
            <Icon circular name='play' inverted color='grey'  link/>
          </div>

          <div className='song-title'>
            <p>{ song.track.name }</p>
          </div>

          <div className='song-artist'>
            <p>{ song.track.artists[0].name }</p>
          </div>

          <div className='song-album'>
            <p>{ song.track.album.name }</p>
          </div>

          <div className='song-added'>
            <p>{ moment(song.added_at).format('YYYY-MM-DD')}</p>
          </div>

          <div className='song-length'>
            <p>{ this.msToMinutesAndSeconds(song.track.duration_ms) }</p>
          </div>
        </li>
      );
    });
  }

  render() {



    return (
      <div>
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
  audioControl: PropTypes.func,
  songPaused: PropTypes.bool,
  songPlaying: PropTypes.bool,
  resumeSong: PropTypes.func,
  pauseSong: PropTypes.func,
  addSongToLibrary: PropTypes.func,
  headerTitle: PropTypes.string, 
  setSelectedSongs : PropTypes.func, 
  clearSongs : PropTypes.func, 
};

export default SongList;
