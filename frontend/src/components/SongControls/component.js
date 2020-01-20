import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './SongControls.css';

import {Icon, Progress} from 'semantic-ui-react';

class SongControls extends Component {

	constructor(props) {
    
		super(props);
		this.state = {
		  spotifyPlayer: props.spotifyPlayer,
		  timeElapsed: props.timeElapsed
		};
		
	  }

	  componentWillMount(){
		this.calculateTime();
	  }

	// componentWillReceiveProps(nextProps) {

	//   if(!nextProps.songPlaying) {
	//     clearInterval(this.state.intervalId);
	//   }

	//   if(nextProps.songPlaying && nextProps.timeElapsed === 0) {
	//     clearInterval(this.state.intervalId);
	    
	//   }

	//   this.setState({
	// 	timeElapsed: nextProps.currentPlayerState !== undefined ? nextProps.currentPlayerState.position/1000 : 0 ,
	// 	spotifyPlayer: nextProps.spotifyPlayer
	//   });

	// }

	calculateTime() {
		
		console.log("creating interval", this.props.currentPlayerState)
		const intervalId  = setInterval(() => {
			if(this.props.currentPlayerState!==undefined){
				if(this.props.timeElapsed === this.props.currentPlayerState.duration/1000) {
					clearInterval(this.state.intervalId);
				  } else if(!this.props.currentPlayerState.paused) {
					this.props.increaseSongTime(this.props.timeElapsed + 1);
				  }
			}
			
		  }, 1000);
	
		  this.setState({
			intervalId: intervalId
		  });
	}


	getSongIndex = () => {
	  const { songs, songDetails } = this.props;
	  const currentIndex = songs.map((song, index) => {
	    if(song.track === songDetails) {
	      return index;
	    }
	  }).filter(item => {
	    return item !== undefined;
	  })[0];

	  return currentIndex;
	}

	nextSong = () => {
	  if(this.props.spotifyPlayer!==null  && this.props.currentPlayerState!==undefined){
			if(this.props.currentPlayerState.track_window.next_tracks.length>0){
				this.props.spotifyPlayer.nextTrack();
			}
		}
	}

	prevSong = () => {
		if(this.props.spotifyPlayer!==null && this.props.currentPlayerState!==undefined){
			if(this.props.currentPlayerState.track_window.previous_tracks.length>0){
				this.props.spotifyPlayer.previousTrack();
			}
			
		}
	}

	toggleSong = () =>{
		if(this.props.spotifyPlayer!==null){
			console.log(this.props.spotifyPlayer);
			this.props.spotifyPlayer.togglePlay();
		}
	}

	render() {
		const playerState = this.props.currentPlayerState;

		if(playerState!==undefined){
			return (
				<div className='song-player-container'>
		
				  <div className='song-details'>
					<p className='song-name'>{ playerState.track_window.current_track.name}</p>
					<p className='artist-name'>{ playerState.track_window.current_track.artists[0].name}</p>
				  </div>
		
				  <div className='song-controls'>
		
					<div onClick={this.prevSong} className='reverse-song'>
					  <Icon name='step backward' inverted color='grey' link/>
					</div>
		
					{playerState.paused===true &&(
						<div className='play-btn' onClick={this.toggleSong}>
							<Icon name='play' inverted color='grey'  link size='small'/>
						</div>
					)}
		
					{playerState.paused===false &&(
						<div className='play-btn' onClick={this.toggleSong}>
							<Icon name='pause' inverted color='grey'  link size='small'/>
						</div>
					)}
		
					<div onClick={this.nextSong} className='next-song'>
					  <Icon name='step forward' inverted color='grey'  link/>
					</div>
		
				  </div>
		
				  <div className='song-progress-container'>
					<p className='timer-start'>{ moment().minutes(0).second(this.props.timeElapsed).format('m:ss') }</p>
					<div className='song-progress'>
					  <div style={{ width: (this.props.timeElapsed/(playerState.duration/1000))*500 }} className='song-expired' />
					  {/* <Progress percent={(this.props.timeElapsed/(playerState.duration/1000))*100} inverted color='green' size='tiny'/> */}
					</div>
					<p className='timer-end'>{ moment().minutes(0).second(playerState.duration/1000 ).format('m:ss') }</p>
				  </div>
		
				</div>
			  );
		}
		else{
			return (
				<div className='song-player-container'>
		
				  <div className='song-details'>
					<p className='song-name'>{ playerState!==undefined ? playerState.track_window.current_track.name : ''}</p>
					<p className='artist-name'>{ playerState!==undefined ? playerState.track_window.current_track.artists[0].name : '' }</p>
				  </div>
		
				  <div className='song-controls'>
		
					<div onClick={this.prevSong} className='reverse-song'>
					  <Icon name='step backward' inverted color='grey' link/>
					</div>
		
					{(
						<div className='play-btn' onClick={this.playSong}>
							<Icon name='play' inverted color='grey'  link size='small'/>
						</div>
					)}
		
					{(
						<div className='play-btn' onClick={!this.props.songPaused ? this.props.pauseSong : this.props.resumeSong}>
							<Icon name='pause' inverted color='grey'  link size='small'/>
						</div>
					)}
		
					<div onClick={this.nextSong} className='next-song'>
					  <Icon name='step forward' inverted color='grey'  link/>
					</div>
		
				  </div>
		
				  <div className='song-progress-container'>
					<p className='timer-start'>{ moment().minutes(0).second(this.props.timeElapsed).format('m:ss') }</p>
					<div className='song-progress'>
					<div style={{ width: 0 }} className='song-expired' />
					{/* <Progress percent={0} inverted color='green' size='tiny'/> */}
					</div>
					<p className='timer-end'>{ moment().minutes(0).second(0).format('m:ss') }</p>
				  </div>
		
				</div>
			)
		};
	}
}

SongControls.propTypes = {
	token: PropTypes.string,
  timeElapsed: PropTypes.number,
  songPlaying: PropTypes.bool,
  songPaused: PropTypes.bool,
  songName: PropTypes.string,
  artistName: PropTypes.string,
  stopSong: PropTypes.func,
  resumeSong: PropTypes.func,
  increaseSongTime: PropTypes.func,
  pauseSong: PropTypes.func,
  songs: PropTypes.array,
  songDetails: PropTypes.object,
  audioControl: PropTypes.func,
  spotifyPlayer: PropTypes.object,
  currentPlayerState: PropTypes.object
};


export default (SongControls);
