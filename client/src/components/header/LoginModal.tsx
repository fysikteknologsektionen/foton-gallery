import React, {FormEvent, useContext, useEffect, useRef, useState} from 'react';
import {sessionContext, toastContext} from '../../contexts';

import {Modal} from 'bootstrap';
import axios from 'axios';
import {useFormState} from '../../hooks';

/**
 * Component for displaying modal that allows uploading images
 * @param albumId ID of the album to add images to
 * @return React component
 */
export const LoginModal: React.VFC = () => {
  const {formState, handleFormChange, clearForm} = useFormState();
  const {session, updateSession} = useContext(sessionContext);
  const newToast = useContext(toastContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (modalRef.current) {
      new Modal(modalRef.current);
    }
  }, [modalRef]);

  /**
   * Toggles the modal
   */
  function toggleModal() {
    if (modalRef.current) {
      Modal.getInstance(modalRef.current)?.toggle();
      clearForm();
      setModalVisible((prev) => !prev);
    }
  }

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await axios.post('/api/auth', formState);
      updateSession();
      newToast({
        title: 'Logga in',
        message: 'Du är nu inloggad.',
        type: 'success',
      });
      toggleModal();
    } catch (error) {
      console.error(error);
      newToast({
        title: 'Logga in',
        message: `Det gick inte att logga in. Kontrollera att 
          användaruppgifterna stämmer och försök igen.`,
        type: 'danger',
      });
    }
  }

  /**
   * Logs user out
   */
  async function logout() {
    try {
      await axios.delete('/api/auth');
      updateSession();
      newToast({
        title: 'Logga ut',
        message: 'Du är nu utloggad.',
        type: 'success',
      });
    } catch (error) {
      console.error();
      newToast({
        title: 'Logga ut',
        message: 'Det gick inte att logga ut.',
        type: 'danger',
      });
    }
  }

  return (
    <>
      {session ? (
        <button
          className="btn btn-outline-secondary mt-1 mt-md-0"
          type="button"
          onClick={logout}
        >
          Logga ut
        </button>
      ) : (
        <button
          className="btn btn-outline-secondary mt-1 mt-md-0"
          type="button"
          onClick={toggleModal}
        >
          Logga in
        </button>
      )}
      <div
        className="modal fade"
        id="login-modal"
        aria-labelledby="login-modal-label"
        aria-hidden={modalVisible ? 'true' : 'false'}
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="login-modal-label">
                Logga in
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="login-modal-form-username-input"
                    type="text"
                    name="username"
                    placeholder="Användarnamn"
                    required
                    value={formState.username}
                    onChange={handleFormChange}
                  />
                  <label
                    className="form-label"
                    htmlFor="login-modal-form-username-input"
                  >
                    Användarnamn
                  </label>
                </div>
                <div className="form-floating">
                  <input
                    className="form-control"
                    id="login-modal-form-password-input"
                    type="password"
                    name="password"
                    placeholder="Lösenord"
                    required
                    value={formState.password}
                    onChange={handleFormChange}
                  />
                  <label
                    className="form-label"
                    htmlFor="login-modal-form-password-input"
                  >
                    Lösenord
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit">
                  Logga in
                </button>
                <button
                  className="btn btn-secondary"
                  id="upload-modal-close-button"
                  type="button"
                  onClick={toggleModal}
                >
                  Stäng
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
