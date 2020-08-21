import React from 'react';
import './App.css';

import PropTypes from 'prop-types';

export default function Sidebar(props) {
  return (
    <aside className="sidebar">
        {props.children}
    </aside>
  );
}

Sidebar.propTypes = {
  children: PropTypes.array
};
