import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

// Standard icons from Simple Icons & FontAwesome
import {
  SiSpringboot,
  SiSpring,
  SiSpringsecurity,
  SiHibernate,
  SiGraphql,
  SiCelery,
  SiRedis,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiSelenium,
  SiPandas,
  SiFfmpeg,
  SiOpenai,
  SiGooglegemini,
  SiReact,
  SiTailwindcss,
  SiJavascript,
  SiVite,
  SiDocker,
  SiLinux,
  SiGithub,
  SiGit,
  SiApachemaven,
  SiPostman
} from 'react-icons/si';
import { FaJava, FaAws, FaHtml5, FaCss3Alt } from 'react-icons/fa6';

// Standard icons from Lucide React
import {
  Server,
  Cpu,
  Database,
  Mail,
  Bot,
  Sparkles,
  Layout,
  Cloud,
  Globe,
  Workflow,
  ShieldCheck,
  Flame,
  Gauge,
  Terminal,
  Boxes,
  Users,
  Radio,
  Repeat,
  RotateCw,
  Clock,
  Mic,
  ShieldAlert,
  CheckCircle2,
  Network
} from 'lucide-react';

const fallbackProjects = [
  {
    num: "PROJECT_01",
    title: "360Airo — Production Email Outreach & Marketing Platform",
    desc: "Architected from scratch and scaled a multi-tenant email outreach platform serving 50+ clients and handling 100K+ emails/day. Engineered sender pooling, queue-based Celery workers, per-domain rate limiting, and warmup workflows.",
    tech: ["Spring Boot", "Python", "Celery", "Redis", "PostgreSQL", "Docker", "AWS EC2/S3", "GraphQL"],
    metric: "✦ 95%+ inbox placement · 100K+ daily emails",
    github: "https://github.com/Nih-0"
  },
  {
    num: "PROJECT_02",
    title: "High-Speed URL Scraper",
    desc: "High-throughput bulk web scraper ingesting XLSX/CSV sheets of URLs, extracting structured data, and writing formatted results. Built with multithreaded worker pools, proxy/IP rotation, randomized headers, and exponential backoff retry logic.",
    tech: ["Python", "Multithreading", "Proxy/IP Rotation", "Pandas", "Requests"],
    metric: "✦ Concurrent multithreading & anti-blocking",
    github: "https://github.com/Nih-0"
  },
  {
    num: "PROJECT_03",
    title: "Reddit Sentiment & Competitor Intelligence Analyzer",
    desc: "Competitor intelligence platform that discovers and analyzes relevant Reddit discussions for target companies. Automates thread collection with Selenium, stores history in MySQL, and caches searches in Redis to surface brand engagement opportunities.",
    tech: ["Spring Boot", "Selenium", "MySQL", "Redis", "Docker", "REST APIs"],
    metric: "✦ Automated thread scraping & competitor sentiment",
    github: "https://github.com/Nih-0"
  },
  {
    num: "PROJECT_04",
    title: "SEO Keyword Gap Analyzer",
    desc: "Competitor intelligence tool that crawls competitor websites via Selenium, extracts SEO signals, and identifies keyword gaps and organic growth opportunities against target domains. Exposes REST APIs with Redis caching.",
    tech: ["Spring Boot", "Selenium", "MySQL", "Redis", "Docker", "REST APIs"],
    metric: "✦ Domain keyword gap detection & SEO analytics",
    github: "https://github.com/Nih-0"
  },
  {
    num: "PROJECT_05",
    title: "TechPeek — Technology Stack Detection Chrome Extension",
    desc: "Wappalyzer-style Chrome extension identifying frameworks, CMS platforms, analytics tools, and hosting services behind any website using a Spring Boot backend and Selenium-based inspection pipeline with Redis caching.",
    tech: ["Spring Boot", "Selenium", "MySQL", "Redis", "Docker", "Chrome Extension"],
    metric: "✦ Instant web stack signature detection",
    github: "https://github.com/Nih-0"
  },
  {
    num: "PROJECT_06",
    title: "Beehive — Collaborative Workspace & Developer Platform",
    desc: "Collaborative workspace combining project management with real-time communication: live chat over WebSockets plus voice and video inside shared project spaces. Features Spring Boot REST APIs, MySQL persistence, and Redis session caching.",
    tech: ["Spring Boot", "WebSockets", "MySQL", "Redis", "Docker", "REST APIs"],
    metric: "✦ Real-time WebSocket communication & sessions",
    github: "https://github.com/Nih-0"
  },
  {
    num: "PROJECT_07",
    title: "AI-Powered Social Media Automation Platform",
    desc: "Distributed job orchestration system for scheduled publishing across multiple platforms. Integrates LLM APIs for content generation and multimedia processing pipelines with Whisper and FFmpeg.",
    tech: ["LLM APIs", "Whisper", "FFmpeg", "Celery", "Redis", "Docker"],
    metric: "✦ 99%+ scheduled execution reliability",
    github: "https://github.com/Nih-0"
  },
  {
    num: "PROJECT_08",
    title: "InsightIQ — AI-Powered Interview Analytics Platform",
    desc: "Full-stack AI interview evaluation platform with speech-to-text, communication analysis, and technical skill assessment built with Spring Boot, Spring AI, React, MySQL, and JWT authentication.",
    tech: ["Spring Boot", "Spring AI", "React", "MySQL", "JWT"],
    metric: "✦ Real-time speech-to-text & skill evaluation",
    github: "https://github.com/Nih-0/InsightIQ_Backend"
  },
  {
    num: "PROJECT_09",
    title: "TicketTrade — Secure Ticket Exchange Platform",
    desc: "Full-stack secure ticket exchange platform using Spring Boot with JWT authentication, role-based access control, and real-time listing management.",
    tech: ["Spring Boot", "JWT", "React", "Tailwind CSS", "MySQL", "RBAC"],
    metric: "✦ Secure authentication & role-based access",
    github: "https://github.com/Nih-0"
  }
];

