import React from 'react';
import './App.css';
import Note from './Note.js';

import NotefulContext from './NotefulContext.js';

class NoteList extends React.Component {
  static contextType = NotefulContext;

  render() {
    const notesInContext = this.props.match.params.folderId ?     
      this.context.allNotes.filter(note => note.folderId === this.props.match.params.folderId)
    : this.context.allNotes || [];

    const notes = notesInContext.map(item => {
      return <Note 
        key={item.id} 
        id={item.id} 
        name={item.name} 
        modified={item.modified}
        goHomeCallback={()=>{}} />;
    });

    return (
      <div className="main-notes__list">
         {notes}
      </div>
    );
  }
}

export default NoteList;
