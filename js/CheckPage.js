const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch(`https://dummyjson.com/products/${productId}`)
.then(res => res.json())
.then(product => {
    const productInfo = document.querySelector(".product-information");
    productInfo.innerHTML = `
    <div class="product-details">
        <div class="heading">
            <h1>Product Details</h1>
        </div>
        <div class="product-box">
            <div class="product-image">
                <img src="${product.thumbnail}" alt="${product.title}" />
            </div>
            <div class="product-info">
                <h2>${product.title}</h2>
                <h3><span>Price: </span>$${product.price}</h3>
                <p>${product.rating} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" style="display: inline; vertical-align: middle;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></p>
                <p>${product.availabilityStatus}</p>
                <div class="product-options">
                    <select id="size" name="size">
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">X-Large</option>
                    </select>
                    <select id="quantity" name="quantity">
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>  
                </div>
            </div>
        </div>
    </div>
    <div class="price-details">
        <div class="heading">
            <h1>Price Details</h1>
        </div>
        <div class="price-box">
            <div class="price-info-1">
                <p><span>Product Price: </span>$${product.price}</p>
                <p><span>Shipping: </span>$5.00</p>
                <p><span>Discount: </span>${product.discountPercentage}%</p>
                <p><span>Total: </span>$${(product.price * (1 - product.discountPercentage / 100) + 5).toFixed(2)}</p>
            </div>
            <div class="price-info-2">
                <button onclick = "proceedToCheckout()" class="checkout-button">Proceed to Checkout</button>
            </div>
        </div>    
    </div>
    `;
})
.catch(error => {
    console.error("Error fetching product details:", error);
    const productInfo = document.querySelector(".product-information");
    productInfo.innerHTML = `<p>Failed to load product details 😢</p>`;
});
function proceedToCheckout() {
    const toast = document.querySelector(".toast");
    toast.style.display = "block";
    const loginButton = document.querySelector(".login-btn");
    loginButton.addEventListener("click", () => {
        window.location.href = "../auth/Sign-in.html";
    });
    toast.classList.add("show");
    // setTimeout(() => {
    //     toast.classList.remove("show");
    //     toast.style.display = "none";
    // }, 9000);
}
function cancelToast() {
    const toast = document.querySelector(".toast");
    toast.classList.remove("show");
    toast.style.display = "none";
 }