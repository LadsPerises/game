const products = [
  { name: "Suporte para headset Creeper", category: "gaming", label: "Gaming", image: "creeper-headset-v2.webp", description: "Um suporte inspirado no universo Minecraft para o teu headset." },
  { name: "Dinossauro pixelado", category: "gaming", label: "Gaming", image: "dino-pixel-v2.webp", description: "Uma peça decorativa inspirada nos jogos em pixels." },
  { name: "Suporte para headset caveira", category: "gaming", label: "Gaming", image: "caveira-headset-v2.webp", description: "Uma caveira geométrica para colocar o teu headset." },
  { name: "Porta-incenso samurai", category: "utilidades", label: "Utilidades", image: "samurai-incenso-v2.webp", description: "Uma peça decorativa inspirada num guerreiro samurai." },
  { name: "Porta-canetas esfera", category: "utilidades", label: "Utilidades", image: "esfera-organizador-v2.webp", description: "Um organizador para a secretária inspirado nos jogos Pokémon." },
  { name: "Porta-chaves design", category: "utilidades", label: "Utilidades", image: "porta-chaves-design-v2.webp", description: "Porta-chaves coloridos para quem gosta de criação digital." },
  { name: "Dragão coleccionável", category: "figuras", label: "Figuras", image: "figura-dragao-gamer.webp", description: "Uma figura de fantasia para dar vida à tua colecção." },
  { name: "Dock para headset e comandos", category: "gaming", label: "Gaming", image: "dock-gamer-headset-comandos.webp", description: "Um lugar para organizar os acessórios do teu setup." },
  { name: "Suporte para comandos", category: "gaming", label: "Gaming", image: "suportes-comandos-gaming.webp", description: "Mantém os teus comandos em destaque e organizados." },
  { name: "Capacete sci-fi", category: "cosplay", label: "Cosplay e props", image: "capacete-cosplay-sci-fi.webp", description: "Uma peça inspirada em universos futuristas." },
  { name: "Conjunto mecânico", category: "tecnicas", label: "Peças técnicas", image: "peca-tecnica-gamer.webp", description: "Uma ideia para projectos mecânicos e de simulação." },
  { name: "Organizador de cabos", category: "utilidades", label: "Utilidades", image: "organizador-cabos-laranja.webp", description: "Cabos sempre à mão e no seu lugar." },
  { name: "Suporte para telemóvel", category: "utilidades", label: "Utilidades", image: "suporte-telemovel-ajustavel.webp", description: "Um suporte prático para a tua secretária." },
  { name: "Organizador de secretária", category: "utilidades", label: "Utilidades", image: "organizador-modular-secretaria.webp", description: "Compartimentos para as pequenas coisas do dia a dia." },
  { name: "Porta-chaves hexagonal", category: "utilidades", label: "Utilidades", image: "porta-chaves-hexagonal.webp", description: "Um toque de cor para organizar as tuas chaves." },
  { name: "Porta-joias em arco", category: "utilidades", label: "Utilidades", image: "porta-joias-arco.webp", description: "Uma forma criativa de guardar os teus acessórios." }
];
products.forEach((product, index) => { product.id = `produto-${index + 1}`; });

const CART_STORAGE_KEY = "popup3d-cart-v1";
const whatsappNumber = (document.body.dataset.whatsappNumber || "").replace(/\D/g, "");
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((item) => products.some((product) => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch { return []; }
}
function saveCart() { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); }
function cartEntries() { return cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product); }
function totalItems() { return cart.reduce((sum, item) => sum + item.quantity, 0); }
function groupEntries(entries) { return entries.reduce((groups, entry) => { (groups[entry.product.label] ||= []).push(entry); return groups; }, {}); }

const cartToggle = document.querySelector("#cart-toggle");
const cartDrawer = document.querySelector("#cart-drawer");
const cartScrim = document.querySelector("#cart-scrim");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartItemSummary = document.querySelector("#cart-item-summary");
const cartCheckout = document.querySelector("#cart-checkout");
const cartClear = document.querySelector("#cart-clear");
const cartNote = document.querySelector("#cart-note");
const gameMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let cartTransitionTimer;

