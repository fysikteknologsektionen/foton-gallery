import React from 'react';
import {useHistory} from 'react-router';

/**
 * Component for displaying a go back button operating on browser history
 * @param className className property to pass to button element
 * @return React component
 */
export function BackButton({className}: {className?: string}) {
  const history = useHistory();

  return (
    <button
      className={`btn btn-sm btn-outline-secondary ${className}`}
      onClick={() => history.goBack()}
    >
      <i className="bi-arrow-left"/>
      &nbsp;Tillbaka
    </button>
  );
}
