/* ADDED: HERO SLIDER */
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: { delay: 3200, disableOnInteraction: false },
  speed: 700,
  pagination: { el: '.hero .swiper-pagination', clickable: true },
  effect: 'fade',
  fadeEffect: { crossFade: true }
});

/* ADDED: Load Recommendations from JSON + slider */
(async function(){
  try{
    const res = await fetch('./data/recommendations.json?cb='+Date.now());
    const recs = await res.json();
    const wrap = document.getElementById('rec-list');
    wrap.innerHTML = recs.map(r => `
      <div class="swiper-slide">
        <article class="rec-card" itemscope itemtype="https://schema.org/Review">
          <p class="rec-quote" itemprop="reviewBody">“${(r.quote||'').replace(/"/g,'&quot;')}”</p>
          <div class="rec-meta">
            <span class="rec-name" itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${r.name||''}</span>
            </span>
            • ${r.title||''}${r.company?', '+r.company:''}
            ${r.relationship?`<br><span style="opacity:.8">${r.relationship}</span>`:''}
          </div>
          ${r.linkedin?`<a href="${r.linkedin}" target="_blank" rel="noopener" style="font-size:12px">View on LinkedIn</a>`:''}
        </article>
      </div>
    `).join('');
    new Swiper('.rec-swiper', {
      autoplay: { delay: 3800, disableOnInteraction: false },
      speed: 600,
      pagination: { el: '.recommendations .swiper-pagination', clickable: true }
    });
  }catch(e){
    console.warn('Recommendations failed to load', e);
  }
})();

/* ADDED: Scroll reveal */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); });
},{ threshold:.12 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ADDED: Animated counters */
function animateCounter(el){
  const target = +el.dataset.target;
  let n = 0, step = Math.max(1, Math.floor(target/60));
  const t = setInterval(()=>{
    n += step;
    if(n >= target){ n = target; clearInterval(t); }
    el.textContent = n;
  }, 18);
}
const io2 = new IntersectionObserver((es)=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.num').forEach(animateCounter);
      io2.unobserve(e.target);
    }
  });
},{ threshold:.6 });
document.querySelectorAll('.metrics').forEach(m=>io2.observe(m));

/* ADDED: Filters for work grid */
const buttons = document.querySelectorAll('.fbtn');
const cards = document.querySelectorAll('.grid .card');
buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c=>{
      c.style.display = (f==='all' || c.dataset.cat===f) ? '' : 'none';
    });
  });
});

/* ADDED: Lightbox */
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
document.querySelectorAll('.card img').forEach(img=>{
  img.addEventListener('click', ()=>{
    lbImg.src = img.src; lb.style.display='flex';
  });
});
lb.addEventListener('click', (e)=>{
  if(e.target===lb || e.target.classList.contains('close')) lb.style.display='none';
});
