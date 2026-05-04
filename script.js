// PARALLAX
document.addEventListener("mousemove", (e) => {
  const profile = document.querySelector(".profile");

  let x = (window.innerWidth / 2 - e.pageX) / 50;
  let y = (window.innerHeight / 2 - e.pageY) / 50;

  profile.style.transform = `
    translateX(-50%) rotateY(${x}deg) rotateX(${y}deg)
  `;
});


// SCROLL FADE
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
});

sections.forEach(sec => {
  sec.style.opacity = 0;
  sec.style.transform = "translateY(50px)";
  observer.observe(sec);
});
