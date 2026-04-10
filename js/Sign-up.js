import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const submitBtn = document.getElementById("sbtBtn");

submitBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
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
        alert("Account created successfully!");
        window.location.href = "../dashboard/dashboard.html";

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered");
        } else if (error.code === "auth/invalid-email") {
            alert("Invalid email address");
        } else {
            alert("Error: " + error.message);
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