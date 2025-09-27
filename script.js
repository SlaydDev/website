// LOADER
window.addEventListener("load", () => {
  const images = document.images;
  let loaded = 0;

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

  for (let i = 0; i < images.length; i++) {
    if (images[i].complete) loaded++;
    else images[i].addEventListener("load", () => {
      loaded++;
      if (loaded === images.length) hideCover();
    });
  }

  if (loaded === images.length) hideCover();
  setTimeout(hideCover, 5000); // fallback
});

// CUSTOM CURSOR
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
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 100;
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
    countersStarted = true;
  }
}

// BLOG PREVIEW DYNAMIC
async function loadBlogPreview() {
  const blogCarousel = document.getElementById("blogCarousel");
  const overlay = document.getElementById("blogOverlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayBadge = document.getElementById("overlayBadge");
  const overlayContent = document.getElementById("overlayContent");

  const res = await fetch('/blog/posts.json');
  const posts = await res.json();

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "blog-card";
    card.innerHTML = `
      <h3>${post.title}</h3>
      ${post.badge ? `<div class="badge-row"><img src="/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" alt="${post.badge}"></div>` : ''}
      <p class="author">By ${post.author}</p>
    `;
    card.addEventListener('click', () => {
      overlayTitle.innerText = post.title;
      overlayBadge.innerHTML = post.badge ? `<img src="/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" alt="${post.badge}">` : '';
      overlayContent.innerText = post.content;
      overlay.style.display = "flex";
    });
    blogCarousel.appendChild(card);
  });

  // Overlay close
  document.getElementById("closeOverlay").addEventListener('click', () => {
    overlay.style.display = "none";
  });
  document.addEventListener('keydown', e => {
    if(e.key === "Escape") overlay.style.display = "none";
  });

  // Carousel arrows
  const prev = document.getElementById("blogPrev");
  const next = document.getElementById("blogNext");
  prev.addEventListener('click', () => blogCarousel.scrollBy({ left: -300, behavior: 'smooth' }));
  next.addEventListener('click', () => blogCarousel.scrollBy({ left: 300, behavior: 'smooth' }));
}
