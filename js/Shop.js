// ===============================
// ELEMENTS
// ===============================

const container = document.querySelector(".products-grid");

const slider = document.getElementById("countSlider");
const countDisplay = document.getElementById("count-value");

const categoryBoxes =
document.querySelectorAll('input[name="option"]');

const sizeButtons =
document.querySelectorAll(".size-btn");

const colorButtons =
document.querySelectorAll(".color-btn");

const rating4 = document.getElementById("r4");
const rating3 = document.getElementById("r3");




// ===============================
// GLOBAL VARIABLES
// ===============================

let allProducts = [];

let selectedCategory = "mens-shirts";

let selectedSize = null;

let selectedColor = null;

let selectedRating = 0;

let selectedPrice = 5000;




// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    fetchProducts(selectedCategory);

});





// ===============================
// PRICE SLIDER
// ===============================

if (slider && countDisplay) {

    countDisplay.textContent = slider.value;

    slider.addEventListener("input", () => {

        selectedPrice = Number(slider.value);

        countDisplay.textContent = slider.value;

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




function handleCategory(category) {

    switch(category) {

        case "tops":
            selectedCategory = "mens-shirts";
            break;

        case "bottoms":
            selectedCategory = "tops";
            break;

        case "outerwear":
            selectedCategory = "mens-shoes";
            break;

        case "footwear":
            selectedCategory = "mens-shoes";
            break;

        case "accessories":
            selectedCategory = "sunglasses";
            break;

        case "all":
            selectedCategory = "mens-shirts";
            break;

        default:
            selectedCategory = "mens-shirts";

    }

    fetchProducts(selectedCategory);

}





// ===============================
// SIZE FILTER
// ===============================

sizeButtons.forEach(button => {

    button.addEventListener("click", () => {

        sizeButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedSize = button.dataset.style;

        applyFilters();

    });

});





// ===============================
// COLOR FILTER
// ===============================

colorButtons.forEach(button => {

    button.addEventListener("click", () => {

        colorButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedColor = button.dataset.style;

        applyFilters();

    });

});





// ===============================
// RATING FILTER
// ===============================

rating4.addEventListener("change", () => {

    if(rating4.checked) {

        selectedRating = 4;

    } else {

        selectedRating = 0;

    }

    applyFilters();

});



rating3.addEventListener("change", () => {

    if(rating3.checked) {

        selectedRating = 3;

    } else {

        selectedRating = 0;

    }

    applyFilters();

});






// ===============================
// FETCH PRODUCTS
// ===============================

async function fetchProducts(category) {

    try {

        const response = await fetch(
            `https://dummyjson.com/products/category/${category}?limit=12`
        );

        const data = await response.json();



        // ADD DEMO SIZE + COLOR
        allProducts = data.products.map(product => {

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

        });


        applyFilters();

    }

    catch(error) {

        console.error("API Error:", error);

        container.innerHTML =
        "<p>Failed to load products 😢</p>";

    }

}







// ===============================
// APPLY FILTERS
// ===============================

function applyFilters() {

    let filteredProducts = allProducts.filter(product => {


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

        const card = document.createElement("div");

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

                        ₹${product.price}

                    </div>



                    <button class="add-cart-btn">

                        <span class="material-symbols-outlined">
                            local_mall
                        </span>

                    </button>

                </div>

            </div>

        `;


        container.appendChild(card);




        // FAVORITE BUTTON
        const favoriteIcon =
        card.querySelector(".favorite-icon");


        favoriteIcon.addEventListener("click", () => {

            favoriteIcon.classList.toggle("active");

        });

    });

}