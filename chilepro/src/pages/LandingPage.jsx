// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importa el componente Link
import styles from './LandingPage.module.css';
import backgroundImage from '../assets/Home.png';

function LandingPage() {
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Chile Pro</h1>
        <p className={styles.subtitle}>Resuelve tu necesidad sin preocuparte de estafas</p>
        <div className={styles.buttons}>
          {/* Usamos Link para la navegación */}
          <Link to="/signup" className={styles.buttonLink}>
            <button className={styles.searchTalent}>BUSCA TALENTO</button>
          </Link>
          <Link to="/talent/signup" className={styles.buttonLink}>
            <button className={styles.beTalent}>SOY TALENTO</button>
          </Link>
        </div>
        <Link to="/login" className={styles.loginButton}>INICIAR SESION</Link>
      </div>
    </div>
  );
}

export default LandingPage;