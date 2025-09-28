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

// Hover
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

// Blog carousel
let posts = [
  { title: "Example Post", author: "Captain.EXE", badge: "verified.png", content: "Sample text here..." }
];
function loadBlogPreview() {
  const carousel = document.getElementById("blogCarousel");
  posts.forEach((post, i) => {
    const card = document.createElement("div");
    card.className = "blog-card";
    card.innerHTML = `
      <h3>${post.title}</h3>
      <div class="author">${post.author} <img class="badge-small" src="${post.badge}" alt="badge"></div>
      <p>${post.content.substring(0, 120)}...</p>
    `;
    card.addEventListener("click", () => openOverlay(post));
    carousel.appendChild(card);
  });
}

function openOverlay(post) {
  const overlay = document.getElementById("blogOverlay");
  document.getElementById("overlayTitle").innerText = post.title;
  document.getElementById("overlayAuthor").innerHTML = `${post.author} <img class="badge-small" src="${post.badge}" alt="badge">`;
  document.getElementById("overlayContent").innerText = post.content;
  overlay.style.display = "flex";
}
document.getElementById("closeOverlay").addEventListener("click", () => {
  document.getElementById("blogOverlay").style.display = "none";
});

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
        counter.innerText = Math.floor(count);
      }, 20);
    });
    countersStarted = true;
  }
}
window.addEventListener("scroll", animateCounters);
