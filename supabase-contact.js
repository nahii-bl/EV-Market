// ==========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ==========================================
// Clean project URL (no trailing /rest/v1/) and Anon Key
const supabaseUrl = "https://qgfxojafkywfhpkvymwv.supabase.co";
const supabaseKey = "sb_publishable_fbk1dk-QWn2rhhCLzqOxlw_c9tsbQ3p";

let supabase;

try {
    // Gracefully handle initialization whether scripts load synchronously or dynamically
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    } else {
        console.error("Supabase CDN failed to load properly. Check your internet connection.");
    }
} catch (initError) {
    console.error("Initialization error:", initError);
}

// ==========================================
// 2. CUSTOMER REQUEST FORM HANDLER
// ==========================================
const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Ensure the Supabase client exists before attempting a database insert
        if (!supabase) {
            const status = contactForm.querySelector(".form-status");
            if (status) status.textContent = "Error: Database service is currently unavailable.";
            return;
        }

        const button = contactForm.querySelector("button");
        const status = contactForm.querySelector(".form-status");
        const originalText = button.textContent;

        const formData = new FormData(contactForm);

        // This maps cleanly to the exact input name="..." tags in your HTML
        const payload = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            model: formData.get("model"),
            message: formData.get("message")
        };

        // UI UX: Set visual states for loading
        button.textContent = "Sending...";
        button.disabled = true;
        if (status) status.textContent = "";

        try {
            // Sends the payload data directly into your Supabase table
            const { error } = await supabase
                .from("customer_request")
                .insert([payload]);

            if (error) {
                throw error;
            }

            // Success configuration
            if (status) {
                status.style.color = "#4caf50"; // Green for success
                status.textContent = "Request sent successfully. We will contact you soon.";
            }
            button.textContent = "Request Sent";
            contactForm.reset();

        } catch (error) {
            // Error handling configuration
            console.error("Submission Error:", error);
            if (status) {
                status.style.color = "#f44336"; // Red for error
                status.textContent = "Error: " + error.message;
            }

        } finally {
            // Restores the button to its baseline state after a brief timeout
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1800);
        }
    });
}
}
