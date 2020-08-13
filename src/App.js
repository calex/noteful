import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import Main from './Main.js';

import UnfilteredSidebar from './UnfilteredSidebar.js';
import FilteredSidebar from './FilteredSidebar.js';

import NoteList from './NoteList.js';
import FullNotePage from './FullNotePage.js';

import NotefulContext from './NotefulContext.js';

class App extends React.Component {
  state = {
    allFolders: [],
    allNotes: []
  }

  deleteNoteFromState = noteId => {    
    this.setState({
      allNotes: this.state.allNotes.filter(note => note.id !== noteId)
    });
  };

  componentDidMount() {
    fetch(`http://localhost:9090/db`, {
      method: 'GET',
    })
    .then(res => {
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
      this.setState({
        allFolders: data.folders,
        allNotes: data.notes
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  render() {
    const contextValue = {
      allFolders: this.state.allFolders,
      allNotes: this.state.allNotes,
      deleteNote: this.deleteNoteFromState
    }

    return (
      <div className="app">
          <header>
            <h1>Noteful</h1>
          </header>
          <main className="app-main">
            <NotefulContext.Provider value={contextValue}>
              <Sidebar>
                <Route
                  exact path='/' 
                  component={UnfilteredSidebar} />
                <Route 
                  path='/folder/:folderId' 
                  component={UnfilteredSidebar} />
                <Route 
                  path='/note/:noteId' 
                  component={FilteredSidebar} />
              </Sidebar>
              <Main>
                <Route 
                  exact path='/' 
                  component={NoteList} />
                <Route 
                  path='/folder/:folderId' 
                  component={NoteList} />
                <Route 
                  path='/note/:noteId' 
                  component={FullNotePage} />
              </Main>
            </NotefulContext.Provider>
          </main>
      </div>
    );
  }
}

export default App;
