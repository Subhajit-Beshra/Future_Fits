const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch(`https://dummyjson.com/products/${productId}`)
.then(res => res.json())
.then(product => {
    const cartItem = document.querySelector(".cart-item");
    cartItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <img src="${product.thumbnail}" alt="${product.title}" />
    `;
    console.log(product);
    
    // Fetch related products using the correct API endpoint
    return fetch(`https://dummyjson.com/products/category/${product.category}`);
})
.then(res => res.json())
.then(data => {
    const relatedProducts = data.products.filter(item => item.id != productId);
    const relatedProContainer = document.querySelector(".related-product-container");
    relatedProducts.forEach( product => {
        const card = document.createElement("div");
        card.classList.add("related-product-card");
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
        `;
        relatedProContainer.appendChild(card);
    })
});