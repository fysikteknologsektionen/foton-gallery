import {Link, NavLink} from 'react-router-dom';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {Collapse} from 'bootstrap';
import {LoginButton} from './LoginButton';
import fotonLogo from './assets/foton.svg';
import ftekLogo from './assets/ftek.svg';
import {sessionContext} from '../../contexts/session';

/**
 * Component for rendering a header
 * @returns Header component
 */
export const Header: React.VFC = () => {
  const {session} = useContext(sessionContext);
  const navCollapseRef = useRef<HTMLDivElement>(null);
  const [navCollapsed, setNavCollapsed] = useState(true);

  useEffect(() => {
    if (navCollapseRef.current) {
      new Collapse(navCollapseRef.current, {toggle: false});
    }
  }, [navCollapseRef]);

  /**
   * Toggles the nav collapse
   */
  function toggleNavCollapse() {
    if (navCollapseRef.current) {
      Collapse.getInstance(navCollapseRef.current)?.toggle();
      setNavCollapsed(() => !navCollapsed);
    }
  }

  return (
    <header>
      <nav
        className="navbar navbar-expand-md navbar-light bg-light"
        aria-label="Huvudnavigering"
      >
        <div className="container">
          <div>
            <a
              className="navbar-brand"
              href="https://ftek.se"
              target="_blank"
              rel="noreferrer"
            >
              <img src={ftekLogo} alt="Fysikteknologsektionen" height="50" />
            </a>
            <Link className="navbar-brand" to="/">
              <img src={fotonLogo} alt="Foton" height="40" />
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbar-nav-content"
            aria-expanded={navCollapsed ? 'false' : 'true'}
            aria-label="Visa/dölj navigation"
            onClick={toggleNavCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbar-nav-content"
            ref={navCollapseRef}
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://ftek.se/foton"
                  target="_blank"
                  rel="noreferrer"
                >
                  Om Foton
                </a>
              </li>
              {session && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/album/new"
                    activeClassName="active"
                  >
                    Nytt album
                  </NavLink>
                </li>
              )}
              {session?.role === 'admin' && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/users/new"
                    activeClassName="active"
                  >
                    Hantera användare
                  </NavLink>
                </li>
              )}
            </ul>
            <LoginButton />
          </div>
        </div>
      </nav>
    </header>
  );
};
