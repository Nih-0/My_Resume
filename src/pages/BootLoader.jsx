import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const BootLoader = () => {
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState('INITIALIZING...');
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    // Add specific styles for bootloader
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.display = 'flex';
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';

    const bootLines = [
      { text: '[ <span class="ok" style="color:var(--accent)">OK</span>  ] Loading kernel modules...', delay: 200 },
      { text: '[ <span class="ok" style="color:var(--accent)">OK</span>  ] Mounting filesystem...', delay: 500 },
      { text: '[ <span class="info" style="color:var(--accent3)">INFO</span>] Spring Boot v3.2.0 initializing...', delay: 800 },
      { text: '[ <span class="ok" style="color:var(--accent)">OK</span>  ] PostgreSQL connection established', delay: 1100 },
      { text: '[ <span class="ok" style="color:var(--accent)">OK</span>  ] Redis daemon started on :6379', delay: 1400 },
      { text: '[ <span class="info" style="color:var(--accent3)">INFO</span>] Celery workers spawned (4 threads)', delay: 1700 },
      { text: '[ <span class="ok" style="color:var(--accent)">OK</span>  ] Selenium WebDriver initialized', delay: 2000 },
      { text: '[ <span class="warn" style="color:var(--accent2)">WARN</span>] AI integration keys loaded from vault', delay: 2200 },
      { text: '[ <span class="ok" style="color:var(--accent)">OK</span>  ] Docker containers healthy', delay: 2500 },
      { text: '[ <span class="ok" style="color:var(--accent)">OK</span>  ] React frontend bundle compiled', delay: 2800 },
      { text: '[ <span class="info" style="color:var(--accent3)">INFO</span>] Portfolio v2.0 ready to serve', delay: 3100 },
    ];

    const labels = ['INITIALIZING...','LOADING MODULES...','CONNECTING DB...','SPAWNING WORKERS...','COMPILING...','READY'];

    bootLines.forEach(({ text, delay }, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, text]);
        
        const pct = Math.round(((i + 1) / bootLines.length) * 100);
        setProgress(pct);
        setLabel(labels[Math.min(Math.floor(i / 2), labels.length - 1)]);
      }, delay);
    });

    const timer = setTimeout(() => {
      setShowEnter(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.display = '';
      document.body.style.alignItems = '';
      document.body.style.justifyContent = '';
    };
  }, []);

  // Auto scroll terminal
  useEffect(() => {
    const term = document.getElementById('terminalBoot');
    if (term) term.scrollTop = term.scrollHeight;
  }, [lines]);

  // CSS injected for boot loader
  const bootStyles = `
    .grid-bg {
      position: fixed; inset: 0; z-index: 0;
      background-image:
        linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: gridShift 20s linear infinite;
    }
    @keyframes gridShift { 0% { background-position: 0 0, 0 0; } 100% { background-position: 60px 60px, 60px 60px; } }
    
    .loader { position: relative; z-index: 10; text-align: center; padding: 60px; }
    
    .boot-logo {
      font-family: var(--sans);
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 800;
      letter-spacing: -4px;
      line-height: 1;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent3) 50%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: logoPulse 2s ease-in-out infinite alternate;
      margin-bottom: 20px;
    }
    @keyframes logoPulse { from { filter: brightness(1); } to { filter: brightness(1.3) drop-shadow(0 0 30px rgba(0,255,136,0.5)); } }
    
    .boot-sub { font-size: 0.75rem; color: var(--accent); letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 50px; opacity: 0; animation: fadeUp 0.8s 0.5s forwards; }
    
    .terminal-boot { font-size: 0.7rem; color: var(--dim); text-align: left; width: 380px; margin: 0 auto 40px; height: 140px; overflow: hidden; position: relative; }
    .terminal-boot::before { content: ''; position: absolute; inset: 0; background: linear-gradient(transparent 60%, var(--bg)); z-index: 1; pointer-events: none; }
    .boot-line { opacity: 0; animation: bootLine 0.3s forwards; padding: 2px 0; }
    @keyframes bootLine { to { opacity: 1; } }
    
    .progress-wrap { width: 380px; margin: 0 auto 30px; position: relative; }
    .progress-label { font-size: 0.65rem; color: var(--dim); display: flex; justify-content: space-between; margin-bottom: 8px; }
    .progress-track { height: 2px; background: rgba(255,255,255,0.1); position: relative; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent3), var(--accent)); transition: width 0.1s linear; position: relative; }
    .progress-fill::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 12px var(--accent); }
    
    .enter-btn { display: inline-block; padding: 14px 48px; font-family: var(--mono); font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bg); background: var(--accent); border: none; cursor: none; position: relative; overflow: hidden; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%); opacity: 0; transform: translateY(10px); transition: all 0.3s; }
    .enter-btn.visible { opacity: 1; transform: translateY(0); }
    .enter-btn::before { content: ''; position: absolute; inset: 0; background: var(--accent2); transform: translateX(-100%); transition: transform 0.3s ease; }
    .enter-btn:hover::before { transform: translateX(0); }
    .enter-btn span { position: relative; z-index: 1; }
    
    .glitch { position: relative; }
    .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; right: 0; background: linear-gradient(135deg, var(--accent) 0%, var(--accent3) 50%, var(--accent2) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .glitch::before { animation: glitch1 4s 2s infinite; clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
    .glitch::after { animation: glitch2 4s 2s infinite; clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); }
    @keyframes glitch1 { 0%,90%,100% { transform: translateX(0); opacity: 0; } 91% { transform: translateX(-3px); opacity: 1; } 93% { transform: translateX(3px); opacity: 1; } 95% { transform: translateX(0); opacity: 0; } }
    @keyframes glitch2 { 0%,90%,100% { transform: translateX(0); opacity: 0; } 92% { transform: translateX(3px); opacity: 1; } 94% { transform: translateX(-3px); opacity: 1; } 96% { transform: translateX(0); opacity: 0; } }
    
    .particles { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
    .particle { position: absolute; width: 2px; height: 2px; background: var(--accent); border-radius: 50%; animation: float var(--dur) var(--delay) infinite ease-in-out; opacity: 0; }
    @keyframes float { 0% { transform: translateY(100vh) translateX(0); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-20px) translateX(var(--drift)); opacity: 0; } }
  `;

  return (
    <>
      <style>{bootStyles}</style>
      <div className="grid-bg"></div>
      
      <div className="particles">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            '--dur': `${6 + Math.random() * 10}s`,
            '--delay': `${Math.random() * 8}s`,
            '--drift': `${(Math.random() - 0.5) * 100}px`,
            background: ['#00ff88','#7c3aed','#ff6b35'][Math.floor(Math.random()*3)],
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`
          }}></div>
        ))}
      </div>

      <div className="scanlines"></div>
      <div className="noise"></div>

      <div className="loader">
        <div className="boot-logo glitch" data-text="NY">NY</div>
        <div className="boot-sub">Nihal Yadav // Full Stack &amp; Automation Engineer</div>

        <div className="terminal-boot" id="terminalBoot">
          {lines.map((line, i) => (
            <div key={i} className="boot-line" dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </div>

        <div className="progress-wrap">
          <div className="progress-label">
            <span>{label}</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <button 
          className={`enter-btn ${showEnter ? 'visible' : ''}`}
          onClick={() => navigate('/home')}
        >
          <span>$ ./enter_portfolio</span>
        </button>
      </div>
    </>
  );
};

export default BootLoader;
