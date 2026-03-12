const noteToggle = document.getElementById("noteToggle");
const heroNote = document.getElementById("heroNote");
const nextSection = document.getElementById("why");
const progressFill = document.getElementById("progressFill");
const revealItems = document.querySelectorAll(".reveal");
const tiltItems = document.querySelectorAll("[data-tilt]");
const floatingItems = document.querySelectorAll("[data-float]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (noteToggle && heroNote) {
  noteToggle.addEventListener("click", () => {
    const isHidden = heroNote.hasAttribute("hidden");

    if (isHidden) {
      heroNote.hidden = false;
      requestAnimationFrame(() => {
        heroNote.classList.add("is-visible");
      });
      noteToggle.textContent = "keep reading";
      noteToggle.setAttribute("aria-expanded", "true");
      return;
    }

    nextSection?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
}

const updateProgress = () => {
  if (!progressFill) {
    return;
  }

  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? (window.scrollY / scrollRange) * 100 : 0;
  progressFill.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
};

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 360)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}

if (!reduceMotion) {
  tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 8;

      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });

  window.addEventListener("pointermove", (event) => {
    const xOffset = (event.clientX / window.innerWidth) - 0.5;
    const yOffset = (event.clientY / window.innerHeight) - 0.5;

    floatingItems.forEach((item, index) => {
      const depth = (index + 1) * 6;
      item.style.transform = `translate3d(${xOffset * depth}px, ${yOffset * depth}px, 0)`;
    });
  });
}
