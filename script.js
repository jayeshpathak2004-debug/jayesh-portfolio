// Animated particle field and pointer-responsive portrait depth
(() => {
 const canvas=document.getElementById('space-canvas'), scene=canvas?.parentElement, ctx=canvas?.getContext('2d');
 if(!canvas||!scene||!ctx)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches; let pts=[],tick=0,mx=0,my=0;
 function resize(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0);pts=Array.from({length:90},()=>({x:(Math.random()-.5)*r.width*1.1,y:(Math.random()-.5)*r.height*1.1,z:Math.random()*180,s:.5+Math.random()*1.6,p:Math.random()*6.28}));}
 function draw(){const w=scene.clientWidth,h=scene.clientHeight;ctx.clearRect(0,0,w,h);const ps=pts.map(p=>({x:w/2+p.x+Math.sin(tick*.006+p.p)*12+mx*15,y:h/2+p.y+Math.cos(tick*.005+p.p)*10+my*12,z:p.z,s:p.s}));for(let i=0;i<ps.length;i++){for(let j=i+1;j<ps.length;j++){const a=ps[i],b=ps[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<75){ctx.strokeStyle=`rgba(45,145,255,${(1-d/75)*.18})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}ps.forEach(p=>{ctx.beginPath();ctx.fillStyle=`rgba(${p.z%2?'65,190,255':'158,111,255'},${.2+(p.z/180)*.45})`;ctx.shadowColor='#268dff';ctx.shadowBlur=8;ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill()});ctx.shadowBlur=0;if(!reduced){tick++;requestAnimationFrame(draw)}}
 resize();draw();window.addEventListener('resize',()=>{resize();if(reduced)draw()},{passive:true});scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;},{passive:true});
 const orb=document.getElementById('profile-orb');scene.addEventListener('pointermove',e=>{if(!orb||innerWidth<700||reduced)return;const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;orb.style.transform=`translate(calc(-50% + ${x*13}px),calc(-50% + ${y*10}px)) rotateY(${x*7}deg) rotateX(${-y*6}deg)`});scene.addEventListener('pointerleave',()=>{if(orb)orb.style.transform='translate(-50%,-50%)'});
})();

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
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('visible'));
});
