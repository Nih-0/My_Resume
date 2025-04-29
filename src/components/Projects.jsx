import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import '../styles/Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'CVXPERT',
      description: 'CVXpert is a Java Servlet-based application that automates resume analysis by extracting technical skills using NLP and calculating their percentage distribution. It includes user authentication, a user-friendly frontend, and secure session management. The tool helps recruiters streamline the recruitment process by quickly identifying top candidates based on skill analysis.',
      technologies: ['Java', 'Servlets', 'MYSQL', 'OpenNLP'],
      githubUrl: 'https://github.com/Nih-0/CvXpert',
      imageUrl: '/assets/cvxpert.png'
    },
    {
        title: 'E-Commerce Backend',
        description: 'E-Commerce Backend is a scalable Spring Boot REST API that handles core functionalities for an online shopping platform, including product CRUD operations, multipart image uploads, and keyword-based product search. It is designed for seamless integration with frontend or mobile applications and supports secure, efficient product management',
        technologies: ['Java', 'Spring Boot', 'RESTful API', 'Spring Data JPA', 'Maven'],
        githubUrl: 'https://github.com/Nih-0/E_Commerce_Backend',
        imageUrl: '/assets/ecommerce.png'
      },
    {
      title: 'Backend Security System',
        description: 'This project is a backend application focused on user authentication and security. It leverages Spring Boot and Spring Security to handle user registration and login with encrypted passwords stored in a MySQL database. The application implements JWT (JSON Web Token) for token-based authentication, ensuring secure access to APIs. It supports CRUD operations on protected endpoints and uses BCrypt for password encoding. The project also includes robust exception handling and response management for a secure and efficient user authentication process.',
      technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT (JSON Web Token)', 'BCrypt',  'MySQL', 'Maven'],
      githubUrl: 'https://github.com/Nih-0/Backend_security',
      imageUrl: '/assets/security.png'
    }
    
  ];

  return (
    <motion.div 
      className="projects-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="projects-content">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          My <span className="highlight">Projects</span>
        </motion.h1>
        
        <motion.p
          className="projects-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Here are some of my recent projects. Each one represents a unique challenge and learning opportunity.
        </motion.p>
        
        <motion.div 
          className="projects-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {projects.map((project, index) => (
            <ProjectCard 
              key={index}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              githubUrl={project.githubUrl}
              imageUrl={project.imageUrl}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Projects;
