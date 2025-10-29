import React, { useState } from 'react';
import '.Footer/Footer.css';

function Footer({ role = 'guest' }) {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <a href="#" className="logo">MiProyecto</a>
          <p className="footer-text">
            © {new Date().getFullYear()} MiProyecto — Todos los derechos reservados.
          </p>
        </div>

        <ul className="footer-links">
          <li><a href="#">Acerca de</a></li>
          <li><a href="#">Privacidad</a></li>
          <li><a href="#">Términos</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>

        {role === 'admin' && (
          <div className="footer-admin">
            <a href="#admin-panel" className="btn btn-admin">Panel de Administración</a>
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
