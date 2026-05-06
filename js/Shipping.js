import { auth, db } from "../firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch(`https://dummyjson.com/products/${productId}`)
.then(res => res.json())
.then(product => {
    console.log(product);
    const productInfo = document.querySelector(".product-information");
    const costInfo = document.querySelector(".cost-section");
    productInfo.innerHTML = `
        <div class="summary-product">
            <img src="${product.thumbnail}" width="80">
            <div class ="summary-info">
                <h4>${product.title}</h4>
                <div class = "more-details">
                   <p>Qyt: 1</p>
                   <p>Size: Medium</p>
            </div>
        </div>
    `;
    costInfo.innerHTML = `
        <div class="heading"></div>
            <p><span>Product Price: </span>$${product.price}</p>
            <p><span>Shipping: </span>$5.00</p>
            <p><span>Discount: </span>${product.discountPercentage}%</p>
            <p><span>Total: </span>$${(product.price * (1 - product.discountPercentage / 100) + 5).toFixed(2)}</p> 
    `;
})
.catch(err => console.log(err));

const country = document.querySelector("#country");
const state = document.querySelector("#state");

fetch("https://countriesnow.space/api/v0.1/countries/states")
.then(res => res.json())
.then(data => {
    console.log(data);
    // first get all countries
    const countries = data.data;
    //add to dropdown one by one
    countries.forEach( c => {
        country.innerHTML += `
        <option value = "${c.name}">${c.name}</option>
        `;
    })
    //States would be shown according to the country
    country.addEventListener("change", () => {

        //to find our state we need to find our country first
        const selectedCountry = countries.find(c => c.name === country.value);

        //first get all states one by one
        selectedCountry.states.forEach (s => {
            state.innerHTML += `
            <option value = "${s.name}">${s.name}</option>
            `;
        })
    })
})

const continueBtn = document.getElementById("continue-btn");
continueBtn.addEventListener("click", async(e) => {
    e.preventDefault();
    const user = auth.currentUser;

    try{
        await setDoc(doc(db, "addresses", user.uid), {
         number: document.getElementById("number").value,
         address: document.getElementById("address").value,
         city: document.getElementById("city").value,
         state: document.getElementById("state").value,
         code: document.getElementById("code").value,
         country: document.getElementById("country").value
        });
        window.location.href = `../Payment/Payment.html?id=${productId}`;
    }catch(error){
        console.error(error);
        alert("Something went wrong!");
    }

});

