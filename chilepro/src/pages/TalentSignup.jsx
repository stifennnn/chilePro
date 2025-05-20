import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './TalentSignup.module.css';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

const sectionsConfig = [
  { id: 'personalInfo', title: 'Información Personal', fields: ['name', 'email', 'password', 'confirmPassword'] },
  { id: 'professionalProfile', title: 'Perfil Profesional', fields: ['profession', 'headline', 'skills', 'portfolioUrl', 'cvFile'] },
  { id: 'experience', title: 'Experiencia Laboral' },
  { id: 'education', title: 'Educación' },
  { id: 'projects', title: 'Proyectos Personales' },
];

function TalentSignup() {
  const [openSection, setOpenSection] = useState('personalInfo');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    headline: '',
    skills: '',
    portfolioUrl: '',
    cvFile: null,
    experience: [{ company: '', title: '', years: '', description: '' }],
    education: [{ institution: '', degree: '', years: '' }],
    projects: [{ title: '', description: '', videoUrl: '' }],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());
  const navigate = useNavigate();

  const validateField = (name, value, sectionId) => {
    const newErrors = { ...errors };
    if (sectionId === 'personalInfo') {
      if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = 'Correo electrónico inválido';
      } else if (name === 'password' && value.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (name === 'confirmPassword' && value !== formData.password) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      } else if (['name', 'email', 'password', 'confirmPassword'].includes(name) && !value) {
        newErrors[name] = 'Este campo es obligatorio';
      } else {
        delete newErrors[name];
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event, sectionId, index, field) => {
    const { name, value, type, files } = event.target;
    setFormData(prevData => {
      let updatedData;
      if (sectionId === 'experience') {
        const updatedExperience = [...prevData.experience];
        updatedExperience[index][field] = value;
        updatedData = { ...prevData, experience: updatedExperience };
      } else if (sectionId === 'education') {
        const updatedEducation = [...prevData.education];
        updatedEducation[index][field] = value;
        updatedData = { ...prevData, education: updatedEducation };
      } else if (sectionId === 'projects') {
        const updatedProjects = [...prevData.projects];
        updatedProjects[index][field] = value;
        updatedData = { ...prevData, projects: updatedProjects };
      } else if (type === 'file' && field === 'cvFile') {
        updatedData = { ...prevData, [field]: files[0] };
      } else {
        updatedData = { ...prevData, [name]: value };
      }
      return updatedData;
    });
    if (sectionId === 'personalInfo') {
      validateField(name, value, sectionId);
    }
  };

  const handleAddSection = (sectionId) => {
    setFormData(prevData => {
      if (sectionId === 'experience') {
        return { ...prevData, experience: [...prevData.experience, { company: '', title: '', years: '', description: '' }] };
      } else if (sectionId === 'education') {
        return { ...prevData, education: [...prevData.education, { institution: '', degree: '', years: '' }] };
      } else if (sectionId === 'projects') {
        return { ...prevData, projects: [...prevData.projects, { title: '', description: '', videoUrl: '' }] };
      }
      return prevData;
    });
  };

  const handleRemoveSection = (sectionId, index) => {
    setFormData(prevData => {
      if (sectionId === 'experience' && prevData.experience.length > 1) {
        const updatedExperience = [...prevData.experience];
        updatedExperience.splice(index, 1);
        return { ...prevData, experience: updatedExperience };
      } else if (sectionId === 'education' && prevData.education.length > 1) {
        const updatedEducation = [...prevData.education];
        updatedEducation.splice(index, 1);
        return { ...prevData, education: updatedEducation };
      } else if (sectionId === 'projects' && prevData.projects.length > 1) {
        const updatedProjects = [...prevData.projects];
        updatedProjects.splice(index, 1);
        return { ...prevData, projects: updatedProjects };
      }
      return prevData;
    });
  };

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const talentProfileRef = doc(collection(db, 'talentProfiles'), user.uid);
      await setDoc(talentProfileRef, {
        name: formData.name,
        email: formData.email,
        profession: formData.profession,
        headline: formData.headline,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        experience: formData.experience,
        education: formData.education,
        portfolioUrl: formData.portfolioUrl,
        projects: formData.projects,
        uid: user.uid,
      });

      console.log('Perfil de talento registrado con éxito:', user.uid);
      setIsSubmitting(false);
      navigate('/');
    } catch (error) {
      console.error('Error al registrar el perfil de talento:', error.message);
      setErrors({ auth: error.message });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const newCompletedSections = new Set();
    sectionsConfig.forEach(section => {
      if (section.id === 'personalInfo' && formData.name && formData.email && formData.password && formData.confirmPassword && !errors.email && !errors.password && !errors.confirmPassword) {
        newCompletedSections.add(section.id);
      } else if (section.id === 'professionalProfile' && formData.profession && formData.headline && formData.skills) {
        newCompletedSections.add(section.id);
      } else if (section.id === 'experience' && formData.experience.every(exp => exp.company && exp.title)) {
        newCompletedSections.add(section.id);
      } else if (section.id === 'education' && formData.education.every(edu => edu.institution && edu.degree)) {
        newCompletedSections.add(section.id);
      } else if (section.id === 'projects' && formData.projects.every(proj => proj.title && proj.description)) {
        newCompletedSections.add(section.id);
      }
    });
    setCompletedSections(newCompletedSections);
  }, [formData, errors]);

  const progress = (completedSections.size / sectionsConfig.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Crea tu Perfil de Talento</h2>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
        {errors.auth && <p className={styles.error}>{errors.auth}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          {sectionsConfig.map((section) => (
            <div key={section.id} className={styles.section}>
              <h3
                className={styles.sectionTitle}
                onClick={() => toggleSection(section.id)}
                role="button"
                aria-expanded={openSection === section.id}
                aria-controls={`section-${section.id}`}
              >
                {section.title}
                <span className={`${styles.arrow} ${openSection === section.id ? styles.arrowUp : styles.arrowDown}`}>
                  ▼
                </span>
              </h3>
              {openSection === section.id && (
                <div id={`section-${section.id}`} className={styles.sectionContent}>
                  {section.id === 'personalInfo' && (
                    <div className={styles.grid}>
                      {section.fields.map(field => (
                        <div key={field} className={styles.gridItem}>
                          <label htmlFor={field} className={styles.label}>
                            {field === 'name' ? 'Nombre Completo' : field === 'email' ? 'Correo Electrónico' : field === 'password' ? 'Contraseña' : 'Confirmar Contraseña'}
                          </label>
                          <input
                            type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                            id={field}
                            name={field}
                            className={`${styles.input} ${errors[field] ? styles.inputError : ''}`}
                            value={formData[field]}
                            onChange={(e) => handleInputChange(e, section.id, null, field)}
                            required={!field.includes('password')}
                            aria-invalid={!!errors[field]}
                            aria-describedby={errors[field] ? `${field}-error` : null}
                          />
                          {errors[field] && (
                            <p id={`${field}-error`} className={styles.error}>{errors[field]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === 'professionalProfile' && (
                    <div className={styles.grid}>
                      {section.fields.map(field => (
                        <div key={field} className={styles.gridItemFull}>
                          <label htmlFor={field} className={styles.label}>
                            {field === 'profession' ? 'Profesión' : field === 'headline' ? 'Titular Profesional' : field === 'skills' ? 'Habilidades (separadas por comas)' : field === 'portfolioUrl' ? 'URL del Portfolio (opcional)' : 'Cargar CV (opcional)'}
                          </label>
                          {field === 'skills' ? (
                            <textarea
                              id={field}
                              name={field}
                              className={styles.textarea}
                              value={formData[field]}
                              onChange={(e) => handleInputChange(e, section.id, null, field)}
                              rows="4"
                            />
                          ) : field === 'cvFile' ? (
                            <input
                              type="file"
                              id={field}
                              name={field}
                              className={styles.fileInput}
                              onChange={(e) => handleInputChange(e, section.id, null, field)}
                            />
                          ) : (
                            <input
                              type={field === 'portfolioUrl' ? 'url' : 'text'}
                              id={field}
                              name={field}
                              className={styles.input}
                              value={formData[field]}
                              onChange={(e) => handleInputChange(e, section.id, null, field)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === 'experience' && (
                    <div>
                      {formData.experience.map((exp, index) => (
                        <div key={index} className={styles.nestedSection}>
                          <h4 className={styles.nestedTitle}>Experiencia {index + 1}</h4>
                          <div className={styles.grid}>
                            {['company', 'title', 'years', 'description'].map(field => (
                              <div key={field} className={field === 'description' ? styles.gridItemFull : styles.gridItem}>
                                <label htmlFor={`${field}-${index}`} className={styles.label}>
                                  {field === 'company' ? 'Empresa' : field === 'title' ? 'Título' : field === 'years' ? 'Años' : 'Descripción'}
                                </label>
                                {field === 'description' ? (
                                  <textarea
                                    id={`${field}-${index}`}
                                    className={styles.textarea}
                                    value={exp[field]}
                                    onChange={(e) => handleInputChange(e, section.id, index, field)}
                                    rows="4"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    id={`${field}-${index}`}
                                    className={styles.input}
                                    value={exp[field]}
                                    onChange={(e) => handleInputChange(e, section.id, index, field)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          {formData.experience.length > 1 && (
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => handleRemoveSection(section.id, index)}
                            >
                              Eliminar Experiencia
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => handleAddSection(section.id)}
                      >
                        Añadir Experiencia
                      </button>
                    </div>
                  )}

                  {section.id === 'education' && (
                    <div>
                      {formData.education.map((edu, index) => (
                        <div key={index} className={styles.nestedSection}>
                          <h4 className={styles.nestedTitle}>Educación {index + 1}</h4>
                          <div className={styles.grid}>
                            {['institution', 'degree', 'years'].map(field => (
                              <div key={field} className={styles.gridItem}>
                                <label htmlFor={`${field}-${index}`} className={styles.label}>
                                  {field === 'institution' ? 'Institución' : field === 'degree' ? 'Título Obtenido' : 'Años'}
                                </label>
                                <input
                                  type="text"
                                  id={`${field}-${index}`}
                                  className={styles.input}
                                  value={edu[field]}
                                  onChange={(e) => handleInputChange(e, section.id, index, field)}
                                />
                              </div>
                            ))}
                          </div>
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => handleRemoveSection(section.id, index)}
                            >
                              Eliminar Educación
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => handleAddSection(section.id)}
                      >
                        Añadir Educación
                      </button>
                    </div>
                  )}

                  {section.id === 'projects' && (
                    <div>
                      {formData.projects.map((project, index) => (
                        <div key={index} className={styles.nestedSection}>
                          <h4 className={styles.nestedTitle}>Proyecto {index + 1}</h4>
                          <div className={styles.grid}>
                            {['title', 'description', 'videoUrl'].map(field => (
                              <div key={field} className={styles.gridItemFull}>
                                <label htmlFor={`${field}-${index}`} className={styles.label}>
                                  {field === 'title' ? 'Título del Proyecto' : field === 'description' ? 'Descripción del Proyecto' : 'URL del Video del Proyecto'}
                                </label>
                                {field === 'description' ? (
                                  <textarea
                                    id={`${field}-${index}`}
                                    className={styles.textarea}
                                    value={project[field]}
                                    onChange={(e) => handleInputChange(e, section.id, index, field)}
                                    rows="4"
                                  />
                                ) : (
                                  <input
                                    type={field === 'videoUrl' ? 'url' : 'text'}
                                    id={`${field}-${index}`}
                                    className={styles.input}
                                    value={project[field]}
                                    onChange={(e) => handleInputChange(e, section.id, index, field)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          {formData.projects.length > 1 && (
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => handleRemoveSection(section.id, index)}
                            >
                              Eliminar Proyecto
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => handleAddSection(section.id)}
                      >
                        Añadir Proyecto
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Registrarse como Talento'}
          </button>
        </form>
        <p className={styles.footerText}>
          ¿Ya tienes una cuenta? <Link to="/login" className={styles.link}>Inicia sesión aquí</Link>
        </p>
        <Link to="/" className={styles.backLink}>Volver a la página principal</Link>
      </div>
    </div>
  );
}

export default TalentSignup;
