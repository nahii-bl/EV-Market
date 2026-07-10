// ==========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ==========================================

const supabaseUrl = "https://qgfxojafkywfhpkvymwv.supabase.co";
const supabaseKey = "sb_publishable_fbk1dk-QWn2rhhCLzqOxlw_c9tsbQ3p";

let supabase;

if (window.supabase) {
    const { createClient } = window.supabase;
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.error("Supabase CDN library not found. Submissions will fail.");
    const statusField = document.querySelector(".form-status");
    if (statusField) {
        statusField.style.color = "#f44336";
        statusField.textContent = "Configuration error. Please reload the page.";
    }
}

// ==========================================
// 2. MOBILE DRAWER NAVIGATION TOGGLE
// ==========================================

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isExpanded = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", isExpanded);
    });

    // Auto-collapse mobile menu when an internal anchor link is clicked
    document.querySelectorAll(".site-nav a").forEach(link => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ==========================================
// 3. SCROLL-REVEAL ELEMENT ANIMATIONS
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => scrollObserver.observe(element));
}

// ==========================================
// 4. CUSTOMER REQUEST FORM HANDLER
// ==========================================

const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = contactForm.querySelector("button");
        const status = contactForm.querySelector(".form-status");
        const originalText = button ? button.textContent : "Send Request";

        if (!supabase) {
            if (status) {
                status.style.color = "#f44336";
                status.textContent = "Unable to connect. Please reload and try again.";
            }
            return;
        }

        const formData = new FormData(contactForm);

        const payload = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            model: formData.get("model"),
            message: formData.get("message")
        };

        if (button) {
            button.disabled = true;
            button.textContent = "Sending...";
        }

        if (status) {
            status.textContent = "";
        }

        try {
            const { error } = await supabase
                .from("customer_request")
                .insert([payload]);

            if (error) throw error;

            if (status) {
                status.style.color = "#4caf50";
                status.textContent = "Request sent successfully. We will contact you soon.";
            }

            contactForm.reset();
            if (button) {
                button.textContent = "Request Sent";
            }

        } catch (error) {
            console.error(error);

            if (status) {
                status.style.color = "#f44336";
                status.textContent = error.message;
            }

            if (button) {
                button.textContent = originalText;
            }

        } finally {
            setTimeout(() => {
                if (button) {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }, 1800);
        }
    });
}
