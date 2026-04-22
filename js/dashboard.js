import { auth, db, storage } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.showSection = function(btn, sectionId) {
    const allButtons = document.querySelectorAll('.section-btn');
    allButtons.forEach((button) => button.classList.remove('active'));
    btn.classList.add('active');

    const sections = document.querySelectorAll(
        '.profile-section, .order-section, .wishlist-section, .checkout-section, .settings-section, .log-out-section'
    );
    sections.forEach ((section) => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}


const logOut = document.getElementById('log-out-btn');
logOut.addEventListener('click', (e) => {
    e.preventDefault();

    signOut(auth).then(() => {
    // Sign-out successful.
    alert("Successfully logged out!");

     window.location.href = "../auth/Sign-up.html";
    }).catch((error) => {
    // An error happened.
     alert(error.message);
    });

}) 

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

            if (data.photoURL) {
                document.getElementById("profile-img").src = data.photoURL;
                document.getElementById("profile-img").style.display = "block";
                document.getElementById("camera-icon").style.display = "none";
            }
        }
       document.getElementById("profile-img-circle").addEventListener("click", () => {
    document.getElementById("imgUpload").click();
});

    document.getElementById("imgUpload").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Compress image using canvas
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (event) => {
            img.src = event.target.result;

            img.onload = async () => {
                // Resize to max 200x200
                const canvas = document.createElement("canvas");
                const maxSize = 300;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to 0.5 quality JPEG
                const base64Image = canvas.toDataURL("image/jpeg", 0.9);

                try {
                    await updateDoc(doc(db, "users", user.uid), {
                        photoURL: base64Image
                    });

                    document.getElementById("profile-img").src = base64Image;
                    document.getElementById("profile-img").style.display = "block";
                    document.getElementById("camera-icon").style.display = "none";

                    alert("Profile picture updated!");
                } catch (err) {
                    console.error(err);
                    alert("Upload failed: " + err.message);
                }
            };
        };

        reader.readAsDataURL(file);
    });

    } else {
        // window.location.href = "../auth/Sign-up.html";
    }
});