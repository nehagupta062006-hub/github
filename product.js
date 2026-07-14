(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    /* Gallery */
    const main = document.getElementById("galleryMain");
    const thumbs = document.querySelectorAll("#galleryThumbs .thumb-btn");
    thumbs.forEach((btn) => {
      btn.addEventListener("click", () => {
        thumbs.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const tint = btn.dataset.tint;
        main.innerHTML = `<div class="art-block art-${tint}"></div>`;
        main.style.opacity = 0;
        requestAnimationFrame(() => {
          main.style.transition = "opacity .5s ease";
          main.style.opacity = 1;
        });
      });
    });

    /* Color swatches */
    let selectedColor = { id: "mint", name: "Mint" };
    const swatches = document.querySelectorAll(".swatch");
    const colorName = document.getElementById("colorName");
    swatches.forEach((sw) => {
      sw.addEventListener("click", () => {
        swatches.forEach((s) => s.classList.remove("active"));
        sw.classList.add("active");
        selectedColor = { id: sw.dataset.id, name: sw.dataset.name };
        colorName.textContent = selectedColor.name;
      });
    });

    /* Add to bag */
    const addBtn = document.getElementById("addToBag");
    addBtn.addEventListener("click", () => {
      window.Cart.add({
        id: `miniprint-${selectedColor.id}`,
        name: `miniprint · ${selectedColor.name}`,
        price: 49,
        image: "",
      });
    });

    /* Accordion */
    document.querySelectorAll("#accordion .acc-item").forEach((item) => {
      const trigger = item.querySelector(".acc-trigger");
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        item.classList.toggle("open", !isOpen);
      });
    });
  });
})();
