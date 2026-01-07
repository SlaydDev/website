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
// STATIC COUNTERS
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
  window.scrollTo({top:0, behavior:'smooth'});
});

// ===========================
// BLOG FETCH + MODAL
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

// Updated blog URL
const blogURL = "https://script.google.com/macros/s/AKfycbw7d63ds3TJr-slKMVnG23kv-W8qllyi7-v1GoO_c19tXxaU3YsVr1oisCN_RqEefDD/exec";

fetch(blogURL)
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      const badgeHTML = post.badge
        ? `<img src="https://raw.githubusercontent.com/SlaydDev/website/main/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" alt="${post.badge}" style="width:24px; height:24px; vertical-align:middle; margin-left:5px;">`
        : `by ${post.author || "Unknown"}`;
      card.innerHTML = `
        <h4>${post.title} ${badgeHTML}</h4>
        <p>${post.content.split('\n').slice(0,4).join('\n')}...</p>
      `;
      card.addEventListener('click', () => {
        const modalBadgeHTML = post.badge
          ? `<img src="https://raw.githubusercontent.com/SlaydDev/website/main/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" alt="${post.badge}" style="width:24px; height:24px; vertical-align:middle; margin-left:5px;">`
          : `by ${post.author || "Unknown"}`;
        modalContent.innerHTML = `
          <h2>${post.title} ${modalBadgeHTML}</h2>
          <p>${post.content.replace(/\n/g,'<br>')}</p>
        `;
        blogModal.classList.add('active');
      });
      blogGrid.appendChild(card);
    });
    showToast("Clicking random things can reveal some easter eggs 👀");
  })
  .catch(err => console.error("Failed to fetch blog posts:", err));

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
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => document.body.removeChild(toast),300); }, 4000);
}




