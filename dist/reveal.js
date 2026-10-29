(() => {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) || motion.matches) return;

  const elements = document.querySelectorAll(".catalog__heading, .product-card, .about-discover__heading, .about-discover__card, .about-discover__banner, .contact-cta__intro, .request-form, .shop-content__top, .shop-cta");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("reveal-pending");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  elements.forEach((element, index) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight) return;
    element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 3) * 70}ms`);
    element.classList.add("reveal-ready", "reveal-pending");
    observer.observe(element);
  });
  motion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    elements.forEach((element) => element.classList.remove("reveal-pending"));
  });
})();
