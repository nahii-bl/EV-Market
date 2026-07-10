// ==========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ==========================================
// FIXED: Removed "/rest/v1/" from the end of the URL string
const supabaseUrl = "https://qgfxojafkywfhpkvymwv.supabase.co";
const supabaseKey = "sb_publishable_fbk1dk-QWn2rhhCLzqOxlw_c9tsbQ3p";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ==========================================
// 2. CUSTOMER REQUEST FORM HANDLER
// ==========================================
const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = contactForm.querySelector("button");
        const status = contactForm.querySelector(".form-status");
        const originalText = button.textContent;

        const formData = new FormData(contactForm);

        const payload = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            model: formData.get("model"),
            message: formData.get("message")
        };

        button.textContent = "Sending...";
        button.disabled = true;
        status.textContent = "";

        try {
            const { error } = await supabase
                .from("customer_request")
                .insert([payload]);

            if (error) {
                throw error;
            }

            status.textContent = "Request sent successfully. We will contact you soon.";
            button.textContent = "Request Sent";
            contactForm.reset();

        } catch (error) {
            console.error(error);
            status.textContent = "Error: " + error.message;

        } finally {
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1800);
        }
    });
}
