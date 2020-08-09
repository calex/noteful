import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import Main from './Main.js';

import UnfilteredSidebar from './UnfilteredSidebar.js';
import FilteredSidebar from './FilteredSidebar.js';

import NoteList from './NoteList.js';
import Note from './Note.js';

import DUMMYSTORE from './DUMMYSTORE.js';

class App extends React.Component {
  state = {
    allFolders: DUMMYSTORE.folders,
    allNotes: DUMMYSTORE.notes
  }

  render() {

    return (
      <div className="app">
          <header>
            <h1>Noteful</h1>
          </header>
          <main className="app-main">
            <Sidebar>
              <Route
                exact path='/' 
                render={() =>
                  <UnfilteredSidebar folders={this.state.allFolders} />
                } />
              <Route 
                path='/folder/:folderId' 
                render={() =>
                  <UnfilteredSidebar folders={this.state.allFolders} />
                } />
              <Route 
                path='/note/:noteId' 
                render={(routeProps) => {
                  // this double lookup seems...surely there's a better way
                  const selectedNote = this.state.allNotes.find(note => note.id === routeProps.match.params.noteId);
                  const parentFolder = this.state.allFolders.find(f =>
                      f.id === selectedNote.folderId
                  );
                  return <FilteredSidebar
                    folderName={parentFolder.name}
                    onClickBack={() => routeProps.history.goBack()} />
                }} />
             </Sidebar>
            <Main>
              <Route 
                exact path='/' 
                render={() =>
                  <NoteList notes={this.state.allNotes} />
                } />
              <Route 
                path='/folder/:folderId' 
                render={(routeProps) =>
                  <NoteList notes={this.state.allNotes.filter(note => note.folderId === routeProps.match.params.folderId)}  />
                } />
              <Route 
                path='/note/:noteId' 
                render={(routeProps) => {
                  const selectedNote = this.state.allNotes.find(note => note.id === routeProps.match.params.noteId);
                  return <Note 
                    id={selectedNote.id}
                    name={selectedNote.name}
                    modified={selectedNote.modified}   
                    content={selectedNote.content}
                  />
                }} />
            </Main>
          </main>
      </div>
    );
  }
}

export default App;
