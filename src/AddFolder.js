import React from 'react';
import './App.css';

import { v4 as uuidv4 } from 'uuid';

import ErrorMessage from './ErrorMessage.js';

import NotefulContext from './NotefulContext.js';

export default class AddFolder extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            errorMessage: null, 

            newFolder: {
                value: '',
                touched: false
            }
        }
    }

    static contextType = NotefulContext;

    validateFolderNameInput() {
        const folderName = this.state.newFolder.value.trim();
        
        if ((folderName.length === 0) && this.state.newFolder.touched) {
          return 'Folder Name is required';
        }
    }

    addFolderRecord = folderName => {
        const newFolderObject = {
            'id': uuidv4(),
            'name': folderName
        }

        fetch(`http://localhost:9090/folders`, {
            method: 'POST',
            body: JSON.stringify(newFolderObject),
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
            this.props.handleSubmitCallback(newFolderObject.id);

            this.context.addFolder(newFolderObject);
        })
        .catch(error => {
            console.error(error);

            this.setState({
                errorMessage: `Sorry, something went wrong: ${error}.`
            });
        })
    }

    updateFolderNameInComponentState(typedInName) {
        this.setState({
            errorMessage: null,

            newFolder: {
                value: typedInName,
                touched: true
            }
        });
    }

    handleSubmit = (event) => {
        
        event.preventDefault();

        const folderName = this.state.newFolder.value.trim();
        
        if (folderName.length > 0) {
            this.addFolderRecord(folderName);
        }
        else {
            this.setState({
                errorMessage: "Please add a folder name"
            })
        }
    }
    
    render() {
        const errorMessage = this.state.errorMessage
            ? this.state.errorMessage
            : this.validateFolderNameInput();

        return (
            <form className="add-folder-form" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add a New Folder</h2>
                <input 
                    id="new-folder-input"
                    type="text" 
                    placeholder="New Folder Name"
                    onChange={e => this.updateFolderNameInComponentState(e.target.value)} />
                <button
                    type="submit"
                    disabled={
                        this.validateFolderNameInput()
                    }>
                    Add Folder
                </button>
                <ErrorMessage message={errorMessage} />
            </form>
        );
    }
}