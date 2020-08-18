import React from 'react';
import './App.css';

import { v4 as uuidv4 } from 'uuid';

import NotefulContext from './NotefulContext.js';

export default class AddFolder extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          newFolder: {
            value: '',
            touched: false
          }
        }
      }

    static contextType = NotefulContext;

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
            this.props.handleSubmitCallback();

            this.context.addFolder(newFolderObject);
        })
        .catch(error => {
            console.error(error)
        })
    }

    updateFolderNameInComponentState(typedInName) {
        this.setState({
            newFolder: {
                value: typedInName,
                touched: true
            }
        });
    }

    handleSubmit = (event) => {
        
        event.preventDefault();
        
        this.addFolderRecord(this.state.newFolder.value);
    }
    
    render() {
        return (
            <form className="add-folder-form" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add a New Folder</h2>
                <input 
                    id="new-folder-input"
                    type="text" 
                    placeholder="New Folder Name"
                    onChange={e => this.updateFolderNameInComponentState(e.target.value)} />
                <button>
                    Add Folder
                </button>
            </form>
        );
    }
}