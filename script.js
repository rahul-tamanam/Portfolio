// ═══════════════════════════════════════════════════════════════════
// GALAXY BACKGROUND
// ═══════════════════════════════════════════════════════════════════
(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); stars.forEach(s => { s.ox = s.x = Math.random()*W; s.oy = s.y = Math.random()*H; }); });
  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  const STAR_COUNT = 280;
  const stars = Array.from({ length: STAR_COUNT }, () => {
    const x = Math.random()*window.innerWidth, y = Math.random()*window.innerHeight;
    return { ox:x,oy:y,x,y,vx:0,vy:0,r:Math.random()*1.7+0.3,alpha:Math.random()*0.6+0.3,twinkleSpeed:Math.random()*0.9+0.3,twinkleOffset:Math.random()*Math.PI*2,hue:190+Math.random()*45,mass:Math.random()*0.4+0.6 };
  });
  const NEBULAS=[{cx:.18,cy:.28,rx:.32,ry:.22,color:'254,189,0',alpha:.042},{cx:.76,cy:.65,rx:.28,ry:.20,color:'100,160,255',alpha:.035},{cx:.50,cy:.50,rx:.42,ry:.30,color:'60,100,200',alpha:.022},{cx:.86,cy:.18,rx:.20,ry:.16,color:'120,200,255',alpha:.032},{cx:.12,cy:.76,rx:.22,ry:.18,color:'80,140,230',alpha:.028}];
  const ORBS=[{cx:.20,cy:.35,r:95,color:'80,160,255',alpha:.055},{cx:.80,cy:.62,r:75,color:'254,189,0',alpha:.065},{cx:.50,cy:.18,r:60,color:'130,190,255',alpha:.048}];
  const shooters=[];
  function spawnShooter(){shooters.push({x:Math.random()*.65,y:Math.random()*.45,len:90+Math.random()*130,speed:.0016+Math.random()*.002,progress:0,alpha:.65+Math.random()*.35,angle:Math.PI/5+(Math.random()-.5)*.3});}
  setInterval(()=>{if(shooters.length<3)spawnShooter();},3000); spawnShooter();
  const REPEL_RADIUS=120,REPEL_FORCE=6.5,FRICTION=.88,RETURN_FORCE=.045; let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=.005;
    const bg=ctx.createLinearGradient(0,0,W*.5,H);
    bg.addColorStop(0,'#07070a'); bg.addColorStop(.5,'#080810'); bg.addColorStop(1,'#07070a');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    NEBULAS.forEach(n=>{
      const g=ctx.createRadialGradient(n.cx*W,n.cy*H,0,n.cx*W,n.cy*H,Math.max(n.rx*W,n.ry*H));
      g.addColorStop(0,`rgba(${n.color},${n.alpha})`); g.addColorStop(.5,`rgba(${n.color},${n.alpha*.4})`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); ctx.scale(1,n.ry/n.rx); ctx.beginPath(); ctx.arc(n.cx*W,(n.cy*H)*(n.rx/n.ry),n.rx*W,0,Math.PI*2); ctx.fillStyle=g; ctx.fill(); ctx.restore();
    });
    ORBS.forEach(o=>{
      const g=ctx.createRadialGradient(o.cx*W,o.cy*H,0,o.cx*W,o.cy*H,o.r);
      g.addColorStop(0,`rgba(${o.color},${o.alpha})`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(o.cx*W,o.cy*H,o.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    });
    stars.forEach(s=>{
      const dx=mouseX-s.x,dy=mouseY-s.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<REPEL_RADIUS&&d>0){const f=(1-d/REPEL_RADIUS)*REPEL_FORCE;s.vx-=(dx/d)*f;s.vy-=(dy/d)*f;}
      s.vx+=(s.ox-s.x)*RETURN_FORCE; s.vy+=(s.oy-s.y)*RETURN_FORCE;
      s.vx*=FRICTION; s.vy*=FRICTION; s.x+=s.vx; s.y+=s.vy;
      const tw=Math.sin(t*s.twinkleSpeed+s.twinkleOffset)*.5+.5;
      const a=s.alpha*(0.6+tw*0.4);
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${s.hue},80%,85%,${a})`; ctx.fill();
    });
    for(let i=shooters.length-1;i>=0;i--){
      const sh=shooters[i]; sh.progress+=sh.speed;
      const sx=sh.x*W+Math.cos(sh.angle)*sh.progress*W*1.5,sy=sh.y*H+Math.sin(sh.angle)*sh.progress*H*1.5;
      const ex=sx-Math.cos(sh.angle)*sh.len,ey=sy-Math.sin(sh.angle)*sh.len;
      const g=ctx.createLinearGradient(ex,ey,sx,sy);
      g.addColorStop(0,'rgba(254,189,0,0)'); g.addColorStop(1,`rgba(254,189,0,${sh.alpha*(1-sh.progress)})`);
      ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(sx,sy);
      ctx.strokeStyle=g; ctx.lineWidth=1.2; ctx.stroke();
      if(sh.progress>1)shooters.splice(i,1);
    }
  }
  draw();
})();

// ═══════════════════════════════════════════════════════════════════
// CINEMATIC VIDEO LOADER
// ═══════════════════════════════════════════════════════════════════
function initVideoLoader() {
  const loader   = document.getElementById('loader');
  const video    = document.getElementById('ld-video');
  const text1    = document.getElementById('ldText1');   // "ENTERING THE UNIVERSE..."
  const text2    = document.getElementById('ldText2');   // "WELCOME TO MY PORTFOLIO"
  const boot1    = document.getElementById('ldBoot1');
  const boot2    = document.getElementById('ldBoot2');
  const boot3    = document.getElementById('ldBoot3');
  const boot4    = document.getElementById('ldBoot4');

  if (!loader || !video) return;

  // Play video — muted first (browser requires it), unmute on first interaction
  if (video) {
    video.muted = true;
    video.loop = true;
    video.play().catch(function() {});
    // Unmute as soon as user touches anything
    var unmute = function() {
      video.muted = false;
      video.volume = 1.0;
      document.removeEventListener('click', unmute);
      document.removeEventListener('keydown', unmute);
    };
    document.addEventListener('click', unmute);
    document.addEventListener('keydown', unmute);
  }
  startLoaderTimers();

  // All timers start AFTER user clicks enter (so they're in sync with video)
  function startLoaderTimers() {
    var bl = [boot1, boot2, boot3, boot4];
    [0, 200, 400, 650].forEach(function(d, i) {
      if (!bl[i]) return;
      setTimeout(function() { bl[i].classList.add('ld-boot-visible'); }, d);
    });
    setTimeout(function() { if (text2) text2.classList.add('ld-visible'); }, 900);
    setTimeout(launch, 2000);

    // Progress bar — grows in steps matching boot lines + launch
    var bar = document.getElementById('ld-progress-bar');
    if (bar) {
      bar.style.width = '0%';
      setTimeout(function(){ bar.style.transition='width 0.4s ease'; bar.style.width='20%'; }, 0);
      setTimeout(function(){ bar.style.width='40%'; }, 200);
      setTimeout(function(){ bar.style.width='60%'; }, 400);
      setTimeout(function(){ bar.style.width='75%'; }, 650);
      setTimeout(function(){ bar.style.transition='width 0.6s ease'; bar.style.width='88%'; }, 900);
    }
  }

}

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
const TECH_LINKS={
  'Python':'https://www.python.org',
  'R':'https://www.r-project.org',
  'SQL':'https://en.wikipedia.org/wiki/SQL',
  'TypeScript':'https://www.typescriptlang.org',
  'React':'https://react.dev',
  'Node/Express':'https://expressjs.com',
  'FastAPI':'https://fastapi.tiangolo.com',
  'Neo4j':'https://neo4j.com',
  'Pinecone':'https://www.pinecone.io',
  'SQLite':'https://www.sqlite.org',
  'Tailwind CSS':'https://tailwindcss.com/',
  'Recharts':'https://recharts.org/en-US/',
  'pandas':'https://pandas.pydata.org',
  'numpy':'https://numpy.org',
  'scipy':'https://scipy.org',
  'XGBoost':'https://xgboost.ai',
  'Docker':'https://www.docker.com',
  'Flask':'https://flask.palletsprojects.com',
  'HTML':'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'CSS':'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'LLMs':null,
  'LMStudio':null,
  'TBD':null
};

const PROJECTS=[
  {
    name:'CometBot',
    category:'Personal Project',
    desc:'JSOMAdvisor is a full-stack advising app for JSOM graduate programs (MSBA, MSITM), with three assistant workflows: Degree Planner (catalog-based progress + remaining courses + LLM narrative), Career Mentor (role fit + certificate paths), and Skills Gap Analyzer (JD/resume-driven gaps).',
    stack:['Python','FastAPI','Neo4j','Pinecone','TypeScript'],
    demo:'#',
    github:'https://github.com/rahul-tamanam/CometBot',
    screenshot:'images/CometBot.png'
  },
  {
    name:'Velox',
    category:'Goldman Sachs Hackathon',
    badge:{ label:'3rd Place', kind:'bronze' },
    desc:'Velox is a localhost-only portfolio workspace for beginner and intermediate investors. It blends plain-English KPIs, macro-aware signals powered by the FRED economic data API, a 1,000-path Monte Carlo simulation engine, and a Macro-Aware Momentum monthly backtest (2020–present) with regime-shaded charts. Ships with a polished React+Vite client, Express+SQLite API, and optional Groq-powered AI assistant.',
    stack:['React','Node/Express','SQLite','Tailwind CSS','Recharts'],
    demo:'https://veloxfolio.vercel.app/',
    github:'https://github.com/rahul-tamanam/Velox',
    screenshot:'images/Velox.png'
  },
  {
    name:'PRISM',
    category:"FINHACK'26",
    desc:'Beanstalk. Terra. Euler. All had warning signs. PRISM watches for them in real time — six risk pillars, one composite score, one signal: ENTER / HOLD / REDUCE / EXIT. It measures TVL quality (not TVL level) to estimate stress exit liquidity and position sizing risk, updating every 15 minutes from live on-chain data.',
    stack:['React','Python','FastAPI','pandas','numpy','scipy'],
    demo:'https://defiprism.vercel.app/',
    github:'https://github.com/rahul-tamanam/Prism',
    screenshot:'images/Prism.png'
  },
  {
    name:'ChurnSense',
    category:'Personal Project',
    desc:'Most churn models tell you who’s leaving. This one tells you who’s leaving, why they’re leaving, and whether it’s even worth trying to stop them. An end-to-end ML pipeline for detecting, explaining, and acting on subscription churn risk — built on real KKBox behavioral data with synthetic intervention layers.',
    stack:['Python','SQL','XGBoost','FastAPI','React','LLMs'],
    demo:'https://churnsense-demo.vercel.app/',
    github:'https://github.com/rahul-tamanam/ChurnSense',
    screenshot:'images/ChurnSense.png'
  },
  {
    name:'Prompt Fuzzing Framework',
    category:'Personal Project',
    desc:'The Prompt Fuzzing Framework automatically mutates, tests, and analyzes prompts against LLMs to uncover unsafe, misaligned, or policy-violating behaviors. Includes a secure sandbox, automated detectors, and a triage interface to benchmark and visualize vulnerabilities.',
    stack:['Python','LLMs','HTML','LMStudio'],
    demo:null,
    github:'https://github.com/rahul-tamanam/PromptFuzzing',
    screenshot:'images/prompt_fuzzing.png'
  },
  {
    name:'PotionWatch',
    category:"HACKUTD'26",
    desc:'A real-time system that detects inconsistencies between potion drain data from cauldrons and potion transport tickets reported by witches — using statistical analysis, Flask APIs, and a React dashboard.',
    stack:['React','FastAPI','Flask','CSS'],
    demo:null,
    github:'https://github.com/rahul-tamanam/PotionWatch',
    screenshot:'images/PotionWatch.png'
  },
  {
    name:'BreatheEasy',
    category:'Undergrad Capstone',
    desc:'Breathe Easy is a deep learning project for respiratory disease classification. It analyzes lung sound recordings by extracting spectrogram features with CNNs and capturing temporal patterns with LSTMs to detect pulmonary conditions.',
    stack:['Python','HTML','CSS'],
    demo:null,
    github:'https://github.com/rahul-tamanam/BreatheEasy',
    screenshot:'images/breatheeasy.jpg'
  },
  {
    name:'Loan Predictor',
    category:'Personal Project',
    desc:'Machine learning project to automate loan decisioning by predicting approvals and modeling credit risk with classification models and data preprocessing.',
    stack:['Python'],
    demo:null,
    github:'https://github.com/rahul-tamanam/LoanApprovalPrediction',
    screenshot:'images/loanpred.png'
  },
];

// ═══════════════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════════════
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const curEl=document.getElementById('cur'), curDot=document.getElementById('curDot');
let mx=0,my=0,tx=0,ty=0,cursorVisible=false;
if(!isTouchDevice){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    curDot.style.left=mx+'px'; curDot.style.top=my+'px';
    if(!cursorVisible){cursorVisible=true;curEl.classList.add('visible');curDot.classList.add('visible');}
  });
  (function animCursor(){tx+=(mx-tx)*.12;ty+=(my-ty)*.12;curEl.style.left=tx+'px';curEl.style.top=ty+'px';requestAnimationFrame(animCursor);})();
}
function bindHover(){
  if(isTouchDevice) return;
  document.querySelectorAll('a,button,.nav-email,.hr-skill,.proj-card,.pd-btn,.icon-back-btn,.icon-close-btn,.pd-back,.social-item,.cv-side,.pd-stack-tag,.ab-contact-email,.ab-contact-social,.proj-h-screenshot,.proj-see-all-btn,.proj-h-btn').forEach(el=>{
    el.addEventListener('mouseenter',()=>curEl.classList.add('hover'));
    el.addEventListener('mouseleave',()=>curEl.classList.remove('hover'));
  });
}

// ═══════════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════════
const smLogo=document.getElementById('smLogo'); let smHovered=false;
function buildLetters(text,visible){
  smLogo.innerHTML=''; [...text].forEach((ch,i)=>{
    const s=document.createElement('span'); s.className='logo-letter'+(visible?' vis':'');
    s.textContent=ch===' '?'\u00A0':ch; s.style.transitionDelay=visible?(i*40)+'ms':'0ms'; smLogo.appendChild(s);
  });
}
smLogo.addEventListener('mouseenter',()=>{smHovered=true;buildLetters('RAHUL TAMANAM',false);requestAnimationFrame(()=>requestAnimationFrame(()=>{smLogo.querySelectorAll('.logo-letter').forEach(l=>l.classList.add('vis'));}));});
smLogo.addEventListener('mouseleave',()=>{smHovered=false;smLogo.querySelectorAll('.logo-letter').forEach(l=>{l.style.transitionDelay='0ms';l.classList.remove('vis');});setTimeout(()=>{if(!smHovered)buildLetters('RT',true);},200);});

// ═══════════════════════════════════════════════════════════════════
// LAUNCH — reveal portfolio after loader
// ═══════════════════════════════════════════════════════════════════
function launch() {
  const loader = document.getElementById('loader');
  const app    = document.getElementById('app');
  const vid    = document.getElementById('ld-video');
  if (!loader) return;

  if (vid) { vid.pause(); vid.src = ''; }
  // Complete progress bar to 100%
  const bar = document.getElementById('ld-progress-bar');
  if (bar) { bar.style.transition = 'width 0.4s ease'; bar.style.width = '100%'; }

  // Fade loader out
  setTimeout(() => {
    loader.style.transition = 'opacity 0.8s cubic-bezier(.4,0,.2,1)';
    loader.style.opacity = '0';
  }, 300);

  setTimeout(() => {
    loader.style.display = 'none';
    if (app) { app.style.display = 'block'; app.style.opacity = '0'; }
    initCardThumbs(); buildProjectCards(); initScrollSystem();
    initScrollReveal(); initGlobe(); buildQuote(); initContactForm(); bindHover(); initCareerLine();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (app) { app.style.transition = 'opacity 0.7s ease'; app.style.opacity = '1'; }
    }));
  }, 1150);
}

// ═══════════════════════════════════════════════════════════════════
// CONTACT FORM (Resend via /api/contact)
// ═══════════════════════════════════════════════════════════════════
function initContactForm(){
  const statusEl=document.getElementById('contactStatusText');
  const form=document.getElementById('contactForm');
  const note=document.getElementById('cfNote');
  const btn=document.getElementById('cfSendBtn');
  if(!form) return;

  // Status line (local time + availability)
  if(statusEl){
    const now=new Date();
    const timeStr=now.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
    const hour=now.getHours();
    const awake = hour >= 9 && hour <= 21;
    statusEl.innerHTML = `It’s currently <b>${timeStr}</b> for me, so I’m probably <b>${awake ? 'Awake' : 'Offline'}</b>. I’ll get back to you soon.`;
  }

  function setNote(msg, kind){
    if(!note) return;
    note.classList.remove('ok','err');
    if(kind) note.classList.add(kind);
    note.textContent = msg || '';
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd=new FormData(form);
    const payload={
      name:String(fd.get('name')||'').trim(),
      email:String(fd.get('email')||'').trim(),
      message:String(fd.get('message')||'').trim(),
    };
    if(!payload.name || !payload.email || !payload.message){
      setNote('Please fill out all fields.', 'err');
      return;
    }

    btn && (btn.disabled=true);
    setNote('Sending…');
    try{
      const res=await fetch('/api/contact', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload),
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(data?.error || 'Failed to send message.');
      form.reset();
      setNote('Message sent. Thank you!', 'ok');
    }catch(err){
      setNote(err?.message || 'Something went wrong. Please try again.', 'err');
    }finally{
      btn && (btn.disabled=false);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════
function copyEmail(){navigator.clipboard.writeText('rahultamanam24@gmail.com').then(()=>{const b=document.getElementById('emailBtn');b.classList.add('copied');setTimeout(()=>b.classList.remove('copied'),2000);});}
function downloadCV(e){if(e)e.preventDefault();window.location.href='Rahul_Tamanam_Resume.pdf';}
window.copyAbEmail=function(e){
  e.preventDefault();
  navigator.clipboard.writeText('rahultamanam24@gmail.com').then(()=>{
    const c=document.getElementById('abEmailCopied'); if(!c)return;
    c.classList.add('show'); setTimeout(()=>c.classList.remove('show'),2000);
  }).catch(()=>{});
};

// ═══════════════════════════════════════════════════════════════════
// TEXT SCRAMBLE — hero right side
// ═══════════════════════════════════════════════════════════════════
function initHeroTextScramble() {
  const line1 = document.getElementById('scrambleLine1');
  const line2 = document.getElementById('scrambleLine2');
  if (!line1 || !line2) return;

  const roles = [
    ['DATA', 'ANALYST'],
    ['DATA', 'ANALYTICS'],
    ['BUSINESS', 'INTELLIGENCE'],
    ['AI', 'ENGINEERING'],
    ['MACHINE', 'LEARNING'],
  ];

  const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const duration = 800; // ms
  const speed = 40; // ms per tick

  let idx = 0;
  let isAnimating = false;

  function scrambleTo(el, target) {
    return new Promise((resolve) => {
      const text = target;
      const steps = Math.max(1, Math.floor(duration / speed));
      let step = 0;
      const len = text.length;

      const interval = setInterval(() => {
        let scrambled = '';
        const progress = step / steps;
        for (let i = 0; i < len; i++) {
          const ch = text[i];
          if (ch === ' ') { scrambled += ' '; continue; }
          if (progress * len > i) scrambled += ch;
          else scrambled += characterSet[Math.floor(Math.random() * characterSet.length)];
        }
        el.textContent = scrambled;
        step++;
        if (step > steps) {
          clearInterval(interval);
          el.textContent = text;
          resolve();
        }
      }, speed);
    });
  }

  async function setRole(nextIdx) {
    if (isAnimating) return;
    isAnimating = true;
    const [a, b] = roles[nextIdx];
    await Promise.all([scrambleTo(line1, a), scrambleTo(line2, b)]);
    isAnimating = false;
  }

  // initial
  setRole(0);

  // cycle
  setInterval(() => {
    idx = (idx + 1) % roles.length;
    setRole(idx);
  }, 2600);
}

// ═══════════════════════════════════════════════════════════════════
// QUOTE
// ═══════════════════════════════════════════════════════════════════
const FULL_QUOTE="I build things with data. Sometimes it's machine learning models, sometimes it's analytics that uncover useful insights. Either way, the goal is the same: turning information into decisions that actually matter. With a strong background in IT and hands-on expertise in artificial intelligence and machine learning, I enjoy turning complex data into practical solutions. I’m driven by curiosity and a genuine interest in building systems that create real impact, whether that’s improving decision-making, automating processes, or unlocking new insights through AI.";
function buildQuote(){
  const el=document.getElementById('abQuoteText');
  if(!el||el.dataset.built)return; el.dataset.built='1'; el.textContent=FULL_QUOTE;
}

// ═══════════════════════════════════════════════════════════════════
// BUILD HORIZONTAL PROJECT CARDS
// ═══════════════════════════════════════════════════════════════════
function buildProjectCards(){
  const track=document.getElementById('projHscrollTrack'); if(!track)return;
  track.innerHTML='';
  PROJECTS.forEach((p,i)=>{
    const card=document.createElement('div'); card.className='proj-h-card';
    const tags=p.stack.map(t=>{const url=TECH_LINKS[t];return url?`<a class="pd-stack-tag" href="${url}" target="_blank" rel="noopener">${t}</a>`:`<span class="pd-stack-tag">${t}</span>`;}).join('');
    const badge = p.badge?.label ? `
      <div class="proj-h-badge proj-h-badge--${p.badge.kind||'default'}" title="${p.badge.label}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 2h4l1 4-3 3-3-3 1-4zM13 2h4l1 4-3 3-3-3 1-4z"/>
          <circle cx="12" cy="15" r="5"/>
          <path d="M12 12.2l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3.9-1.8z" fill="currentColor" opacity=".95"/>
        </svg>
        <span>${p.badge.label}</span>
      </div>
    ` : '';
    const demoBtn=p.demo!=null?`<a class="proj-h-btn proj-h-btn-primary" href="${p.demo}" ${p.demo!=='#'?'target="_blank" rel="noopener"':''} ${p.demo==='#'?'onclick="return false;" style="opacity:.4;pointer-events:none;"':''}>
          <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo
        </a>`:'';
    card.innerHTML=`
      <div class="proj-h-num">${String(i+1).padStart(2,'0')}</div>
      <div class="proj-h-top">
        <div class="proj-h-meta">
          <div class="proj-h-category">${p.category}</div>
          ${badge}
        </div>
        <div class="proj-h-name">${p.nameStyle||(()=>{const w=p.name.split(' ');return w.length>1?w[0]+' <span style="color:var(--blue)">'+w.slice(1).join(' ')+'</span>':p.name;})()} </div>
      </div>
      <div class="proj-h-tools-label">Tools and features</div>
      <div class="proj-h-tags">${tags}</div>
      <div class="proj-h-screenshot" data-idx="${i}">
        <img src="${p.screenshot}" alt="${p.name}" onload="this.classList.add('loaded')" onerror="this.style.display='none'">
        <div class="proj-h-corner tl"></div><div class="proj-h-corner tr"></div>
        <div class="proj-h-corner bl"></div><div class="proj-h-corner br"></div>
      </div>
      <div class="proj-h-actions">
        ${demoBtn}
        <a class="proj-h-btn proj-h-btn-outline" href="${p.github}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>GitHub
        </a>
      </div>
    `;
    const ss=card.querySelector('.proj-h-screenshot');
    // Clicking a project should open the full detail view (not just the image lightbox).
    ss.style.cursor='pointer';
    ss.onclick=()=>{
      try { openProjectsFull(); } catch(e) {}
      try { openDetail(i); } catch(e) {}
    };
    track.appendChild(card);
  });
  initHorizontalScroll();
  bindHover();
}

// ═══════════════════════════════════════════════════════════════════
// HORIZONTAL SCROLL
// ═══════════════════════════════════════════════════════════════════
function initHorizontalScroll(){
  const wrapper=document.getElementById('projHscrollWrapper');
  const track=document.getElementById('projHscrollTrack');
  if(!wrapper||!track)return;
  let hPos=0;
  function getMax(){ return Math.max(0,track.scrollWidth-wrapper.clientWidth); }
  function setPos(next){
    const max=getMax();
    hPos=Math.max(0,Math.min(max,next));
    track.style.transform=`translateX(-${hPos}px)`;
  }
  function canScroll(delta){
    const max=getMax();
    if(max<=0) return false;
    if(delta>0 && hPos<max) return true;
    if(delta<0 && hPos>0) return true;
    return false;
  }
  function onWheel(e){
    // Support both trackpads and mouse wheels:
    // - Trackpad: deltaX dominates → horizontal scroll
    // - Mouse wheel: deltaY → map to horizontal while the carousel can still scroll
    //   (once at start/end, we let the page scroll vertically again)
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    const intentHorizontal = absX > absY;
    const delta = intentHorizontal ? e.deltaX : e.deltaY;

    // If we can't scroll the carousel in this direction, don't intercept.
    if(!canScroll(delta)) return;

    e.preventDefault();
    setPos(hPos + delta*1.5);
  }

  // Wheel over the wrapper: horizontal intent scrolls the track.
  wrapper.addEventListener('wheel', onWheel, {passive:false});

  let tStartX=0,tStartH=0;
  wrapper.addEventListener('touchstart',e=>{tStartX=e.touches[0].clientX;tStartH=hPos;},{passive:true});
  wrapper.addEventListener('touchmove',e=>{
    const dx=tStartX-e.touches[0].clientX;
    setPos(tStartH+dx);
  },{passive:true});
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL SYSTEM — progress bar + active nav
// ═══════════════════════════════════════════════════════════════════
// FIXED: About Me + Tech Stack + Strengths → navAbout
const SECTION_NAV_MAP = {
  'section-home':     'navHome',
  'section-whatido':  'navAbout',
  'section-about':    'navAbout',
  'section-career':   'navAbout',
  'section-techstack':'navAbout',
  'section-strengths':'navAbout',
  'section-projects': 'navProjects',
  'section-contact':  'navContact',
};

function initScrollSystem(){
  const sc=document.getElementById('scroll-container');
  const pt=document.getElementById('progress-top');
  if(!sc)return;

  sc.addEventListener('scroll',()=>{
    // Progress bar
    const max=sc.scrollHeight-sc.clientHeight;
    const pct=max>0?(sc.scrollTop/max*100):0;
    if(pt)pt.style.setProperty('--progress',pct+'%');

    // Active nav — find which section is most in view
    const scrollMid=sc.scrollTop+sc.clientHeight*0.4;
    let activeSection=null;
    Object.keys(SECTION_NAV_MAP).forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      if(el.offsetTop<=scrollMid) activeSection=id;
    });
    const activeNav=activeSection?SECTION_NAV_MAP[activeSection]:null;
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    if(activeNav){ const el=document.getElementById(activeNav); if(el)el.classList.add('active'); }
  },{passive:true});

  document.getElementById('navHome')?.classList.add('active');
}

// ═══════════════════════════════════════════════════════════════════
// SMOOTH SCROLL TO SECTION — FIXED: now truly smooth
// ═══════════════════════════════════════════════════════════════════
function scrollToSection(name){
  const sc=document.getElementById('scroll-container');
  const map={
    home:'section-home',
    about:'section-about',
    techstack:'section-techstack',
    projects:'section-projects',
    contact:'section-contact'
  };
  const id=map[name]||('section-'+name);
  const el=document.getElementById(id);
  if(!el||!sc)return;

  // If the full projects overlay is open, close it first so navigation works.
  const overlay=document.getElementById('page-projects-full');
  const overlayOpen=!!overlay && (overlay.classList.contains('visible') || overlay.classList.contains('open') || overlay.style.display==='flex');
  if(overlayOpen){
    closeProjectsFull();
    // Also ensure we're back on the grid (not detail) so next open is consistent.
    try { closeDetail(); } catch(e) {}
  }

  function runScroll(){
    const targetScrollTop = el.offsetTop;
    const startScrollTop = sc.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 0.6));
    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    }

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      sc.scrollTop = startScrollTop + distance * ease;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // If we had to close the overlay, wait for its fade-out.
  if(overlayOpen) setTimeout(runScroll, 420);
  else runScroll();
}

// ═══════════════════════════════════════════════════════════════════
// BIDIRECTIONAL SCROLL REVEAL
// ═══════════════════════════════════════════════════════════════════
function initScrollReveal(){
  const sc=document.getElementById('scroll-container');
  const sections = [...document.querySelectorAll('.scroll-section:not(.section-home)')];
  const innerEls = [...document.querySelectorAll('.ab-big-title,.ab-quote-wrap,.ab-globe-wrap,.ab-strength-card,.wid-cards-anim')];

  // Track section visibility state
  const sectionStates = new Map(); // id -> 'above' | 'visible' | 'below'
  sections.forEach(el => sectionStates.set(el.id, 'below'));

  function updateSections() {
    const viewTop = sc.scrollTop;
    const viewBottom = viewTop + sc.clientHeight;
    const threshold = sc.clientHeight * 0.15;

    sections.forEach(el => {
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const prevState = sectionStates.get(el.id);

      // Determine new state
      let newState;
      if (elBottom < viewTop + threshold) {
        newState = 'above';
      } else if (elTop > viewBottom - threshold) {
        newState = 'below';
      } else {
        newState = 'visible';
      }

      if (newState === prevState) return;
      sectionStates.set(el.id, newState);

      // Remove all state classes first
      el.classList.remove('section-visible', 'section-exit-up', 'section-exit-down');

      if (newState === 'visible') {
        // Small delay so transition fires
        requestAnimationFrame(() => el.classList.add('section-visible'));
      } else if (newState === 'above') {
        // Was visible, now scrolled past upward — exit up
        el.classList.add('section-exit-up');
      } else if (newState === 'below') {
        // Was visible or above, now scrolled down past — reset to below
        el.classList.add('section-exit-down');
      }
    });
  }

  // Inner element intersection observer (bidirectional)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const el = e.target;
      if (e.isIntersecting) {
        // Entering view
        if (el.classList.contains('ab-strength-card')) {
          const cards = [...document.querySelectorAll('.ab-strength-card')];
          const delay = cards.indexOf(el) * 110;
          setTimeout(() => {
            el.classList.remove('ab-exit');
            el.classList.add('ab-visible');
          }, delay);
        } else {
          el.classList.remove('ab-exit');
          requestAnimationFrame(() => el.classList.add('ab-visible'));
        }
      } else {
        // Leaving view — reset for re-animation
        el.classList.remove('ab-visible');
        el.classList.add('ab-exit');
        // After exit transition, fully reset
        setTimeout(() => {
          el.classList.remove('ab-exit');
        }, 500);
      }
    });
  }, { root: sc, threshold: 0.1 });

  innerEls.forEach(el => io.observe(el));

  // Listen to scroll for section bidirectional
  sc.addEventListener('scroll', updateSections, { passive: true });
  // Initial check
  setTimeout(updateSections, 100);
}

// ═══════════════════════════════════════════════════════════════════
// FULL PROJECTS OVERLAY
// ═══════════════════════════════════════════════════════════════════
function openProjectsFull(){
  const o=document.getElementById('page-projects-full'); if(!o)return;
  o.classList.add('open');
  o.style.display='flex';
  requestAnimationFrame(()=>o.classList.add('visible'));
  document.getElementById('proj-detail-view').style.display='none';
  document.getElementById('proj-grid-view').style.display='flex';
  initCardThumbs();
}
function closeProjectsFull(){
  const o=document.getElementById('page-projects-full'); if(!o)return;
  o.classList.remove('visible');
  setTimeout(()=>{
    o.classList.remove('open');
    o.style.display='none';
  },400);
}
window.closeProjectsFull=closeProjectsFull;

// Always allow ESC to close the projects overlay
document.addEventListener('keydown',(e)=>{
  if(e.key!=='Escape') return;
  const o=document.getElementById('page-projects-full');
  const open=!!o && (o.classList.contains('visible') || o.classList.contains('open') || o.style.display==='flex');
  if(open) closeProjectsFull();
});

function initCardThumbs(){
  PROJECTS.forEach((p,i)=>{
    if(!p.screenshot)return;
    const img=document.getElementById('pc-ti-'+i);
    const fb=document.getElementById('pc-fb-'+i); if(!img)return;
    img.className='pc-thumb-img'; img.src=p.screenshot;
    img.onload=()=>{img.classList.add('loaded');if(fb)fb.style.display='none';};
    img.onerror=()=>{img.style.display='none';};
  });
}

function openDetail(i){
  const p=PROJECTS[i];
  document.getElementById('pd-crumb-name').textContent=p.name;
  document.getElementById('pd-index').textContent='PROJECT '+String(i+1).padStart(2,'0');
  const parts=p.name.split(' ');
  document.getElementById('pd-name').innerHTML=p.nameStyle||(()=>{const w=p.name.split(' ');return w.length>1?w[0]+' <span style="color:var(--blue)">'+w.slice(1).join(' ')+'</span>':p.name;})();
  document.getElementById('pd-desc').textContent=p.desc;
  document.getElementById('pd-stack').innerHTML=p.stack.map(t=>{const url=TECH_LINKS[t];return url?`<a class="pd-stack-tag" href="${url}" target="_blank" rel="noopener">${t}</a>`:`<span class="pd-stack-tag">${t}</span>`;}).join('');
  const pdDemo=document.getElementById('pd-demo');
  if(p.demo==null){pdDemo.style.display='none';pdDemo.removeAttribute('href');pdDemo.onclick=null;}
  else{
    pdDemo.style.display='';
    pdDemo.href=p.demo;
    const dis=p.demo==='#';
    if(dis){pdDemo.removeAttribute('target');pdDemo.removeAttribute('rel');pdDemo.style.opacity='.4';pdDemo.style.pointerEvents='none';pdDemo.onclick=()=>false;}
    else{pdDemo.target='_blank';pdDemo.rel='noopener';pdDemo.style.opacity='';pdDemo.style.pointerEvents='';pdDemo.onclick=null;}
  }
  document.getElementById('pd-github').href=p.github;
  const imgEl=document.getElementById('pd-screenshot-img'),ph=document.getElementById('pd-shot-placeholder');
  if(p.screenshot){imgEl.style.display='block';imgEl.classList.remove('loaded');imgEl.src=p.screenshot;imgEl.onload=()=>imgEl.classList.add('loaded');ph.style.display='none';imgEl.style.cursor='zoom-in';imgEl.onclick=()=>window.openScreenshot&&window.openScreenshot(p.screenshot);}
  else{imgEl.style.display='none';imgEl.src='';ph.style.display='flex';imgEl.onclick=null;}
  document.getElementById('proj-grid-view').style.display='none';
  const dv=document.getElementById('proj-detail-view');
  dv.style.display='flex'; dv.classList.remove('animating'); void dv.offsetWidth; dv.classList.add('animating');
  setTimeout(()=>dv.classList.remove('animating'),800); bindHover();
}
function closeDetail(){document.getElementById('proj-detail-view').style.display='none';document.getElementById('proj-grid-view').style.display='flex';}

// ═══════════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════════
window.openScreenshot=function(src){
  if(!src)return;
  let lb=document.getElementById('screenshotLightbox');
  if(!lb){
    lb=document.createElement('div'); lb.id='screenshotLightbox';
    lb.innerHTML=`<div class="slb-bg"></div><div class="slb-inner"><img id="slbImg" src=""><button class="slb-close" onclick="closeScreenshot()">&#10005;</button></div>`;
    document.body.appendChild(lb);
    lb.querySelector('.slb-bg').addEventListener('click',closeScreenshot);
    if(!isTouchDevice){const cl=lb.querySelector('.slb-close');cl.addEventListener('mouseenter',()=>curEl.classList.add('hover'));cl.addEventListener('mouseleave',()=>curEl.classList.remove('hover'));}
  }
  document.getElementById('slbImg').src=src;
  lb.classList.add('slb-open'); document.body.style.overflow='hidden';
};
window.closeScreenshot=function(){
  const lb=document.getElementById('screenshotLightbox'); if(lb)lb.classList.remove('slb-open');
  document.body.style.overflow='';
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeScreenshot();});

