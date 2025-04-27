import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css'; // Usaremos un archivo de estilos común para Login y Signup

function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
            <input type="email" id="email" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input type="password" id="password" className={styles.input} />
          </div>
          <button type="submit" className={styles.button}>Iniciar Sesión</button>
        </form>
        <p className={styles.signupLink}>
          ¿No tienes una cuenta? <Link to="/signup" className={styles.link}>Regístrate aquí</Link>
        </p>
        <Link to="/" className={styles.backLink}>Volver a la página principal</Link>
      </div>
    </div>
  );
}

export default Login;