import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css'; // Usaremos el mismo archivo de estilos
import { useState } from 'react'; // Importamos useState para el ejemplo de selección de rol

function Signup() {
  const [userType, setUserType] = useState('talent'); // Estado para controlar el tipo de usuario (por defecto 'talent')

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Regístrate</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Nombre</label>
            <input type="text" id="name" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
            <input type="email" id="email" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input type="password" id="password" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="userType" className={styles.label}>¿Eres?</label>
            <select id="userType" className={styles.select} value={userType} onChange={handleUserTypeChange}>
              <option value="talent">Talento</option>
              <option value="seeker">Buscador</option>
            </select>
          </div>
          <button type="submit" className={styles.button}>Registrarse</button>
        </form>
        <p className={styles.loginLink}>
          ¿Ya tienes una cuenta? <Link to="/login" className={styles.link}>Inicia sesión aquí</Link>
        </p>
        <Link to="/" className={styles.backLink}>Volver a la página principal</Link>
      </div>
    </div>
  );
}

export default Signup;