// ==========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ==========================================
const supabaseUrl = 'https://ufzdbyrcflftpupqqzjg.supabase.co';
const supabaseKey = 'sb_publishable_8169Y0pYnw0LtF206Ra9OA_QEoTU5Cc';

let supabase;

// Mobile/Production Fix: Safely ensure the CDN library has loaded before building client
if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
} else {
    console.error("Supabase CDN library not detected! Submissions will fail.");
    // Fallback UI warning if the database connection isn't initialized
    const fallbackStatus = document.querySelector(".form-status");
    if (fallbackStatus) {
        fallbackStatus.style.color = "red";
        fallbackStatus.textContent = "✗ Connection error. Please reload the page.";
    }
}

// ==========================================
// 2. MOBILE MENU TOGGLE
// ==========================================
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", siteNav.classList.contains("is-open"));
    });

    // Close menu when a link is clicked
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
// 4. CONTACT FORM HANDLING (SUPABASE FIX)
// ==========================================
const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const statusEl = contactForm.querySelector(".form-status");
        
        // Safety checkpoint if Supabase didn't initialize
        if (!supabase) {
            if (statusEl) {
                statusEl.style.color = "red";
                statusEl.textContent = "✗ Database configuration error. Refresh and try again.";
            }
            return;
        }

        // Gather form data fields safely
        const formData = {
            name: contactForm.name.value,
            phone: contactForm.phone.value,
            model: contactForm.model.value,
            message: contactForm.message.value
        };

        const button = contactForm.querySelector("button");
        const originalText = button ? button.textContent : "Send Request";

        try {
            if (statusEl) {
                statusEl.style.color = "orange";
                statusEl.textContent = "Sending...";
            }
            if (button) {
                button.disabled = true;
                button.textContent = "Sending...";
            }

            // CRITICAL FIX: Direct link to Supabase table bypassing local backend routing restrictions
            const { error } = await supabase
                .from("customer_request")
                .insert([formData]);

            if (error) {
                throw error;
            }

            // Success configuration
            if (statusEl) {
                statusEl.style.color = "green";
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
            console.error("Form error:", error);
            if (statusEl) {
                statusEl.style.color = "red";
                statusEl.textContent = "✗ " + (error.message || "Error sending request.");
            }
        } finally {
            // Restore button properties after timeline lapse
            setTimeout(() => {
                if (button) {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }, 1800);
        }
    });
}
