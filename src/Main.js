import React from 'react';
import './App.css';

function Main(props) {
  return (
    <main className="main-notes">
        {props.children}
    </main>
  );
}

export default Main;
