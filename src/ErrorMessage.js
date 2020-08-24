import React from 'react';

export default function ErrorMessage(props) {
  if (props.message) {
    return (
      <p id="error-message" className="error-message">{props.message}</p>
    );
  }

  return <></>
}