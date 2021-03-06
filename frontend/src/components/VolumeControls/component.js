import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VolumeControls.css';

class VolumeControls extends Component {

  constructor(props) {
    
    super(props);
    this.state = {
      volume: props.volume
    };
    
  }

	updateVolume = (e) => {
	  this.setState({
	    volume: e.target.value
	  });

	  if(this.props.spotifyPlayer!==undefined){
		this.props.spotifyPlayer.setVolume(e.target.value/100);
		this.props.updateVolume(Math.ceil(e.target.value / 10) * 10);
	  }
	}


	render() {

	  return (
	    <div className='volume-container'>
	      <i className="fa fa-volume-up" aria-hidden="true"/>
	      <input className='volume' type="range" min={0} max={100} value={this.props.volume} onChange={this.updateVolume} />
	    </div>
	  );
    
	}
}

VolumeControls.propTypes = {
  volume: PropTypes.number,
  updateVolume: PropTypes.func,
  spotifyPlayer: PropTypes.object
};

export default VolumeControls;
