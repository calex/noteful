import React from 'react';
import './App.css';
import { Link, NavLink } from 'react-router-dom';
import AddFolder from './AddFolder.js';

import NotefulContext from './NotefulContext.js';
import PropTypes from 'prop-types';

export default class UnfilteredSidebar extends React.Component {
  static contextType = NotefulContext;

  handleGoBackAfterNewFolderAdd = (itemId) => {
    this.props.history.push(`/folder/${itemId}`);  
  }

  render() {
    const foldersContext = this.context.allFolders;

    const folders = foldersContext.map(item => {
      return <li key={item.id} className="folders-nav__item">
        <NavLink to={`/folder/${item.id}`}>
          {item.folder_name}
        </NavLink>
      </li>;
    });
    
    const bottomForm = this.props.match.path === '/add-new-folder' ?
      <AddFolder handleSubmitCallback={this.handleGoBackAfterNewFolderAdd} /> : <Link to={`/add-new-folder`}>
          <button>Add Folder</button>
        </Link>;

    return (
      <>
          <nav>
            <ul>
              {folders}
            </ul>
          </nav>
          {bottomForm}
      </>
    );
  }
}

UnfilteredSidebar.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};