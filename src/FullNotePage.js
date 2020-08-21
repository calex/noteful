import React from 'react';
import './App.css';

import Note from './Note.js';

import PropTypes from 'prop-types';
import NotefulContext from './NotefulContext.js';

export default class FullNotePage extends React.Component {
  static contextType = NotefulContext;

  handleGoHome = () => {
    this.props.history.push(`/`);
  }

  render() {
    const selectedNote = this.context.allNotes.find(note => note.id === this.props.match.params.noteId);

    return (
      <div className="note-page">
        <Note 
          id={selectedNote.id}
          name={selectedNote.name}
          modified={selectedNote.modified}
          goHomeCallback={this.handleGoHome} />
        <p>{selectedNote.content}</p>
      </div>
    );
  }
}

FullNotePage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};
