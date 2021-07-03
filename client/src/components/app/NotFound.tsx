import {Alert} from '../common';
import React from 'react';

/**
 * View component for rendering a general 404 not found-message
 * @return React component
 */
export function NotFound() {
  return (
    <Alert
      type="warning"
      message="Sidan kunde inte hittas. Kontrollera sökvägen och försök igen."
      heading="Något gick fel"
      showBackButton
    />
  );
}
