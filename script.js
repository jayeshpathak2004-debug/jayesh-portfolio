document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) { toggle.innerHTML = '<i data-lucide="menu"></i>'; if (window.lucide) window.lucide.createIcons(); }
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  // Interactive particle sphere: lightweight canvas animation, no build tools required.
  const canvas = document.getElementById('space-canvas');
  const scene = canvas?.parentElement;
  const ctx = canvas?.getContext('2d');
  let particles = [], frame = 0, pointerX = 0, pointerY = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setupSpace() {
    if (!canvas || !ctx || !scene) return;
    const rect = scene.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(55, Math.min(115, Math.floor(rect.width / 4)));
    particles = Array.from({length: count}, (_, i) => {
      const theta = Math.acos(2 * Math.random() - 1), phi = Math.random() * Math.PI * 2;
      const radius = 95 + Math.random() * 125;
      return {x: Math.sin(theta)*Math.cos(phi)*radius, y: Math.cos(theta)*radius, z: Math.sin(theta)*Math.sin(phi)*radius, size: .7 + Math.random()*1.7, phase: Math.random()*6.28, i};
    });
  }
  function drawSpace() {
    if (!ctx || !canvas || !scene) return;
    const w = scene.clientWidth, h = scene.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const angle = reducedMotion ? .25 : frame * .0025 + pointerX * .35;
    const tilt = pointerY * .18;
    const projected = particles.map(p => {
      const x = p.x*Math.cos(angle) - p.z*Math.sin(angle);
      const z = p.x*Math.sin(angle) + p.z*Math.cos(angle);
      const y = p.y*Math.cos(tilt) - z*Math.sin(tilt);
      const zz = p.y*Math.sin(tilt) + z*Math.cos(tilt);
      const scale = 270 / (270 + zz);
      return {x:w*.5+x*scale, y:h*.48+y*scale, z:zz, r:p.size*scale, a:Math.max(.12,Math.min(.8,(zz+180)/420)), i:p.i};
    });
    for (let i=0;i<projected.length;i++) {
      const a=projected[i];
      for(let j=i+1;j<projected.length;j++) {
        const b=projected[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if(d<48 && Math.abs(a.z-b.z)<90) {ctx.strokeStyle=`rgba(165,243,109,${(1-d/48)*.13})`;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      }
    }
    projected.forEach(p=>{ctx.beginPath();ctx.fillStyle=`rgba(190,255,153,${p.a})`;ctx.shadowColor='#a5f36d';ctx.shadowBlur=7;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});
    ctx.shadowBlur=0;
    if(!reducedMotion) frame++;
    if(!reducedMotion) requestAnimationFrame(drawSpace);
  }
  setupSpace(); drawSpace();
  window.addEventListener('resize', () => { setupSpace(); if(reducedMotion) drawSpace(); }, {passive:true});
  scene?.addEventListener('pointermove', e => { const r=scene.getBoundingClientRect(); pointerX=((e.clientX-r.left)/r.width-.5)*2; pointerY=((e.clientY-r.top)/r.height-.5)*2; }, {passive:true});
  scene?.addEventListener('pointerleave', () => {pointerX=0;pointerY=0;}, {passive:true});
  const orb = document.getElementById('profile-orb');
  scene?.addEventListener('pointermove', e => { if(!orb || window.innerWidth<700) return; const r=scene.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5; orb.style.transform=`translateX(calc(-50% + ${x*16}px)) translateY(${y*12}px) translateZ(65px) rotateY(${x*10}deg) rotateX(${-y*8}deg)`; });
  scene?.addEventListener('pointerleave', () => {if(orb) orb.style.transform='translateX(-50%) translateZ(65px)';});
  document.querySelectorAll('.project-card, .skill-card, .stat-card, .growth-card').forEach(card => {
    card.addEventListener('pointermove', e => {if(window.innerWidth<700 || reducedMotion) return; const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5; card.style.transform=`perspective(900px) rotateY(${x*3.5}deg) rotateX(${-y*3.5}deg) translateY(-3px)`;});
    card.addEventListener('pointerleave', () => {card.style.transform='';});
  });
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('visible'));
});
