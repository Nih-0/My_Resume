import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaHome, FaProjectDiagram, FaUser, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <motion.div 
        className="logo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="highlight">Nihal</span> Yadav
      </motion.div>
      
      <div className="nav-links">
        <Link to="/" className="nav-link"><FaHome /> Home</Link>
        <Link to="/projects" className="nav-link"><FaProjectDiagram /> Projects</Link>
        <Link to="/about" className="nav-link"><FaUser /> About</Link>
        <Link to="/contact" className="nav-link"><FaEnvelope /> Contact</Link>
      </div>
      
     
    </nav>
  );
};

export default Navbar;