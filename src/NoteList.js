import React from 'react';
import './App.css';

import AddNote from './AddNote.js';
import ComponentsError from './ComponentsError.js';
import Note from './Note.js';

import PropTypes from 'prop-types';

import NotefulContext from './NotefulContext.js';

export default class NoteList extends React.Component {
  static contextType = NotefulContext;

  render() {
    const allNotes = this.context.allNotes;
    const allFolders = this.context.allFolders;

    const matchParams = this.props.match.params;

    const notesInContext = matchParams.folderId && allNotes.length ?     
      allNotes.filter(note => note.folderId === matchParams.folderId)
    : allNotes;

    const selectedFolderId = matchParams.folderId ? 
      matchParams.folderId
    : allFolders.length ?
    this.context.allFolders[0].id
    : '';

    const notes = notesInContext.length ? 
      notesInContext.map(item => {
        return <ComponentsError key={item.id} message="Something went wrong and we couldn't display this note"> 
          <Note 
          key={item.id} 
          id={item.id} 
          name={item.name} 
          modified={item.modified}
          goHomeCallback={()=>{}} />
        </ComponentsError>;
      }).sort(function(a, b) {
        // sort by ISO date, newest first
        return (a.modified < b.modified) ? 0 : ((a.modified > b.jodified) ? 1 : -1);
    })
    : <p>No notes have been added to this folder.</p>

    return (
      <div className="main-notes__list">
          <AddNote selectedFolderId={selectedFolderId} />
          <ComponentsError message="Something went wrong and we couldn't display this list of notes">
            {notes}
          </ComponentsError>
      </div>
    );
  }
}

NoteList.propTypes = {
  match: PropTypes.object
};

