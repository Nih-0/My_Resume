import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FaLinkedin, FaGithub, FaWhatsapp, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then((result) => {
      setSubmitMessage('Message sent successfully!');
      form.current.reset();
    }, (error) => {
      setSubmitMessage('Failed to send message. Please try again.');
    })
    .finally(() => {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    });
  };

  return (
    <motion.div 
      className="contact-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="contact-content">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Get In <span className="highlight">Touch</span>
        </motion.h1>
        
        <div className="contact-wrapper">
          <motion.form
            ref={form}
            onSubmit={sendEmail}
            className="contact-form"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="form-group">
              <div className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input type="text" name="user_name" placeholder="Your Name" required />
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input type="email" name="user_email" placeholder="Your Email" required />
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1-2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
            </div>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </button>
            
            {submitMessage && (
              <motion.p 
                className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submitMessage}
              </motion.p>
            )}
          </motion.form>
          
          <motion.div
            className="contact-info"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3>Connect with me</h3>
            <p>Feel free to reach out for collaborations or just a friendly hello!</p>
            
            <div className="social-links">
              <a href="https://www.linkedin.com/in/nihal-yadav-" target="_blank" rel="noopener noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="https://github.com/Nih-0" target="_blank" rel="noopener noreferrer">
                <FaGithub /> GitHub 
              </a>
              <a href="https://wa.me/8088895784" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp /> WhatsApp
              </a>
              <a href="https://www.instagram.com/not_nihal_?igsh=MTc3aWl0ZXQwMmQ2aw==" target="_blank" rel="noopener noreferrer">
                <FaInstagram /> Instagram
              </a>
            </div>
            
            <div className="contact-details">
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                varunbb30@gmail.com
              </p>
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +91 8088895784
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
