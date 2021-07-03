import {FormEvent, useState} from 'react';

/**
 * Hook for managing the state of a form
 * @param initialState Value to set as initial state
 * @returns Form state, function to set individual state values and function
 * to reset form
 */
export function useFormState(initialState: Record<string, string> = {}) {
  const [state, setState] = useState(initialState);

  // Proxy to set default value of state properties to ''
  const stateProxy = new Proxy(state, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return prop in target ? target[prop] : '';
      }
    },
  });

  /**
   * Sets an individual state value
   * @param event FormEvent  passed by onChange
   */
  function setFormValue(
      event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  return {
    formState: stateProxy,
    setFormValue,
    reset: () => setState({}),
  };
}
