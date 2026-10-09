import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch dynamic CV URL
    fetch(`${API_BASE}/api/data`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data?.profile?.cvUrl) {
          setCvUrl(data.profile.cvUrl);
        }
      })
      .catch(err => console.error('Navbar CV fetch error:', err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadCv = (e) => {
    e.preventDefault();
    if (cvUrl) {
      const finalUrl = cvUrl.startsWith('http') ? cvUrl : `${API_BASE}${cvUrl}`;
      const link = document.createElement('a');
      link.href = finalUrl;
      link.setAttribute('download', 'Nihal_Yadav_CV.pdf');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open('https://nihalresume.vercel.app', '_blank', 'noopener,noreferrer');
    }
  };

  const handleScrollTo = (e, hash) => {
    e.preventDefault();
    if (location.pathname !== '/home') {
      navigate('/home' + hash);
    } else {
      navigate(hash);
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentPath = location.pathname;
  const currentHash = location.hash;

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <NavLink to="/" className="nav-logo">N<span>.</span>Y</NavLink>
      <ul className="nav-links">
        <li>
          <NavLink 
            to="/home" 
            className={() => currentPath === '/home' && !currentHash ? 'active' : ''}
            onClick={() => { if(currentPath === '/home') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about" 
            className={() => currentPath === '/about' ? 'active' : ''}
          >
            About
          </NavLink>
        </li>
        <li>
          <a 
            href="#skills" 
            className={currentHash === '#skills' ? 'active' : ''}
            onClick={(e) => handleScrollTo(e, '#skills')}
          >
            Skills
          </a>
        </li>
        <li>
          <a 
            href="#experience" 
            className={currentHash === '#experience' ? 'active' : ''}
            onClick={(e) => handleScrollTo(e, '#experience')}
          >
            Experience
          </a>
        </li>
        <li>
          <a 
            href="#projects" 
            className={currentHash === '#projects' ? 'active' : ''}
            onClick={(e) => handleScrollTo(e, '#projects')}
          >
            Projects
          </a>
        </li>
      </ul>
      <div className="nav-right">
        <button 
          className="btn-download-cv" 
          onClick={handleDownloadCv}
          title="Download CV (Resume)"
          aria-label="Download CV"
        >
          <Download size={13} className="cv-icon" />
          <span>Download CV</span>
        </button>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
