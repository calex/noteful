import React from 'react';
import './App.css';

import PropTypes from 'prop-types';

export default function Main(props) {
  return (
    <main className="main-notes">
        {props.children}
    </main>
  );
}

Main.propTypes = {
  children: PropTypes.array
};

