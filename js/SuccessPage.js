import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// URL Params
const params = new URLSearchParams(window.location.search);

const productId = params.get("id");
const orderIdFromURL = params.get("orderId");


// Fetch Product
if (!productId) {
    console.error("SuccessPage: missing product id in URL");
} else {
    fetch(`https://dummyjson.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {

        console.log(product);

    const productInfo = document.querySelector(".product-info");
    const costInfo = document.querySelector(".cost-info");

    productInfo.innerHTML = `
        <div class="summary-product">

            <img src="${product.thumbnail}" width="80">

            <div class="extra">

                <div class="summary-info">

                    <h4>${product.title}</h4>

                    <div class="more-details">
                        <p>Qty: 1</p>
                        <p>Size: Medium</p>
                    </div>

                </div>

                <div class="price">
                    <p>$${product.price}</p>
                </div>

            </div>

        </div>
    `;

    costInfo.innerHTML = `
        <div class="heading">
            <h3>Price Details</h3>
        </div>

        <div class="price-info">

            <p>
                <span>Product Price: </span>
                $${product.price}
            </p>

            <p>
                <span>Shipping: </span>
                $5.00
            </p>

            <p>
                <span>Discount: </span>
                ${product.discountPercentage}%
            </p>

            <p>
                <span>Total: </span>
                $${(
                    product.price *
                    (1 - product.discountPercentage / 100)
                    + 5
                ).toFixed(2)}
            </p>

        </div>
    `;

})
.catch(error => {
    console.log(error);
});
}

// Firebase Auth
onAuthStateChanged(auth, async(user) => {

    if(!user){
        console.log("User not logged in");
        return;
    }

    // =========================
    // FETCH ADDRESS
    // =========================

    try{

        const docRef = doc(db, "addresses", user.uid);

        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){

            const data = docSnap.data();

            console.log(data);

            document.querySelector("#address").innerText =
            `${data.address},`;

            document.querySelector("#city").innerText =
            `${data.city},`;

            document.querySelector("#state").innerText =
            `${data.state},`;

            document.querySelector("#code").innerText =
            `${data.code},`;

            document.querySelector("#country").innerText =
            `${data.country}`;

        }
        else{

            console.log("No address found");

        }

    }
    catch(error){

        console.log(error);

    }


    // =========================
    // FETCH CURRENT ORDER
    // =========================

    try{

        const q = query(
            collection(db, "orders"),
            where("orderId", "==", orderIdFromURL)
        );

        const querySnapshot = await getDocs(q);

        if(querySnapshot.empty){

            console.log("No order found");
            return;

        }

        // Only ONE order
        const orderDoc = querySnapshot.docs[0];

        const orderData = orderDoc.data();

        console.log(orderData);

        // Order ID
        document.querySelector("#order-id").innerText =
        orderData.orderId;

        // Payment
        document.querySelector("#order-payment").innerText =
        orderData.cardLast4;

        // Total
        document.querySelector("#total-price").innerText =
        `$${orderData.totalPrice}`;

        // Date
        const orderDate = orderData.createdAt.toDate();

        const formattedDate = orderDate.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

        document.querySelector("#order-date").innerText =
        formattedDate;

    }
    catch(error){

        console.log(error);

    }

});

//Additional buttons
const continueBtn = document.getElementById("continue");
const invoiceBtn = document.getElementById("invoice");
continueBtn.addEventListener("click", () => {
    window.location.href = "../Shop/Shop.html";
});
invoiceBtn.addEventListener("click", () => {
    window.location.href = `../Invoice/Invoice.html?id=${productId}&orderId=${orderIdFromURL}`;
    console.log(productId);
    console.log(orderIdFromURL);
})
//Show confetti!

document.addEventListener("DOMContentLoaded", () => {
    confetti({
        particleCount: 300,
        angle: 60,
        spread: 55,
        colors: ['#22c55e','#86efac','#4ade80','#fbbf24','#f472b6','#60a5fa','#a78bfa','#fb923c'],
        origin: {x:0}
    })
    confetti({
        particleCount: 300,
        angle: 120,
        spread: 55,
        colors: ['#22c55e','#86efac','#4ade80','#fbbf24','#f472b6','#60a5fa','#a78bfa','#fb923c'],
        origin: {x:1}
    })
});
// Animation
const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }
        else{

            entry.target.classList.remove("show");

        }

    });

}, {});

elements.forEach(el => observer.observe(el));