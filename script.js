/* =====================================================================
   Hope Okoko — Portfolio interactions
   Vanilla JavaScript only. Handles:
     1. Mobile navigation toggle
     2. Active nav link highlighting on scroll
     3. Scroll-reveal animations
     4. "My Superpower" accessible tabbed facets
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. Mobile navigation toggle ---------- */
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");

  if (header && navToggle) {
    const closeNav = () => {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Close the menu after following a link.
    header.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    // Close with Escape and return focus to the toggle.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("nav-open")) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ---------- 2. Active nav link highlighting on scroll ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (navLinks.length && sections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        const match = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", match);
        if (match) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- 3. Scroll-reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything if IntersectionObserver isn't available.
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 4. My Superpower — accessible tabs ---------- */
  const facetGrid = document.querySelector(".facet-grid");

  if (facetGrid) {
    const tabs = Array.from(facetGrid.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll(".facet-panel"));

    const activate = (tab) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.classList.toggle("is-active", selected);
        t.tabIndex = selected ? 0 : -1; // roving tabindex for keyboard users
      });

      panels.forEach((panel) => {
        const show = panel.id === tab.getAttribute("aria-controls");
        panel.classList.toggle("is-active", show);
        panel.setAttribute("aria-hidden", show ? "false" : "true");
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));

      // Keyboard navigation between tabs.
      tab.addEventListener("keydown", (event) => {
        let next = null;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft")
          next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;

        if (next !== null) {
          event.preventDefault();
          tabs[next].focus();
          activate(tabs[next]);
        }
      });
    });

    // Initialise: make sure the first facet is active on load.
    if (tabs.length) activate(tabs[0]);
  }
})();
