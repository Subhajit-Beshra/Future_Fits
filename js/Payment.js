import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =========================
// URL PARAMS
// =========================

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

let currentProduct;


// =========================
// FETCH PRODUCT
// =========================

fetch(`https://dummyjson.com/products/${productId}`)
.then(res => res.json())

.then(product => {

    currentProduct = product;

    console.log(product);

    const productInfo =
    document.querySelector(".product-information");

    const costInfo =
    document.querySelector(".cost-section");


    // Product Section
    productInfo.innerHTML = `

        <div class="summary-product">

            <img src="${product.thumbnail}" width="80">

            <div class="summary-info">

                <h4>${product.title}</h4>

                <div class="more-details">
                    <p>Qty: 1</p>
                    <p>Size: Medium</p>
                </div>

            </div>

        </div>

    `;


    // Price Section
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


// =========================
// FETCH USER ADDRESS
// =========================

onAuthStateChanged(auth, async(user) => {

    if(!user){

        console.log("User not logged in");
        return;

    }

    try{

        // Address Document
        const docRef = doc(
            db,
            "addresses",
            user.uid
        );

        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){

            const data = docSnap.data();

            console.log(data);

            // Show Address
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

});


// =========================
// PAYMENT BUTTON
// =========================

const payBtn = document.querySelector(".pay-btn");

payBtn.addEventListener("click", async() => {

    const user = auth.currentUser;

    if(!user){

        alert("Please login first");
        return;

    }

    if(!currentProduct){

        alert("Product not loaded yet");
        return;

    }

    try{

        // =========================
        // CARD DETAILS
        // =========================

        const cardNumber =
        document.querySelector("#number")
        .value
        .trim();

        const cardHolder =
        document.querySelector("#c-holder")
        .value
        .trim();

        const expiryDate =
        document.querySelector("#e-date")
        .value
        .trim();

        const cvv =
        document.querySelector("#cvv")
        .value
        .trim();


        // =========================
        // VALIDATION
        // =========================

        if(
            !cardNumber ||
            !cardHolder ||
            !expiryDate ||
            !cvv
        ){

            alert("Please fill all fields");
            return;

        }

        if(cardNumber.length < 4){

            alert("Invalid card number");
            return;

        }


        // =========================
        // GENERATE ORDER
        // =========================

        const orderId =
        "ORD" + Date.now();


        // =========================
        // TOTAL PRICE
        // =========================

        const total = (

            currentProduct.price *

            (1 - currentProduct.discountPercentage / 100)

            + 5

        ).toFixed(2);


        // =========================
        // MASK CARD
        // =========================

        const maskedCard =
        "**** **** **** " +
        cardNumber.slice(-4);


        // =========================
        // FETCH ADDRESS
        // =========================

        const docRef = doc(
            db,
            "addresses",
            user.uid
        );

        const docSnap = await getDoc(docRef);

        const addressData = docSnap.data();


        // =========================
        // SAVE ORDER
        // =========================

        await addDoc(

            collection(db, "orders"),

            {

                orderId: orderId,

                userId: user.uid,

                productId: currentProduct.id,

                productTitle: currentProduct.title,

                productPrice: currentProduct.price,

                thumbnail: currentProduct.thumbnail,

                totalPrice: total,

                discount:
                currentProduct.discountPercentage,

                shipping: 5,

                paymentMethod: "Card",

                cardLast4: maskedCard,

                cardHolder: cardHolder,

                paymentStatus: "Paid",

                address: addressData,

                createdAt: new Date()

            }

        );

        console.log("Order Saved Successfully");


        // =========================
        // REDIRECT
        // =========================

        window.location.href =
        `../SuccessPage/SuccessPage.html?id=${productId}&orderId=${orderId}`;

    }
    catch(error){

        console.log(error);

        alert("Payment Failed");

    }

});