const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {
  let scroll = window.scrollY;

  hero.style.transform = `scale(${1 + scroll * 0.0004})`;
  hero.style.opacity = 1 - scroll * 0.0012;
});