// ═══════════════════════════════════════════════════════════════════
// GLOBE — 3D tech stack (unchanged)
// ═══════════════════════════════════════════════════════════════════
const SKILLS=[
  // Data Engineering
  {name:'Python',color:'#3776ab',url:'https://www.python.org',svg:'<path fill="#3776ab" d="M12.2 2c-3.6 0-3.4 1.6-3.4 3.4V7h6.9v1H6.2C4 8 2 9.3 2 12s1.7 4 4.2 4h2.7v-2.4c0-2.2 1.9-4.2 4.2-4.2h6.8c1.9 0 3.4-1.6 3.4-3.4V5.4C23.3 3.3 21 2 18.8 2h-6.6z"/><path fill="#ffd43b" d="M11.8 22c3.6 0 3.4-1.6 3.4-3.4V17H8.3v-1h9.5c2.2 0 4.2-1.3 4.2-4s-1.7-4-4.2-4h-2.7v2.4c0 2.2-1.9 4.2-4.2 4.2H4.2C2.3 14.6.8 16.2.8 18v.6C.8 20.7 3.1 22 5.3 22h6.5z"/><circle cx="9.2" cy="5.2" r="1" fill="#fff"/><circle cx="14.8" cy="18.8" r="1" fill="#fff"/>'},
  {name:'R',color:'#276dc3',url:'https://www.r-project.org',svg:'<ellipse cx="12" cy="12" rx="10" ry="6.5" fill="#276dc3"/><ellipse cx="12" cy="12" rx="8" ry="5" fill="#ffffff"/><path d="M13 8h3.2c1.6 0 2.8 1.1 2.8 2.5S17.8 13 16.2 13H15l2.3 3H15l-2-2.8V16H11V8h2zm0 2v2h2.8c.7 0 1.2-.4 1.2-1s-.5-1-1.2-1H13z" fill="#276dc3"/>'},
  {name:'SQL',color:'#2d72d2',url:'https://en.wikipedia.org/wiki/SQL',svg:'<rect x="2" y="4" width="20" height="16" rx="3" fill="#2d72d2"/><text x="12" y="15" text-anchor="middle" font-family="Outfit, sans-serif" font-size="8" font-weight="700" fill="#fff">SQL</text>'},
  {name:'PySpark',color:'#e25a1c',url:'https://spark.apache.org',svg:'<path fill="#e25a1c" d="M12 2l3 6-3 1-3-1 3-6zm0 8c3.3 0 6 2.2 6 5s-2.7 5-6 5-6-2.2-6-5 2.7-5 6-5z"/><path fill="#fff" d="M10.2 15.4c1.4.6 3 .5 4.2-.3-.2 1.3-1.2 2.4-2.7 2.7-1.4.3-2.9-.2-3.7-1.2.7-.5 1.5-.9 2.2-1.2z" opacity=".9"/>'},
  {name:'Hadoop',color:'#ffcc00',url:'https://hadoop.apache.org',svg:'<rect x="3" y="3" width="18" height="18" rx="4" fill="#ffcc00"/><path fill="#000" d="M9 7h6v2H9V7zm0 4h6v6H9v-6z"/>'},
  {name:'Hive',color:'#f7b500',url:'https://hive.apache.org',svg:'<path fill="#f7b500" d="M12 2l7 4v12l-7 4-7-4V6l7-4z"/><path fill="#fff" d="M9 9h6v2H9V9zm0 4h6v2H9v-2z" opacity=".9"/>'},

  // Warehouses / Cloud
  {name:'Snowflake',color:'#29b5e8',url:'https://www.snowflake.com',svg:'<path fill="#29b5e8" d="M9.5 7.2c-.7-1.2-2.3-1.6-3.5-.9-1.2.7-1.6 2.3-.9 3.5.1.2.3.5.5.6-1.3.3-2.2 1.5-2.2 2.9 0 1.6 1.3 3 3 3 .3 0 .5 0 .8-.1.2 1.4 1.4 2.5 2.9 2.5 1 0 1.9-.5 2.4-1.3.5.8 1.4 1.3 2.4 1.3 1.5 0 2.7-1.1 2.9-2.5.3.1.5.1.8.1 1.6 0 3-1.3 3-3 0-1.4-1-2.6-2.2-2.9.2-.2.3-.4.5-.6.7-1.2.3-2.8-.9-3.5-1.2-.7-2.8-.3-3.5.9-.2.3-.3.6-.3.9-.6-.5-1.4-.8-2.3-.8s-1.7.3-2.3.8c0-.3-.1-.6-.3-.9z"/>'},
  {name:'AWS',color:'#ff9900',url:'https://aws.amazon.com',svg:'<rect x="2" y="2" width="20" height="20" rx="4" fill="#232f3e"/><path fill="#ff9900" d="M7 14c1.7 1.2 3.4 1.8 5.5 1.8 2.4 0 4.5-.7 6.3-2l.7.9c-1.9 1.6-4.5 2.6-7.2 2.6-2.4 0-4.6-.7-6.4-2.1l1.1-1.2z"/><text x="12" y="12.8" text-anchor="middle" font-family="Outfit, sans-serif" font-size="7" font-weight="700" fill="#ff9900">aws</text>'},
  {name:'GCP',color:'#4285f4',url:'https://cloud.google.com',svg:'<path fill="#4285f4" d="M12 3a6.5 6.5 0 016.3 4.8l-2.1.8A4.3 4.3 0 0012 6.3c-1.7 0-3.2 1-3.9 2.4l-2-1A6.5 6.5 0 0112 3z"/><path fill="#34a853" d="M5.2 8.2A6.5 6.5 0 0012 21c2.7 0 5.1-1.6 6.1-4l-2.1-.8A4.3 4.3 0 0112 18.7c-2.3 0-4.2-1.8-4.3-4.1l-2.5-.1z"/><path fill="#fbbc05" d="M18.8 8.2l-2 1A4.3 4.3 0 0116.3 12c0 .6-.1 1.1-.3 1.6l2.1.8c.4-.8.6-1.7.6-2.6 0-1.3-.3-2.5-.9-3.6z"/><path fill="#ea4335" d="M7.9 9.6A4.3 4.3 0 007.7 12c0 .9.3 1.8.8 2.4l-2 1A6.5 6.5 0 015.5 12c0-1.2.3-2.3.8-3.3l1.6.9z"/>'},

  // Databases & Tools
  {name:'PostgreSQL',color:'#336791',url:'https://www.postgresql.org',svg:'<path fill="#336791" d="M12 3c3.9 0 6.5 2.4 6.5 6.4 0 2.6-.7 4.8-1.4 6.2-.6 1.2-1.2 1.9-2 2.1-.7.2-1.5 0-2.4-.5l-.4-.2-.3 2.2c-.1.7-.7 1.3-1.5 1.3h-1c-.8 0-1.4-.6-1.5-1.3l-.3-2.2-.4.2c-.9.5-1.7.7-2.4.5-.8-.2-1.4-.9-2-2.1C5.2 14.2 4.5 12 4.5 9.4 4.5 5.4 8.1 3 12 3z"/><circle cx="10" cy="9" r="1" fill="#fff"/><circle cx="14" cy="9" r="1" fill="#fff"/><path fill="#fff" d="M10.2 12.2c1 .9 2.6.9 3.6 0l.7.8c-1.5 1.4-3.5 1.4-5 0l.7-.8z" opacity=".9"/>'},
  {name:'MongoDB',color:'#47a248',url:'https://www.mongodb.com',svg:'<path fill="#47a248" d="M12 2s3.7 3.2 4 8.1c.3 4.7-2.4 8.7-3.4 9.9l-.6 2-.6-2c-1-1.2-3.7-5.2-3.4-9.9C8.3 5.2 12 2 12 2z"/><path fill="#fff" d="M12 4c.6 1.4 1 3 .9 5.2-.1 3.8-.8 6.7-.9 7.2-.1-.5-.8-3.4-.9-7.2C11 7 11.4 5.4 12 4z" opacity=".85"/>'},
  {name:'Docker',color:'#2496ed',url:'https://www.docker.com',svg:'<path fill="#2496ed" d="M9 10h2v2H9v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zM6 10h2v2H6v-2zm3-3h2v2H9V7zm3 0h2v2h-2V7z"/><path fill="#2496ed" d="M21 12c-.6-.4-1.7-.4-2.3 0-.3-1.2-1.2-2-2.5-2H6.2v2.8c0 2.7 2.2 4.9 4.9 4.9h3.4c2.9 0 5.4-1.8 6.2-4.4.7.1 1.4-.1 1.9-.6.7-.7.7-1.9 0-2.7z"/>'},
  {name:'FastAPI',color:'#009688',url:'https://fastapi.tiangolo.com',svg:'<path fill="#009688" d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><path fill="#fff" d="M9 8h6v2H9V8zm0 4h4v2H9v-2z" opacity=".9"/>'},
  {name:'Git',color:'#f05032',url:'https://git-scm.com',svg:'<path fill="#f05032" d="M22.2 10.8l-9-9a1.4 1.4 0 00-2 0l-2 2 2.5 2.5a1.7 1.7 0 012.1 2.1l2.4 2.4a1.7 1.7 0 011.8 2.8 1.7 1.7 0 01-2.9-1.8l-2.2-2.2v5.8a1.7 1.7 0 11-2 0V9.3a1.7 1.7 0 01-.9-2.8L7.5 4 1.8 9.8a1.4 1.4 0 000 2l9 9a1.4 1.4 0 002 0l9.4-9.4a1.4 1.4 0 000-2z"/>'},

  // Data Analysis & Viz
  {name:'Pandas',color:'#150458',url:'https://pandas.pydata.org',svg:'<rect x="6" y="3" width="3" height="18" fill="#150458"/><rect x="10.5" y="3" width="3" height="18" fill="#150458" opacity=".75"/><rect x="15" y="3" width="3" height="18" fill="#150458" opacity=".55"/>'},
  {name:'NumPy',color:'#013243',url:'https://numpy.org',svg:'<path fill="#013243" d="M7 6l5-3 5 3v12l-5 3-5-3V6z"/><path fill="#4dabcf" d="M12 5l3 1.7v10.6L12 19l-3-1.7V6.7L12 5z"/>'},
  {name:'Power BI',color:'#f2c811',url:'https://powerbi.microsoft.com',svg:'<rect x="4" y="6" width="4" height="12" rx="1" fill="#f2c811"/><rect x="10" y="4" width="4" height="14" rx="1" fill="#f2c811" opacity=".85"/><rect x="16" y="8" width="4" height="10" rx="1" fill="#f2c811" opacity=".7"/>'},
  {name:'Tableau',color:'#4e79a7',url:'https://www.tableau.com',svg:'<path fill="#4e79a7" d="M12 4v16M4 12h16M7 7h10M7 17h10M9 9v6M15 9v6" stroke="#4e79a7" stroke-width="1.6" stroke-linecap="round"/>'},
  {name:'Excel',color:'#217346',url:'https://www.microsoft.com/microsoft-365/excel',svg:'<rect x="3" y="4" width="18" height="16" rx="2" fill="#217346"/><path fill="#fff" d="M8 8l2.2 4L8 16h2l1.2-2.6L12.4 16h2l-2.2-4 2.2-4h-2l-1.2 2.6L10 8H8z"/>'},

  // AI/ML & LLM Tools (only where we can show a reasonable icon)
  {name:'Hugging Face',color:'#ffcc4d',url:'https://huggingface.co',svg:'<circle cx="12" cy="12" r="9" fill="#ffcc4d"/><circle cx="9" cy="11" r="1" fill="#000"/><circle cx="15" cy="11" r="1" fill="#000"/><path d="M9 15c1 .9 2.2 1.3 3 1.3s2-.4 3-1.3" fill="none" stroke="#000" stroke-width="1.3" stroke-linecap="round"/>'},
  {name:'LangChain',color:'#00d2a8',url:'https://www.langchain.com',svg:'<path fill="#00d2a8" d="M7 7h6l4 4v6H7V7z"/><path fill="#fff" d="M9 10h6v1.6H9V10zm0 3h4v1.6H9V13z" opacity=".9"/>'},
  {name:'Pinecone',color:'#FEBD00',url:'https://www.pinecone.io',svg:'<path fill="#FEBD00" d="M12 3l7 7-7 11L5 10l7-7z"/><path fill="#0b2a33" d="M12 7l3 3-3 5-3-5 3-3z" opacity=".35"/>'},
  {name:'Neo4j',color:'#008cc1',url:'https://neo4j.com',svg:'<circle cx="12" cy="12" r="9" fill="#008cc1"/><path fill="#fff" d="M8 14c1.2 1.2 2.4 1.7 4 1.7s2.8-.5 4-1.7l-1.1-1.1c-.8.8-1.6 1.1-2.9 1.1s-2.1-.3-2.9-1.1L8 14z" opacity=".95"/>'},
  {name:'W&B',color:'#ffbe00',url:'https://wandb.ai',svg:'<rect x="3" y="5" width="18" height="14" rx="3" fill="#ffbe00"/><text x="12" y="14.2" text-anchor="middle" font-family="Outfit, sans-serif" font-size="7.5" font-weight="800" fill="#000">W&amp;B</text>'},
  {name:'scikit-learn',color:'#f7931e',url:'https://scikit-learn.org',svg:'<path fill="#f7931e" d="M12 3l7 4v10l-7 4-7-4V7l7-4z"/><circle cx="10" cy="11" r="2.2" fill="#fff" opacity=".9"/><circle cx="14.5" cy="14.2" r="1.6" fill="#fff" opacity=".9"/>'},
  {name:'XGBoost',color:'#5e6ad2',url:'https://xgboost.ai',svg:'<rect x="3" y="4" width="18" height="16" rx="4" fill="#5e6ad2"/><text x="12" y="15" text-anchor="middle" font-family="Outfit, sans-serif" font-size="7" font-weight="800" fill="#fff">XGB</text>'},
];

