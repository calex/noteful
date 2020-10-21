import React from 'react';
import './App.css';
import config from './config.js';

import { v4 as uuidv4 } from 'uuid';

import ErrorMessage from './ErrorMessage.js';

import NotefulContext from './NotefulContext.js';

export default class AddFolder extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            errorMessage: null, 
            newFolderNameInputInvalid: false,

            newFolder: {
                value: '',
                touched: false
            }
        }

        this.newFolderInput = React.createRef();
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
            'folder_name': folderName,
            'date_created': new Date().toISOString()
        }

        fetch(`${config.API_ENDPOINT}/folders`, {
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
            newFolderNameInputInvalid: false,

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
                errorMessage: "Please add a folder name",
                newFolderNameInputInvalid: true
            })

            // reset the focus on the input
            this.newFolderInput.current.focus();           
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
                    aria-required="true"
                    aria-describedby="error-message"
                    aria-label="Enter your new folder's name"
                    aria-invalid={this.state.newFolderNameInputInvalid}
                    placeholder="New Folder Name"
                    ref={this.newFolderInput}
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