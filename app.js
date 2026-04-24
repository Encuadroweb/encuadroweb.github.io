// Renders projects from PROJECTS (defined in projects.js) and wires up animations

(function () {
  const container = document.getElementById("projects");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function encode(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }

  function renderCount() {
    const el = document.getElementById("project-count");
    if (el && window.PROJECTS) {
      el.textContent = window.PROJECTS.length + " projects";
    }
  }

  function renderProjects() {
    if (!container || !window.PROJECTS) return;

    const html = window.PROJECTS.map((p, i) => {
      const mobileSrc = p.mobile || p.desktop;
      return `
        <article class="project" aria-label="${encode(p.title)}">
          <div class="project-meta">
            <div class="project-title-wrap">
              <span class="project-year">${encode(p.year)}</span>
              <h2 class="project-title">${encode(p.title)}</h2>
              <div class="project-line"></div>
            </div>
            <p class="project-desc">${encode(p.description)}</p>
          </div>
          <div class="project-image-outer">
            <div class="project-image-wrap">
              <div class="reveal-overlay" aria-hidden="true"></div>
              <img
                class="project-img"
                src="${encode(p.desktop)}"
                alt="${encode(p.title)} — ${encode(p.category)}"
                loading="${i < 2 ? "eager" : "lazy"}"
              >
              <img
                class="project-img project-img-mobile"
                src="${encode(mobileSrc)}"
                alt="${encode(p.title)} — ${encode(p.category)}"
                loading="lazy"
              >
            </div>
          </div>
        </article>
      `;
    }).join("");

    container.innerHTML = html;
  }

  function setupScrollReveal() {
    const items = document.querySelectorAll(".project");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  function setupScrollBar() {
    const bar = document.getElementById("scroll-bar");
    if (!bar) return;

    function update() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? (scrolled / total) * 100 + "%" : "0%";
    }

    window.addEventListener("scroll", update, { passive: true });
  }

  function init() {
    renderProjects();
    renderCount();
    setupScrollReveal();
    setupScrollBar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
