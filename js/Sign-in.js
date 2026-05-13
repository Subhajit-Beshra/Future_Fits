import { auth } from "../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const signInBtn = document.getElementById("sign-in-Btn");

// 
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.remove("success", "error");

    toast.classList.add("show", type);

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("Password").value;

    if (!email || !password) {
        showToast("Please fill all fields", "error"); // ← use toast, not alert
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showToast("Login successful!", "success"); // ← use toast, not alert

        setTimeout(() => {
            const redirectPage = localStorage.getItem("redirectAfterLogin");
            if (redirectPage) {
                localStorage.removeItem("redirectAfterLogin");
                window.location.href = redirectPage;
            } else {
                window.location.href = "../dashboard/dashboard.html";
            }
        }, 1000); // small delay so user sees the success toast

    } catch (error) {
        // Firebase v9+ uses auth/invalid-credential for bad email/password
        if (error.code === "auth/invalid-credential") {
            showToast("Invalid email or password", "error");
        } else if (error.code === "auth/invalid-email") {
            showToast("Invalid email format", "error");
        } else if (error.code === "auth/too-many-requests") {
            showToast("Too many attempts. Try again later.", "error");
        } else {
            showToast("Something went wrong. Please try again.", "error");
        }
    }
});