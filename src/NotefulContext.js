import React from 'react';

const NotefulContext = React.createContext({
    allFolders: [],
    allNotes: [],
    addFolder: () => {},
    addNote: () => {},
    deleteNote: () => {}
})

export default NotefulContext;