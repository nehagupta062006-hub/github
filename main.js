/* ==========================================================================
   miniprint — shared behaviour (cart, nav, mini-cart drawer, reveal-on-scroll)
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Cart state (persisted to localStorage, same shape as the original app)
     ------------------------------------------------------------------- */
  const STORAGE_KEY = "miniprint_cart";

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* ignore */
    }
  }

  const Cart = {
    items: loadCart(),

    add(item, qty = 1) {
      const existing = this.items.find((i) => i.id === item.id);
      if (existing) {
        existing.qty += qty;
      } else {
        this.items.push({ ...item, qty });
      }
      this.persist();
      this.openDrawer();
    },
    remove(id) {
      this.items = this.items.filter((i) => i.id !== id);
      this.persist();
    },
    setQty(id, qty) {
      const item = this.items.find((i) => i.id === id);
      if (item) item.qty = Math.max(1, qty);
      this.persist();
    },
    clear() {
      this.items = [];
      this.persist();
    },
    get count() {
      return this.items.reduce((s, i) => s + i.qty, 0);
    },
    get total() {
      return this.items.reduce((s, i) => s + i.qty * i.price, 0);
    },
    persist() {
      saveCart(this.items);
      render();
    },
    openDrawer() {
      setDrawerOpen(true);
    },
  };
  window.Cart = Cart;

  /* ---------------------------------------------------------------------
     Icons (small inline SVGs, lucide-style)
     ------------------------------------------------------------------- */
  const ICON = {
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };

  /* ---------------------------------------------------------------------
     Nav: scroll shadow + mobile menu
     ------------------------------------------------------------------- */
  function initNav() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const menuBtn = document.querySelector(".menu-btn");
    const mobileMenu = document.querySelector(".mobile-menu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
      mobileMenu.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => mobileMenu.classList.remove("open"))
      );
    }

    document.querySelectorAll(".cart-btn").forEach((btn) =>
      btn.addEventListener("click", () => setDrawerOpen(true))
    );
  }

  /* ---------------------------------------------------------------------
     Mini-cart drawer
     ------------------------------------------------------------------- */
  function setDrawerOpen(open) {
    const overlay = document.querySelector(".cart-overlay");
    const drawer = document.querySelector(".cart-drawer");
    if (!overlay || !drawer) return;
    overlay.classList.toggle("open", open);
    drawer.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function renderCartDrawer() {
    const body = document.querySelector(".cart-body");
    const footer = document.querySelector(".cart-footer");
    if (!body) return;

    if (Cart.items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div>
            <p class="big">Empty.</p>
            <p>Time to print some memories.</p>
            <a href="product.html" class="btn-underline" style="display:inline-block;margin-top:1.5rem;">Shop miniprint</a>
          </div>
        </div>`;
      if (footer) footer.style.display = "none";
      return;
    }

    body.innerHTML = `<ul>${Cart.items
      .map(
        (it) => `
      <li class="cart-item" data-id="${it.id}">
        <div class="art-block art-hero" style="width:5rem;height:5rem;border-radius:0.75rem;flex-shrink:0;"><img src="images/product-box.jpeg" alt="${it.name}" loading="lazy"></div>
        <div class="cart-item-info">
          <div class="cart-item-top">
            <p class="cart-item-name">${it.name}</p>
            <p>$${(it.price * it.qty).toFixed(2)}</p>
          </div>
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button class="qty-minus" aria-label="Decrease quantity">${ICON.minus}</button>
              <span>${it.qty}</span>
              <button class="qty-plus" aria-label="Increase quantity">${ICON.plus}</button>
            </div>
            <button class="remove-btn">Remove</button>
          </div>
        </div>
      </li>`
      )
      .join("")}</ul>`;

    body.querySelectorAll(".cart-item").forEach((li) => {
      const id = li.dataset.id;
      const item = Cart.items.find((i) => i.id === id);
      li.querySelector(".qty-minus").addEventListener("click", () => Cart.setQty(id, item.qty - 1));
      li.querySelector(".qty-plus").addEventListener("click", () => Cart.setQty(id, item.qty + 1));
      li.querySelector(".remove-btn").addEventListener("click", () => Cart.remove(id));
    });

    if (footer) {
      footer.style.display = "";
      const subtotal = footer.querySelector(".cart-subtotal span:last-child");
      if (subtotal) subtotal.textContent = `$${Cart.total.toFixed(2)}`;
    }
  }

  function initCartDrawerChrome() {
    const overlay = document.querySelector(".cart-overlay");
    const closeBtn = document.querySelector(".cart-close");
    if (overlay) overlay.addEventListener("click", () => setDrawerOpen(false));
    if (closeBtn) closeBtn.addEventListener("click", () => setDrawerOpen(false));
  }

  /* ---------------------------------------------------------------------
     Badge + any per-page cart-dependent bits
     ------------------------------------------------------------------- */
  function renderBadge() {
    document.querySelectorAll(".cart-badge").forEach((badge) => {
      const n = Cart.count;
      badge.textContent = String(n);
      badge.style.display = n > 0 ? "grid" : "none";
    });
  }

  function render() {
    renderBadge();
    renderCartDrawer();
    document.dispatchEvent(new CustomEvent("cart:updated"));
  }
  window.renderCart = render;

  /* ---------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Init
     ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initCartDrawerChrome();
    initReveal();
    render();
  });
})();