function clearCartTransition() {
  window.clearTimeout(cartTransitionTimer);
  cartDrawer.classList.remove("is-opening", "is-closing");
  cartScrim.classList.remove("is-opening", "is-closing");
}

function finishClosingCart() {
  cartDrawer.hidden = true;
  cartScrim.hidden = true;
  cartDrawer.classList.remove("is-opening", "is-closing");
  cartScrim.classList.remove("is-opening", "is-closing");
}

function setCartOpen(open) {
  window.clearTimeout(cartTransitionTimer);
  if (open) {
    document.body.classList.add("cart-open");
    cartDrawer.hidden = false;
    cartScrim.hidden = false;
    cartDrawer.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
    cartToggle.setAttribute("aria-label", "Fechar carrinho");
    clearCartTransition();

    if (!gameMotion.matches) {
      void cartDrawer.offsetWidth;
      cartDrawer.classList.add("is-opening");
      cartScrim.classList.add("is-opening");
      cartToggle.classList.add("is-powered");
      cartTransitionTimer = window.setTimeout(() => {
        cartDrawer.classList.remove("is-opening");
        cartScrim.classList.remove("is-opening");
        cartToggle.classList.remove("is-powered");
      }, 760);
    }
    cartDrawer.querySelector(".cart-close").focus();
    return;
  }

  document.body.classList.remove("cart-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartToggle.setAttribute("aria-expanded", "false");
  cartToggle.setAttribute("aria-label", `Abrir carrinho${totalItems() ? `, ${totalItems()} produto(s)` : ""}`);
  cartToggle.classList.remove("is-powered");

  if (gameMotion.matches || cartDrawer.hidden) {
    finishClosingCart();
    return;
  }

  cartDrawer.classList.remove("is-opening");
  cartScrim.classList.remove("is-opening");
  cartDrawer.classList.add("is-closing");
  cartScrim.classList.add("is-closing");
  cartTransitionTimer = window.setTimeout(finishClosingCart, 300);
}
function updateCartItem(id, change) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
  saveCart(); renderCart(); renderProducts();
}
function playAddToCartEffect(trigger, product) {
  if (gameMotion.matches) return;
  const source = trigger.getBoundingClientRect();
  const target = cartToggle.getBoundingClientRect();
  const effect = document.createElement("div");
  effect.className = "cart-loot-fx";
  effect.setAttribute("aria-hidden", "true");
  effect.style.setProperty("--source-x", `${source.left + source.width / 2}px`);
  effect.style.setProperty("--source-y", `${source.top + source.height / 2}px`);
  effect.style.setProperty("--flight-x", `${target.left + target.width / 2 - (source.left + source.width / 2)}px`);
  effect.style.setProperty("--flight-y", `${target.top + target.height / 2 - (source.top + source.height / 2)}px`);
  effect.innerHTML = `<span class="cart-loot-fx__ring"></span><span class="cart-loot-fx__particle"></span><span class="cart-loot-fx__particle"></span><span class="cart-loot-fx__particle"></span><span class="cart-loot-fx__particle"></span><span class="cart-loot-fx__token"><svg viewBox="0 0 24 24"><path d="M5 7h14l-1.1 13H6.1L5 7Zm3 0a4 4 0 0 1 8 0"/></svg><b>+1</b></span><span class="cart-loot-fx__label">ITEM ADICIONADO<small>${product.name}</small></span>`;
  document.body.append(effect);
  const card = trigger.closest(".shop-card");
  card?.classList.add("is-collecting");
  cartToggle.classList.remove("is-receiving");
  void cartToggle.offsetWidth;
  cartToggle.classList.add("is-receiving");
  window.setTimeout(() => {
    effect.remove();
    cartToggle.classList.remove("is-receiving");
  }, 950);
}

