(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    /* Hero parallax */
    const heroBg = document.getElementById("heroBg");
    const hero = document.querySelector(".hero");
    if (heroBg && hero) {
      const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / hero.offsetHeight, 0), 1);
        const translate = progress * 35;
        const scale = 1 + progress * 0.15;
        heroBg.style.transform = `translateY(${translate}%) scale(${scale})`;
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* Quick-buy sticky bar */
    const quickBuy = document.getElementById("quickBuy");
    if (quickBuy) {
      const onScroll = () => quickBuy.classList.toggle("show", window.scrollY > window.innerHeight * 1.4);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* Buy buttons */
    const buy = () => window.Cart.add({ id: "miniprint-mint", name: "miniprint · Mint", price: 49, image: "" });
    const closingBuy = document.getElementById("closingBuy");
    if (closingBuy) closingBuy.addEventListener("click", buy);
    const quickBuyBtn = document.getElementById("quickBuyBtn");
    if (quickBuyBtn) quickBuyBtn.addEventListener("click", buy);

    /* Feature widget */
    const items = document.querySelectorAll("#featureList .feature-item");
    const visual = document.getElementById("featureVisual");
    const badge = document.getElementById("featureBadge");
    const icons = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="m6.5 6.5 11 11L12 23V1l5.5 5.5-11 11"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>',
    ];

    function setActive(i) {
      items.forEach((el) => el.classList.remove("active"));
      const el = items[i];
      el.classList.add("active");
      const tint = el.dataset.tint;
      visual.classList.remove("mint", "blush");
      visual.classList.add(tint);
      badge.innerHTML = icons[i];
    }

    items.forEach((el, i) => {
      el.addEventListener("mouseenter", () => setActive(i));
      el.addEventListener("click", () => setActive(i));
    });
  });
})();
