import React from 'react';
import './App.css';

import NotefulContext from './NotefulContext.js';

class FilteredSidebar extends React.Component {
  static contextType = NotefulContext;

  handleBackButtonClick = () => {
    this.props.history.goBack();
  }

  render() {
    const selectedNote = this.context.allNotes.find(note => note.id === this.props.match.params.noteId);
    const parentFolder = this.context.allFolders.find(f =>
        f.id === selectedNote.folderId
    );

    return (
      <div>
        <button onClick={this.handleBackButtonClick}>Go Back</button>
        {parentFolder && (
          <h3>{parentFolder.name}</h3>  
        )}
      </div>
    );
  }
}

export default FilteredSidebar;
