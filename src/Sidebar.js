import React from 'react';
import './App.css';

function Sidebar(props) {
  return (
    <aside className="sidebar">
        {props.children}
    </aside>
  );
}

export default Sidebar;
