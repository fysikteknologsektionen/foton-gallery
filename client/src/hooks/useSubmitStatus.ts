import {useState} from 'react';

/**
 * Enum for submit status.
 * PENDING - no active request/hasn't been sent yet
 * SUCCESS - request successful
 * ERROR - request error
 */
export enum SubmitStatus {
    PENDING,
    SUCCESS,
    ERROR,
}

/**
 * Hook or managing submit status for e.g. forms.
 * @returns Current status as a member of SubmitStatus and function to set state
 */
export function useSubmitStatus() {
  const [submitStatus, setSubmitStatus] = useState(SubmitStatus.PENDING);

  return {
    submitStatus,
    setSubmitStatus,
  };
}
