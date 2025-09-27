// LOADER
window.addEventListener("load", () => {
  const images = document.images;
  let loaded = 0;
  for (let i = 0; i < images.length; i++) {
    if (images[i].complete) loaded++;
    else images[i].addEventListener("load", () => { loaded++; if (loaded === images.length) hideCover(); });
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
window.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
window.addEventListener('click', () => { cursor.classList.add("click-glow"); setTimeout(() => cursor.classList.remove("click-glow"), 300); });

// Cursor modes
const textHoverElems = document.querySelectorAll('p, a, h1, h2, li, span');
const interactHoverElems = document.querySelectorAll('img, a.button, .project-item, .team-member');
textHoverElems.forEach(el => { el.addEventListener('mouseenter', () => cursor.classList.add('text-hover')); el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover')); });
interactHoverElems.forEach(el => { el.addEventListener('mouseenter', () => cursor.classList.add('interact-hover')); el.addEventListener('mouseleave', () => cursor.classList.remove('interact-hover')); });

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
    if (rect.top < window.innerHeight - 60) el.classList.add("visible");
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
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const step = target / 100;
      const interval = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(interval); }
        counter.textContent = Math.floor(count);
      }, 15);
    });
    countersStarted = true;
  }
}
window.addEventListener("scroll", animateCounters);

// BLOG PREVIEW & OVERLAY
let blogData = [];
const overlay = document.getElementById("blogOverlay");
const overlayTitle = document.createElement("h2");
const overlayAuthor = document.createElement("div");
overlayAuthor.className = "author";
const overlayBadge = document.createElement("img");
overlayBadge.className = "badge-small";
overlay.appendChild(overlayTitle);
overlay.appendChild(overlayAuthor);
overlay.appendChild(overlayBadge);
const overlayContent = document.createElement("div");
overlayContent.id = "overlayContent";
overlay.appendChild(overlayContent);
const closeBtn = document.createElement("button");
closeBtn.className = "close-btn";
closeBtn.textContent = "✕";
overlay.appendChild(closeBtn);
closeBtn.addEventListener("click", () => overlay.style.display = "none");
window.addEventListener("keydown", e => { if (e.key === "Escape") overlay.style.display = "none"; });

function loadBlogPreview() {
  fetch("blog/posts.json")
    .then(res => res.json())
    .then(data => {
      blogData = data;
      const carousel = document.createElement("div");
      carousel.className = "blog-carousel";
      data.forEach(post => {
        const card = document.createElement("div");
        card.className = "blog-card";
        const title = document.createElement("h3");
        title.textContent = post.title;
        const author = document.createElement("div");
        author.className = "author";
        author.textContent = post.author;
        if (post.badge) {
          const img = document.createElement("img");
          img.className = "badge-small";
          img.src = `/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png`;
          author.appendChild(img);
        }
        const content = document.createElement("div");
        content.className = "content";
        content.textContent = post.content;
        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(content);
        card.addEventListener("click", () => {
          overlay.style.display = "flex";
          overlayTitle.textContent = post.title;
          overlayAuthor.textContent = post.author;
          if (post.badge) overlayBadge.src = `/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png`;
          overlayContent.textContent = post.content;
        });
        carousel.appendChild(card);
      });
      document.getElementById("blogCarousel").appendChild(carousel);

      // Carousel arrows
      const prev = document.createElement("button");
      prev.className = "blog-prev"; prev.textContent = "‹";
      const next = document.createElement("button");
      next.className = "blog-next"; next.textContent = "›";
      carousel.parentElement.appendChild(prev);
      carousel.parentElement.appendChild(next);
      prev.addEventListener("click", () => { carousel.scrollBy({left: -320, behavior: 'smooth'}); });
      next.addEventListener("click", () => { carousel.scrollBy({left: 320, behavior: 'smooth'}); });
    });
}
