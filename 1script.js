
// ==========================================
// 1. SUPABASE CLIENT INITIALIZATION
// ==========================================
// Uses your provided Project URL and Anon Public Key
const supabaseUrl = 'https://ufzdbyrcflftpupqqzjg.supabase.co';
const supabaseKey = 'sb_publishable_8169Y0pYnw0LtF206Ra9OA_QEoTU5Cc';

// Note: If using the HTML CDN script tag, 'supabase' is the global object 
// containing 'createClient'. We overwrite it here to hold your active instance.
const supabase = supabase.createClient(supabaseUrl, supabaseKey);


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

        // Maps the inputs from your form fields into the payload object
        const payload = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            model: formData.get("model"),
            message: formData.get("message")
        };

        // UI Feedback: Disable button during submission
        button.textContent = "Sending...";
        button.disabled = true;
        status.textContent = "";

        try {
            // Sends the payload into your Supabase "customer_request" table
            const { error } = await supabase
                .from("customer_request")
                .insert([payload]);

            if (error) {
                throw error;
            }

            // Success feedback
            status.textContent = "Request sent successfully. We will contact you soon.";
            button.textContent = "Request Sent";
            contactForm.reset();

        } catch (error) {
            // Error feedback
            console.error(error);
            status.textContent = "Error: " + error.message;

        } finally {
            // Reset button back to normal after a brief delay
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1800);
        }
    });
}
