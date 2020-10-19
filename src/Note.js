import React from 'react';
import './App.css';

import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import NotefulContext from './NotefulContext.js';
import PropTypes from 'prop-types';

export default class Note extends React.Component {
    static defaultProps = {
        goHomeCallback: () => {}
    }
    
    static contextType = NotefulContext;

    deleteNoteRecord = event => {
        event.preventDefault();

        const noteId = this.props.id;

        fetch(`http://localhost:8000/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                // get the error message from the response,
                return res.json().then(error => {
                    // then throw it
                    throw error
                })
            }
            //return res.json()
        })
        .then(data => {
            // make sure this comes above deleteNote, or we are stuck on the component for too long
            this.props.goHomeCallback();

            this.context.deleteNote(noteId);
        })
        .catch(error => {
            console.error(error)
        })
    }

    render() {
        return (
            <div className="note">
                <div>
                    <Link tabIndex="2" to={`/note/${this.props.id}`}>
                        <h2>{this.props.note_name}</h2>
                    </Link>
                    <p>Last modified: <Moment format="ddd DD MMM, YYYY">{this.props.modified}</Moment></p>
                </div>
                <button tabIndex="3" onClick={this.deleteNoteRecord}>
                    Delete Note
                </button>
            </div>
        );
    }
}

Note.propTypes = {
  id: PropTypes.string.isRequired,
  note_name: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  goHomeCallback: PropTypes.func.isRequired
};