function addToCart(id, trigger) {
  const product = products.find((entry) => entry.id === id);
  if (product && trigger) playAddToCartEffect(trigger, product);
  const item = cart.find((entry) => entry.id === id);
  if (item) item.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart(); renderCart(); renderProducts();
}
function renderCart() {
  const entries = cartEntries();
  const amount = totalItems();
  cartCount.textContent = amount;
  cartItemSummary.textContent = amount ? `(${amount})` : "";
  if (cartDrawer.hidden) cartToggle.setAttribute("aria-label", `Abrir carrinho${amount ? `, ${amount} produto(s)` : ""}`);
  cartCheckout.disabled = !entries.length;
  cartClear.disabled = !entries.length;
  cartItems.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement("p"); empty.className = "cart-empty"; empty.textContent = "O teu carrinho está vazio. Adiciona produtos do catálogo para preparar o pedido."; cartItems.append(empty); return;
  }
  const groups = groupEntries(entries);
  Object.entries(groups).forEach(([label, group]) => {
    const section = document.createElement("section"); section.className = "cart-group";
    const heading = document.createElement("h3"); heading.textContent = label; section.append(heading);
    group.forEach(({ product, quantity }) => {
      const item = document.createElement("article"); item.className = "cart-item";
      item.innerHTML = `<img src="assets/catalog/${product.image}" alt="" /><div><p>${product.name}</p><small>${product.description}</small></div><div class="cart-quantity" aria-label="Quantidade de ${product.name}"><button type="button" data-cart-change="-1" data-product-id="${product.id}" aria-label="Diminuir quantidade">−</button><span>${quantity}</span><button type="button" data-cart-change="1" data-product-id="${product.id}" aria-label="Aumentar quantidade">+</button></div>`;
      section.append(item);
    });
    cartItems.append(section);
  });
}
function buildWhatsappMessage() {
  const groups = groupEntries(cartEntries());
  const lines = ["*Pedido de produtos — PopUP 3D Angola*", "", "Olá! Gostaria de pedir informações sobre estes produtos:"];
  Object.entries(groups).forEach(([label, entries]) => {
    lines.push("", `*${label}*`);
    entries.forEach(({ product, quantity }) => lines.push(`• ${product.name} × ${quantity}`));
  });
  if (cartNote.value.trim()) lines.push("", "*Observação*", cartNote.value.trim());
  lines.push("", "Podem indicar disponibilidade, opções de personalização e valores?");
  return lines.join("\n");
}
cartToggle.addEventListener("click", () => setCartOpen(cartDrawer.hidden));
document.querySelector(".cart-close").addEventListener("click", () => setCartOpen(false));
cartScrim.addEventListener("click", () => setCartOpen(false));
cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-change]");
  if (button) updateCartItem(button.dataset.productId, Number(button.dataset.cartChange));
});
cartClear.addEventListener("click", () => { cart = []; saveCart(); renderCart(); renderProducts(); });
cartCheckout.addEventListener("click", () => {
  if (!cartEntries().length) return;
  const text = encodeURIComponent(buildWhatsappMessage());
  window.open(whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${text}` : `https://wa.me/?text=${text}`, "_blank", "noopener");
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !cartDrawer.hidden) setCartOpen(false); });

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
    const inCart = cart.find((item) => item.id === product.id)?.quantity || 0;
    card.innerHTML = `<div class="shop-card__image"><img src="assets/catalog/${product.image}" alt="${product.name}" loading="lazy" /><span class="shop-card__number" aria-hidden="true">ITEM / ${itemNumber}</span><span class="shop-card__corner shop-card__corner--top" aria-hidden="true"></span><span class="shop-card__corner shop-card__corner--bottom" aria-hidden="true"></span></div><div class="shop-card__body"><p class="shop-card__category">${product.label}</p><h3>${product.name}</h3><p class="shop-card__description">${product.description}</p><button class="shop-card__add${inCart ? " is-added" : ""}" type="button" data-add-product="${product.id}">${inCart ? `No carrinho (${inCart})` : "Adicionar ao carrinho"}<span aria-hidden="true">+</span></button></div>`;
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
grid.addEventListener("click", (event) => { const button = event.target.closest("[data-add-product]"); if (button) addToCart(button.dataset.addProduct, button); });
document.querySelector("#shop-year").textContent = new Date().getFullYear();
renderCart();
renderProducts();
