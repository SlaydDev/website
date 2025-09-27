// LOADER
window.addEventListener("load", () => {
  const images = document.images;
  let loaded = 0;

  for (let i = 0; i < images.length; i++) {
    if (images[i].complete) loaded++;
    else images[i].addEventListener("load", () => {
      loaded++;
      if (loaded === images.length) hideCover();
    });
  }

  if (loaded === images.length) hideCover();

  function hideCover() {
    setTimeout(() => {
      const cover = document.getElementById("cover");
      cover.style.opacity = "0";
      setTimeout(() => {
        cover.style.display = "none";
        revealOnScroll();
        loadCounters();
        loadBlog();
      }, 500);
    }, 300);
  }
});

// CURSOR
const cursor = document.getElementById('cursor');
window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
window.addEventListener('click', () => {
  cursor.classList.add("click-glow");
  setTimeout(() => cursor.classList.remove("click-glow"), 300);
});

// Cursor hover effects
const textHoverElems = document.querySelectorAll('p, a, h1, h2, li, span');
const interactHoverElems = document.querySelectorAll('img, a.button, .project-item, .team-member');
textHoverElems.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('text-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover'));
});
interactHoverElems.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('interact-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('interact-hover'));
});

// Smooth scroll highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
function onScroll() {
  let scrollPos = window.scrollY + window.innerHeight / 3;
  sections.forEach((section, i) => {
    if (scrollPos >= section.offsetTop) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (navLinks[i]) navLinks[i].classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScroll);

// Reveal animations
function revealOnScroll() {
  const elems = document.querySelectorAll('section, .team-member, .stat, .project-item');
  elems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);

// COUNTERS
function loadCounters() {
  fetch('https://script.google.com/macros/s/AKfycbwG3r12rcr5XF0O6VbVdkvWXY-lp64NztseAPcdo3c1YVa_v4IlEIjSSLWzfi7t342vag/exec')
    .then(res => res.json())
    .then(data => {
      const counters = [
        {el: document.querySelector('#stats .stat:nth-child(1) .counter'), target: data.ServerMembers || 0},
        {el: document.querySelector('#stats .stat:nth-child(2) .counter'), target: data.ProjectsDone || 0},
        {el: document.querySelector('#stats .stat:nth-child(3) .counter'), target: data.OngoingProjects || 0},
        {el: document.querySelector('#stats .stat:nth-child(4) .counter'), target: data.HappyCustomers || 0},
      ];

      counters.forEach(c => animateCounter(c.el, c.target));
    });
}

function animateCounter(el, target) {
  if (!el) return;
  let count = 0;
  const increment = target / 100;
  const interval = setInterval(() => {
    count += increment;
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    el.textContent = Math.floor(count);
  }, 20);
}

// BLOG
let currentIndex = 0;
let blogData = [];

function loadBlog() {
  fetch('blog/posts.json')
    .then(res => res.json())
    .then(posts => {
      blogData = posts;
      const carousel = document.getElementById('blogCarousel');
      carousel.innerHTML = '';

      posts.forEach((post, i) => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
          <h3>${post.title}</h3>
          <div class="author">
            <span>${post.author}</span>
            ${post.badge ? `<img class="badge-small" src="/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png">` : ''}
          </div>
          <div class="content">${post.content}</div>
        `;
        card.addEventListener('click', () => openOverlay(i));
        carousel.appendChild(card);
      });

      addBlogArrows();
    });
}

function addBlogArrows() {
  const container = document.querySelector('.blog-carousel-container');
  if (!container.querySelector('.blog-prev')) {
    const prev = document.createElement('button');
    prev.className = 'blog-prev';
    prev.textContent = '‹';
    prev.addEventListener('click', () => scrollCarousel(-1));
    container.appendChild(prev);

    const next = document.createElement('button');
    next.className = 'blog-next';
    next.textContent = '›';
    next.addEventListener('click', () => scrollCarousel(1));
    container.appendChild(next);
  }
}

function scrollCarousel(dir) {
  const carousel = document.getElementById('blogCarousel');
  const cardWidth = carousel.querySelector('.blog-card').offsetWidth + 24; // include gap
  carousel.scrollBy({left: dir * cardWidth, behavior: 'smooth'});
}

// Overlay
function openOverlay(i) {
  const overlay = document.getElementById('blogOverlay');
  const post = blogData[i];
  document.getElementById('overlayTitle').textContent = post.title;
  document.getElementById('overlayBadge').innerHTML = post.badge ? `<img class="badge-small" src="/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png">` : '';
  document.getElementById('overlayContent').textContent = post.content;

  overlay.style.display = 'flex';

  function closeHandler(e) {
    if (e.key === "Escape") {
      overlay.style.display = 'none';
      document.removeEventListener('keydown', closeHandler);
    }
  }
  document.addEventListener('keydown', closeHandler);
}

document.getElementById('closeOverlay').addEventListener('click', () => {
  document.getElementById('blogOverlay').style.display = 'none';
});
