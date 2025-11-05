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
    showToast("Blog posts loaded successfully!");
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

// ===========================
// KOALAS TO THE MAX STYLE
// ===========================
const canvas = document.createElement('canvas');
canvas.id = 'koalasCanvas';
canvas.width = 250;
canvas.height = 250;
canvas.style.position = 'fixed';
canvas.style.bottom = '20px';
canvas.style.right = '20px';
canvas.style.zIndex = '5000';
canvas.style.cursor = 'pointer';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = 'https://raw.githubusercontent.com/SlaydDev/website/main/badges/winter.png';

const MIN_SIZE = 8; // smaller tiles for Koalas effect
const squares = [];

const motivation = document.createElement('div');
motivation.style.position = 'absolute';
motivation.style.bottom = '280px';
motivation.style.right = '20px';
motivation.style.color = '#fff';
motivation.style.fontWeight = '700';
motivation.style.fontSize = '1rem';
motivation.style.opacity = '0';
motivation.style.transition = 'opacity 0.3s';
document.body.appendChild(motivation);

const finalMessage = document.createElement('div');
finalMessage.style.position = 'absolute';
finalMessage.style.bottom = '20px';
finalMessage.style.right = '20px';
finalMessage.style.color = '#fff';
finalMessage.style.fontWeight = '900';
finalMessage.style.fontSize = '1.2rem';
finalMessage.style.opacity = '0';
finalMessage.style.transition = 'opacity 1s';
document.body.appendChild(finalMessage);

class Square {
  constructor(x, y, size, imgX, imgY, imgSize) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.imgX = imgX;
    this.imgY = imgY;
    this.imgSize = imgSize;
    this.children = [];
  }

  draw() {
    if (this.children.length > 0) {
      this.children.forEach(c => c.draw());
    } else {
      ctx.drawImage(
        image,
        this.imgX, this.imgY, this.imgSize, this.imgSize,
        this.x, this.y, this.size, this.size
      );
    }
  }

  split() {
    if (this.size / 2 >= MIN_SIZE && this.children.length === 0) {
      const newSize = this.size / 2;
      const newImgSize = this.imgSize / 2;
      this.children.push(new Square(this.x, this.y, newSize, this.imgX, this.imgY, newImgSize));
      this.children.push(new Square(this.x + newSize, this.y, newSize, this.imgX + newImgSize, this.imgY, newImgSize));
      this.children.push(new Square(this.x, this.y + newSize, newSize, this.imgX, this.imgY + newImgSize, newImgSize));
      this.children.push(new Square(this.x + newSize, this.y + newSize, newSize, this.imgX + newImgSize, this.imgY + newImgSize, newImgSize));
    }
  }

  hover(mx, my) {
    if (mx > this.x && mx < this.x + this.size && my > this.y && my < this.y + this.size) {
      this.split();
    }
    this.children.forEach(c => c.hover(mx, my));
  }

  isFullySplit() {
    if (this.children.length === 0) return false;
    return this.children.every(c => c.isFullySplit());
  }
}

image.onload = () => {
  squares.push(new Square(0, 0, canvas.width, 0, 0, image.width));
  draw();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  squares.forEach(sq => sq.draw());
  requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  motivation.textContent = Math.random() > 0.5 ? "Almost there!" : "Keep going!";
  motivation.style.opacity = '1';

  squares.forEach(sq => sq.hover(mx, my));

  if (squares.every(sq => sq.isFullySplit())) {
    finalMessage.textContent = "Congrats!";
    finalMessage.style.opacity = '1';
    motivation.style.opacity = '0';
  }
});

canvas.addEventListener('mouseleave', () => {
  motivation.style.opacity = '0';
});

