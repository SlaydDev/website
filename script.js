(function() {
  // ===========================
  // LOADER & FAVICON FIX
  // ===========================
  window.addEventListener("load", () => {
    const cover = document.getElementById("cover");
    if (cover) {
      cover.style.opacity = "0";
      setTimeout(() => {
        cover.style.display = "none";
      }, 500);
    }
  });

  // Safety fallback: Forces the loader to disappear after 1.5 seconds no matter what
  setTimeout(() => {
    const cover = document.getElementById("cover");
    if (cover && getComputedStyle(cover).display !== "none") {
      cover.style.opacity = "0";
      cover.style.display = "none";
    }
  }, 1500);

  document.addEventListener("DOMContentLoaded", () => {
    const isSubfolder = window.location.pathname.split('/').filter(Boolean).length > 1;
    const assetsPath = isSubfolder ? "../assets/logo.png" : "assets/logo.png";
    
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = assetsPath;
    document.getElementsByTagName('head')[0].appendChild(link);
  });

  // ===========================
  // CUSTOM CURSOR
  // ===========================
  const cursor = document.getElementById('cursor');
  window.addEventListener('mousemove', e => {
    if (!cursor) return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  window.addEventListener('click', () => {
    if (!cursor) return;
    cursor.classList.add("click-glow");
    setTimeout(() => cursor.classList.remove("click-glow"), 300);
  });

  const textHoverElems = document.querySelectorAll('p, a, h1, h2, li, span');
  const interactHoverElems = document.querySelectorAll('img, a.button, .project-item, .team-member, .blog-card, .bento-card');

  textHoverElems.forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('text-hover'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('text-hover'));
  });
  interactHoverElems.forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('interact-hover'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('interact-hover'));
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
    const elems = document.querySelectorAll('section, .team-member, .stat, .project-item, .blog-card, .bento-card');
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
  // FEATURED PROJECTS LOADER (Bento Grid)
  // ===========================
  const featuredGrid = document.getElementById('featuredProjectsGrid');
  if (featuredGrid) {
    fetch('assets/projects.json')
      .then(res => res.json())
      .then(projects => {
        featuredGrid.innerHTML = '';
        projects.forEach(project => {
          const card = document.createElement('a');
          card.href = project.link;
          card.target = '_blank';
          card.className = 'bento-card';
          
          let bannerHTML = project.banner 
            ? `<img src="${project.banner}" alt="${project.title}" class="bento-banner">` 
            : '';

          card.innerHTML = `
            ${bannerHTML}
            <div class="bento-content">
              <h3 class="bento-title">${project.title}</h3>
              <p class="bento-desc">${project.description}</p>
              <span class="bento-link">Learn More →</span>
            </div>
          `;
          featuredGrid.appendChild(card);
        });
      })
      .catch(err => console.error("Failed to load featured projects:", err));
  }

  // ===========================
  // DYNAMIC STATS COUNTERS
  // ===========================
  const counters = document.querySelectorAll(".counter");
  let countersStarted = false;

  function sanitizeNumber(numStr) {
    return parseInt(numStr.replace(/[^\d]/g, "")) || 0;
  }

  const currentYearVal = new Date().getFullYear();
  const calculatedExpYears = currentYearVal - 2017;

  counters.forEach(counter => {
    const type = counter.getAttribute("data-counter-type");
    if (type === "experience") {
      counter.setAttribute("data-target", calculatedExpYears);
    }
  });

  async function fetchRepoCount() {
    try {
      const res = await fetch("https://api.github.com/users/thecaptainexe");
      const data = await res.json();
      if (data && typeof data.public_repos === 'number') {
        counters.forEach(counter => {
          if (counter.getAttribute("data-counter-type") === "projects") {
            counter.setAttribute("data-target", data.public_repos);
          }
        });
      }
    } catch (e) {
      console.error("Could not fetch GitHub repo count:", e);
    }
  }
  fetchRepoCount();

  function animateCounters() {
    if (countersStarted) return;
    const statsSection = document.querySelector("#stats");
    if (!statsSection) return;
    const sectionTop = statsSection.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight - 50) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = sanitizeNumber(counter.getAttribute("data-target") || counter.innerText);
        let count = 0;
        const increment = target / 200 || 1;
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
        if (counter.parentElement) {
          counter.parentElement.classList.add("visible");
        }
      });
    }
  }
  window.addEventListener("scroll", animateCounters);
  document.addEventListener("DOMContentLoaded", animateCounters);

  // ===========================
  // SCROLL TO TOP BUTTON
  // ===========================
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = (window.scrollY > 300) ? 'block' : 'none';
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // ===========================
  // BLOG FETCH + MODAL
  // ===========================
  const blogGrid = document.querySelector('.blog-grid');
  if (blogGrid) {
    const blogModal = document.createElement('div');
    blogModal.className = 'blog-modal';
    blogModal.innerHTML = `<div class="blog-modal-content"></div>`;
    document.body.appendChild(blogModal);
    const modalContent = blogModal.querySelector('.blog-modal-content');

    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) blogModal.classList.remove('active');
    });

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
              ? `<img src="https://raw.githubusercontent.com/SalyqHub/badges/${post.badge.toLowerCase().replace(/\s+/g,'-')}.png" alt="${post.badge}" style="width:24px; height:24px; vertical-align:middle; margin-left:5px;">`
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
  }

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
    setTimeout(() => { 
      toast.style.opacity = '0'; 
      setTimeout(() => document.body.removeChild(toast), 300); 
    }, 4000);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.querySelector('.blog-modal.active');
      if (modal) modal.classList.remove('active');
    }
  });

  // ===========================
  // TESTIMONIALS CAROUSEL
  // ===========================
  const testimonialTrack = document.getElementById('testimonialTrack');
  let testimonialsData = [];
  let currentIndex = 0;
  let testimonialInterval;

  fetch('assets/testimonials.json')
    .then(res => res.json())
    .then(data => {
      testimonialsData = data;
      if (testimonialsData.length > 0) {
        initCarousel();
        startAutoRotate();
      }
    })
    .catch(err => console.error("Failed to load testimonials:", err));

  function renderCarousel() {
    if (!testimonialTrack || testimonialsData.length === 0) return;
    testimonialTrack.innerHTML = '';

    const total = testimonialsData.length;
    const leftIdx = (currentIndex - 1 + total) % total;
    const centerIdx = currentIndex;
    const rightIdx = (currentIndex + 1) % total;
    const indices = [leftIdx, centerIdx, rightIdx];

    indices.forEach((idx, position) => {
      const item = testimonialsData[idx];
      const card = document.createElement('div');
      const isCenter = position === 1;
      card.className = `testimonial-card ${isCenter ? 'center-card' : 'side-card'}`;

      card.innerHTML = `
        <p class="quote-text">
          <span class="quote-large quote-start">“</span>${item.testimonial}<span class="quote-large quote-end">”</span>
        </p>
        <div class="testimonial-author">
          <img src="${item.profile_image}" alt="${item.name}">
          <span>${item.name}</span>
        </div>
      `;
      testimonialTrack.appendChild(card);
    });
  }

  function initCarousel() {
    renderCarousel();
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonialsData.length;
    renderCarousel();
  }

  function startAutoRotate() {
    testimonialInterval = setInterval(nextTestimonial, 3000);
  }

  const carouselContainer = document.querySelector('.testimonial-carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    carouselContainer.addEventListener('mouseleave', () => startAutoRotate());
  }
})();