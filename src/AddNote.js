import React from 'react';
import './App.css';

import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

import ErrorMessage from './ErrorMessage.js';

import NotefulContext from './NotefulContext.js';

export default class AddNote extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            foldedUp: true,

            errorMessage: null,

            noteNameInputTouched: false,

            noteBodyTextAreaTouched: false,
            
            selectedFolder: {
                id: ''
            },

            newNote: {
                name: '',
                body: '',
            }
        }
    }

    static contextType = NotefulContext;

    toggleFoldedState = () => {
        this.setState({
            foldedUp: !this.state.foldedUp
        });
    }

    validateNewNote() {
        const noteName = this.state.newNote.name.trim();
        const noteBody = this.state.newNote.body.trim();
        
        if ((noteName.length === 0 || noteBody.length === 0) && this.state.noteNameInputTouched && this.state.noteBodyTextAreaTouched) {
          return 'Please add some note information';
        }
    }

    addNoteRecord = (folderId, newNote) => {
        const newNoteObject = {
            'id': uuidv4(),
            'name': newNote.name,
            'modified': new Date().toISOString(),
            'content': newNote.body,
            'folderId': folderId
        }

        fetch(`http://localhost:9090/notes`, {
            method: 'POST',
            body: JSON.stringify(newNoteObject),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(async res => {
            if (!res.ok) {
                // get the error message from the response,
                return res.json().then(error => {
                    // then throw it
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            this.context.addNote(newNoteObject);
        })
        .catch(error => {
            console.error(error);

            this.setState({
                errorMessage: `Sorry, something went wrong: ${error}.`
            });
        })
    }

    updateSelectedFolderInComponentState(selectedFolderId) {
        this.setState({
            selectedFolder: {
                id: selectedFolderId
            },
        });
    }

    updateNoteNameInComponentState(typedInName) {
        this.setState({
            errorMessage: null,
            noteNameInputTouched: true,
            newNote: {...this.state.newNote, name: typedInName }
        });
    }

    updateNoteBodyInComponentState(typedInNote) {
        this.setState({
            errorMessage: null,
            noteBodyTextAreaTouched: true,
            newNote: {...this.state.newNote, body: typedInNote }
        });
    }

    handleSubmit = (event) => {
        
        event.preventDefault();

        const selectedFolderId = this.state.selectedFolder.id ? this.state.selectedFolder.id : this.props.selectedFolderId;
        
        const noteName = this.state.newNote.name.trim();
        const noteBody = this.state.newNote.body.trim();

        if ((noteName.length > 0) && (noteBody.length > 0)) {
            this.addNoteRecord(selectedFolderId, this.state.newNote);
            
            this.setState({
                foldedUp: true
            })  
        }
        else {
            if ((noteName.length === 0) && (noteBody.length > 0)) {
                this.setState({
                    errorMessage: "Please add a note name"
                })            
            }
            else if ((noteName.length > 0) && (noteBody.length === 0)) {
                this.setState({
                    errorMessage: "Please add a note"
                })            
            } else {
                this.setState({
                    errorMessage: "Please add some note information"
                })            
            }
            
        }
    }
    
    render() {
        const errorMessage = this.state.errorMessage
            ? this.state.errorMessage
            : this.validateNewNote();

        const selectFolderDropdownOptions = this.context.allFolders.map(item => {
            return (
            <option 
                key={item.id} 
                value={item.id}>
                {item.name}
            </option>
          );
        });

        const selectedFolderId = this.state.selectedFolder.id ? this.state.selectedFolder.id : this.props.selectedFolderId;

        return (

            <section className="top-form">
                <div className="top-form__toggler" onClick={this.toggleFoldedState}><h2>+ Add a New Note</h2></div>
                {!this.state.foldedUp && <form className="form add-note-form" onSubmit={e => this.handleSubmit(e)}>
                    <label htmlFor="new-note-folder-select">Select Folder</label>
                    <select
                        value={selectedFolderId}
                        id="new-note-folder-select"
                        onChange={e => this.updateSelectedFolderInComponentState(e.target.value)}>
                            {selectFolderDropdownOptions}
                    </select>
                    <input 
                        id="new-note-title-input"
                        type="text" 
                        placeholder="New Note Title"
                        onChange={e => this.updateNoteNameInComponentState(e.target.value)} />
                    <textarea 
                        id="new-note-textarea"
                        placeholder="Type Your New Note"
                        onChange={e => this.updateNoteBodyInComponentState(e.target.value)} />
                    <button
                        type="submit"
                        disabled={
                            this.validateNewNote()
                        }>
                        Add Note
                    </button>
                    <ErrorMessage message={errorMessage} />
                </form> 
                }
            </section>
        );
    }
}

AddNote.propTypes = {
    selectedFolderId: PropTypes.string
};