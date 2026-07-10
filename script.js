// ==========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ==========================================
const supabaseUrl = 'https://ufzdbyrcflftpupqqzjg.supabase.co';
const supabaseKey = 'sb_publishable_8169Y0pYnw0LtF206Ra9OA_QEoTU5Cc';

let supabase;

// Mobile Stability: Verify the Supabase global window library loads prior to instantiation
if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
} else {
    console.error("Supabase CDN library not detected! Submissions will fail.");
    const loadStatus = document.querySelector(".form-status");
    if (loadStatus) {
        loadStatus.style.color = "#ff4d4d";
        loadStatus.textContent = "✗ Connection error. Please reload the page.";
    }
}

// ==========================================
// 2. MOBILE MENU TOGGLE
// ==========================================
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu automatically when any local page link is tapped
    document.querySelectorAll(".site-nav a").forEach(link => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ==========================================
// 3. REVEAL ANIMATIONS ON SCROLL
// ==========================================
const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
}

// ==========================================
// 4. CONTACT FORM HANDLING
// ==========================================
const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const statusEl = contactForm.querySelector(".form-status");
        
        // Critical safeguard if CDN fails to initialize
        if (!supabase) {
            if (statusEl) {
                statusEl.style.color = "#ff4d4d";
                statusEl.textContent = "✗ Connection down. Refresh and try again.";
            }
            return;
        }

        // Clean target values extracted safely from inputs match your layout names
        const formData = {
            name: contactForm.name.value.trim(),
            phone: contactForm.phone.value.trim(),
            model: contactForm.model.value,
            message: contactForm.message.value.trim()
        };

        const button = contactForm.querySelector("button");
        const originalText = button ? button.textContent : "Send Request";

        try {
            if (statusEl) {
                statusEl.style.color = "#ffa500";
                statusEl.textContent = "Sending...";
            }
            if (button) {
                button.disabled = true;
                button.textContent = "Sending...";
            }

            // Write direct payload bypass to Supabase table schema
            const { error } = await supabase
                .from("customer_request")
                .insert([formData]);

            if (error) throw error;

            // Successful feedback indicators
            if (statusEl) {
                statusEl.style.color = "#2ecc71";
                statusEl.textContent = "✓ Request sent successfully!";
            }
            if (button) {
                button.textContent = "Sent!";
            }
            
            contactForm.reset();

            setTimeout(() => {
                if (statusEl) statusEl.textContent = "";
            }, 4000);

        } catch (error) {
            console.error("Form transmission error:", error);
            if (statusEl) {
                statusEl.style.color = "#ff4d4d";
                statusEl.textContent = "✗ " + (error.message || "Error sending request.");
            }
        } finally {
            // Re-enable interactive capabilities
            setTimeout(() => {
                if (button) {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }, 1800);
        }
    });
}