function initCareerLine(){
  const sc=document.getElementById('scroll-container');
  const section=document.getElementById('section-career');
  const fill=document.getElementById('careerLineFill');
  const dot=document.getElementById('careerLineDot');
  if(!sc||!section||!fill||!dot)return;
  const entries=[...section.querySelectorAll('.career-entry')];
  const titleEls=[...section.querySelectorAll('.career-title-1,.career-title-2,.career-title-ul')];

  // Set transitions
  [...titleEls,...entries].forEach(el=>{
    el.style.transition='opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)';
  });

  function update(){
    const secTop=section.offsetTop,secH=section.offsetHeight,viewH=sc.clientHeight,st=sc.scrollTop;
    const pct=Math.max(0,Math.min(1,(st-(secTop-viewH*.7))/((secTop+secH-viewH*.3)-(secTop-viewH*.7))));

    fill.style.height=(pct*100)+'%';
    dot.style.top=(pct*100)+'%';

    // Section is visible when pct between 0.03 and 0.97
    const visible=pct>0.03&&pct<0.97;

    titleEls.forEach((el,i)=>{
      el.style.transitionDelay=visible?(i*0.08)+'s':'0s';
      el.style.opacity=visible?'1':'0';
      el.style.transform=visible?'translateY(0)':'translateY(20px)';
    });

    entries.forEach((e,i)=>{
      e.style.transitionDelay=visible?(0.1+i*0.07)+'s':'0s';
      e.style.opacity=visible?'1':'0';
      e.style.transform=visible?'translateY(0)':'translateY(16px)';
    });
  }

  // Init hidden
  [...titleEls,...entries].forEach(el=>{ el.style.opacity='0'; el.style.transform='translateY(16px)'; });

  sc.addEventListener('scroll',update,{passive:true});
  update();
}

