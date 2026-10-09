import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Cursor = () => {
  const location = useLocation();

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    
    let mx = -100, my = -100;
    
    const moveCursor = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
      }
      setTimeout(() => {
        if (trail) {
          trail.style.left = mx + 'px';
          trail.style.top = my + 'px';
        }
      }, 60);
    };

    document.addEventListener('mousemove', moveCursor);

    const addHoverEffect = () => document.body.classList.add('hovering');
    const removeHoverEffect = () => document.body.classList.remove('hovering');

    const setupHoverElements = () => {
      const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .link-card, .upload-zone, input, textarea');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', addHoverEffect);
        el.addEventListener('mouseleave', removeHoverEffect);
      });
    };

    setupHoverElements();
    const timeoutId = setTimeout(setupHoverElements, 500);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .link-card, .upload-zone, input, textarea');
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverEffect);
        el.removeEventListener('mouseleave', removeHoverEffect);
      });
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return (
    <>
      <div className="cursor" id="cursor">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M3 2L21 9.5L12 13.5L8 22L3 2Z" 
            fill="var(--accent)" 
            stroke="var(--bg)" 
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="cursor-trail" id="cursorTrail">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M3 2L21 9.5L12 13.5L8 22L3 2Z" 
            stroke="var(--accent)" 
            strokeWidth="1.2" 
            fill="rgba(0, 255, 136, 0.1)"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

export default Cursor;
