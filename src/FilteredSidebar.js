import React from 'react';
import './App.css';

function FilteredSidebar(props) {
    return (
      <div>
        <button onClick={props.onClickBack}>Go Back</button>
        <h3>{props.folderName}</h3>
      </div>
    );
}

export default FilteredSidebar;
