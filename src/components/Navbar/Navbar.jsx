import React, { useState } from 'react';
import '.Navbar/navbar.css';


function Navbar({ role = 'guest' }) {
const [open, setOpen] = useState(false);


return (
<header>
<nav className="navbar" aria-label="Navegación principal">
<div className="brand">
<a href="#" className="logo">Sprint Flow</a>


<button
className={`nav-toggle ${open ? 'is-open' : ''}`}
aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
aria-expanded={open}
aria-controls="primary-nav"
onClick={() => setOpen(!open)}
>
<span className="hamburger" aria-hidden="true"><span /></span>
</button>
</div>


<ul id="primary-nav" className={`nav-links ${open ? 'open' : ''}`}>
<li><a href="#">Inicio</a></li>
<li><a href="#">Características</a></li>
<li><a href="#">Precios</a></li>
<li><a href="#">Contacto</a></li>
</ul>


<div className="nav-actions">
{role === 'guest' && (
<div className="actions-guest">
<a className="btn btn-outline" href="#login">Login</a>
<a className="btn btn-primary" href="#register">Register</a>
</div>
)}


{role === 'user' && (
<div className="actions-user">
<a className="btn" href="#dashboard">Mi cuenta</a>
<div className="avatar" title="Usuario">U</div>
</div>
)}


{role === 'admin' && (
<div className="actions-admin">
<a className="btn btn-admin" href="#admin-panel">Panel Admin</a>
<a className="btn" href="#dashboard">Mi cuenta</a>
<div className="avatar admin" title="Administrador">A</div>
</div>
)}
</div>
</nav>


<main className="container">
<h1>Navbar con roles (Invitado / Usuario / Administrador)</h1>
<p>Este ejemplo separa el JSX y el CSS. Para la demo en tu app, controla el `role` desde tu estado/Context o backend.</p>


<section className="cards">
<article className="card">
<h2>Invitado</h2>
<p>Verá los botones <strong>Login</strong> y <strong>Register</strong>.</p>
</article>
<article className="card">
<h2>Usuario</h2>
<p>Verá enlace a su <strong>Mi cuenta</strong> y un avatar.</p>
</article>
<article className="card">
<h2>Administrador</h2>
<p>Verá además el botón <strong>Panel Admin</strong> para gestiones extra.</p>
</article>
</section>
</main>
</header>
);
}


export default Navbar;