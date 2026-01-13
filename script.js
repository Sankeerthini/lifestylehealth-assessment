const reveals = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-link");
const scrollBtn = document.getElementById("scrollTopBtn");

/* Scroll-based nav highlight + scroll-to-top toggle */
window.addEventListener("scroll", () => {
  let currentSection = "";

  document.querySelectorAll("section").forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 150) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });

  scrollBtn.style.display = window.scrollY > 400 ? "block" : "none";
});

/* Scroll to top */
scrollBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* Reveal on scroll */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => observer.observe(el));