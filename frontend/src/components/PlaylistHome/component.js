import React, { Component } from "react";
import PropTypes from 'prop-types';
import './PlaylistHome.css';
import { Card, Image } from 'semantic-ui-react'



class PlaylistHome extends Component{

    componentWillReceiveProps (nextProps) {
        if(nextProps.userId !== '' && nextProps.token !== '') {
          this.props.fetchPlaylistsMenu(nextProps.userId, nextProps.token);
        }
      }

    renderPlaylists() {
      if(this.props.playlists!==''){
        return this.props.playlists.map(playlist => {
          const getPlaylistSongs = () => {
            this.props.fetchPlaylistSongs(playlist.owner.id, playlist.id, this.props.token);
            this.props.updateHeaderTitle(playlist.name);
            
          };
    
          return (

            <Card color='grey' key={playlist.id} className='card-main' onClick={getPlaylistSongs}>
                <Image src={playlist.images[0] ? playlist.images[0].url : null}/>
                <Card.Content>
                    <Card.Header >{playlist.name}</Card.Header>
                    <Card.Description>{playlist.description}</Card.Description>
                </Card.Content>
            </Card>
          );
        });
      }
        
      }

    render(){
        return(
            <div>
                <Card.Group>
                    {this.renderPlaylists()}
                </Card.Group>
                
            </div>
        )
    }
}

PlaylistHome.propTypes = {
    userId: PropTypes.string,
    token: PropTypes.string,
    title: PropTypes.string,
    playlists:  PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    fetchPlaylistsMenu: PropTypes.func,
    fetchPlaylistSongs: PropTypes.func,
    updateHeaderTitle: PropTypes.func,
    updateViewType: PropTypes.func
  };

export default PlaylistHome;