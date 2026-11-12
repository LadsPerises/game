(() => {
  const storageKey = "popup3d-cart-v1";
  const count = document.querySelector("#home-cart-count");
  const cart = document.querySelector("#home-cart-toggle");
  if (!count || !cart) return;

  const refreshCartCount = () => {
    let items = [];
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      items = Array.isArray(saved) ? saved : [];
    } catch { /* A navegação continua funcional se o armazenamento não estiver disponível. */ }
    const total = items.reduce((sum, item) => sum + (Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0), 0);
    count.textContent = total;
    cart.setAttribute("aria-label", total ? `Ver carrinho, ${total} produto${total === 1 ? "" : "s"}` : "Ver carrinho");
  };

  refreshCartCount();
  window.addEventListener("pageshow", refreshCartCount);
  window.addEventListener("storage", (event) => { if (event.key === storageKey) refreshCartCount(); });
})();
