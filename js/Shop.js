const slider = document.getElementById('countSlider');
const countDisplay = document.getElementById('count-value');
 if(slider && countDisplay){
    countDisplay.textContent = slider.value;
    slider.addEventListener('input', () => {
        countDisplay.textContent = slider.value;
    })
 }

const favouriteIcons = document.querySelectorAll('.material-symbols-outlined');
 favouriteIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        icon.classList.toggle('active');
    })
})
const container = document.querySelector(".products-grid");

// wait till page loads (important)
document.addEventListener("DOMContentLoaded", () => {

  fetch("https://fakestoreapi.com/products/category/men%27s%20clothing")
    .then(res => res.json())
    .then(data => {

      // clear old (if any)
      container.innerHTML = "";

      data.forEach(product => {

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
          <div class="card-hero">
            <span class="material-symbols-outlined">favorite</span>
          </div>

          <div class="card-content">
            <img src="${product.image}" alt="${product.title}">
          </div>

          <div class="card-info">
            <div class="prod-cat">${product.category}</div>
            <div class="prod-name">${product.title}</div>
            <div class="prod-rating">⭐ ${product.rating?.rate || "N/A"}</div>

            <div class="prod-price-low">
              <div class="prod-price">
                <span>₹${product.price.toFixed(0)}</span>
              </div>

              <button class="add-cart-btn">
                <span class="material-symbols-outlined">local_mall</span>
              </button>
            </div>
          </div>
        `;

        container.appendChild(card);
        
        // Attach favorite icon listener after adding to DOM
        const favoriteIcon = card.querySelector('.card-hero .material-symbols-outlined');
        if (favoriteIcon) {
          favoriteIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
          });
        }
        
      });

    })
    .catch(err => {
      console.error("API Error:", err);
      container.innerHTML = "<p>Failed to load products 😢</p>";
    });

});
