import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './GeneratePlaylistHeader.css';
import {Form, TextArea, Input} from 'semantic-ui-react';


class GeneratePlaylistHeader extends Component{

  constructor(props){
    super(props);
    this.generatePlaylistClick = this.generatePlaylistClick.bind(this); 
    this.addSongsToPlaylist = this.addSongsToPlaylist.bind(this); 
    this.state = {
      name : "", 
      size : 0, 
      nameError : false, 
      sizeError : false,  
    }
  }

  generatePlaylistClick(){
    if(this.state.name === ""){
      this.setState({nameError : true}); 
    }
    else if(this.state.nameError){
      this.setState({nameError : false}); 
    }
    if(this.state.size <= 0){
      this.setState({sizeError : true}); 
    }
    else if(this.state.sizeError){
      this.setState({sizeError : false}); 
    }
    if(!this.state.sizeError && !this.state.nameError){
      this.generatePlaylist();
    }
  }

  
  generatePlaylist(){
    var seedSongIds = [];
    
    for(let seed of this.props.selectedSongs){
      seedSongIds.push(seed.track.id);      
    }
    fetch("http://localhost:8080/playlist/generate", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
        },
		  body: JSON.stringify({
        access_token: this.props.token,
        ids:seedSongIds, 
        num_of_songs: this.state.size, 
		  }),
		}).then(res => {
      res.json().then(parsed=>{
        this.createGeneratedPlaylist(parsed.generated_playlist_ids);
      })
    });
  }

  createGeneratedPlaylist(trackIds){
    const request = new Request(`https://api.spotify.com/v1/users/${this.props.userId}/playlists`, {
      method: "POST",
      headers: new Headers({
        'Authorization': 'Bearer ' + this.props.token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        'name' : this.state.name
      })
    })
    fetch(request)
    .then((res) =>{
      return res.json()
    })
    .then((data)=>{
      this.addSongsToPlaylist(trackIds, data['id'])
    })
  }

  addSongsToPlaylist(trackIds, playlistId){
    let uris = ''

    for(let i = 0; i < trackIds.length; i++){
      if(i === trackIds.length - 1){
        uris += `spotify:track:${trackIds[i]}`
      }
      else{
        uris += `spotify:track:${trackIds[i]},`
      }
    }
    console.log(uris)
    const request = new Request(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`, {
      method: "POST",
      headers: new Headers({
        'Authorization': 'Bearer ' + this.props.token,
        "Content-Type": "application/json",
      })
    })
    fetch(request)
    .then(res =>{
      return res.json(); 
    })
    .then(data=>{
      console.log(data)
      this.addPlaylist(playlistId);
    });
  }

  addPlaylist(playlistId){
    const request = new Request(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: "GET",
      headers: new Headers({
        'Authorization': 'Bearer ' + this.props.token,
        "Content-Type": "application/json",
      })
    })
    fetch(request)
    .then(res =>{
      return res.json(); 
    })
    .then(data=>{
      console.log(data)
      this.props.addPlaylistItem(data)
      this.props.fetchPlaylistSongs(this.props.userId, playlistId, this.props.token);
      this.props.updateHeaderTitle(this.state.name); 
    });
  }

  selectSong(){
    if(this.props.selectedSongs.length > 0){
        return  (<div>
                    <div className='playlist-title-container'>
                        <div className='playlist-image-container'>
                            <img  className='playlist-image' src={this.props.selectedSongs[0].track.album.images[0] ? this.props.selectedSongs[0].track.album.images[0].url : null} />
                        </div>
                        
                        <div className='playlist-info-container'>
                            <p className='playlist-text'>SELECTED SONG</p>
                            <h3 className='header-title'>{this.props.selectedSongs[0].track.name}</h3>
                            <p className='created-by'>Artist: <span className='lighter-text'>{this.props.selectedSongs[0].track.artists[0].name}</span> </p>
                        
                        </div>
                    </div>
                </div>)
    }
    return <div/>
    
  }

  render(){

    return (
      <div>
        <h3>Generate Playlist</h3>
        <Form inverted>
          <Form.Group widths='equal'>
            <Form.Field 
              control={Input}
              label = 'Playlist Name'
              placeholder='Playlist Name'
              error={this.state.nameError} 
              onChange={e=> this.setState({'name' : e.target.value})}
            />
            <Form.Field 
              control={Input}
              label = 'Playlist Size'
              type='number' 
              placeholder='Playlist Size'
              error={this.state.sizeError}
              onChange={e=> this.setState({'size' : e.target.value})} 
            /> 
          </Form.Group>
          {this.props.selectedSongs.length > 0 && (
            <div>
              <label>Seed Songs</label>
              {this.selectSong()}
            </div>
          )}
          <button onClick={this.generatePlaylistClick} className='organize-btn'>GENERATE</button>
        </Form>
      </div>
    );
  }
}

GeneratePlaylistHeader.propTypes = {
  selectedSongs : PropTypes.array, 
  token : PropTypes.string, 
  userId : PropTypes.string, 
  updateHeaderTitle : PropTypes.func,
  updateViewType : PropTypes.func, 
  fetchPlaylistSongs : PropTypes.func, 
  fetchPlaylistsMenu: PropTypes.func, 
  addPlaylistItem : PropTypes.func, 
};

export default GeneratePlaylistHeader;
