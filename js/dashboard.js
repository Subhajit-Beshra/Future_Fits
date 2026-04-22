import { auth, db, storage } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/**
 * Dashboard application class - handles all dashboard functionality
 */
class Dashboard {
    constructor() {
        // Cache DOM elements to avoid repeated queries
        this.setupDOMCache();
        this.currentUser = null;
        this.init();
    }

    /**
     * Cache all frequently used DOM elements
     */
    setupDOMCache() {
        this.sections = {
            buttons: document.querySelectorAll('.section-btn'),
            profile: document.getElementById('profile'),
            orders: document.getElementById('orders'),
            wishlist: document.getElementById('wishlist'),
            addresses: document.getElementById('addresses'),
            settings: document.getElementById('settings'),
            logOut: document.getElementById('log-out'),
        };

        this.profileElements = {
            name: document.getElementById('profile-name'),
            email: document.getElementById('profile-email'),
            fullname: document.getElementById('profile-fullname'),
            emailvalue: document.getElementById('profile-emailvalue'),
            joinedDate: document.getElementById('joined-date'),
            img: document.getElementById('profile-img'),
            imgCircle: document.getElementById('profile-img-circle'),
            cameraIcon: document.getElementById('camera-icon'),
            imgUpload: document.getElementById('imgUpload'),
        };

        this.buttons = {
            logOut: document.getElementById('log-out-btn'),
        };
    }

    /**
     * Initialize dashboard - setup event listeners and auth
     */
    init() {
        this.setupEventListeners();
        this.setupAuthListener();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Section navigation
        this.sections.buttons.forEach((button) => {
            button.addEventListener('click', (e) => this.handleSectionClick(e));
        });

        // Logout button
        this.buttons.logOut?.addEventListener('click', (e) => this.handleLogout(e));

        // Profile image upload
        this.profileElements.imgCircle?.addEventListener('click', () => {
            this.profileElements.imgUpload.click();
        });

        this.profileElements.imgUpload?.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
    }

    /**
     * Handle section navigation click
     */
    handleSectionClick(event) {
        const button = event.currentTarget;
        const sectionId = button.getAttribute('data-section');
        
        if (!sectionId) return;

        this.switchSection(button, sectionId);
    }

    /**
     * Switch active section and button
     */
    switchSection(button, sectionId) {
        // Update button states
        this.sections.buttons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        // Hide all sections, show selected
        const allSections = document.querySelectorAll(
            '.profile-section, .order-section, .wishlist-section, .checkout-section, .settings-section, .log-out-section'
        );
        allSections.forEach((section) => section.classList.add('hidden'));
        
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.remove('hidden');
        }
    }

    /**
     * Handle logout
     */
    async handleLogout(event) {
        event.preventDefault();

        try {
            await signOut(auth);
            this.showNotification('Successfully logged out!', 'success');
            setTimeout(() => {
                window.location.href = "../auth/Sign-up.html";
            }, 500);
        } catch (error) {
            this.showNotification(`Logout failed: ${error.message}`, 'error');
            console.error('Logout error:', error);
        }
    }

    /**
     * Setup authentication listener
     */
    setupAuthListener() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.currentUser = user;
                await this.loadUserProfile(user);
            } else {
                // Redirect if not authenticated
                // window.location.href = "../auth/Sign-up.html";
            }
        });
    }

    /**
     * Load and display user profile data
     */
    async loadUserProfile(user) {
        try {
            const docSnap = await getDoc(doc(db, "users", user.uid));

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('User profile data loaded:', data);
                this.populateProfileData(data);
            } else {
                console.warn('No user document found in database');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showNotification('Failed to load profile', 'error');
        }
    }

    /**
     * Populate profile UI with user data
     */
    populateProfileData(data) {
        this.profileElements.name.textContent = data.name || '';
        this.profileElements.email.textContent = data.email || '';
        this.profileElements.fullname.textContent = data.name || '';
        this.profileElements.emailvalue.textContent = data.email || '';
        this.profileElements.joinedDate.textContent = data.joined || '';

        if (data.photoURL) {
            console.log('Photo URL found, displaying image');
            this.displayProfileImage(data.photoURL);
        } else {
            console.log('No photoURL in database');
        }
    }

    /**
     * Display profile image
     */
    displayProfileImage(imageUrl) {
        if (!imageUrl) {
            console.warn('No image URL provided');
            return;
        }

        this.profileElements.img.src = imageUrl;
        this.profileElements.img.style.display = "block";
        this.profileElements.cameraIcon.style.display = "none";
        
        console.log('Profile image loaded:', imageUrl.substring(0, 50) + '...');
        
        // Verify image loaded successfully
        this.profileElements.img.onerror = () => {
            console.error('Failed to load image from:', imageUrl);
            alert('Failed to load profile image');
        };
        
        this.profileElements.img.onload = () => {
            console.log('Profile image loaded successfully');
        };
    }

    /**
     * Handle image upload and compression
     */
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file || !this.currentUser) return;

        try {
            const compressedBlob = await this.compressImage(file);
            const downloadURL = await this.uploadProfileImage(this.currentUser.uid, compressedBlob);
            this.displayProfileImage(downloadURL);
            this.showNotification('Profile picture updated!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            this.showNotification(`Upload failed: ${error.message}`, 'error');
        }
    }

    /**
     * Compress image using canvas
     */
    compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const { width, height } = this.calculateResizedDimensions(
                        img.width,
                        img.height,
                        300
                    );

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.6);
                };

                img.onerror = () => reject(new Error('Failed to load image'));
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Calculate resized dimensions maintaining aspect ratio
     */
    calculateResizedDimensions(width, height, maxSize) {
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
        return { width, height };
    }

    /**
     * Upload profile image to Firebase Storage and save URL to Firestore
     */
    async uploadProfileImage(userId, imageBlob) {
        try {
            // Create a reference to the storage location
            const storageRef = ref(storage, `profile-images/${userId}/profile.jpg`);
            
            // Upload the image blob to Firebase Storage
            await uploadBytes(storageRef, imageBlob);
            console.log('Image uploaded to Firebase Storage');
            
            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            console.log('Got download URL:', downloadURL.substring(0, 50) + '...');
            
            // Save the URL to Firestore
            await updateDoc(doc(db, "users", userId), {
                photoURL: downloadURL
            });
            console.log('Profile URL saved to Firestore');
            
            return downloadURL;
        } catch (error) {
            console.error('Error uploading profile image:', error);
            throw error;
        }
    }

    /**
     * Show user notification
     */
    showNotification(message, type = 'info') {
        // Using alert for now, can be replaced with a toast notification system
        alert(message);
        // In a production app, use: console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Dashboard();
    });
} else {
    new Dashboard();
}