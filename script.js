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

// Hover effects
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
      let target = +counter.dataset.target;
      let count = 0;
      let step = Math.ceil(target / 200);
      let interval = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(interval);
        } else counter.textContent = count;
      }, 10);
    });
    countersStarted = true;
  }
}

// BLOG
function loadBlogPreview() {
  fetch("blog/posts.json")
    .then(res => res.json())
    .then(posts => {
      const container = document.getElementById("blogCarousel");
      container.innerHTML = "";

      posts.forEach(post => {
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

        card.addEventListener("click", () => openOverlay(post));

        container.appendChild(card);
      });
    });
}

const overlay = document.getElementById("blogOverlay");
function openOverlay(post) {
  overlay.style.display = "flex";
  document.getElementById("overlayTitle").textContent = post.title;
  document.getElementById("overlayAuthor").textContent = post.author;
  const badge = document.getElementById("overlayBadge");
  if(post.badge){
    badge.src = `/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png`;
    badge.style.display = "inline-block";
  } else badge.style.display = "none";
  document.getElementById("overlayContent").textContent = post.content;
}

// Close overlay
document.getElementById("closeOverlay").addEventListener("click", () => overlay.style.display="none");
window.addEventListener("keydown", e => { if(e.key==="Escape") overlay.style.display="none"; });
