import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TrackSearch.css';

import {Input, Icon, Form} from 'semantic-ui-react';

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
				{/* <Input icon='search' onChange={this.updateSearchTerm} inverted placeholder='Search...' /> */}
				<Form inverted onSubmit={() => { this.props.searchSongs(this.state.searchTerm, this.props.token);}}>
					<Form.Group>
						<Form.Input  onChange={this.updateSearchTerm} placeholder='Search...'/>
					</Form.Group>
				</Form>
			</div>
			
		);
	};

	render() {
	  return(
	    <div className='track-search-container'>
			{this.renderSearch()}
	      {/* <form onSubmit={() => { this.props.searchSongs(this.state.searchTerm, this.props.token);}}>
	        <input onChange={this.updateSearchTerm} type='text' placeholder='Search...' />
	        <button onClick={(e) => { e.preventDefault(); this.props.searchSongs(this.state.searchTerm, this.props.token);}}>
	          <i className="fa fa-search search" aria-hidden="true"/>
	        </button>
	      </form> */}
	    </div>
	  );
	}
}

TrackSearch.propTypes = {
  searchSongs: PropTypes.func,
  token: PropTypes.string,
};

export default TrackSearch;
