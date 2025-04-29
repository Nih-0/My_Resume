import { motion } from 'framer-motion';
import '../styles/About.css';

const About = () => {
  const skills = [
    { name: 'Java', level: 88 },
    { name: 'SpringBoot', level: 85 },
    { name: 'Backend Development', level: 87 },
    { name: 'HTML', level: 80 },
    { name: 'CSS', level: 70 },
    { name: 'DBMS', level: 80 },
    { name: 'React', level: 65, note: 'Learning' },
    { name: 'Docker', level: 60, note: 'Learning' },
    
  ];

  return (
    <motion.div 
      className="about-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="about-content">
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          About <span className="highlight">Me</span>
        </motion.h1>
        
        <motion.div
          className="about-bio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <p>
            I'm <span className="highlight">Nihal Yadav</span>, a passionate Full Stack Developer with expertise in Java and modern web technologies. 
            I specialize in building robust backend systems while also crafting intuitive user interfaces.
          </p>
          <p>
            With a strong foundation in computer applications principles and hands-on experience with technologies like Java , Spring Boot, 
            React, and database management systems,  I create efficient and scalable solutions to complex problems.
          </p>
          <p>
            My approach combines technical excellence with creative problem-solving, always focusing on delivering 
            high-quality, maintainable code that meets user needs.
          </p>
        </motion.div>
        
        <motion.div
          className="skills-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <h2>My <span className="highlight">Skills</span></h2>
          
          <div className="skills-container">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-info">
                  <span>{skill.name}</span>
                  {skill.note && <span className="skill-note">{skill.note}</span>}
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-level"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 1 }}
                  />
                </div>
                <div className="skill-percent">{skill.level}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;