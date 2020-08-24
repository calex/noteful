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

            noteTitleInputInvalid: false,

            noteBodyInputInvalid: false,

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

        this.folderSelectDropdown = React.createRef();
        this.noteTitleInput = React.createRef();
        this.noteBodyInput = React.createRef();
    }

    static contextType = NotefulContext;

    toggleFoldedState = () => {
        this.setState({
            foldedUp: !this.state.foldedUp
        });
    }

    toggleFoldedStateWithMouse = () => {
        this.toggleFoldedState();
    }

    toggleFoldedStateWithKeyboard = (e) => {
        if (this.state.foldedUp === false && (e.keycode === 9 || 13 || 32)) {
            if (this.folderSelectDropdown.current !== null) {
                this.folderSelectDropdown.current.focus(); 
            }          
        }
        else if (e.keycode === 9 || 13 || 32) {
            this.setState({
                foldedUp: false
            })
        }
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
            noteTitleInputInvalid: false,
            noteNameInputTouched: true,
            newNote: {...this.state.newNote, name: typedInName }
        });
    }

    updateNoteBodyInComponentState(typedInNote) {
        this.setState({
            errorMessage: null,
            noteBodyInputInvalid: false,
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
                foldedUp: true,
                noteTitleInputInvalid: false,
                noteBodyInputInvalid: false
            })  
        }
        else {
            if ((noteName.length === 0) && (noteBody.length > 0)) {
                this.setState({
                    errorMessage: "Please add a note name",
                    noteTitleInputInvalid: true
                })
                // reset the focus on the input
                this.noteTitleInput.current.focus();           
            }
            else if ((noteName.length > 0) && (noteBody.length === 0)) {
                this.setState({
                    errorMessage: "Please add a note",
                    noteBodyInputInvalid: true
                }) 
                // reset the focus on the input
                this.noteBodyInput.current.focus();                 
            } else {
                this.setState({
                    errorMessage: "Please add some note information",
                    noteTitleInputInvalid: true,
                    noteBodyInputInvalid: true
                })   
                // reset the focus on the input
                this.noteTitleInput.current.focus();           
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
                <div tabIndex="1" className="top-form__toggler" onKeyDown={(e) => this.toggleFoldedStateWithKeyboard(e)} onClick={this.toggleFoldedStateWithMouse}><h2>+ Add a New Note</h2></div>
                {!this.state.foldedUp && <form className="form add-note-form" onSubmit={e => this.handleSubmit(e)}>
                    <label htmlFor="new-note-folder-select">Select Folder</label>
                    <select
                        tabIndex={!this.state.foldedUp ? "1" : "" }
                        aria-required="true"
                        aria-describedby="error-message"
                        aria-label="Select from folders to put a note within"
                        value={selectedFolderId}
                        ref={this.folderSelectDropdown}
                        id="new-note-folder-select"
                        onChange={e => this.updateSelectedFolderInComponentState(e.target.value)}>
                            {selectFolderDropdownOptions}
                    </select>
                    <input 
                        tabIndex={!this.state.foldedUp ? "2" : "" }
                        aria-required="true"
                        aria-describedby="error-message"
                        aria-label="Enter your new note title"
                        aria-invalid={this.state.noteTitleInputInvalid}
                        id="new-note-title-input"
                        type="text" 
                        ref={this.noteTitleInput}
                        placeholder="New Note Title"
                        onChange={e => this.updateNoteNameInComponentState(e.target.value)} />
                    <textarea 
                        tabIndex={!this.state.foldedUp ? "3" : "" }
                        aria-required="true"
                        aria-describedby="error-message"
                        aria-label="Enter your new note"
                        aria-invalid={this.state.noteBodyInputInvalid}
                        id="new-note-textarea"
                        ref={this.noteBodyInput}
                        placeholder="Type Your New Note"
                        onChange={e => this.updateNoteBodyInComponentState(e.target.value)} />
                    <button
                        tabIndex={!this.state.foldedUp ? "4" : "" }
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