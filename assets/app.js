// Mobile menu
function toggleMenu(){
  const el = document.getElementById('mobileMenu');
  el.classList.toggle('hidden');
  window.scrollBy({top:1,left:0,behavior:'instant'});
}

// Year stamp (optional footer if you add span#year)
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

/* HERO slider */
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: { delay: 3200, disableOnInteraction: false },
  speed: 700,
  pagination: { el: '.hero .swiper-pagination', clickable: true },
  effect: 'fade',
  fadeEffect: { crossFade: true }
});

/* Recommendations from JSON + slider */
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
      autoplay: { delay: 4200, disableOnInteraction: false },
      speed: 600,
      pagination: { el: '.recommendations .swiper-pagination', clickable: true }
    });
  }catch(e){
    console.warn('Recommendations failed to load', e);
  }
})();

/* Pause marquee on tab blur (perf) */
const marquee = document.getElementById('logos-marquee');
if (marquee){
  document.addEventListener('visibilitychange', ()=>{
    marquee.style.animationPlayState = document.hidden ? 'paused' : 'running';
    marquee.querySelectorAll('img').forEach(i=>i.style.animationPlayState = document.hidden ? 'paused':'running');
  });
}
