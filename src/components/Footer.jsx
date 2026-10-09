import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-brand">N<span>.</span>Y</div>
      <div className="footer-links">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <a href="mailto:varunbb30@gmail.com">Contact</a>
        <a href="https://github.com/Nih-0" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/nihal-yadav-/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://leetcode.com/u/nihal04_10/" target="_blank" rel="noopener noreferrer">LeetCode</a>
        <a href="https://nihalresume.vercel.app" target="_blank" rel="noopener noreferrer">Resume</a>
      </div>
      <div className="footer-copy">
        © 2025–2026 Nihal Yadav · Bangalore, Karnataka · Full Stack Engineer
      </div>
    </footer>
  );
};

export default Footer;
