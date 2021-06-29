import React from 'react';
import {useHistory} from 'react-router';

/**
 * Component for displaying a go back button operating on browser history
 * @return React component
 */
export function GoBackButton({className}: {className?: string}) {
  const history = useHistory();

  return (
    <button
      className={`${className} btn btn-sm btn-outline-secondary`}
      onClick={() => history.goBack()}
    >
      <i className="bi-arrow-left"/>
      &nbsp;Tillbaka
    </button>
  );
}
