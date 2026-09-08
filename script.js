
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav
const menuBtn=document.querySelector('.menuButton'),nav=document.querySelector('.nav');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const o=nav.classList.toggle('open');document.body.classList.toggle('menuOpen',o);menuBtn.setAttribute('aria-expanded',String(o))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menuOpen');menuBtn.setAttribute('aria-expanded','false')}))}

// FAQ accordion
document.querySelectorAll('.faq button').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq'),was=item.classList.contains('active');document.querySelectorAll('.faq').forEach(x=>{x.classList.remove('active');x.querySelector('b').textContent='+'});if(!was){item.classList.add('active');btn.querySelector('b').textContent='−'}}));

// Scroll-reveal with stagger for grouped items (feature grid, steps, etc.)
document.querySelectorAll('.reveal').forEach(el=>{
  const parent=el.parentElement;
  const siblings=parent?Array.from(parent.children).filter(c=>c.classList.contains('reveal')):[];
  if(siblings.length>1){
    const idx=siblings.indexOf(el);
    el.style.setProperty('--rd',Math.min(idx*0.08,0.56)+'s');
  }
});
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');obs.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// Sticky header shrink + gold scroll progress bar
const header=document.querySelector('.siteHeader');
const progressBar=document.querySelector('.scrollProgress span');
const onScroll=()=>{
  if(header) header.classList.toggle('scrolled',window.scrollY>10);
  if(progressBar){
    const h=document.documentElement;
    const max=h.scrollHeight-h.clientHeight;
    progressBar.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  }
};
document.addEventListener('scroll',onScroll,{passive:true});
onScroll();

// Back-to-top button
const toTop=document.querySelector('.toTop');
if(toTop){
  document.addEventListener('scroll',()=>toTop.classList.toggle('show',window.scrollY>700),{passive:true});
  toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));
}

// Count-up numbers (hero mini-proof, price)
const countEls=document.querySelectorAll('.countUp');
if(countEls.length){
  const runCount=el=>{
    const target=parseInt(el.dataset.count,10)||0;
    if(reduceMotion){el.textContent=target;return}
    const duration=1100;
    const start=performance.now();
    const step=now=>{
      const p=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(eased*target);
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){runCount(e.target);countObs.unobserve(e.target)}}),{threshold:.6});
  countEls.forEach(el=>countObs.observe(el));
}

// Gallery lightbox
const lightbox=document.querySelector('.lightbox');
if(lightbox){
  const lbImg=lightbox.querySelector('img');
  const closeBtn=lightbox.querySelector('.lightboxClose');
  const openLightbox=(src,alt)=>{
    lbImg.src=src;lbImg.alt=alt||'';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('menuOpen');
  };
  const closeLightbox=()=>{
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('menuOpen');
  };
  document.querySelectorAll('.galleryItem').forEach(item=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      const img=item.querySelector('img');
      openLightbox(item.getAttribute('href'),img?img.alt:'');
    });
  });
  closeBtn.addEventListener('click',closeLightbox);
  lightbox.addEventListener('click',e=>{if(e.target===lightbox) closeLightbox()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeLightbox()});
}

// Magnetic buttons
if(!reduceMotion && matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.button').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      btn.style.transform=`translate(${x*0.18}px,${y*0.35-2}px)`;
    });
    btn.addEventListener('mouseleave',()=>{btn.style.transform=''});
  });

  // Feature card cursor spotlight
  document.querySelectorAll('.feature.spotlight').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(e.clientX-r.left)+'px');
      card.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });

  // Subtle hero visual parallax
  const heroVisual=document.querySelector('.heroVisual');
  const heroSection=document.querySelector('.hero');
  if(heroVisual&&heroSection){
    heroSection.addEventListener('mousemove',e=>{
      const r=heroSection.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-0.5, y=(e.clientY-r.top)/r.height-0.5;
      heroVisual.style.transform=`rotate(${x*1.2}deg) translate(${x*10}px,${y*10}px)`;
    });
    heroSection.addEventListener('mouseleave',()=>{heroVisual.style.transform=''});
  }
}
