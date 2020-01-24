import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './SongList.css';
import FlipMove from 'react-flip-move'
import {Icon, Segment, Dimmer, Loader} from 'semantic-ui-react';

class SongList extends Component {

  constructor(props){
    super(props)
    this.state= {
      currentPlaylist: null,
      currentSongs: []
    }
  }

  componentWillUnmount(){
    // just want to remove the songs from the list
    this.props.clearSongs()
    this.props.setSelectedSongs([])
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

  }


  msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  renderSongs() {
    if(this.state.currentSongs!==this.props.songs){
      this.setState({currentSongs: this.props.songs})
    }
    return (
      <Segment >
            <Dimmer active={this.props.isOrganizing!==undefined ? this.props.isOrganizing : false}>
              <Loader content='Organizing...' />
            </Dimmer>
         <FlipMove duration={600}>{
                
            this.state.currentSongs.map((song, i) => {
              const currentlyPlayingClass = this.props.currentPlayerState!==undefined && song.track.id === this.props.currentPlayerState.track_window.current_track.id ? "fa-pause-circle-o greenText" : "fa-play-circle-o";

              return (
                <li onClick={()=>{
                  
                  this.props.setSelectedSongs([song])
                }} className={song.track.id === this.props.songId ? `active user-song-item greenText ${currentlyPlayingClass}` : `user-song-item`} key={ song.track.id }>
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
            })
            }
            </FlipMove>
   </Segment>
      
    )
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
  addSongToLibrary: PropTypes.func,
  headerTitle: PropTypes.string,
  playSpecificTrack: PropTypes.func,
  playlists: PropTypes.array,
  currentPlayerState: PropTypes.object,
  isOrganizing: PropTypes.bool,
  setSelectedSongs : PropTypes.func, 
  clearSongs : PropTypes.func, 
};

export default SongList;
