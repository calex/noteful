import React from 'react';

const NotefulContext = React.createContext({
    allFolders: [],
    allNotes: [],
    addFolder: () => {},
    deleteNote: () => {}
})

export default NotefulContext;