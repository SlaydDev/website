// LOADER
window.addEventListener("load", () => {
  const images = document.images;
  let loaded = 0;
  for (let i=0;i<images.length;i++){
    if(images[i].complete) loaded++; 
    else images[i].addEventListener("load",()=>{loaded++;});
  }
  setTimeout(()=>{document.getElementById("cover").style.display="none"; revealOnScroll(); animateCounters(); initBlog();},500);
});

// CURSOR
const cursor=document.getElementById('cursor');
window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px';});
window.addEventListener('click',()=>{cursor.classList.add("click-glow"); setTimeout(()=>cursor.classList.remove("click-glow"),300);});

// SCROLL REVEAL
function revealOnScroll(){const elems=document.querySelectorAll('section,.team-member,.stat,.project-item'); elems.forEach(el=>{const rect=el.getBoundingClientRect(); if(rect.top<window.innerHeight-60) el.classList.add("visible");});}
window.addEventListener("scroll",revealOnScroll);

// COUNTERS
const counters=document.querySelectorAll(".counter"); let countersStarted=false;
function animateCounters(){if(countersStarted) return; counters.forEach(c=>{const target=+c.getAttribute('data-target'); let count=0; const interval=setInterval(()=>{count+=Math.ceil(target/100); if(count>=target){count=target; clearInterval(interval);} c.textContent=count;},10);}); countersStarted=true;}

// BLOG
function initBlog(){
  const carousel=document.querySelector('.blog-carousel');
  const prevBtn=document.createElement('button');
  prevBtn.className='blog-prev'; prevBtn.innerHTML='&#8249;';
  const nextBtn=document.createElement('button');
  nextBtn.className='blog-next'; nextBtn.innerHTML='&#8250;';
  document.querySelector('.blog-preview').appendChild(prevBtn);
  document.querySelector('.blog-preview').appendChild(nextBtn);

  prevBtn.addEventListener('click',()=>{carousel.scrollBy({left:-300, behavior:'smooth'});});
  nextBtn.addEventListener('click',()=>{carousel.scrollBy({left:300, behavior:'smooth'});});

  // overlay
  const overlay=document.createElement('div'); overlay.className='blog-overlay';
  overlay.innerHTML='<button class="close-btn">✕</button><div class="overlay-content"></div>';
  document.body.appendChild(overlay);
  const overlayContent=overlay.querySelector('.overlay-content');
  const closeBtn=overlay.querySelector('.close-btn');

  fetch('blog/posts.json').then(res=>res.json()).then(posts=>{
    carousel.innerHTML='';
    posts.forEach(post=>{
      const card=document.createElement('div'); card.className='blog-card';
      card.innerHTML=`<h3>${post.title}</h3>
        <p class="author">${post.author}${post.badge?` <img src="/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" class="badge-small">`:''}</p>
        <div class="content">${post.content}</div>`;
      carousel.appendChild(card);

      card.addEventListener('click',()=>{
        overlay.style.display='flex';
        overlayContent.innerHTML=`<h2>${post.title}</h2>
          <p class="author">${post.author}${post.badge?` <img src="/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" class="badge-small">`:''}</p>
          <div class="content">${post.content}</div>`;
      });
    });
  });

  closeBtn.addEventListener('click',()=>overlay.style.display='none');
  window.addEventListener('keydown',e=>{if(e.key==='Escape') overlay.style.display='none';});
}
