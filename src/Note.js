import React from 'react';
import './App.css';
import Moment from 'react-moment';

import { Link } from 'react-router-dom';

function Note(props) {

    const contentNode = (props.content) ? 
        <p>{props.content}</p> : null;
    
    return (
        <div className="note">
            <Link to={`/note/${props.id}`}>
                <h2>{props.name}</h2>
            </Link>
            <div>
                <p>Last modified: <Moment format="ddd DD MMM, YYYY">{props.modified}</Moment></p>
                <button>
                    Delete Note
                </button>
            </div>
            {contentNode}
        </div>
    );
}

export default Note;
