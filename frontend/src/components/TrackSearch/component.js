import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TrackSearch.css';

import {Form} from 'semantic-ui-react';

class TrackSearch extends Component {

	state = {
	  searchTerm: ''
	};

	updateSearchTerm = (e) => {
	  this.setState({
	    searchTerm: e.target.value
	  });
	  
	}

	renderSearch() {

		return(
			<div >
				<h3>Search for songs to base your playlist off of!</h3>
				<Form inverted onSubmit={() => { this.props.searchSongs(this.state.searchTerm, this.props.token);}}>
					<Form.Input onChange={this.updateSearchTerm} placeholder='Search for a song...'/>
				</Form>
			</div>
			
		);
	};

	render() {
	  return(
	    <div className='track-search-container'>
			{this.renderSearch()}
	    </div>
	  );
	}
}

TrackSearch.propTypes = {
  searchSongs: PropTypes.func,
  token: PropTypes.string,
};

export default TrackSearch;
