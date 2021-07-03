import {BackButton} from '.';
import React from 'react';

/**
 * Alert component for rendering an error message
 * (mainly from failed fetches or form submissions)
 * @param type Visual type property to pass to alert
 * @param message Message to display in alert
 * @param heading Heading to display in alert
 * @param showBackButton Whether to render a BackButton below the alert or not
 * @return React component
 */
export function Alert({type, message, heading, showBackButton = false}: {
  type: 'danger' | 'warning' | 'success',
  message: string,
  heading?: string,
  showBackButton?: boolean,
}) {
  return (
    <>
      <div
        className={`alert alert-${type}`}
        role="alert"
      >
        {heading && <div className="alert-heading h2">{heading}</div>}
        <span>{message}</span>
      </div>
      {showBackButton && <BackButton />}
    </>
  );
}
