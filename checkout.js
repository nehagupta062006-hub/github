(function () {
  "use strict";

  function renderSummary() {
    const el = document.getElementById("summaryContent");
    const payBtn = document.getElementById("payBtn");
    const items = window.Cart.items;
    const total = window.Cart.total;

    if (items.length === 0) {
      el.innerHTML = `<p style="font-size:0.875rem;color:var(--muted-foreground);">Your bag is empty. <a href="product.html" class="btn-underline">Shop miniprint</a>.</p>`;
      if (payBtn) { payBtn.disabled = true; payBtn.textContent = "Pay $0.00"; }
      return;
    }

    const rows = items
      .map(
        (it) => `
      <div class="summary-item">
        <div class="art-block art-hero" style="height:4rem;width:4rem;border-radius:0.75rem;flex-shrink:0;"><img src="images/product-box.jpeg" alt="${it.name}" loading="lazy"></div>
        <div class="summary-item-info">
          <div>
            <p class="name">${it.name}</p>
            <p class="qty">Qty ${it.qty}</p>
          </div>
          <p>$${(it.price * it.qty).toFixed(2)}</p>
        </div>
      </div>`
      )
      .join("");

    el.innerHTML = `
      ${rows}
      <div class="summary-rows">
        <div class="summary-row"><span class="muted">Subtotal</span><span>$${total.toFixed(2)}</span></div>
        <div class="summary-row"><span class="muted">Shipping</span><span>Free</span></div>
        <div class="summary-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      </div>`;

    if (payBtn) { payBtn.disabled = false; payBtn.textContent = `Pay $${total.toFixed(2)}`; }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderSummary();
    document.addEventListener("cart:updated", renderSummary);

    const form = document.getElementById("checkoutForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (window.Cart.items.length === 0) return;
      window.Cart.clear();
      document.getElementById("checkoutView").style.display = "none";
      document.getElementById("thankYouView").style.display = "grid";
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  });
})();
