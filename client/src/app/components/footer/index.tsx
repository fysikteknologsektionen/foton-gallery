import {LoginButton} from './LoginButton';
import React from 'react';

/**
 * Component for rendering a page footer
 * @returns Footer component
 */
export const Footer: React.VFC = () => {
  return (
    // eslint-disable-next-line max-len
    <footer className="bg-light">
      <div className="container d-flex flex-column align-items-center pt-3">
        <span className="mb-3">
          <a
            className="link-secondary fs-1"
            href="https://www.facebook.com/FotonChalmers"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi-facebook" aria-label="Besök oss på facebook" />
          </a>
        </span>
        <span className="text-center">
          Denna sida är en del av{' '}
          <a
            className="link-secondary text-decoration-none"
            href="https://ftek.se"
            target="_blank"
            rel="noreferrer"
          >
            Fysikteknologsektionens webbplats
          </a>
          .
        </span>
        <span className="text-center">
          Vill du veta hur vi hanterar personuppgifter? Läs vår{' '}
          <a
            className="link-secondary text-decoration-none"
            href="https://ftek.se/integritetspolicy"
            target="_blank"
            rel="noreferrer"
          >
            integritetspolicy
          </a>
          .
        </span>
        <span className="text-center mb-3">
          Har du frågor om innehållet på sidan?{' '}
          <a
            className="link-secondary text-decoration-none"
            href="mailto:foton@ftek.se"
          >
            Kontakta Foton
          </a>
          .
        </span>
        <span>
          Utveckling:{' '}
          <a
            className="link-secondary text-decoration-none"
            href="https://github.com/eric-carlsson"
            target="_blank"
            rel="noreferrer"
          >
            Eric Carlsson
          </a>
        </span>
        <span className="mb-3">
          Underhåll:{' '}
          <a
            className="link-secondary text-decoration-none"
            href="https://ftek.se/spidera"
            target="_blank"
            rel="noreferrer"
          >
            Spidera
          </a>
        </span>
        <LoginButton className="link-secondary text-decoration-none mb-3" />
        <span className="mb-3">
          &copy; {new Date().getFullYear()} Fysikteknologsektionen
        </span>
      </div>
    </footer>
  );
};
