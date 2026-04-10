import { auth } from "../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const signInBtn = document.getElementById("sign-in-Btn");

signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("Password").value;

    // Validation
    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        // 🔑 Login user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert("Login successful!");

        // Redirect to dashboard
        window.location.href = "../dashboard/dashboard.html";

    } catch (error) {
        if (error.code === "auth/user-not-found") {
            alert("User not found");
        } else if (error.code === "auth/wrong-password") {
            alert("Wrong password");
        } else if (error.code === "auth/invalid-email") {
            alert("Invalid email");
        } else {
            alert("Error: " + error.message);
        }
    }
});