const skillCategories = [
  {
    title: "Backend Development",
    icon: <Server size={24} className="skill-icon-svg" />,
    skills: [
      { name: "Java", icon: <FaJava /> },
      { name: "Spring Boot", icon: <SiSpringboot /> },
      { name: "Spring MVC", icon: <SiSpring /> },
      { name: "Spring Security", icon: <SiSpringsecurity /> },
      { name: "Hibernate / JPA", icon: <SiHibernate /> },
      { name: "Spring Data JPA", icon: <SiSpring /> },
      { name: "Spring AI", icon: <Sparkles size={12} /> },
      { name: "REST APIs", icon: <Globe size={12} /> },
      { name: "GraphQL", icon: <SiGraphql /> },
      { name: "WebSockets", icon: <Radio size={12} /> }
    ]
  },
  {
    title: "Async & Distributed",
    icon: <Cpu size={24} className="skill-icon-svg" />,
    skills: [
      { name: "Celery", icon: <SiCelery /> },
      { name: "Redis Queue", icon: <SiRedis /> },
      { name: "Multithreading", icon: <Cpu size={12} /> },
      { name: "Background Processing", icon: <RotateCw size={12} /> },
      { name: "Task Scheduling", icon: <Clock size={12} /> },
      { name: "Multi-Tenant Design", icon: <Boxes size={12} /> },
      { name: "Worker Pooling", icon: <Workflow size={12} /> }
    ]
  },
  {
    title: "Languages & Databases",
    icon: <Database size={24} className="skill-icon-svg" />,
    skills: [
      { name: "Java", icon: <FaJava /> },
      { name: "Python", icon: <SiPython /> },
      { name: "SQL", icon: <Database size={12} /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "PostgreSQL", icon: <SiPostgresql /> },
      { name: "MySQL", icon: <SiMysql /> },
      { name: "Redis", icon: <SiRedis /> }
    ]
  },
  {
    title: "Email & Deliverability",
    icon: <Mail size={24} className="skill-icon-svg" />,
    skills: [
      { name: "SMTP", icon: <Mail size={12} /> },
      { name: "IP/Domain Warmup", icon: <Flame size={12} /> },
      { name: "Rate Limiting", icon: <Gauge size={12} /> },
      { name: "Bounce & Complaint", icon: <ShieldAlert size={12} /> },
      { name: "Deliverability Optimization", icon: <CheckCircle2 size={12} /> },
      { name: "List Validation", icon: <ShieldCheck size={12} /> }
    ]
  },
  {
    title: "Scraping & Automation",
    icon: <Bot size={24} className="skill-icon-svg" />,
    skills: [
      { name: "Selenium WebDriver", icon: <SiSelenium /> },
      { name: "Web Scraping", icon: <Terminal size={12} /> },
      { name: "Proxy / IP Rotation", icon: <Repeat size={12} /> },
      { name: "Retry Strategies", icon: <RotateCw size={12} /> },
      { name: "FFmpeg", icon: <SiFfmpeg /> },
      { name: "Pandas", icon: <SiPandas /> }
    ]
  },
  {
    title: "AI Integration",
    icon: <Sparkles size={24} className="skill-icon-svg" />,
    skills: [
      { name: "OpenAI API", icon: <SiOpenai /> },
      { name: "Google Gemini", icon: <SiGooglegemini /> },
      { name: "Grok API", icon: <Sparkles size={12} /> },
      { name: "Whisper", icon: <Mic size={12} /> },
      { name: "Prompt Engineering", icon: <Terminal size={12} /> },
      { name: "AI Output Validation", icon: <ShieldCheck size={12} /> }
    ]
  },
  {
    title: "Frontend & UI",
    icon: <Layout size={24} className="skill-icon-svg" />,
    skills: [
      { name: "React.js", icon: <SiReact /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "HTML5", icon: <FaHtml5 /> },
      { name: "CSS3", icon: <FaCss3Alt /> },
      { name: "JavaScript (ES6+)", icon: <SiJavascript /> },
      { name: "Vite", icon: <SiVite /> }
    ]
  },
  {
    title: "DevOps & Engineering",
    icon: <Cloud size={24} className="skill-icon-svg" />,
    skills: [
      { name: "AWS EC2 / S3", icon: <FaAws /> },
      { name: "Docker", icon: <SiDocker /> },
      { name: "Linux (Ubuntu)", icon: <SiLinux /> },
      { name: "Git / GitHub", icon: <SiGithub /> },
      { name: "Maven", icon: <SiApachemaven /> },
      { name: "Postman", icon: <SiPostman /> },
      { name: "Agile / Scrum", icon: <Users size={12} /> },
      { name: "System Design", icon: <Network size={12} /> }
    ]
  }
];

