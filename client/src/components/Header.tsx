import React, {useContext} from 'react';
import ftekLogo from '../img/ftek.svg';
import fotonLogo from '../img/foton.svg';
import {Link} from 'react-router-dom';
import {LoginModal} from '.';
import {userSessionContext} from '../contexts';
import axios from 'axios';

/**
 * Header component containing navigation
 * @return React component
 */
export function Header() {
  const {userSession, setUserSession} = useContext(userSessionContext);

  /**
   * Logs user out
   */
  async function logoutUser() {
    try {
      await axios.delete('/api/auth');
      setUserSession(undefined);
    } catch (error) {
      console.error(error);
    }
  }

  // Will be either a login or logout button depending on if there is an active user session
  const authButton = userSession ? (
    <button
      className="btn btn-outline-secondary"
      type="button"
      onClick={logoutUser}
    >
    Logga ut
    </button>
  ) : (
    <button
      className="btn btn-outline-secondary"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#login-modal"
    >
      Logga in
    </button>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="https://ftek.se/" target="_blank" rel="noreferrer">
          <img src={ftekLogo} height="50" alt="Fysikteknologsektionen" />
        </a>
        <Link className="navbar-brand" to="/">
          <img className="py-2" src={fotonLogo} height="50" alt="Foton" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="https://ftek.se/foton/" target="_blank" rel="noreferrer">Om Foton</a>
            </li>
          </ul>
          {authButton}
        </div>
      </div>
      <LoginModal />
    </nav>
  );
}
