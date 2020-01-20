import React from 'react';
import PropTypes from 'prop-types';
import './SideMenu.css';

import {Icon} from 'semantic-ui-react';

const SideMenu = ({
  updateHeaderTitle,
  updateViewType,
}) => {


  const handleHomeClick = () =>{
    updateHeaderTitle('Home');
    updateViewType('Home');

  }

  const handleGenerateClick = () =>{
    updateHeaderTitle('GeneratePlaylist');
    updateViewType('songs');

  }

  return (
    <ul className='side-menu-container'>

      <li className='side-menu-item'>
        <Icon name='home'/>
        <h3 className='side-menu-title' onClick={handleHomeClick}>Home</h3>
      </li>

      <li className='side-menu-item'>
        <button onClick={handleGenerateClick} className='new-playlist-btn'>Generate Playlist</button>
      </li>
    </ul>
  );

};

SideMenu.propTypes = {
  updateHeaderTitle: PropTypes.func,
  updateViewType: PropTypes.func,
  title: PropTypes.string
};

export default SideMenu;
