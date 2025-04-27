import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>¡Bienvenido a Chile Pro!</h2>
      <p className={styles.description}>
        Esta es una página de inicio de plantilla. Aquí eventualmente se mostrarán las ofertas de trabajo y otras funcionalidades.
      </p>
      <div className={styles.navigation}>
        <Link to="/profile" className={styles.link}>Ver Perfil</Link> {/* Placeholder */}
        <button className={styles.logoutButton}>Cerrar Sesión</button> {/* Placeholder */}
      </div>
    </div>
  );
}

export default Home;