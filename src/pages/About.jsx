import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { SiLeetcode } from 'react-icons/si';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { Globe, Mail, Award, BookOpen, Terminal, Sparkles } from 'lucide-react';

const About = () => {
  const [dynamicData, setDynamicData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    // Fetch dynamic profile data
    fetch('http://localhost:5000/api/data', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setDynamicData(data))
      .catch(err => console.error('Failed to fetch data', err));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('#termWin, #eduCard, .reveal-card, #lc1, #lc2, #lc3, #lc4, #lc5').forEach(el => observer.observe(el));
    ['lc1','lc2','lc3','lc4','lc5'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.style.transitionDelay = (i * 0.1) + 's';
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!dynamicData?.profile?.photos || dynamicData.profile.photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % dynamicData.profile.photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [dynamicData]);

  const photos = dynamicData?.profile?.photos?.length > 0 
    ? dynamicData.profile.photos 
    : [{url: `/profile.jpg?t=${new Date().getTime()}`}];

  const profileData = dynamicData?.profile || {
    name: "Nihal Yadav",
    role: "Full Stack Developer & Automation Engineer",
    location: "Bangalore, Karnataka 🇮🇳",
    phone: "+91-8088895784",
    bio: "Full Stack Engineer who architected and scaled 360Airo, a production email outreach and marketing platform serving 50+ clients.\n\nExperienced in building backend systems, REST/GraphQL APIs, and distributed automation using Spring Boot, Python, SQL and React — with a focus on reliability, deliverability, secure coding, and validation of LLM-generated outputs. Comfortable owning a product from infrastructure design to production scale in agile teams.",
    email: "varunbb30@gmail.com",
    github: "https://github.com/Nih-0",
    linkedin: "https://www.linkedin.com/in/nihal-yadav-/",
    leetcode: "https://leetcode.com/u/nihal04_10/",
    portfolio: "https://nihalresume.vercel.app"
  };

  const aboutStyles = `
    .about-hero { padding: calc(var(--nav-h) + 80px) 80px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; position: relative; overflow: hidden; min-height: 80vh; }
    .about-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 50% 60% at 80% 30%, rgba(0,255,136,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 10% 70%, rgba(124,58,237,0.08) 0%, transparent 60%); }
    .about-left { position: relative; z-index: 1; padding-top: 40px; }
    .breadcrumb { display: flex; align-items: center; gap: 12px; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg2); margin-bottom: 40px; opacity: 0; animation: fadeUp 0.7s 0.2s forwards; }
    .breadcrumb a { color: var(--accent); text-decoration: none; cursor: none; }
    .breadcrumb .sep { color: var(--dim); }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    .about-title { font-family: var(--sans); font-size: clamp(3rem, 6vw, 6rem); font-weight: 800; letter-spacing: -4px; line-height: 0.95; margin-bottom: 40px; opacity: 0; animation: fadeUp 0.8s 0.3s forwards; }
    .about-title .highlight { display: block; background: linear-gradient(90deg, var(--accent), var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .about-bio { font-size: 0.8rem; line-height: 1.9; color: var(--fg2); margin-bottom: 40px; opacity: 0; animation: fadeUp 0.8s 0.5s forwards; }
    .quick-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); margin-bottom: 40px; opacity: 0; animation: fadeUp 0.8s 0.7s forwards; }
    .fact { background: var(--bg); padding: 20px 24px; }
    [data-theme="light"] .fact { background: var(--bg2); }
    .fact-label { font-size: 0.58rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--dim); margin-bottom: 6px; }
    .fact-value { font-size: 0.78rem; color: var(--fg); }
    .fact-value .dot { color: var(--accent); margin-right: 4px; }
    
    .about-right { position: relative; z-index: 1; padding-top: 40px; opacity: 0; animation: fadeUp 0.9s 0.4s forwards; }
    .photo-container { position: relative; width: 100%; aspect-ratio: 3/4; max-height: 580px; }
    .photo-frame { position: absolute; inset: 0; border: 1px solid var(--border); pointer-events: none; z-index: 2; }
    .photo-frame::before { content: ''; position: absolute; top: -8px; left: -8px; right: -8px; bottom: -8px; border: 1px solid rgba(0,255,136,0.15); pointer-events: none; }
    .photo-frame::after { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 60px; border-top: 2px solid var(--accent); border-left: 2px solid var(--accent); }
    .photo-frame-br { position: absolute; bottom: -8px; right: -8px; width: 60px; height: 60px; border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent); z-index: 3; }
    .photo-corner { position: absolute; font-size: 0.55rem; letter-spacing: 0.1em; color: var(--accent); z-index: 4; pointer-events: none; }
    .photo-corner.tl { top: 12px; left: 12px; }
    .photo-corner.br { bottom: 12px; right: 12px; }
    .photo-preview { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 1; filter: grayscale(10%) contrast(1.05); transition: filter 0.4s, opacity 0.8s ease-in-out; }
    .photo-preview:hover { filter: grayscale(0%) contrast(1); }
    .photo-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(10,10,15,0.9)); padding: 24px; z-index: 3; }
    .photo-overlay-text { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); }
    .photo-glow { position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(0,255,136,0.12), transparent 70%); filter: blur(40px); z-index: 0; animation: glowPulse 4s ease-in-out infinite; }
    @keyframes glowPulse { 0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } }
    
    .terminal-section { padding: 100px 80px; background: var(--bg2); }
    .terminal-window { border: 1px solid var(--border); background: #070710; overflow: hidden; position: relative; opacity: 0; transform: translateY(30px); transition: all 0.7s; }
    [data-theme="light"] .terminal-window { background: #1a1a2e; }
    .terminal-window.visible { opacity: 1; transform: translateY(0); }
    .terminal-bar { background: rgba(255,255,255,0.05); padding: 12px 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
    .t-dot { width: 10px; height: 10px; border-radius: 50%; }
    .t-dot:nth-child(1) { background: #ff5f57; }
    .t-dot:nth-child(2) { background: #febc2e; }
    .t-dot:nth-child(3) { background: #28c840; }
    .t-title { font-size: 0.65rem; color: var(--fg2); letter-spacing: 0.1em; margin-left: 8px; }
    .terminal-body { padding: 32px; font-size: 0.72rem; line-height: 1.8; color: #c0c0d0; }
    .t-prompt { color: var(--accent); }
    .t-key { color: #a78bfa; }
    .t-val { color: #fb923c; }
    .t-str { color: var(--accent); }
    .t-comment { color: #444466; }
    .t-line { display: block; margin-bottom: 4px; }
    .t-cursor { display: inline-block; width: 8px; height: 14px; background: var(--accent); vertical-align: middle; animation: blink 1s step-end infinite; margin-left: 2px; }
    @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
    
    .edu-section { padding: 80px 80px; background: var(--bg); }
    .edu-card { border: 1px solid var(--border); padding: 40px; display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: center; position: relative; overflow: hidden; opacity: 0; transform: translateY(30px); transition: all 0.7s; }
    .edu-card.visible { opacity: 1; transform: translateY(0); }
    .edu-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, var(--accent), var(--accent3)); }
    .edu-degree { font-family: var(--sans); font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px; }
    .edu-school { font-size: 0.75rem; color: var(--fg2); margin-bottom: 16px; }
    .edu-meta { display: flex; gap: 16px; flex-wrap: wrap; }
    .edu-pill { font-size: 0.6rem; padding: 5px 14px; border: 1px solid var(--border); color: var(--fg2); letter-spacing: 0.1em; }
    
    .reveal-card { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.23,1,0.32,1); }
    .reveal-card.visible { opacity: 1; transform: translateY(0); }

    .links-section { padding: 80px; background: var(--bg2); display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .link-card { border: 1px solid var(--border); padding: 28px; text-decoration: none; color: var(--fg); position: relative; overflow: hidden; opacity: 0; transform: translateY(20px); transition: opacity 0.6s, transform 0.6s, border-color 0.3s; cursor: none; }
    .link-card.visible { opacity: 1; transform: translateY(0); }
    .link-card:hover { border-color: var(--accent); }
    .link-card::after { content: '↗'; position: absolute; top: 16px; right: 20px; color: var(--dim); transition: color 0.3s, transform 0.3s; }
    .link-card:hover::after { color: var(--accent); transform: translate(3px, -3px); }
    .link-platform { font-size: 0.6rem; color: var(--dim); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px; }
    .link-handle { font-family: var(--sans); font-size: 1rem; font-weight: 700; letter-spacing: -0.5px; word-break: break-all; }

    @media (max-width: 900px) {
      .about-hero { grid-template-columns: 1fr; padding: 120px 32px 40px; gap: 60px; }
      .about-right { order: -1; }
      .photo-container { max-height: 400px; }
      .terminal-section, .edu-section, .links-section { padding: 60px 32px; }
      .edu-card { grid-template-columns: 1fr; }
    }
  `;

  return (
    <AnimatedPage>
      <style>{aboutStyles}</style>

      {/* ABOUT HERO */}
      <div className="about-hero">
        <div className="about-bg"></div>

        <div className="about-left">
          <div className="breadcrumb">
            <Link to="/home">Home</Link>
            <span className="sep">/</span>
            <span>About</span>
          </div>

          <h1 className="about-title">
            Who am<br />
            <span className="highlight">I, exactly?</span>
          </h1>

          <p className="about-bio" style={{ whiteSpace: 'pre-line' }}>
            {profileData.bio}
          </p>

          <div className="quick-facts">
            <div className="fact">
              <div className="fact-label">Location</div>
              <div className="fact-value"><span className="dot">▸</span>{profileData.location}</div>
            </div>
            <div className="fact">
              <div className="fact-label">Status</div>
              <div className="fact-value"><span className="dot" style={{color:'var(--accent)'}}>●</span>Available</div>
            </div>
            <div className="fact">
              <div className="fact-label">Focus</div>
              <div className="fact-value"><span className="dot">▸</span>Backend &amp; Distributed Systems</div>
            </div>
            <div className="fact">
              <div className="fact-label">Phone</div>
              <div className="fact-value"><span className="dot">▸</span>{profileData.phone || '+91-8088895784'}</div>
            </div>
            <div className="fact">
              <div className="fact-label">Email</div>
              <div className="fact-value"><span className="dot">▸</span>{profileData.email}</div>
            </div>
            <div className="fact">
              <div className="fact-label">Portfolio</div>
              <div className="fact-value"><span className="dot">▸</span>{profileData.portfolio?.replace('https://', '') || 'nihalresume.vercel.app'}</div>
            </div>
          </div>
        </div>

        {/* PHOTO CONTAINER */}
        <div className="about-right">
          <div className="photo-container" id="photoContainer">
            <div className="photo-glow"></div>
            <div className="photo-frame"></div>
            <div className="photo-frame-br"></div>
            <div className="photo-corner tl">NY_001</div>
            <div className="photo-corner br">2025</div>

            {photos.map((photo, i) => (
              <img 
                key={i}
                className="photo-preview" 
                src={photo.url} 
                alt={`${profileData.name} - slide ${i}`} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/profile.jpg';
                }}
                style={{
                  display: 'block', 
                  opacity: currentSlide === i ? 1 : 0
                }} 
              />
            ))}
            <div className="photo-overlay">
              <div className="photo-overlay-text">{profileData.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* TERMINAL INFO */}
      <section className="terminal-section">
        <div className="section-header">
          <span className="section-num">01</span>
          <h2 className="section-title">Profile.json</h2>
          <div className="section-line"></div>
        </div>

        <div className="terminal-window" id="termWin">
          <div className="terminal-bar">
            <span className="t-dot"></span>
            <span className="t-dot"></span>
            <span className="t-dot"></span>
            <span className="t-title">{profileData.name.split(' ')[0].toLowerCase()}@portfolio ~ profile.json</span>
          </div>
          <div className="terminal-body">
            <span className="t-line"><span className="t-comment">// {profileData.name} — Developer Profile</span></span>
            <span className="t-line">{"{"}</span>
            <span className="t-line">&nbsp;&nbsp;<span className="t-key">"name"</span>: <span className="t-str">"{profileData.name}"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;<span className="t-key">"role"</span>: <span className="t-str">"{profileData.role}"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;<span className="t-key">"location"</span>: <span className="t-str">"{profileData.location}"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;<span className="t-key">"strengths"</span>: [</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Backend Architecture (Spring Boot, GraphQL, REST)"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Distributed Task Execution (Celery + Redis)"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Email Systems &amp; Deliverability (360Airo, Warmup, SMTP)"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Browser Automation &amp; Scraping (Selenium, Proxies)"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"AI Integration &amp; Output Validation (OpenAI, Gemini, Grok)"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Full Stack (Spring Boot + React + PostgreSQL)"</span></span>
            <span className="t-line">&nbsp;&nbsp;],</span>
            <span className="t-line">&nbsp;&nbsp;<span className="t-key">"achievements"</span>: {"{"}</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"award"</span>: <span className="t-str">"Q3–Q4 Best Performer @ Globo Persona"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"keyPlatform"</span>: <span className="t-str">"Architected 360Airo (50+ clients, 100K+ emails/day)"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"inboxPlacement"</span>: <span className="t-str">"95%+ inbox placement (&lt;2% bounce rate)"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"reliability"</span>: <span className="t-str">"99%+ scheduled automation reliability"</span></span>
            <span className="t-line">&nbsp;&nbsp;{"}"},</span>
            <span className="t-line">&nbsp;&nbsp;<span className="t-key">"contacts"</span>: {"{"}</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"email"</span>: <span className="t-str">"{profileData.email}"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"phone"</span>: <span className="t-str">"{profileData.phone || '+91-8088895784'}"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"github"</span>: <span className="t-str">"{profileData.github}"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"linkedin"</span>: <span className="t-str">"{profileData.linkedin}"</span>,</span>
            <span className="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="t-key">"leetcode"</span>: <span className="t-str">"{profileData.leetcode || 'https://leetcode.com/u/nihal04_10/'}"</span></span>
            <span className="t-line">&nbsp;&nbsp;{"}"}</span>
            <span className="t-line">{"}"}</span>
            <span className="t-line"><span className="t-prompt">$</span> <span className="t-cursor"></span></span>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="edu-section">
        <div className="section-header">
          <span className="section-num">02</span>
          <h2 className="section-title">Achievements</h2>
          <div className="section-line"></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="edu-card reveal-card" style={{ gridTemplateColumns: '1fr', padding: '32px' }}>
            <div>
              <div className="edu-degree" style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--accent)' }}>
                🏆 Best Performer (Multiple Quarters)
              </div>
              <div className="edu-school" style={{ fontSize: '0.8rem', lineHeight: '1.7', marginBottom: 0 }}>
                Recognized with the Best Performer Award (Q3–Q4) at Globo Persona for consistent delivery excellence, deep technical contribution, and end-to-end ownership of the 360Airo email marketing platform.
              </div>
            </div>
          </div>

          <div className="edu-card reveal-card" style={{ gridTemplateColumns: '1fr', padding: '32px' }}>
            <div>
              <div className="edu-degree" style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--accent)' }}>
                🚀 Rapid Full-Stack Ownership Promotion
              </div>
              <div className="edu-school" style={{ fontSize: '0.8rem', lineHeight: '1.7', marginBottom: 0 }}>
                Promoted to full-stack ownership within months of joining, architecting and leading 360Airo from initial system and database design to a multi-client production product handling 100K+ emails daily.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="edu-section" style={{ paddingTop: '0' }}>
        <div className="section-header">
          <span className="section-num">03</span>
          <h2 className="section-title">Education</h2>
          <div className="section-line"></div>
        </div>

        <div className="edu-card" id="eduCard">
          <div>
            <div className="edu-degree">Bachelor of Computer Application (BCA)</div>
            <div className="edu-school">Sambhram Academy of Management Studies · Bangalore, India</div>
            <div className="edu-meta">
              <span className="edu-pill">Sep 2022 – Jul 2025</span>
              <span className="edu-pill">Computer Science &amp; Applications</span>
              <span className="edu-pill">Bangalore University</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SOLVING */}
      <section className="edu-section" style={{ paddingTop: '0' }}>
        <div className="section-header">
          <span className="section-num">04</span>
          <h2 className="section-title">Problem Solving</h2>
          <div className="section-line"></div>
        </div>
        <div className="edu-card reveal-card" style={{ gridTemplateColumns: '1fr', padding: '32px' }}>
          <div>
            <div className="edu-degree" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
              LeetCode Profile (<a href="https://leetcode.com/u/nihal04_10/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>nihal04_10</a>)
            </div>
            <div className="edu-school" style={{ fontSize: '0.8rem', lineHeight: '1.7', marginBottom: 0 }}>
              Regularly solving Data Structures &amp; Algorithms problems across Arrays, Strings, Dynamic Programming, Trees, and Graphs to reinforce computer science fundamentals and algorithmic problem solving alongside production engineering.
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="edu-section" style={{ paddingTop: '0' }}>
        <div className="section-header">
          <span className="section-num">05</span>
          <h2 className="section-title">Certifications</h2>
          <div className="section-line"></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className="edu-card reveal-card" style={{ gridTemplateColumns: '1fr', padding: '24px' }}>
            <div className="edu-degree" style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Full Stack Web Development</div>
            <div className="edu-school" style={{ marginBottom: 0, color: 'var(--accent)' }}>Great Learning</div>
          </div>
          <div className="edu-card reveal-card" style={{ gridTemplateColumns: '1fr', padding: '24px' }}>
            <div className="edu-degree" style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Programming and Data Structures</div>
            <div className="edu-school" style={{ marginBottom: 0, color: 'var(--accent)' }}>HackerRank</div>
          </div>
          <div className="edu-card reveal-card" style={{ gridTemplateColumns: '1fr', padding: '24px' }}>
            <div className="edu-degree" style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Spring Boot REST API Development</div>
            <div className="edu-school" style={{ marginBottom: 0, color: 'var(--accent)' }}>Udemy</div>
          </div>
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="links-section">
        <a href={profileData.github || "https://github.com/Nih-0"} target="_blank" rel="noopener noreferrer" className="link-card" id="lc1">
          <div className="link-platform" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaGithub size={14} color="var(--accent)" />
            <span>GitHub</span>
          </div>
          <div className="link-handle">{profileData.github?.replace('https://', '') || 'github.com/Nih-0'}</div>
        </a>
        <a href={profileData.linkedin || "https://www.linkedin.com/in/nihal-yadav-/"} target="_blank" rel="noopener noreferrer" className="link-card" id="lc2">
          <div className="link-platform" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaLinkedin size={14} color="var(--accent)" />
            <span>LinkedIn</span>
          </div>
          <div className="link-handle">nihal-yadav-</div>
        </a>
        <a href={profileData.leetcode || "https://leetcode.com/u/nihal04_10/"} target="_blank" rel="noopener noreferrer" className="link-card" id="lc3">
          <div className="link-platform" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SiLeetcode size={14} color="var(--accent)" />
            <span>LeetCode</span>
          </div>
          <div className="link-handle">nihal04_10</div>
        </a>
        <a href={profileData.portfolio || "https://nihalresume.vercel.app"} target="_blank" rel="noopener noreferrer" className="link-card" id="lc4">
          <div className="link-platform" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={14} color="var(--accent)" />
            <span>Resume Site</span>
          </div>
          <div className="link-handle">{profileData.portfolio?.replace('https://', '') || 'nihalresume.vercel.app'}</div>
        </a>
        <a href={`mailto:${profileData.email || 'varunbb30@gmail.com'}`} className="link-card" id="lc5">
          <div className="link-platform" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={14} color="var(--accent)" />
            <span>Email</span>
          </div>
          <div className="link-handle">{profileData.email || 'varunbb30@gmail.com'}</div>
        </a>
      </section>
    </AnimatedPage>
  );
};

export default About;
