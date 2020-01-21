import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './GeneratePlaylistHeader.css';
import {Form} from 'semantic-ui-react';


class GeneratePlaylistHeader extends Component{

  constructor(props){
    super(props);
    this.generatePlaylistClick = this.generatePlaylistClick.bind(this)
	}

  generatePlaylistClick(){
    this.generatePlaylist(); 
    // promise.then(res=>{
    //   this.createGeneratedPlaylist(res); 
    // })
  }

  createGeneratedPlaylist(generatedPlaylist){
    console.log(generatedPlaylist)
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
        console.log("Parsed",parsed.ordered_ids)
        
        this.createGeneratedPlaylist(parsed.ordered_ids);
        // return parsed.ordered_ids; 
      })
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
          <Form.Field>
            <label>Playlist Name</label>
            <input placeholder='Playlist Name' onChange={e=> this.setState({'name' : e.target.value})}/>
          </Form.Field>
          <Form.Field>
            <label>Playlist Size</label>
            <input type='number' placeholder='Playlist Size' onChange={e=> this.setState({'size' : e.target.value})}/>
          </Form.Field>
        </Form.Group>
        {this.props.selectedSongs.length > 0 && (
          <div>
            <label>Seed Songs</label>
            {this.selectSong()}
          </div>
        )}
        <button onClick={this.generatePlaylistClick} className='new-playlist-btn'>Generate</button>
      </Form>
      </div>
    );
  }
}

GeneratePlaylistHeader.propTypes = {
  selectedSongs : PropTypes.array, 
  token: PropTypes.string, 
};

export default GeneratePlaylistHeader;
