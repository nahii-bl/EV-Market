// ==========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ==========================================

const supabaseUrl = "https://qgfxojafkywfhpkvymwv.supabase.co";
const supabaseKey = "sb_publishable_fbk1dk-QWn2rhhCLzqOxlw_c9tsbQ3p";

const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);

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

        button.disabled = true;
        button.textContent = "Sending...";

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
                status.textContent =
                    "Request sent successfully. We will contact you soon.";
            }

            contactForm.reset();
            button.textContent = "Request Sent";

        } catch (error) {
            console.error(error);

            if (status) {
                status.style.color = "#f44336";
                status.textContent = error.message;
            }

            button.textContent = originalText;

        } finally {
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
            }, 1800);
        }
    });
}
