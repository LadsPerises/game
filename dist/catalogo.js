const products = [
  { name: "Suporte para headset Creeper", category: "gaming", label: "Gaming", image: "creeper-headset-v2.png", description: "Um suporte inspirado no universo Minecraft para o teu headset." },
  { name: "Dinossauro pixelado", category: "gaming", label: "Gaming", image: "dino-pixel-v2.png", description: "Uma peça decorativa inspirada nos jogos em pixels." },
  { name: "Suporte para headset caveira", category: "gaming", label: "Gaming", image: "caveira-headset-v2.png", description: "Uma caveira geométrica para colocar o teu headset." },
  { name: "Porta-incenso samurai", category: "utilidades", label: "Utilidades", image: "samurai-incenso-v2.png", description: "Uma peça decorativa inspirada num guerreiro samurai." },
  { name: "Porta-canetas esfera", category: "utilidades", label: "Utilidades", image: "esfera-organizador-v2.png", description: "Um organizador para a secretária inspirado nos jogos Pokémon." },
  { name: "Porta-chaves design", category: "utilidades", label: "Utilidades", image: "porta-chaves-design-v2.png", description: "Porta-chaves coloridos para quem gosta de criação digital." },
  { name: "Dragão coleccionável", category: "figuras", label: "Figuras", image: "figura-dragao-gamer.png", description: "Uma figura de fantasia para dar vida à tua colecção." },
  { name: "Dock para headset e comandos", category: "gaming", label: "Gaming", image: "dock-gamer-headset-comandos.png", description: "Um lugar para organizar os acessórios do teu setup." },
  { name: "Suporte para comandos", category: "gaming", label: "Gaming", image: "suportes-comandos-gaming.png", description: "Mantém os teus comandos em destaque e organizados." },
  { name: "Capacete sci-fi", category: "cosplay", label: "Cosplay e props", image: "capacete-cosplay-sci-fi.png", description: "Uma peça inspirada em universos futuristas." },
  { name: "Conjunto mecânico", category: "tecnicas", label: "Peças técnicas", image: "peca-tecnica-gamer.png", description: "Uma ideia para projectos mecânicos e de simulação." },
  { name: "Organizador de cabos", category: "utilidades", label: "Utilidades", image: "organizador-cabos-laranja.png", description: "Cabos sempre à mão e no seu lugar." },
  { name: "Suporte para telemóvel", category: "utilidades", label: "Utilidades", image: "suporte-telemovel-ajustavel.png", description: "Um suporte prático para a tua secretária." },
  { name: "Organizador de secretária", category: "utilidades", label: "Utilidades", image: "organizador-modular-secretaria.png", description: "Compartimentos para as pequenas coisas do dia a dia." },
  { name: "Porta-chaves hexagonal", category: "utilidades", label: "Utilidades", image: "porta-chaves-hexagonal.png", description: "Um toque de cor para organizar as tuas chaves." },
  { name: "Porta-joias em arco", category: "utilidades", label: "Utilidades", image: "porta-joias-arco.png", description: "Uma forma criativa de guardar os teus acessórios." }
];

const filters = [...document.querySelectorAll(".filter")];
const search = document.querySelector("#product-search");
const grid = document.querySelector("#product-grid");
const count = document.querySelector("#results-count");
const noResults = document.querySelector("#no-results");
const heroScenes = [...document.querySelectorAll(".shop-hero__scene")];
const heroMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroDesktop = window.matchMedia("(min-width: 901px)");
let heroIndex = 0;
let heroTimer;
function updateHeroRotation() {
  clearInterval(heroTimer);
  if (document.hidden || heroMotion.matches || !heroDesktop.matches) {
    heroScenes.forEach((scene, index) => scene.classList.toggle("is-visible", index === 0));
    heroIndex = 0;
    return;
  }
  heroTimer = setInterval(() => {
    heroScenes[heroIndex].classList.remove("is-visible");
    heroIndex = (heroIndex + 1) % heroScenes.length;
    heroScenes[heroIndex].classList.add("is-visible");
  }, 6500);
}
document.addEventListener("visibilitychange", updateHeroRotation);
heroMotion.addEventListener("change", updateHeroRotation);
heroDesktop.addEventListener("change", updateHeroRotation);
updateHeroRotation();
const shopMenu = document.querySelector(".shop-nav");
const shopMenuButton = document.querySelector(".shop-menu-toggle");
document.body.classList.add("has-shop-menu");
function setShopMenu(open) {
  shopMenu.classList.toggle("is-open", open);
  shopMenuButton.setAttribute("aria-expanded", String(open));
  shopMenuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}
shopMenuButton.addEventListener("click", () => setShopMenu(shopMenuButton.getAttribute("aria-expanded") !== "true"));
shopMenu.addEventListener("click", (event) => { if (event.target.closest("a")) setShopMenu(false); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && shopMenuButton.getAttribute("aria-expanded") === "true") {
    setShopMenu(false);
    shopMenuButton.focus();
  }
});
window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => { if (event.matches) setShopMenu(false); });
const initialCategory = new URLSearchParams(location.search).get("categoria");
let category = filters.some((filter) => filter.dataset.category === initialCategory) ? initialCategory : "todos";
const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function renderProducts() {
  const query = normalize(search.value);
  const visible = products.filter((product) => (category === "todos" || product.category === category) && normalize(`${product.name} ${product.label} ${product.description}`).includes(query));
  filters.forEach((filter) => {
    const active = filter.dataset.category === category;
    filter.classList.toggle("is-active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  grid.replaceChildren();
  visible.forEach((product) => {
    const card = document.createElement("article");
    card.className = "shop-card";
    card.dataset.category = product.category;
    const itemNumber = String(products.indexOf(product) + 1).padStart(2, "0");
    card.innerHTML = `<div class="shop-card__image"><img src="assets/catalog/${product.image}" alt="${product.name}" loading="lazy" /><span class="shop-card__number" aria-hidden="true">ITEM / ${itemNumber}</span><span class="shop-card__corner shop-card__corner--top" aria-hidden="true"></span><span class="shop-card__corner shop-card__corner--bottom" aria-hidden="true"></span></div><div class="shop-card__body"><p class="shop-card__category">${product.label}</p><h3>${product.name}</h3><p class="shop-card__description">${product.description}</p><a class="shop-card__action" aria-label="Pedir informações sobre ${product.name}" href="index.html?produto=${encodeURIComponent(product.name)}#contacto">Pedir informações <span aria-hidden="true"><i class="ui-icon ui-icon--arrow-up-right" aria-hidden="true"></i></span></a></div>`;
    grid.append(card);
  });
  count.textContent = `${visible.length} ${visible.length === 1 ? "produto" : "produtos"}`;
  noResults.hidden = visible.length !== 0;
}

filters.forEach((filter) => filter.addEventListener("click", () => {
  category = filter.dataset.category;
  renderProducts();
}));
search.addEventListener("input", renderProducts);
document.querySelector("#shop-year").textContent = new Date().getFullYear();
renderProducts();
