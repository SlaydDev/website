// LOADER with layout stability
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
      document.getElementById("cover").style.opacity = "0";
      setTimeout(() => {
        document.getElementById("cover").style.display = "none";
        revealOnScroll();
        animateCounters();
        loadBlogPreview();
      }, 500);
    }, 300);
  }
});

// Cursor
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

// Counters
const counters = document.querySelectorAll(".counter");
let countersStarted = false;
function animateCounters() {
  if (countersStarted) return;
  const statsSection = document.querySelector("#stats");
  const sectionTop = statsSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight - 50) {
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      let count = 0;
      const step = target / 100;
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }
        counter.textContent = Math.floor(count);
      }, 20);
    });
    countersStarted = true;
  }
}
window.addEventListener("scroll", animateCounters);

// BLOG FUNCTIONALITY
const blogOverlay = document.getElementById("blogOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayBadge = document.getElementById("overlayBadge");
const overlayContent = document.getElementById("overlayContent");
const closeOverlay = document.getElementById("closeOverlay");

function loadBlogPreview() {
  fetch('/blog/posts.json')
    .then(res => res.json())
    .then(posts => {
      const carousel = document.getElementById("blogCarousel");
      carousel.innerHTML = '';
      posts.forEach(post => {
        const card = document.createElement("div");
        card.classList.add("blog-card");
        card.innerHTML = `
          <h3>${post.title}</h3>
          <span class="author">${post.author}${post.badge ? `<img src="/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" class="badge-small">` : ''}</span>
          <div class="content">${post.content}</div>
        `;
        carousel.appendChild(card);

        card.addEventListener('click', () => {
          overlayTitle.textContent = post.title;
          overlayBadge.innerHTML = '';
          overlayContent.innerHTML = post.content;
          if (post.badge) {
            const img = document.createElement("img");
            img.src = `/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png`;
            img.classList.add("badge-small");
            overlayBadge.appendChild(img);
          }
          blogOverlay.style.display = 'flex';
        });
      });

      // Add carousel buttons
      if(!document.querySelector('.blog-prev')) {
        const prev = document.createElement('button');
        prev.className = 'blog-prev';
        prev.textContent = '<';
        prev.addEventListener('click', () => carousel.scrollBy({left: -300, behavior:'smooth'}));
        const next = document.createElement('button');
        next.className = 'blog-next';
        next.textContent = '>';
        next.addEventListener('click', () => carousel.scrollBy({left: 300, behavior:'smooth'}));
        carousel.parentElement.appendChild(prev);
        carousel.parentElement.appendChild(next);
      }
    });
}

// Close overlay
closeOverlay.addEventListener('click', () => blogOverlay.style.display = 'none');
window.addEventListener('keydown', e => {
  if(e.key === "Escape") blogOverlay.style.display = 'none';
});
