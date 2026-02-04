const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

if (!reduceMotion && parallaxItems.length) {
  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach((item) => {
      const factor = Number(item.dataset.parallax) || 0.15;
      item.style.transform = `translateY(${scrollY * factor * 0.1}px)`;
    });
  };

  handleParallax();
  window.addEventListener("scroll", handleParallax, { passive: true });
}
