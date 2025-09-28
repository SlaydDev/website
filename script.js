// ------------------- LOADER -------------------
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("cover").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("cover").style.display = "none";
    }, 500);
  }, 1000);
});

// ------------------- CUSTOM CURSOR -------------------
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

// ------------------- SCROLL HIGHLIGHT -------------------
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

function onScroll() {
  let scrollPos = window.scrollY + window.innerHeight / 3;
  sections.forEach((section, i) => {
    if(scrollPos >= section.offsetTop) {
      navLinks.forEach(link => link.classList.remove('active'));
      if(navLinks[i]) navLinks[i].classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScroll);

// ------------------- REVEAL ANIMATIONS -------------------
function revealOnScroll() {
  const elems = document.querySelectorAll('section, .team-member, .stat, .project-item');
  elems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
document.addEventListener('DOMContentLoaded', revealOnScroll);

// ------------------- COUNTERS -------------------
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function animateCounters() {
  if(countersStarted) return;
  const statsSection = document.querySelector('#stats');
  const sectionTop = statsSection.getBoundingClientRect().top;
  if(sectionTop < window.innerHeight - 50) {
    countersStarted = true;
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const increment = target / 200;
      function updateCounter() {
        count += increment;
        if(count < target) {
          counter.textContent = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }
      updateCounter();
      counter.parentElement.classList.add('visible');
    });
  }
}
window.addEventListener('scroll', animateCounters);

// ------------------- GOOGLE SHEETS COUNTERS -------------------
window.addEventListener('load', () => {
  fetch('https://script.google.com/macros/s/AKfycbwG3r12rcr5XF0O6VbVdkvWXY-lp64NztseAPcdo3c1YVa_v4IlEIjSSLWzfi7t342vag/exec')
    .then(res => res.json())
    .then(data => {
      const counters = document.querySelectorAll('.stat .counter');
      counters[1].setAttribute('data-target', data.ProjectsDone);
      counters[2].setAttribute('data-target', data.OngoingProjects);
      counters[3].setAttribute('data-target', data.HappyCustomers);
    });
});

// ------------------- BLOG CAROUSEL & OVERLAY -------------------
const blogCarousel = document.getElementById('blogCarousel');
const blogOverlay = document.getElementById('blogOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayAuthorBadge = document.getElementById('overlayAuthorBadge');
const overlayContent = document.getElementById('overlayContent');
const closeOverlay = document.getElementById('closeOverlay');
const leftArrow = document.querySelector('.blog-arrow.left');
const rightArrow = document.querySelector('.blog-arrow.right');

let currentOffset = 0;

// Fetch posts.json and populate carousel
fetch('blog/posts.json')
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
        <h3>${post.title}</h3>
        <div class="author-badge">
          <span>${post.author}</span>
          ${post.badge ? `<img src="badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" alt="${post.badge}">` : ''}
        </div>
        <p>${post.content.substring(0,100)}...</p>
      `;
      // Open overlay on click
      card.addEventListener('click', () => {
        overlayTitle.textContent = post.title;
        overlayAuthorBadge.innerHTML = `<span>${post.author}</span>${post.badge ? `<img src="badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" alt="${post.badge}">` : ''}`;
        overlayContent.textContent = post.content;
        blogOverlay.style.display = 'flex';
      });
      blogCarousel.appendChild(card);
    });
  });

// Carousel navigation
leftArrow.addEventListener('click', () => {
  currentOffset -= 320;
  if(currentOffset < 0) currentOffset = 0;
  blogCarousel.scrollTo({left: currentOffset, behavior:'smooth'});
});
rightArrow.addEventListener('click', () => {
  currentOffset += 320;
  blogCarousel.scrollTo({left: currentOffset, behavior:'smooth'});
});

// Close overlay
closeOverlay.addEventListener('click', () => blogOverlay.style.display = 'none');
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') blogOverlay.style.display = 'none';
});
