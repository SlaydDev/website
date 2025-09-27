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

// Cursor modes
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
    countersStarted = true;
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const increment = target / 200;
      function updateCounter() {
        count += increment;
        if (count < target) {
          counter.textContent = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }
      updateCounter();
      counter.parentElement.classList.add("visible");
    });
  }
}
window.addEventListener("scroll", animateCounters);

// Initial reveal on load
document.addEventListener("DOMContentLoaded", revealOnScroll);

// Blog preview loader
function loadBlogPreview() {
  fetch('/blog/posts.json')
    .then(res => res.json())
    .then(posts => {
      const latest = posts[0];
      const blogCard = document.getElementById('blogCard');
      blogCard.innerHTML = `
        <h3>${latest.title} →</h3>
        <p>By ${latest.author}</p>
        <div class="badge-row">
          <img src="/badges/${latest.badge.toLowerCase().replace(/\s+/g, '-')}.png" alt="${latest.badge}">
        </div>
      `;

      blogCard.addEventListener('click', () => {
        document.getElementById('overlayTitle').textContent = latest.title;
        document.getElementById('overlayContent').textContent = latest.content;
        document.getElementById('overlayBadge').innerHTML = `
          <img src="/badges/${latest.badge.toLowerCase().replace(/\s+/g, '-')}.png" alt="${latest.badge}">
        `;
        document.getElementById('blogOverlay').classList.add('active');
      });

      document.getElementById('closeOverlay').addEventListener('click', () => {
        document.getElementById('blogOverlay').classList.remove('active');
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          document.getElementById('blogOverlay').classList.remove('active');
        }
      });
    });
}
