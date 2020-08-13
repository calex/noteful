import React from 'react';
import './App.css';
import { NavLink } from 'react-router-dom';

import NotefulContext from './NotefulContext.js';

class UnfilteredSidebar extends React.Component {
  static contextType = NotefulContext;

  render() {
    const foldersContext = this.context.allFolders || [];

    const folders = foldersContext.map(item => {
      return <li key={item.id} className="folders-nav__item">
        <NavLink to={`/folder/${item.id}`}>
          {item.name}
        </NavLink>
      </li>;
    });

    return (
      <>
          <nav>
            <ul>
              {folders}
            </ul>
          </nav>
          <button>Add Folder</button>
      </>
    );
  }
}

export default UnfilteredSidebar;
