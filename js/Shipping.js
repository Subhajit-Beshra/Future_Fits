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
const showToast = document.querySelector(".toast");
showToast.innerHTML = `
<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
fill="currentColor" viewBox="0 0 24 24" >
<!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="M11 9h2v6h-2zm0 8h2v2h-2z"></path><path d="M12.87 2.51c-.35-.63-1.4-.63-1.75 0l-9.99 18c-.17.31-.17.69.01.99.18.31.51.49.86.49h20c.35 0 .68-.19.86-.49a1 1 0 0 0 .01-.99zM3.7 20 12 5.06 20.3 20z"></path>
</svg>
<p>Something went wrong!</p>
`

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
        showToast.classList.add('.show');
        setTimeout(() => {
        showToast.classList.remove('show');
    }, 3000);
    }

});

