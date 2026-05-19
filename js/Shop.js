// ===============================
// ELEMENTS
// ===============================

const container =
document.querySelector(".products-grid");

const slider =
document.getElementById("countSlider");

const countDisplay =
document.getElementById("count-value");

const categoryBoxes =
document.querySelectorAll('input[name="option"]');

const sizeButtons =
document.querySelectorAll(".size-btn");

const colorButtons =
document.querySelectorAll(".color-btn");

const rating4 =
document.getElementById("r4");

const rating3 =
document.getElementById("r3");




// ===============================
// GLOBAL VARIABLES
// ===============================

let defaultProducts = [];

let allProducts = [];

let selectedCategory = "all";

let selectedSize = null;

let selectedColor = null;

let selectedRating = 0;

let selectedPrice = 5000;




// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadDefaultProducts();
    updateCartCount();

});

//===============================
//LOAD CARTCOUNT
//================================
window.addEventListener("storage", () => {

    updateCartCount();

});

function updateCartCount(){

    const cartNum = document.querySelector(".cartNum");
    const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    cartNum.textContent =
    cart.length;

}


// ===============================
// LOAD DEFAULT PRODUCTS
// ===============================

async function loadDefaultProducts() {

    try {

        const data = await Promise.all([

            fetch(
                "https://dummyjson.com/products/category/mens-shirts?limit=3"
            ).then(res => res.json()),

            fetch(
                "https://dummyjson.com/products/category/womens-dresses?limit=3"
            ).then(res => res.json()),

            fetch(
                "https://dummyjson.com/products/category/mens-shoes?limit=3"
            ).then(res => res.json()),

            fetch(
                "https://dummyjson.com/products/category/womens-shoes?limit=3"
            ).then(res => res.json()),

            fetch(
                "https://dummyjson.com/products/category/sunglasses?limit=3"
            ).then(res => res.json()),

            fetch(
                "https://dummyjson.com/products/category/womens-bags?limit=3"
            ).then(res => res.json())

        ]);


        defaultProducts = data
        .flatMap(item => item.products)
        .map(addDemoData);


        allProducts = defaultProducts;

        renderProducts(allProducts);

    }

    catch(error) {

        console.error(error);

        container.innerHTML =
        "<h2>Failed to load products 😢</h2>";

    }

}




// ===============================
// ADD DEMO SIZE + COLOR
// ===============================

function addDemoData(product) {

    const sizes =
    ["S", "M", "L", "XL"];

    const colors =
    ["black", "white", "red", "green"];

    return {

        ...product,

        size:
        sizes[
            Math.floor(Math.random() * sizes.length)
        ],

        color:
        colors[
            Math.floor(Math.random() * colors.length)
        ]

    };

}




// ===============================
// PRICE SLIDER
// ===============================

if(slider && countDisplay) {

    countDisplay.textContent =
    slider.value;

    slider.addEventListener("input", () => {

        selectedPrice =
        Number(slider.value);

        countDisplay.textContent =
        slider.value;

        applyFilters();

    });

}




// ===============================
// CATEGORY FILTER
// ===============================

categoryBoxes.forEach(box => {

    box.addEventListener("change", () => {

        handleCategory(box.value);

    });

});




async function handleCategory(category) {

    selectedCategory = category;


    // SHOW ALL PRODUCTS
    if(category === "all") {

        allProducts = defaultProducts;

        applyFilters();

        return;

    }


    let apiCategory = "";


    switch(category) {

        case "tops":
            apiCategory = "mens-shirts";
            break;

        case "bottoms":
            apiCategory = "mens-pants";
            break;

        case "outerwear":
            apiCategory = "mens-jackets";
            break;

        case "footwear":
            apiCategory = "mens-shoes";
            break;

        case "accessories":
            apiCategory = "sunglasses";
            break;

        default:
            apiCategory = "mens-shirts";

    }


    fetchProducts(apiCategory);

}




// ===============================
// FETCH PRODUCTS
// ===============================

async function fetchProducts(category) {

    try {

        const response = await fetch(
            `https://dummyjson.com/products/category/${category}`
        );

        const data =
        await response.json();


        allProducts =
        data.products.map(addDemoData);


        applyFilters();

    }

    catch(error) {

        console.error("API Error:", error);

        container.innerHTML =
        "<h2>Failed to load products 😢</h2>";

    }

}




// ===============================
// SIZE FILTER
// ===============================

sizeButtons.forEach(button => {

    button.addEventListener("click", () => {

        sizeButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedSize =
        button.dataset.style;

        applyFilters();

    });

});




// ===============================
// COLOR FILTER
// ===============================

colorButtons.forEach(button => {

    button.addEventListener("click", () => {

        colorButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedColor =
        button.dataset.style;

        applyFilters();

    });

});




// ===============================
// RATING FILTER
// ===============================

function updateRating() {

    selectedRating = Math.max(

        rating4.checked ? 4 : 0,

        rating3.checked ? 3 : 0

    );

    applyFilters();

}


rating4.addEventListener(
    "change",
    updateRating
);

rating3.addEventListener(
    "change",
    updateRating
);




// ===============================
// APPLY FILTERS
// ===============================

function applyFilters() {

    const filteredProducts =
    allProducts.filter(product => {


        // PRICE
        const matchPrice =
        product.price <= selectedPrice;


        // RATING
        const matchRating =
        product.rating >= selectedRating;


        // SIZE
        const matchSize =
        selectedSize
        ? product.size === selectedSize
        : true;


        // COLOR
        const matchColor =
        selectedColor
        ? product.color === selectedColor
        : true;


        return (

            matchPrice &&
            matchRating &&
            matchSize &&
            matchColor

        );

    });


    renderProducts(filteredProducts);

}
// ===============================
// CHECK WISHLIST
// ===============================

function isInWishlist(id) {

    const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some(item => item.id === id);

}

// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts(products) {

    container.innerHTML = "";


    if(products.length === 0) {

        container.innerHTML =
        "<h2>No Products Found 😢</h2>";

        return;

    }


    products.forEach(product => {

        const card =
        document.createElement("div");

        card.classList.add("product-card");


        card.innerHTML = `

            <div class="card-hero">

                <span class="material-symbols-outlined favorite-icon">
                    favorite
                </span>

            </div>



            <div class="card-content">

                <img
                    src="${product.thumbnail}"
                    alt="${product.title}"
                >

            </div>



            <div class="card-info">

                <div class="prod-cat">
                    ${product.category}
                </div>



                <div class="prod-name">
                    ${product.title}
                </div>



                <div class="prod-rating">
                    ⭐ ${product.rating}
                </div>



                <div class="prod-price-low">

                    <div class="prod-price">
                        $${product.price}
                    </div>



                    <button class="add-cart-btn">

                        <span class="material-symbols-outlined">
                            local_mall
                        </span>

                    </button>

                </div>

            </div>

        `;


        // CARD CLICK
        card.addEventListener("click", () => {

            window.location.href =
            `../Product/Product.html?id=${product.id}`;

        });


        // FAVORITE BUTTON
        const favoriteIcon =
        card.querySelector(".favorite-icon");

        favoriteIcon.classList.toggle("active", isInWishlist(product.id));

        favoriteIcon.addEventListener("click", (e) => {
            e.stopPropagation();

            const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            const idx = wishlist.findIndex(item => item.id === product.id);

            if (idx === -1) {
                // add to wishlist
                wishlist.push(product);
                favoriteIcon.classList.add("active");
            } else {
                // remove from wishlist
                wishlist.splice(idx, 1);
                favoriteIcon.classList.remove("active");
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));

        });


        container.appendChild(card);

    });

}