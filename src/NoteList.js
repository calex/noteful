import React from 'react';
import './App.css';
import Note from './Note.js';

import NotefulContext from './NotefulContext.js';

class NoteList extends React.Component {
  static contextType = NotefulContext;

  render() {
    const allNotes = this.context.allNotes;

    const notesInContext = this.props.match.params.folderId && allNotes.length ?     
      allNotes.filter(note => note.folderId === this.props.match.params.folderId)
    : allNotes;

    const notes = notesInContext.length ? 
      notesInContext.map(item => {
        return <Note 
          key={item.id} 
          id={item.id} 
          name={item.name} 
          modified={item.modified}
          goHomeCallback={()=>{}} />;
      })
    : <p>No notes have been added to this folder.</p>

    return (
      <div className="main-notes__list">
         {notes}
      </div>
    );
  }
}

export default NoteList;
