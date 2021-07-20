import {Field, Form, Formik} from 'formik';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {Modal} from 'bootstrap';
import axios from 'axios';
import {sessionContext} from '../../contexts/session';
import {toastContext} from '../../contexts/toast';

/**
 * Component for displaying modal that allows uploading images
 * @param albumId ID of the album to add images to
 * @return React component
 */
export const LoginModal: React.VFC = () => {
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
      setModalVisible((prev) => !prev);
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

  const initialValues: {username: string; password: string} = {
    username: '',
    password: '',
  };

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
            <Formik
              initialValues={initialValues}
              onSubmit={async (values, actions) => {
                try {
                  await axios.post('/api/auth', values);
                  updateSession();
                  newToast({
                    title: 'Logga in',
                    message: 'Du är nu inloggad.',
                    type: 'success',
                  });
                  toggleModal();
                  actions.resetForm();
                } catch (error) {
                  console.error(error);
                  newToast({
                    title: 'Logga in',
                    message: `Det gick inte att logga in. Kontrollera att 
                      användaruppgifterna stämmer och försök igen.`,
                    type: 'danger',
                  });
                }
              }}
            >
              <Form>
                <div className="modal-body">
                  <label className="form-label" htmlFor="login-modal-username">
                    Användarnamn
                  </label>
                  <Field
                    className="form-control mb-3"
                    id="login-modal-username"
                    name="username"
                    type="text"
                    required
                  />
                  <label className="form-label" htmlFor="login-modal-password">
                    Lösenord
                  </label>
                  <Field
                    className="form-control"
                    id="login-modal-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Logga in
                  </button>
                  <button
                    className="btn btn-secondary"
                    id="login-modal-close-button"
                    type="button"
                    onClick={toggleModal}
                  >
                    Stäng
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};
