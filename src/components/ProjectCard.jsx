import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import '../styles/Projects.css';

const ProjectCard = ({ title, description, technologies, githubUrl, imageUrl, index }) => {
  return (
    <motion.div 
      className="project-card"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.2 + 0.8, duration: 0.8 }}
      whileHover={{ y: -10 }}
    >
      <div className="project-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="project-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="technologies">
          {technologies.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
        <a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github-link"
        >
          <FaGithub /> View on GitHub
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
