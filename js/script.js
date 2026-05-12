const elements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }else{
      entry.target.classList.remove('show');
    }
  });
}, {});

elements.forEach(el => observer.observe(el));

const products = document.querySelector(".products");

Promise.all([
fetch("https://dummyjson.com/products/category/mens-shirts?limit=3")
.then(res => res.json()),

fetch("https://dummyjson.com/products/category/womens-dresses?limit=3")
.then(res => res.json()),

fetch("https://dummyjson.com/products/category/mens-shoes?limit=3")
.then(res => res.json()),

fetch("https://dummyjson.com/products/category/womens-shoes?limit=3")
.then(res => res.json()),

fetch("https://dummyjson.com/products/category/sunglasses?limit=3")
.then(res => res.json()),

fetch("https://dummyjson.com/products/category/womens-bags?limit=3")
.then(res => res.json())
])

.then(data => {
  const allProducts = data.flatMap(item => item.products);
  console.log(allProducts);
  allProducts.forEach(product => {
    products.innerHTML += `

        <div class="card" data-id="${product.id}">

        <img src="${product.thumbnail}" width="150">

        <h3>${product.title}</h3>

        <p>price: $${product.price}</p>

      </div>
    `;
  });
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      window.location.href = `pages/Product/Product.html?id=${id}`;
    });
  });
});

const showProduct = document.getElementById("showProduct");
showProduct.addEventListener("click", () => {
  window.location.href = "pages/Shop/Shop.html";
})

document.getElementById('shopBtn').addEventListener('click', () => {
  window.location.href = "pages/Shop/Shop.html";
});

const slider = document.querySelector('.slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

prevBtn.addEventListener('click', () => {
  slider.scrollBy({ left: -300, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
  slider.scrollBy({ left: 300, behavior: 'smooth' });
});