const productScenes = {
  printer: { label: "Impressora 3D em ação", selector: ".product--printer" },
  robot: { label: "Boneco 3D colecionável", selector: ".product--robot" }
};

let activeScene = "printer";
let rotationTimer;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function showScene(nextScene) {
  if (!productScenes[nextScene] || nextScene === activeScene) return;
  document.querySelector(productScenes[activeScene].selector).classList.remove("is-visible");
  document.querySelector(`[data-scene="${activeScene}"]`).classList.remove("is-current");
  document.querySelector(`[data-scene="${activeScene}"]`).setAttribute("aria-selected", "false");
  activeScene = nextScene;
  document.querySelector(productScenes[activeScene].selector).classList.add("is-visible");
  document.querySelector(`[data-scene="${activeScene}"]`).classList.add("is-current");
  document.querySelector(`[data-scene="${activeScene}"]`).setAttribute("aria-selected", "true");
  document.querySelector("#scene-name").textContent = productScenes[activeScene].label;
}

function startRotation() {
  if (prefersReducedMotion) return;
  window.clearInterval(rotationTimer);
  rotationTimer = window.setInterval(() => showScene(activeScene === "printer" ? "robot" : "printer"), 5600);
}

document.querySelectorAll(".scene-control").forEach((button) => {
  button.addEventListener("click", () => {
    showScene(button.dataset.scene);
    startRotation();
  });
});

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("nav");
menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

let noticeTimer;
document.querySelectorAll("[data-message]").forEach((button) => {
  button.addEventListener("click", () => {
    const notice = document.querySelector(".notice");
    notice.textContent = button.dataset.message;
    notice.classList.add("is-visible");
    window.clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(() => notice.classList.remove("is-visible"), 3200);
  });
});

startRotation();
