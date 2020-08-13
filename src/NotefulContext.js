import React from 'react';

const NotefulContext = React.createContext({
    allFolders: [],
    allNotes: [],
    deleteNote: () => {}
})

export default NotefulContext;