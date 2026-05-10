import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const submitBtn = document.getElementById("sbtBtn");

function showToast(message, type = "success") {
    const toast = document.querySelector(".toast");
    
    if(type === "success"){

        toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.49 10 10-4.49 10-10 10m0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8"></path>
        <path d="M10 16c-.26 0-.51-.1-.71-.29l-3-3L7.7 11.3l2.29 2.29 5.29-5.29 1.41 1.41-6 6c-.2.2-.45.29-.71.29Z"></path>
        </svg>
        <span>${message}</span>
        `;

    }else{
        toast.innerHTML = `
        <span>${message}</span>
        `;
    }

    toast.classList.remove("success", "error");

    toast.classList.add("show", type);

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

submitBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showToast("Please fill in all fields", "error");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match", "error");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }

    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            joined: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
            photoURL: ""
        });

        // 3. Redirect to dashboard
        showToast("Account created successfully!");
        // 
        setTimeout(() => {
            window.location.href = "../dashboard/dashboard.html";
        }, 1500);

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            showToast("This email is already registered", "error");
        } else if (error.code === "auth/invalid-email", "error") {
            showToast("Invalid email address");
        } else {
            showToast("Error: " + error.message);
        }
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting){
            entry.target.classList.add('active');
        }else{
            entry.target.classList.remove('active');
        }
    });
}, {});

const elements = document.querySelectorAll('.reveal');
elements.forEach(el => observer.observe(el));