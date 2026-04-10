import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.showSection = function(btn, sectionId) {
    const allButtons = document.querySelectorAll('.section-btn');
    allButtons.forEach((button) => {
        button.classList.remove('active');
    });
    btn.classList.add('active');
    console.log('Section switched to:', sectionId);
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("profile-name").textContent = data.name;
            document.getElementById("profile-email").textContent = data.email;
            document.getElementById("profile-fullname").textContent = data.name;
            document.getElementById("profile-emailvalue").textContent = data.email;
            document.getElementById("joined-date").textContent = data.joined;
        }
    } else {
        window.location.href = "../auth/Sign-up.html";
    }
});