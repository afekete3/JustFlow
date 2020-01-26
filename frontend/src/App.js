import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUser } from './actions/userActions';
import { setToken } from './actions/tokenActions';
import {updateSpotifyPlayer, updateCurrentPlayerState} from './actions/spotifyPlayerActions'
import { playSong, stopSong, pauseSong, resumeSong, increaseSongTime } from './actions/songActions';
import {updateHeaderTitle} from './actions/uiActions';
import {updateVolume} from './actions/soundActions';
import './App.css';
import queryString from 'query-string'
import Header from './components/Header';
import Footer from './components/Footer';
import UserPlaylists from './components/UserPlaylists';
import MainView from './components/MainView';
import ArtWork from './components/ArtWork';
import MainHeader from './components/MainHeader';
import SideMenu from './components/SideMenu';

class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			spotifyPlayer: null,
			device_id: null,
			accessToken: null,
			firstAuth: true,
			authenticated: false
		  };
		
		this.playerCheckInterval = null;
		this.player = null;
	}
	
	static audio;

	async componentDidMount() {

		let parsed = queryString.parse(window.location.search)
		if(parsed['access_token']===undefined){
			window.location = 'http://localhost:8080/';
			this.setState({authenticated: true})
		}
		else if(this.state.firstAuth !== false){
			let accessToken = parsed['access_token']
			this.props.setToken(accessToken)
			this.setState({accessToken: accessToken, firstAuth: false})
			this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
		}
		this.props.updateHeaderTitle('Home')
	}

	checkForPlayer(){
		if(window.Spotify !== undefined){
			clearInterval(this.playerCheckInterval);
		  this.player = new window.Spotify.Player({
			  name: 'JustFlow',
			  getOAuthToken: callback =>{
				  
				  callback(this.props.token);
			  },
			  volume: 0.5
		  });
		  var tempThis = this;
		  this.player.connect().then(success=>{
			  if(success){
				  console.log('The Web Playback SDK successfully connected to Spotify!');
				  this.createEventHandlers();
				  tempThis.setState({spotifyPlayer: this.player, device_id: this.player.device_id})
			  }
			  else{
				  console.log("Uncessful connection")
			  }
		  });
		  
		}
	}

	transferPlaybackHere() {
		const { device_id, token } = this.state;
		console.log("state", this.state)
		fetch("https://api.spotify.com/v1/me/player", {
		  method: "PUT",
		  headers: {
			authorization: `Bearer ${this.props.token}`,
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			"device_ids": [ device_id ],
			"play": false,
		  }),
		});
	  }

	startPlayer(){
		if(this.state.spotifyPlayer!==null){
			console.log(this.state.spotifyPlayer);
			this.state.spotifyPlayer.togglePlay().then(()=>{
				console.log('PLAYING ')
			});
		}
	}

	createEventHandlers() {
		this.player.addListener('initialization_error', e => { console.error(e); });
		this.player.addListener('authentication_error', e => {
		  console.error(e);
		});
		this.player.addListener('account_error', e => { console.error(e); });
		this.player.addListener('playback_error', e => { console.error(e); });
	  
		// Playback status updates
		this.player.addListener('player_state_changed', state => { 
			console.log('state changed', state); 
			this.props.updateCurrentPlayerState(state);
			this.props.increaseSongTime(state.position/1000)
			this.player.getVolume().then(res=>{
				this.props.updateVolume(res*100);
			})
			
		});
	  
		// Ready
		this.player.addListener('ready',  data => {
			let { device_id } = data;
			this.props.updateSpotifyPlayer(this.player)
			this.setState({ device_id: device_id }, ()=>{
				this.transferPlaybackHere();
			});
			
		});
	  }

	componentWillReceiveProps(nextProps) {
	  if(nextProps.token) {
	    this.props.fetchUser(nextProps.token);
	  };

	  if(this.audio !== undefined) {
	    this.audio.volume = nextProps.volume / 100;
	  }

	}

	stopSong = () => {
	  if(this.audio) {
	    this.props.stopSong();
	    this.audio.pause();
	  }
	}

	pauseSong = () => {
	  if(this.audio) {
	    this.props.pauseSong();
	    this.audio.pause();
	  }
	}

	resumeSong = () => {
	  if(this.audio) {
	    this.props.resumeSong();
		this.audio.play();
		
	  }
	  
	}

	audioControl = (song) => {

	  const { playSong, stopSong } = this.props;

	  if(this.audio === undefined){
	    playSong(song.track);
	    this.audio = new Audio(song.track.preview_url);
	    this.audio.play();
	  } else {
	    stopSong();
	    this.audio.pause();
	    playSong(song.track);
	    this.audio = new Audio(song.track.preview_url);
	    this.audio.play();
	  }
	}

	render() {
		
		

	  return (

	    <div className='App'>
	      <div className='app-container'>
			  
			<div className='left-side-section'>
				<SideMenu />
				<UserPlaylists />
				<ArtWork />
			</div>

	        <div className='main-section'>
	          <Header />
	          <div className='main-section-container'>
	            <MainHeader
	              pauseSong={ this.pauseSong }
	              resumeSong={ this.resumeSong }
	            />
	            <MainView
	              pauseSong={this.pauseSong}
	              resumeSong={ this.resumeSong }
	              audioControl={ this.audioControl }
	            />
	          </div>
	        </div>

	        <Footer
	          stopSong={ this.stopSong }
	          pauseSong={ this.pauseSong }
	          resumeSong={ this.resumeSong }
	          audioControl={ this.audioControl }
	        />
	      </div>
	    </div>
	  );
	}
}

App.propTypes = {
  token: PropTypes.string,
  fetchUser: PropTypes.func,
  setToken: PropTypes.func,
  pauseSong: PropTypes.func,
  playSong: PropTypes.func,
  stopSong: PropTypes.func,
  resumeSong: PropTypes.func,
  volume: PropTypes.number,
  spotifyPlayer: PropTypes.object,
  currentPlayerState: PropTypes.object
};

const mapStateToProps = (state) => {

  return {
    token: state.tokenReducer.token,
	volume: state.soundReducer.volume,
	spotifyPlayer: state.spotifyPlayerReducer.spotifyPlayer,
	currentPlayerState: PropTypes.object, 
  };

};

const mapDispatchToProps = dispatch => {

  return bindActionCreators({
    fetchUser,
	setToken,
    playSong,
    stopSong,
    pauseSong,
	resumeSong,
	updateSpotifyPlayer,
	updateCurrentPlayerState,
	updateHeaderTitle,
	increaseSongTime,
	updateVolume
  },dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(App);