function initGlobe(){
  const canvas=document.getElementById('globeCanvas'); if(!canvas)return;
  const ctx=canvas.getContext('2d');
  function setSize(){canvas.width=canvas.parentElement.clientWidth;canvas.height=canvas.parentElement.clientHeight;}
  setSize(); window.addEventListener('resize',setSize);
  const ICON_SIZE=128;
  function fibSphere(n){const pts=[],G=Math.PI*(3-Math.sqrt(5));for(let i=0;i<n;i++){const y=1-(i/(n-1))*2,r=Math.sqrt(1-y*y),t=G*i;pts.push([Math.cos(t)*r,y,Math.sin(t)*r]);}return pts;}
  function renderIcons(size){return SKILLS.map(sk=>{const oc=document.createElement('canvas');oc.width=oc.height=size;const c=oc.getContext('2d');const svgStr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">${sk.svg}</svg>`;const blob=new Blob([svgStr],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const img=new Image();img.src=url;img.onload=()=>{c.drawImage(img,0,0,size,size);URL.revokeObjectURL(url);};return{img,name:sk.name,color:sk.color,url:sk.url};});}
  const icons=renderIcons(ICON_SIZE),pts=fibSphere(SKILLS.length);
  let rotY=0,rotX=0.3,isDragging=false,lastMX=0,lastMY=0,velX=0,velY=0.005,hoveredIdx=-1;
  canvas.addEventListener('mousedown',e=>{isDragging=true;lastMX=e.clientX;lastMY=e.clientY;velX=0;velY=0;});
  window.addEventListener('mouseup',()=>isDragging=false);
  window.addEventListener('mousemove',e=>{if(!isDragging)return;const dx=e.clientX-lastMX,dy=e.clientY-lastMY;velY=-dx*0.01;velX=-dy*0.01;rotY+=velY;rotX+=velX;lastMX=e.clientX;lastMY=e.clientY;});
  let lastTX=0,lastTY=0;
  canvas.addEventListener('touchstart',e=>{isDragging=true;lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;velX=0;velY=0;});
  canvas.addEventListener('touchend',()=>isDragging=false);
  canvas.addEventListener('touchmove',e=>{const dx=e.touches[0].clientX-lastTX,dy=e.touches[0].clientY-lastTY;velY=-dx*0.012;velX=-dy*0.012;rotY+=velY;rotX+=velX;lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;e.preventDefault();},{passive:false});
  canvas.addEventListener('mousemove',e=>{if(isDragging){hoveredIdx=-1;return;}const rect=canvas.getBoundingClientRect();const mx=e.clientX-rect.left,my=e.clientY-rect.top;hoveredIdx=-1;const cx=canvas.width/2,cy=canvas.height/2,R=Math.min(canvas.width,canvas.height)*0.48;pts.forEach(([x,y,z],i)=>{const{sx,sy,d}=proj(x,y,z);if(d<0)return;const px=cx+sx*R,py=cy+sy*R;if(Math.hypot(mx-px,my-py)<28){hoveredIdx=i;canvas.style.cursor='pointer';}});if(hoveredIdx===-1)canvas.style.cursor='grab';});
  canvas.addEventListener('click',e=>{if(hoveredIdx>=0&&SKILLS[hoveredIdx].url)window.open(SKILLS[hoveredIdx].url,'_blank');});
  function proj(x,y,z){const cy=Math.cos(rotY),sy=Math.sin(rotY);let x1=x*cy-z*sy,z1=x*sy+z*cy;const cx=Math.cos(rotX),sx2=Math.sin(rotX);let y1=y*cx-z1*sx2,z2=y*sx2+z1*cx;return{sx:x1,sy:y1,d:z2};}
  function drawGrid(cx,cy,R){ctx.save();for(let lat=0;lat<10;lat++){const phi=(lat/10)*Math.PI,yr=Math.cos(phi),xr=Math.sin(phi);ctx.beginPath();let first=true;for(let j=0;j<=80;j++){const t=(j/80)*Math.PI*2;const{sx,sy,d}=proj(xr*Math.cos(t),yr,xr*Math.sin(t));if(d<-0.05){first=true;ctx.stroke();ctx.beginPath();continue;}ctx.strokeStyle=`rgba(254,189,0,${0.08+(d+1)/2*0.1})`;ctx.lineWidth=0.7;const px=cx+sx*R,py=cy+sy*R;if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);}ctx.stroke();}for(let lng=0;lng<16;lng++){const theta=(lng/16)*Math.PI*2;ctx.beginPath();let first=true;for(let j=0;j<=40;j++){const phi=(j/40)*Math.PI;const{sx,sy,d}=proj(Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta));if(d<-0.05){first=true;ctx.stroke();ctx.beginPath();continue;}ctx.strokeStyle=`rgba(254,189,0,${0.07+(d+1)/2*0.09})`;ctx.lineWidth=0.7;const px=cx+sx*R,py=cy+sy*R;if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);}ctx.stroke();}const grd=ctx.createRadialGradient(cx,cy,R*0.85,cx,cy,R*1.15);grd.addColorStop(0,'rgba(254,189,0,0)');grd.addColorStop(0.5,'rgba(254,189,0,0.04)');grd.addColorStop(1,'rgba(254,189,0,0)');ctx.beginPath();ctx.arc(cx,cy,R*1.1,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();ctx.restore();}
  function drawSkills(cx,cy,R){const items=pts.map(([x,y,z],i)=>{const{sx,sy,d}=proj(x,y,z);return{sx,sy,d,i};}).sort((a,b)=>a.d-b.d);items.forEach(({sx,sy,d,i})=>{if(d<-0.1)return;const t=(d+1)/2;if(t<0.05)return;const alpha=Math.pow(t,1.2),scale=0.5+t*0.5;const px=cx+sx*R,py=cy+sy*R;const isHov=(i===hoveredIdx),iconR=R*0.085*scale*(isHov?1.25:1);ctx.save();ctx.globalAlpha=alpha;if(isHov){const grd=ctx.createRadialGradient(px,py,0,px,py,iconR*3);grd.addColorStop(0,'rgba(254,189,0,0.35)');grd.addColorStop(1,'rgba(254,189,0,0)');ctx.beginPath();ctx.arc(px,py,iconR*3,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();}ctx.beginPath();ctx.arc(px,py,iconR,0,Math.PI*2);ctx.fillStyle=SKILLS[i].color+'18';ctx.strokeStyle=isHov?'rgba(254,189,0,0.9)':SKILLS[i].color+'66';ctx.lineWidth=(isHov?2:1.2)*scale;ctx.fill();ctx.stroke();const ic=icons[i];if(ic.img.complete&&ic.img.naturalWidth){const s=iconR*1.35;ctx.drawImage(ic.img,px-s/2,py-s/2,s,s);}else{ctx.beginPath();ctx.arc(px,py,iconR*0.5,0,Math.PI*2);ctx.fillStyle=SKILLS[i].color;ctx.fill();}const fs=Math.max(9,R*0.048*scale*(isHov?1.1:1));ctx.fillStyle=isHov?'#FEBD00':'#ffffff';ctx.font=`${isHov?'600':'400'} ${fs}px Outfit,sans-serif`;ctx.textAlign='center';ctx.textBaseline='top';ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=4;ctx.fillText(SKILLS[i].name,px,py+iconR+3*scale);ctx.shadowBlur=0;ctx.restore();});}
  let raf;
  function loop(){raf=requestAnimationFrame(loop);const w=canvas.width,h=canvas.height;if(!w||!h)return;ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*0.48;if(!isDragging){rotY+=velY;velY+=(-0.005-velY)*0.02;velX*=0.95;rotX+=velX;rotX+=(0.3-rotX)*0.01;}drawGrid(cx,cy,R);drawSkills(cx,cy,R);}
  loop();
}

// ═══════════════════════════════════════════════════════════════════
// START — called after all functions are defined
// ═══════════════════════════════════════════════════════════════════
initVideoLoader();
initHeroTextScramble();