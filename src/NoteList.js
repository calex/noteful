import React from 'react';
import './App.css';
import Note from './Note.js';

class NoteList extends React.Component {
  render() {
    const notes = this.props.notes.map(item => {
      return <Note key={item.id} id={item.id} name={item.name} modified={item.modified} />;
    });

    return (
      <div className="main-notes__list">
         {notes}
      </div>
    );
  }
}

export default NoteList;
