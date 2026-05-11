import { auth, db } from "../firebase.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.isEditingAddress = false;

        this.cacheDOM();
        this.init();
    }

    cacheDOM() {
        this.buttons = document.querySelectorAll(".section-btn");

        this.sections = document.querySelectorAll(
            ".profile-section, .order-section, .wishlist-section, .checkout-section, .settings-section, .log-out-section"
        );

        this.profile = {
            name: document.getElementById("name"),
            email: document.getElementById("email")
        };

        this.logoutBtn = document.getElementById("log-out-btn");

        this.addressInputs = {
            address: document.getElementById("address"),
            city: document.getElementById("city"),
            state: document.getElementById("state"),
            zip: document.getElementById("zip"),
            phone: document.getElementById("phone")
        };

        this.editAddressBtn = document.querySelector(".edit-address-btn");

        this.toast = document.querySelector(".toast");
    }

    init() {
        this.handleAuth();
        this.addEvents();
    }

    // ✅ single reusable showToast method for whole class
    showToast(message, type = "success") {
        this.toast.textContent = message;
        this.toast.style.backgroundColor = type === "error" ? "#dc3545" : "#215B63";

        this.toast.classList.add("show");

        setTimeout(() => {
            this.toast.classList.remove("show");
        }, 2000);
    }

    addEvents() {
        this.buttons.forEach(btn => {
            btn.addEventListener("click", () => this.switchSection(btn));
        });

        this.logoutBtn?.addEventListener("click", () => this.logout());

        this.editAddressBtn?.addEventListener("click", () => this.toggleAddressEdit());
    }

    switchSection(button) {
        const id = button.dataset.section;

        this.buttons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        this.sections.forEach(sec => sec.classList.add("hidden"));
        document.getElementById(id)?.classList.remove("hidden");
    }

    async logout() {
        try {
            await signOut(auth);

            // ✅ show toast first, then redirect after 2s so user sees it
            this.showToast("Logged out successfully!");
            setTimeout(() => {
                window.location.href = "../auth/Sign-up.html";
            }, 2000);

        } catch (err) {
            console.error(err);
            // ✅ replaced alert with showToast
            this.showToast("Logout failed", "error");
        }
    }

    handleAuth() {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            this.currentUser = user;

            const userSnap = await getDoc(doc(db, "users", user.uid));

            if (userSnap.exists()) {
                const data = userSnap.data();
                this.profile.name.value = data.name || "";
                this.profile.email.value = data.email || "";
            }

            const addressSnap = await getDoc(doc(db, "addresses", user.uid));

            if (addressSnap.exists()) {
                this.setAddress(addressSnap.data());
            }
        });
    }

    setAddress(data) {
        this.addressInputs.address.value = data.address || "";
        this.addressInputs.city.value = data.city || "";
        this.addressInputs.state.value = data.state || "";
        this.addressInputs.zip.value = data.code || "";
        this.addressInputs.phone.value = data.number || "";
    }

    toggleAddressEdit() {
        const inputs = Object.values(this.addressInputs);

        this.isEditingAddress = !this.isEditingAddress;

        inputs.forEach(input => {
            input.disabled = !this.isEditingAddress;
        });

        this.editAddressBtn.querySelector("span").innerText =
            this.isEditingAddress ? "Save Address" : "Edit Address";

        if (!this.isEditingAddress) {
            this.saveAddress();
        }
    }

    async saveAddress() {
        try {
            if (!this.currentUser) return;

            await setDoc(doc(db, "addresses", this.currentUser.uid), {
                address: this.addressInputs.address.value,
                city: this.addressInputs.city.value,
                state: this.addressInputs.state.value,
                code: this.addressInputs.zip.value,
                number: this.addressInputs.phone.value
            });

            // ✅ replaced alert with showToast
            this.showToast("Address updated successfully!");

        } catch (err) {
            console.error(err);
            // ✅ replaced alert with showToast
            this.showToast("Failed to update address", "error");
        }
    }
}

new Dashboard();