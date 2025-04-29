import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import '../styles/Home.css';

const Home = () => {
  return (
    <motion.div 
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="home-content">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Hi, I'm <span className="highlight">Nihal Yadav</span>
        </motion.h1>
        
        <motion.div
          className="typewriter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Typewriter
            options={{
              strings: [
                'Full Stack Developer',
                'Java Enthusiast', 
                'Problem Solver',
                'Tech Explorer'
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 30,
            }}
          />
        </motion.div>
        
        <motion.div
          className="home-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <a href="/Contact" className="btn primary">Contact Me</a>
          <a href="/assets/Resume.pdf" download className="btn secondary">Download Resume</a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;