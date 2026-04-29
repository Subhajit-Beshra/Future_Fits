import { auth, db } from "../firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.cacheDOM();
        this.init();
    }

    cacheDOM() {
        this.buttons = document.querySelectorAll('.section-btn');
        this.sections = document.querySelectorAll(
            '.profile-section, .order-section, .wishlist-section, .checkout-section, .settings-section, .log-out-section'
        );

        this.profile = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            // fullname: document.getElementById('profile-fullname'),
            // emailvalue: document.getElementById('profile-emailvalue'),
            // joined: document.getElementById('joined-date'),
            // img: document.getElementById('profile-img'),
            // camera: document.getElementById('camera-icon'),
        };

        this.logoutBtn = document.getElementById('log-out-btn');
    }

    init() {
        this.handleAuth();
        this.addEvents();
    }

    addEvents() {
        // Section switching
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.switchSection(btn));
        });

        // Logout
        this.logoutBtn?.addEventListener('click', () => this.logout());
    }

    switchSection(button) {
        const id = button.dataset.section;

        this.buttons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        this.sections.forEach(sec => sec.classList.add('hidden'));
        document.getElementById(id)?.classList.remove('hidden');
    }

    async logout() {
        try {
            await signOut(auth);
            alert("Logged out");
            window.location.href = "../auth/Sign-up.html";
        } catch (e) {
            console.error(e);
            alert("Logout failed");
        }
    }

    handleAuth() {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            this.currentUser = user;
            const snap = await getDoc(doc(db, "users", user.uid));

            if (snap.exists()) {
                this.setProfile(snap.data());
            }
        });
    }

    setProfile(data) {
        const { name, email } = data;

        this.profile.name.value = name || "";
        this.profile.email.value = email || "";
        // this.profile.fullname.textContent = name || "";
        // this.profile.emailvalue.textContent = email || "";
        // this.profile.joined.textContent = joined || "";
    }
}

// INIT
new Dashboard();