const Home = () => {
  const [dynamicData, setDynamicData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash;
        const element = document.querySelector(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Wait for transition
    }
  }, [location.hash]);

  useEffect(() => {
    // Fetch dynamic data
    fetch('http://localhost:5000/api/data', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setDynamicData(data))
      .catch(err => console.error('Failed to fetch data', err));
  }, []);

  useEffect(() => {
    // Reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .skill-card, .exp-item, .stat-item, .project-card').forEach(el => observer.observe(el));

    // Stats counter
    const animateCounter = (el, target) => {
      let current = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 30);
    };

    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(el => {
            animateCounter(el, parseInt(el.dataset.count));
          });
          entry.target.querySelectorAll('.stat-item').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 150);
          });
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    const statsBar = document.getElementById('statsBar');
    if (statsBar) statsObs.observe(statsBar);

    // Timeline line animation
    const tlObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tlLine = document.getElementById('timelineLine');
          if (tlLine) tlLine.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    const tlLine = document.getElementById('timelineLine');
    if (tlLine && tlLine.parentElement) tlObs.observe(tlLine.parentElement);

    // Magnetic glow on skill cards
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    };

    document.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
    });

    // Staggered card delays
    document.querySelectorAll('.skill-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.05) + 's';
    });
    
    document.querySelectorAll('.project-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
    });

    document.querySelectorAll('.exp-item').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.15) + 's';
    });

    return () => {
      observer.disconnect();
      statsObs.disconnect();
      tlObs.disconnect();
      document.querySelectorAll('.skill-card').forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, [dynamicData]);

  const handleTerminalMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleTerminalMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(-8deg)';
    e.currentTarget.style.transition = 'transform 0.5s ease-out, box-shadow 0.3s ease';
  };

  const handleTerminalMouseEnter = (e) => {
    e.currentTarget.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
  };

  const projectsToDisplay = dynamicData?.projects?.length ? dynamicData.projects : fallbackProjects;

  const homeStyles = `
    .hero { min-height: 100vh; display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 40px; align-items: center; padding: calc(var(--nav-h) + 40px) 80px 80px; position: relative; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 60% 50% at 70% 50%, rgba(124,58,237,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(0,255,136,0.08) 0%, transparent 60%); }
    .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%); }
    
    .hero-visual { position: relative; z-index: 2; opacity: 0; animation: fadeUpHero 1s 1.2s forwards; perspective: 1000px; width: 100%; max-width: 500px; justify-self: center; }
    .automation-window { 
      background: rgba(255, 255, 255, 0.05); 
      border: 1px solid rgba(255, 255, 255, 0.1); 
      border-radius: 16px; 
      overflow: hidden; 
      transform: perspective(1000px) rotateY(-8deg) rotateX(5deg); 
      box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15); 
      backdrop-filter: blur(20px); 
      -webkit-backdrop-filter: blur(20px);
      transition: transform 0.1s ease-out, box-shadow 0.3s ease; 
      transform-style: preserve-3d;
    }
    .automation-window:hover { 
      box-shadow: 0 40px 80px rgba(0,255,136,0.15), inset 0 1px 0 rgba(255,255,255,0.3); 
    }
    .window-header { background: rgba(255,255,255,0.05); padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); transform: translateZ(20px); }
    .window-header .dots { display: flex; gap: 6px; }
    .window-header .dots span { width: 10px; height: 10px; border-radius: 50%; }
    .window-header .dots span:nth-child(1) { background: #ff5f56; }
    .window-header .dots span:nth-child(2) { background: #ffbd2e; }
    .window-header .dots span:nth-child(3) { background: #27c93f; }
    .window-title { font-size: 0.65rem; color: #a1a1aa; font-family: var(--mono); margin-left: auto; margin-right: auto; letter-spacing: 0.1em; }
    .window-body { padding: 24px; font-family: var(--mono); font-size: 0.8rem; line-height: 1.8; color: #e2e8f0; transform: translateZ(40px); }
    
    .code-line { margin-bottom: 4px; overflow: hidden; white-space: nowrap; width: 0; animation: typeLine 0.5s steps(40, end) forwards; opacity: 0; }
    .code-line:nth-child(1) { animation-delay: 1.5s; }
    .code-line:nth-child(2) { animation-delay: 1.9s; }
    .code-line:nth-child(3) { animation-delay: 2.3s; }
    .code-line:nth-child(4) { animation-delay: 2.7s; }
    .code-line:nth-child(5) { animation-delay: 3.1s; }
    .code-line:nth-child(6) { animation-delay: 3.5s; }
    .code-line:nth-child(7) { animation-delay: 3.9s; }
    .code-line:nth-child(8) { animation-delay: 4.3s; }
    .code-line:nth-child(9) { animation-delay: 4.7s; }
    
    @keyframes typeLine { 0% { width: 0; opacity: 1; } 100% { width: 100%; opacity: 1; } }
    .keyword { color: #ff7b72; }
    .function { color: #d2a8ff; }
    .string { color: #a5d6ff; }
    .comment { color: #8b949e; font-style: italic; }
    .prompt { color: var(--accent); }
    .indent { padding-left: 20px; }
    .indent-2 { padding-left: 40px; }
    .typing-cursor { display: inline-block; width: 8px; height: 15px; background: var(--accent); vertical-align: middle; margin-left: 4px; animation: blink 1s step-end infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    .hero-content { position: relative; z-index: 2; max-width: 900px; }
    .hero-tag { display: inline-flex; align-items: center; gap: 10px; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--accent); margin-bottom: 32px; opacity: 0; animation: slideRight 0.8s 0.2s forwards; }
    .hero-tag::before { content: ''; width: 30px; height: 1px; background: var(--accent); }
    @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    .hero-name { font-family: var(--sans); font-size: clamp(3.5rem, 8vw, 8rem); font-weight: 800; line-height: 0.95; letter-spacing: -4px; margin-bottom: 24px; overflow: hidden; }
    .hero-name .line { display: block; opacity: 0; transform: translateY(100%); animation: lineReveal 0.8s cubic-bezier(0.23,1,0.32,1) forwards; }
    .hero-name .line:nth-child(1) { animation-delay: 0.4s; }
    .hero-name .line:nth-child(2) { animation-delay: 0.6s; }
    .hero-name .accent-stroke { -webkit-text-stroke: 2px var(--accent); color: transparent; }
    @keyframes lineReveal { to { opacity: 1; transform: translateY(0); } }
    .hero-desc { font-size: 0.8rem; line-height: 1.9; color: var(--fg2); max-width: 560px; margin-bottom: 48px; opacity: 0; animation: fadeUpHero 0.8s 0.9s forwards; }
    @keyframes fadeUpHero { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; opacity: 0; animation: fadeUpHero 0.8s 1.1s forwards; }
    .tech-ticker { position: absolute; right: 40px; top: 50%; transform: translateY(-50%) rotate(90deg); transform-origin: center; z-index: 2; display: flex; gap: 24px; font-size: 0.6rem; letter-spacing: 0.2em; color: var(--dim); white-space: nowrap; animation: tickerScroll 20s linear infinite; }
    @keyframes tickerScroll { from { transform: translateY(-50%) rotate(90deg) translateX(0); } to { transform: translateY(-50%) rotate(90deg) translateX(-50%); } }
    .scroll-hint { position: absolute; bottom: 40px; left: 80px; display: flex; align-items: center; gap: 16px; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); opacity: 0; animation: fadeUpHero 0.8s 1.5s forwards; }
    .scroll-line { width: 60px; height: 1px; background: var(--dim); position: relative; overflow: hidden; }
    .scroll-line::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: var(--accent); animation: scanLine 2s ease-in-out infinite; }
    @keyframes scanLine { from { left: -100%; } to { left: 100%; } }
    .stats-bar { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 32px 80px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; position: relative; overflow: hidden; }
    .stats-bar::before { content: ''; position: absolute; top: 0; left: 0; width: 200px; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); animation: sweep 3s ease-in-out infinite; }
    @keyframes sweep { from { transform: translateX(-200px); } to { transform: translateX(calc(100vw + 200px)); } }
    .stat-item { padding: 20px 40px; border-right: 1px solid var(--border); opacity: 0; transform: translateY(20px); transition: all 0.6s; }
    .stat-item.visible { opacity: 1; transform: translateY(0); }
    .stat-item:last-child { border-right: none; }
    .stat-num { font-family: var(--sans); font-size: 2.5rem; font-weight: 800; color: var(--accent); letter-spacing: -2px; line-height: 1; }
    .stat-label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg2); margin-top: 6px; }
    
    .skills-section { background: var(--bg); }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); }
    .skill-card { background: var(--bg); padding: 32px; position: relative; overflow: hidden; opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.23,1,0.32,1); cursor: none; }
    .skill-card.visible { opacity: 1; transform: translateY(0); }
    .skill-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent3), var(--accent)); transform: scaleX(0); transform-origin: left; transition: transform 0.4s; }
    .skill-card:hover::before { transform: scaleX(1); }
    .skill-card::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,255,136,0.05), transparent 60%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
    .skill-card:hover::after { opacity: 1; }
    
    .skill-icon-wrap { margin-bottom: 16px; display: inline-flex; align-items: center; justify-content: center; }
    .skill-icon-svg { color: var(--accent); transition: transform 0.3s ease, color 0.3s ease; }
    .skill-card:hover .skill-icon-svg { transform: scale(1.1); color: #fff; }
    .skill-category { font-size: 0.68rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; font-weight: 700; }
    
    .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    .tag { font-size: 0.62rem; padding: 5px 10px; border: 1px solid var(--border); color: var(--fg2); letter-spacing: 0.03em; transition: all 0.25s; display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.02); border-radius: 4px; }
    .tag svg { font-size: 0.8rem; color: var(--accent); flex-shrink: 0; transition: color 0.2s; }
    .skill-card:hover .tag { border-color: rgba(0,255,136,0.3); color: var(--fg); background: rgba(0,255,136,0.05); }
    .skill-card:hover .tag svg { color: var(--accent); }
    
    .exp-section { background: var(--bg2); }
    .timeline { position: relative; padding-left: 60px; }
    .timeline::before { content: ''; position: absolute; left: 20px; top: 0; bottom: 0; width: 1px; background: var(--border); }
    .timeline-dot-line { position: absolute; left: 20px; top: 0; width: 1px; height: 0%; background: linear-gradient(to bottom, var(--accent), var(--accent3)); transition: height 1.5s ease-out; }
    .timeline-dot-line.visible { height: 100%; }
    .exp-item { position: relative; padding: 40px 0 60px; opacity: 0; transform: translateX(-20px); transition: all 0.7s cubic-bezier(0.23,1,0.32,1); }
    .exp-item.visible { opacity: 1; transform: translateX(0); }
    .exp-dot { position: absolute; left: -48px; top: 48px; width: 12px; height: 12px; border: 2px solid var(--accent); background: var(--bg2); transform: rotate(45deg); transition: background 0.3s; }
    .exp-item:hover .exp-dot { background: var(--accent); }
    .exp-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
    .exp-date { font-size: 0.65rem; color: var(--accent); letter-spacing: 0.1em; }
    .exp-badge { font-size: 0.55rem; padding: 3px 10px; background: rgba(0,255,136,0.1); color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid rgba(0,255,136,0.2); }
    .exp-title { font-family: var(--sans); font-size: 1.6rem; font-weight: 700; letter-spacing: -1px; margin-bottom: 6px; }
    .exp-company { font-size: 0.75rem; color: var(--fg2); margin-bottom: 24px; }
    .exp-bullets { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .exp-bullets li { font-size: 0.75rem; color: var(--fg2); line-height: 1.7; padding-left: 20px; position: relative; }
    .exp-bullets li::before { content: '▸'; position: absolute; left: 0; color: var(--accent); }
    .exp-award { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; font-size: 0.65rem; color: var(--accent2); padding: 8px 16px; border: 1px solid rgba(255,107,53,0.3); background: rgba(255,107,53,0.05); }
    .projects-section { background: var(--bg); }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
    .project-card { border: 1px solid var(--border); background: var(--card); padding: 40px; position: relative; overflow: hidden; opacity: 0; transform: translateY(40px) scale(0.98); transition: all 0.7s cubic-bezier(0.23,1,0.32,1); cursor: none; }
    .project-card.visible { opacity: 1; transform: translateY(0) scale(1); }
    .project-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,255,136,0.05), rgba(124,58,237,0.05)); opacity: 0; transition: opacity 0.4s; }
    .project-card:hover { border-color: rgba(0,255,136,0.3); transform: translateY(-6px) scale(1); }
    .project-card:hover::before { opacity: 1; }
    .project-num { font-size: 0.6rem; color: var(--dim); letter-spacing: 0.2em; margin-bottom: 24px; }
    .project-title { font-family: var(--sans); font-size: 1.4rem; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 16px; line-height: 1.2; }
    .project-desc { font-size: 0.72rem; color: var(--fg2); line-height: 1.8; margin-bottom: 28px; }
    .project-tech { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .project-tech span { font-size: 0.58rem; padding: 4px 10px; background: rgba(124,58,237,0.1); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); letter-spacing: 0.05em; }
    .project-metric { font-size: 0.65rem; color: var(--accent); border-top: 1px solid var(--border); padding-top: 20px; }
    .project-arrow { position: absolute; bottom: 40px; right: 40px; width: 40px; height: 40px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--fg2); transform: rotate(-45deg); transition: all 0.3s; }
    .project-card:hover .project-arrow { background: var(--accent); border-color: var(--accent); color: #000; transform: rotate(0deg); }
    @media (max-width: 900px) { .hero { padding: 120px 32px 80px; } .stats-bar { grid-template-columns: repeat(2,1fr); padding: 24px 32px; } .stat-item { padding: 16px 20px; } .projects-grid { grid-template-columns: 1fr; } }
  `;

  return (
    <AnimatedPage>
      <style>{homeStyles}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>

        <div className="hero-content">
          <div className="hero-tag">Available for opportunities</div>

          <div className="hero-name">
            <span className="line">{dynamicData?.profile?.name ? dynamicData.profile.name.split(' ')[0] : 'Nihal'}</span>
            <span className="line"><span className="accent-stroke">{dynamicData?.profile?.name ? dynamicData.profile.name.split(' ').slice(1).join(' ') : 'Yadav'}</span></span>
          </div>

          <p className="hero-desc">
            {dynamicData?.profile?.bio || `Full Stack Engineer who architected and scaled 360Airo, a production email outreach & marketing platform serving 50+ clients.\nSpring Boot · Python · Distributed Systems · React · AI Integrations.\nBuilding reliable, fault-tolerant systems that scale.`}
          </p>

          <div className="hero-ctas">
            <Link to="/about" className="btn-primary">
              <span>$ cat about.md</span>
            </Link>
            <a href={`mailto:${dynamicData?.profile?.email || 'varunbb30@gmail.com'}`} className="btn-outline">
              ping {dynamicData?.profile?.name ? dynamicData.profile.name.split(' ')[0].toLowerCase() : 'nihal'}@mail
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div 
            className="automation-window"
            onMouseMove={handleTerminalMouseMove}
            onMouseLeave={handleTerminalMouseLeave}
            onMouseEnter={handleTerminalMouseEnter}
          >
            <div className="window-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <div className="window-title">360airo_dispatcher.py</div>
            </div>
            <div className="window-body">
              <div className="code-line"><span className="keyword">import</span> celery_cluster, deliverability</div>
              <div className="code-line"><span className="keyword">async def</span> <span className="function">dispatch_campaign</span>(id):</div>
              <div className="code-line indent">await warmup.validate_pool(senders)</div>
              <div className="code-line indent">workers = celery.spawn_pool(concurrency=<span className="string">"auto"</span>)</div>
              <div className="code-line indent"><span className="keyword">if</span> deliverability.is_optimal():</div>
              <div className="code-line indent-2">workers.dispatch_batch(id, rate_limit=<span className="string">"per_domain"</span>)</div>
              <div className="code-line indent-2"><span className="function">print</span>(<span className="string">"🚀 100K+ emails dispatching (95%+ placement)"</span>)</div>
              <div className="code-line"><span className="comment"># Status: 360Airo Production Engine Active</span></div>
              <div className="code-line"><span className="prompt">root@nihal-360airo:~#</span> <span className="typing-cursor"></span></div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar" id="statsBar">
        <div className="stat-item">
          <div className="stat-num"><span data-count="50">0</span>+</div>
          <div className="stat-label">Active 360Airo Clients</div>
        </div>
        <div className="stat-item">
          <div className="stat-num"><span data-count="100">0</span>K+</div>
          <div className="stat-label">Daily Emails Handled</div>
        </div>
        <div className="stat-item">
          <div className="stat-num"><span data-count="95">0</span>%+</div>
          <div className="stat-label">Inbox Placement Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-num" style={{fontSize: '1.8rem'}}>Q3–Q4</div>
          <div className="stat-label">Best Performer Award</div>
        </div>
      </div>

      {/* SKILLS */}
      <section className="skills-section" id="skills">
        <div className="section-header">
          <span className="section-num">01</span>
          <h2 className="section-title">Technical Skills</h2>
          <div className="section-line"></div>
        </div>

        <div className="skills-grid">
          {skillCategories.map((cat, idx) => (
            <div className="skill-card reveal" key={idx}>
              <div className="skill-icon-wrap">
                {cat.icon}
              </div>
              <div className="skill-category">{cat.title}</div>
              <div className="skill-tags">
                {cat.skills.map((skill, sIdx) => (
                  <span className="tag" key={sIdx}>
                    {skill.icon}
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="exp-section" id="experience">
        <div className="section-header">
          <span className="section-num">02</span>
          <h2 className="section-title">Experience</h2>
          <div className="section-line"></div>
        </div>

        <div className="timeline">
          <div className="timeline-dot-line" id="timelineLine"></div>

          <div className="exp-item">
            <div className="exp-dot"></div>
            <div className="exp-meta">
              <span className="exp-date">Sep 2025 – Present</span>
              <span className="exp-badge">Full Time · On-site</span>
            </div>
            <div className="exp-title">Full Stack Developer &amp; Automation Engineer</div>
            <div className="exp-company">Globo Persona · Bangalore, India</div>
            <ul className="exp-bullets">
              <li>Joined as Frontend + Automation Developer building React dashboards for CRM and automation workflows, and moved into full-stack ownership within the first few months based on delivery performance.</li>
              <li><strong>Built 360Airo from scratch</strong> (company's email outreach &amp; marketing product): planned the infrastructure, system architecture, and database design end to end, then took ownership of deployment, monitoring, and day-to-day operations.</li>
              <li>Scaled 360Airo as the client base grew from 5 to 50+ active accounts, handling 100K+ emails/day by adding multi-tenant isolation, sender-account pooling, queue-based workers, and horizontal scaling of Celery workers.</li>
              <li>Raised inbox placement to 95%+ and cut bounce rate to under 2% through IP/domain warmup logic, per-domain rate limiting, bounce/complaint handling, and list validation before sending.</li>
              <li>Designed scalable REST and GraphQL APIs in Spring Boot and Python for campaigns, contacts, and analytics, applying authentication, input validation, and role-based access control.</li>
              <li>Architected distributed task execution with Celery + Redis (retries, fault tolerance), achieving 99%+ reliability in scheduled automation runs and 40% faster campaign dispatch.</li>
              <li>Integrated LLM APIs (OpenAI, Gemini, Grok) into content workflows, validating AI output for accuracy and tone before production use.</li>
              <li>Containerized services with Docker and ran production on AWS EC2/S3; took part in agile sprints and peer code reviews.</li>
            </ul>
            <div className="exp-award">🏆 Recognized as Q3–Q4 Best Performer for consistent delivery &amp; 360Airo ownership</div>
          </div>

          <div className="exp-item">
            <div className="exp-dot"></div>
            <div className="exp-meta">
              <span className="exp-date">Mar 2025 – Sep 2025</span>
              <span className="exp-badge">Internship · Bangalore</span>
            </div>
            <div className="exp-title">Software Development Engineer (SDE)</div>
            <div className="exp-company">Nxtgen Tech · Bangalore, India</div>
            <ul className="exp-bullets">
              <li>Developed and maintained backend services using Spring Boot and REST APIs, supporting core business functionalities.</li>
              <li>Collaborated with frontend and product teams in an Agile environment to deliver features on time.</li>
              <li>Designed database schemas, wrote optimized SQL queries, and integrated JPA/Hibernate for data persistence.</li>
              <li>Participated in code reviews, testing, and deployment processes to ensure high code quality and reliability.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-dot"></div>
            <div className="exp-meta">
              <span className="exp-date">Feb 2025 – Mar 2025</span>
              <span className="exp-badge">Internship · Remote</span>
            </div>
            <div className="exp-title">Java Developer</div>
            <div className="exp-company">Reignite Technologies · Remote</div>
            <ul className="exp-bullets">
              <li>Developed scalable RESTful APIs using Spring Boot and Hibernate, applying object-oriented design and layered architecture patterns.</li>
              <li>Designed relational schemas and implemented JPA-based ORM mappings for core business entities.</li>
              <li>Built full-stack applications integrating a Spring Boot backend with a React frontend.</li>
              <li>Participated in Agile workflows including sprint planning, backlog grooming, and peer code reviews.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects-section" id="projects">
        <div className="section-header">
          <span className="section-num">03</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-line"></div>
        </div>

        <div className="projects-grid">
          {projectsToDisplay.map((proj, i) => (
            <a 
              key={i} 
              href={proj.github && proj.github !== '#' ? proj.github : undefined}
              target={proj.github && proj.github !== '#' ? "_blank" : undefined}
              rel={proj.github && proj.github !== '#' ? "noopener noreferrer" : undefined}
              className="project-card reveal" 
              style={{ transitionDelay: `${i * 0.08}s`, textDecoration: 'none', display: 'block', color: 'inherit' }}
            >
              <div className="project-num">{proj.num}</div>
              <div className="project-title">{proj.title}</div>
              <div className="project-desc">{proj.desc}</div>
              <div className="project-tech">
                {proj.tech.map((t, idx) => <span key={idx}>{t}</span>)}
              </div>
              <div className="project-metric">{proj.metric}</div>
              <div className="project-arrow">↗</div>
            </a>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
};

export default Home;
