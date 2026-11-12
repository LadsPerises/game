const productScenes = [...document.querySelectorAll(".showcase .product")];
let activeScene = 0;
let rotationTimer;
const heroMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroDesktop = window.matchMedia("(min-width: 901px)");

function showScene(nextScene) {
  if (!productScenes[nextScene] || nextScene === activeScene) return;
  productScenes[activeScene].classList.remove("is-visible");
  activeScene = nextScene;
  productScenes[activeScene].classList.add("is-visible");
}

function startRotation() {
  window.clearInterval(rotationTimer);
  if (document.querySelector('.showcase')?.dataset.rotation === 'standby' || heroMotionPreference.matches || !heroDesktop.matches || document.hidden || productScenes.length < 2) return;
  rotationTimer = window.setInterval(() => showScene((activeScene + 1) % productScenes.length), 6200);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) window.clearInterval(rotationTimer);
  else startRotation();
});
heroMotionPreference.addEventListener("change", startRotation);
heroDesktop.addEventListener("change", startRotation);

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("nav");
menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});
navigation.addEventListener("click", (event) => { if (event.target.closest("a")) { navigation.classList.remove("is-open"); menuButton.setAttribute("aria-expanded", "false"); menuButton.setAttribute("aria-label", "Abrir menu"); } });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && navigation.classList.contains("is-open")) { navigation.classList.remove("is-open"); menuButton.setAttribute("aria-expanded", "false"); menuButton.setAttribute("aria-label", "Abrir menu"); menuButton.focus(); } });

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

document.querySelector("#current-year").textContent = new Date().getFullYear();

const gameScene = document.querySelector(".contact-cta");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let sceneInView = true;

function updateGameScene() {
  gameScene.classList.toggle("is-playing", sceneInView && !document.hidden && !motionPreference.matches);
  if (motionPreference.matches) {
    gameScene.style.removeProperty("--scene-x");
    gameScene.style.removeProperty("--scene-y");
  }
}

if ("IntersectionObserver" in window) {
  const sceneObserver = new IntersectionObserver(([entry]) => {
    sceneInView = entry.isIntersecting;
    updateGameScene();
  }, { threshold: 0.05 });
  sceneObserver.observe(gameScene);
}
document.addEventListener("visibilitychange", updateGameScene);
motionPreference.addEventListener("change", updateGameScene);
let sceneFrame;
gameScene.addEventListener("pointermove", (event) => {
  if (motionPreference.matches || event.pointerType !== "mouse") return;
  const bounds = gameScene.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
  cancelAnimationFrame(sceneFrame);
  sceneFrame = requestAnimationFrame(() => {
    gameScene.style.setProperty("--scene-x", `${x.toFixed(1)}px`);
    gameScene.style.setProperty("--scene-y", `${y.toFixed(1)}px`);
  });
});
gameScene.addEventListener("pointerleave", () => {
  cancelAnimationFrame(sceneFrame);
  gameScene.style.removeProperty("--scene-x");
  gameScene.style.removeProperty("--scene-y");
});
updateGameScene();

const requestForm = document.querySelector(".request-form");
const categoryPicker = document.querySelector("[data-category-picker]");
const categorySelect = document.querySelector("#request-type");
const categoryTrigger = categoryPicker?.querySelector(".category-picker__trigger");
const categoryOptions = categoryPicker?.querySelector(".category-picker__options");

function closeCategoryPicker() {
  if (!categoryPicker) return;
  categoryPicker.classList.remove("is-open");
  categoryTrigger.setAttribute("aria-expanded", "false");
  categoryOptions.hidden = true;
}

if (categoryPicker) {
  categoryTrigger.addEventListener("click", () => {
    const willOpen = !categoryPicker.classList.contains("is-open");
    closeCategoryPicker();
    if (willOpen) {
      categoryPicker.classList.add("is-open");
      categoryTrigger.setAttribute("aria-expanded", "true");
      categoryOptions.hidden = false;
    }
  });

  categoryOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-value]");
    if (!option) return;
    categorySelect.value = option.dataset.value;
    categoryTrigger.querySelector("span").textContent = option.dataset.value;
    categoryOptions.querySelectorAll("[role=option]").forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    categoryPicker.classList.remove("is-invalid");
    closeCategoryPicker();
    categoryTrigger.focus();
  });

  categoryTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCategoryPicker();
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (categoryOptions.hidden) categoryTrigger.click();
      categoryOptions.querySelector("button")?.focus();
    }
  });
  document.addEventListener("click", (event) => { if (!categoryPicker.contains(event.target)) closeCategoryPicker(); });
}

const requestedProduct = new URLSearchParams(window.location.search).get("produto");
if (requestedProduct) {
  document.querySelector("#request-idea").value = `Gostaria de saber mais sobre: ${requestedProduct}.`;
}
requestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!categorySelect.value) {
    categoryPicker.classList.add("is-invalid");
    categoryTrigger.focus();
    requestForm.querySelector(".request-form__feedback").textContent = "Escolhe uma categoria para continuar.";
    return;
  }
  if (!requestForm.reportValidity()) return;

  const values = new FormData(requestForm);
  const request = [
    "Pedido de impressão 3D — PopUP 3D Angola",
    `Nome: ${values.get("name")}`,
    `Contacto: ${values.get("contact")}`,
    `Categoria: ${values.get("type")}`,
    `Ideia: ${values.get("idea")}`
  ].join("\n");
  const feedback = requestForm.querySelector(".request-form__feedback");
  const fallback = requestForm.querySelector(".request-form__fallback");
  const fallbackText = requestForm.querySelector("#request-copy");

  try {
    await navigator.clipboard.writeText(request);
    fallback.hidden = true;
    feedback.textContent = "Pedido copiado. Já podes colá-lo na tua mensagem.";
  } catch {
    fallbackText.value = request;
    fallback.hidden = false;
    feedback.textContent = "Não foi possível copiar automaticamente. Selecciona e copia o texto abaixo.";
    fallbackText.focus();
    fallbackText.select();
  }
});
