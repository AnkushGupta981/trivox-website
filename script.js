// Scroll progress bar

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / height) * 100;
  document.querySelector(".scroll-progress").style.width = progress + "%";
});

// Reveal animation

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Parallax glow

window.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  document.querySelector(".glow1").style.transform =
    `translate(${x}px, ${y}px)`;
  document.querySelector(".glow2").style.transform =
    `translate(${-x}px, ${-y}px)`;
});
// ===== SPLIT TEXT HEADING =====

const heading = document.getElementById("animated-heading");

function splitHeadingText() {
  const text = heading.textContent;
  heading.innerHTML = "";

  text.split("").forEach((letter, index) => {
    const span = document.createElement("span");

    span.textContent = letter === " " ? "\u00A0" : letter;
    span.style.animationDelay = `${index * 0.08}s`;

    heading.appendChild(span);
  });
}

splitHeadingText();
