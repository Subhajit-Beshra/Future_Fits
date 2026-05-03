const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    const cartItem = document.querySelector(".cart-item");
    cartItem.innerHTML = `<h2>No product selected</h2><p>Please select a product from the shop.</p>`;
} else {
    fetch(`https://dummyjson.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        const cartItem = document.querySelector(".cart-item");
        cartItem.innerHTML = `

            <div class = "container-1">
                <img src="${product.thumbnail}" alt="${product.title}" />
                <div class = "buttons">
                    <button class="add-to-cart">Add to Cart</button>
                    <button class="buy-now">Buy Now</button>
                </div>
            </div>
            <div class = "container-2">
                <div class = "container-2-1">
                    <h1>${product.title}</h1>
                    <br>
                    <h4> ${product.rating} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" style="display: inline; vertical-align: middle;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></h4>
                    <br>
                    <p>${product.availabilityStatus}</p>
                    <br>
                    <h2><span>Price: </span> $${product.price}</h2>
                </div>
                <div class = "container-2-2">
                    <h1>Additional Status</h1>
                    <br>
                    <p><span>Brand: </span>${product.brand}</p>
                    <br>
                    <p><span>Category: </span>${product.category}</p>
                    <br>
                    <p><span>Return Policy: </span>${product.returnPolicy}</p>
                    <br>
                    <p><span>Warranty: </span>${product.warranty}</p>
                </div>
                <div class = "container-2-3">
                    <h1>Reviews</h1>
                    <br>
                    <div class="reviews">
                        <div class="reviews-info">
                            <p><span>Reviewer: </span>${product.reviews[0].reviewerName} <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"fill="currentColor" viewBox="0 0 24 24" ><!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--><path d="M12 6c-2.28 0-4 1.72-4 4s1.72 4 4 4 4-1.72 4-4-1.72-4-4-4m0 6c-1.18 0-2-.82-2-2s.82-2 2-2 2 .82 2 2-.82 2-2 2"></path><path d="M12 2C6.49 2 2 6.49 2 12c0 3.26 1.58 6.16 4 7.98V20h.03c1.67 1.25 3.73 2 5.97 2s4.31-.75 5.97-2H18v-.02c2.42-1.83 4-4.72 4-7.98 0-5.51-4.49-10-10-10M8.18 19.02C8.59 17.85 9.69 17 11 17h2c1.31 0 2.42.85 2.82 2.02-1.14.62-2.44.98-3.82.98s-2.69-.35-3.82-.98m9.3-1.21c-.81-1.66-2.51-2.82-4.48-2.82h-2c-1.97 0-3.66 1.16-4.48 2.82A7.96 7.96 0 0 1 4 11.99c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.29-.97 4.36-2.52 5.82"></path></svg></p>
                            <br>
                            <p>${product.reviews[0].comment}</p>
                            <br>
                            <p><span>Rating: </span>${product.reviews[0].rating} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" style="display: inline; vertical-align: middle;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></p>
                        </div>
                        <div></div>
                        <br>
                        <div class="reviews-info">
                            <p><span>Reviewer: </span>${product.reviews[1].reviewerName} <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" ><!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--><path d="M12 6c-2.28 0-4 1.72-4 4s1.72 4 4 4 4-1.72 4-4-1.72-4-4-4m0 6c-1.18 0-2-.82-2-2s.82-2 2-2 2 .82 2 2-.82 2-2 2"></path><path d="M12 2C6.49 2 2 6.49 2 12c0 3.26 1.58 6.16 4 7.98V20h.03c1.67 1.25 3.73 2 5.97 2s4.31-.75 5.97-2H18v-.02c2.42-1.83 4-4.72 4-7.98 0-5.51-4.49-10-10-10M8.18 19.02C8.59 17.85 9.69 17 11 17h2c1.31 0 2.42.85 2.82 2.02-1.14.62-2.44.98-3.82.98s-2.69-.35-3.82-.98m9.3-1.21c-.81-1.66-2.51-2.82-4.48-2.82h-2c-1.97 0-3.66 1.16-4.48 2.82A7.96 7.96 0 0 1 4 11.99c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.29-.97 4.36-2.52 5.82"></path></svg></p>
                            <br>
                            <p>${product.reviews[1].comment}</p>
                            <br>
                            <p><span>Rating: </span>${product.reviews[1].rating} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" style="display: inline; vertical-align: middle;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></p>
                        </div>
                        <div></div>
                        <br>
                        <div class="reviews-info">
                            <p><span>Reviewer: </span>${product.reviews[2].reviewerName} <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="currentColor" viewBox="0 0 24 24" ><!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--><path d="M12 6c-2.28 0-4 1.72-4 4s1.72 4 4 4 4-1.72 4-4-1.72-4-4-4m0 6c-1.18 0-2-.82-2-2s.82-2 2-2 2 .82 2 2-.82 2-2 2"></path><path d="M12 2C6.49 2 2 6.49 2 12c0 3.26 1.58 6.16 4 7.98V20h.03c1.67 1.25 3.73 2 5.97 2s4.31-.75 5.97-2H18v-.02c2.42-1.83 4-4.72 4-7.98 0-5.51-4.49-10-10-10M8.18 19.02C8.59 17.85 9.69 17 11 17h2c1.31 0 2.42.85 2.82 2.02-1.14.62-2.44.98-3.82.98s-2.69-.35-3.82-.98m9.3-1.21c-.81-1.66-2.51-2.82-4.48-2.82h-2c-1.97 0-3.66 1.16-4.48 2.82A7.96 7.96 0 0 1 4 11.99c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.29-.97 4.36-2.52 5.82"></path></svg></p>
                            <br>
                            <p>${product.reviews[2].comment}</p>
                            <br>
                            <p><span>Rating: </span>${product.reviews[2].rating} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" style="display: inline; vertical-align: middle;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></p>
                        </div>
                    </div>
                </div>
            </div>
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
    })
    .catch(error => {
        console.error("Error loading product:", error);
        const cartItem = document.querySelector(".cart-item");
        cartItem.innerHTML = `<h2>Error loading product</h2><p>Please try again later.</p>`;
    });

}