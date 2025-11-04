// ===========================
// LOADER
// ===========================
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("cover").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("cover").style.display = "none";
    }, 500);
  }, 1000);
});

// ===========================
// CUSTOM CURSOR
// ===========================
const cursor = document.getElementById('cursor');
window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
window.addEventListener('click', () => {
  cursor.classList.add("click-glow");
  setTimeout(() => cursor.classList.remove("click-glow"), 300);
});

const textHoverElems = document.querySelectorAll('p, a, h1, h2, li, span');
const interactHoverElems = document.querySelectorAll('img, a.button, .project-item, .team-member, .blog-card');

textHoverElems.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('text-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover'));
});
interactHoverElems.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('interact-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('interact-hover'));
});

// ===========================
// NAV HIGHLIGHT & SMOOTH SCROLL
// ===========================
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

// ===========================
// REVEAL ANIMATIONS
// ===========================
function revealOnScroll() {
  const elems = document.querySelectorAll('section, .team-member, .stat, .project-item, .blog-card');
  elems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
document.addEventListener("DOMContentLoaded", revealOnScroll);

// ===========================
// COUNTERS (FIXED VERSION)
// ===========================
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function sanitizeNumber(numStr) {
  return parseInt(numStr.replace(/[^\d]/g, "")) || 0;
}

function animateCounters() {
  if (countersStarted) return;
  const statsSection = document.querySelector("#stats");
  const sectionTop = statsSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight - 50) {
    countersStarted = true;
    counters.forEach(counter => {
      const target = sanitizeNumber(counter.getAttribute("data-target"));
      let count = 0;
      const increment = target / 200;
      function updateCounter() {
        count += increment;
        if (count < target) {
          counter.textContent = Math.ceil(count).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }
      updateCounter();
      counter.parentElement.classList.add("visible");
    });
  }
}
window.addEventListener("scroll", animateCounters);
document.addEventListener("DOMContentLoaded", animateCounters);

// ===========================
// FETCH COUNTERS FROM GOOGLE SHEET (FIXED)
// ===========================
window.addEventListener('load', () => {
  fetch('https://script.google.com/macros/s/AKfycbwG3r12rcr5XF0O6VbVdkvWXY-lp64NztseAPcdo3c1YVa_v4IlEIjSSLWzfi7t342vag/exec')
    .then(res => res.json())
    .then(data => {
      const counters = document.querySelectorAll('.stat .counter');
      if (data.ProjectsDone) counters[1].setAttribute("data-target", data.ProjectsDone);
      if (data.OngoingProjects) counters[2].setAttribute("data-target", data.OngoingProjects);
      countersStarted = false; // re-enable animation if already scrolled
      animateCounters();
    })
    .catch(err => console.error("Counter fetch failed:", err));
});

// ===========================
// TEAM MEMBER SKILL EXPANSION
// ===========================
const teamMembers = document.querySelectorAll('.team-member');
teamMembers.forEach(member => {
  member.addEventListener('click', () => {
    const skills = member.querySelector('.skills-container');
    if (skills.classList.contains('hidden')) {
      skills.classList.remove('hidden');
      const bars = skills.querySelectorAll('.progress-bar div');
      bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = width; }, 50);
      });
    } else {
      skills.classList.add('hidden');
    }
  });
});

// ===========================
// SCROLL TO TOP BUTTON
// ===========================
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollBtn.style.display = (window.scrollY > 300) ? 'block' : 'none';
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===========================
// BLOG FETCH + MODAL WITH BADGES
// ===========================
const blogGrid = document.querySelector('.blog-grid');
const blogModal = document.createElement('div');
blogModal.className = 'blog-modal';
blogModal.innerHTML = `<div class="blog-modal-content"></div>`;
document.body.appendChild(blogModal);
const modalContent = blogModal.querySelector('.blog-modal-content');

blogModal.addEventListener('click', (e) => {
  if (e.target === blogModal) blogModal.classList.remove('active');
});

fetch('https://script.google.com/macros/s/AKfycbzo3tjss4ow-r23cQB6cf4PqglEvPbVxba4hP-d51e7DevdPQTdD9p1zDB0M-2W4wUC/exec')
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'blog-card';

      const badgeHTML = post.badge
        ? `<img src="https://raw.githubusercontent.com/SlaydDev/website/main/badges/${post.badge.toLowerCase().replace(/\s+/g, '-')}.png" alt="${post.badge}" style="width:24px; height:24px; vertical-align:middle; margin-left:5px;">`
        : `by ${post.author || "Unknown"}`;

      card.innerHTML = `
        <h4>${post.title} ${badgeHTML}</h4>
        <p>${post.content.split('\n').slice(0, 4).join('\n')}...</p>
      `;

      card.addEventListener('click', () => {
        const modalBadgeHTML = post.badge
          ? `<img src="https://raw.githubusercontent.com/SlaydDev/website/main/badges/${post.badge.toLowerCase().replace(/\s+/g, '-')}.png" alt="${post.badge}" style="width:24px; height:24px; vertical-align:middle; margin-left:5px;">`
          : `by ${post.author || "Unknown"}`;

        modalContent.innerHTML = `
          <h2>${post.title} ${modalBadgeHTML}</h2>
          <p>${post.content.replace(/\n/g, '<br>')}</p>
        `;
        blogModal.classList.add('active');
      });

      blogGrid.appendChild(card);
    });

    showToast("Blog posts loaded successfully!");
  })
  .catch(err => console.error("Failed to fetch blog posts:", err));

// ===========================
// MINI-GAME / EASTER EGG
// ===========================
const gameCanvas = document.createElement('canvas');
gameCanvas.id = 'miniGame';
gameCanvas.width = 200;
gameCanvas.height = 200;
gameCanvas.style.position = 'fixed';
gameCanvas.style.bottom = '20px';
gameCanvas.style.right = '20px';
gameCanvas.style.zIndex = '5000';
gameCanvas.style.background = 'rgba(255,255,255,0.05)';
gameCanvas.style.border = '1px solid #fff';
gameCanvas.style.cursor = 'pointer';
document.body.appendChild(gameCanvas);
const ctx = gameCanvas.getContext('2d');
let gameActive = false;
gameCanvas.addEventListener('click', () => {
  gameActive = !gameActive;
  if (gameActive) runGame();
});

function runGame() {
  if (!gameActive) { ctx.clearRect(0, 0, 200, 200); return; }
  ctx.clearRect(0, 0, 200, 200);
  ctx.fillStyle = '#fff';
  const x = Math.random() * 180;
  const y = Math.random() * 180;
  ctx.fillRect(x, y, 20, 20);
  requestAnimationFrame(runGame);
}

// ===========================
// PROJECT / BLOG IMAGE LIGHTBOX
// ===========================
document.addEventListener('click', e => {
  if (e.target.tagName === 'IMG' && e.target.closest('.project-item, .blog-card')) {
    const lightbox = document.createElement('div');
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.background = 'rgba(0,0,0,0.95)';
    lightbox.style.display = 'flex';
    lightbox.style.justifyContent = 'center';
    lightbox.style.alignItems = 'center';
    lightbox.style.zIndex = '5000';
    lightbox.addEventListener('click', () => document.body.removeChild(lightbox));
    const img = document.createElement('img');
    img.src = e.target.src;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
  }
});

// ===========================
// TOAST NOTIFICATIONS
// ===========================
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.right = '20px';
  toast.style.background = '#fff';
  toast.style.color = '#000';
  toast.style.padding = '10px 15px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '5001';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '1', 50);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => document.body.removeChild(toast), 300); }, 4000);
}
