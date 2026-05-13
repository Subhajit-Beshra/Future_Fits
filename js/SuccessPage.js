import { auth, db } from "../firebase.js";
import { doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch(`https://dummyjson.com/products/${productId}`)
.then(res => res.json())
.then(product => {

    console.log(product);
    const productInfo = document.querySelector(".product-info");
    const costInfo = document.querySelector(".cost-info");
    productInfo.innerHTML = `
        <div class="summary-product">
            <img src="${product.thumbnail}" width="80">
            <div class = "extra">
                <div class ="summary-info">
                    <h4>${product.title}</h4>
                    <div class = "more-details">
                    <p>Qyt: 1</p>
                    <p>Size: Medium</p>
                    </div>       
                </div>
                <div class = "price">
                    <p>$${product.price}</p>
                </div>
            </div>
        </div>
    `;
    costInfo.innerHTML = `
        <div class="heading"><h3>Price Details</h3></div>
        <div class="price-info">
            <p><span>Product Price: </span>$${product.price}</p>
            <p><span>Shipping: </span>$5.00</p>
            <p><span>Discount: </span>${product.discountPercentage}%</p>
            <p><span>Total: </span>$${(product.price * (1 - product.discountPercentage / 100) + 5).toFixed(2)}</p>
        </div>    
    `;
})

onAuthStateChanged(auth, async (user) => {

    if(user){

        try{

            // Reference to document
            const docRef = doc(db, "addresses", user.uid);

            // Fetch document
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){

                // Data from Firestore
                const data = docSnap.data();
                console.log(data);

                // Show data on website

                document.querySelector("#address").innerText = `${data.address},`;

                document.querySelector("#city").innerText = `${data.city},`;

                document.querySelector("#state").innerText = `${data.state},`;

                document.querySelector("#code").innerText = `${data.code},`;

                document.querySelector("#country").innerText = `${data.country}`;

            }
            else{

                console.log("No address found");

            }

        }
        catch(error){

            console.log(error);

        }

    }

});
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