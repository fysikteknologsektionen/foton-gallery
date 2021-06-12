import ftekLogo from '../img/ftek.svg';
import fotonLogo from '../img/foton.svg';
import { Link } from 'react-router-dom';

export function Header () {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="https://ftek.se/">
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
              <a className="nav-link" href="https://ftek.se/foton/">Om Foton</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Logga in</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}