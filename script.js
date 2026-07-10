// ==========================================
// CLIENT REQUEST FORM (Talks to local Node Server)
// ==========================================
const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = contactForm.querySelector("button");
        const status = contactForm.querySelector(".form-status");
        const originalText = button.textContent;

        const formData = new FormData(contactForm);

        // Gather information directly from the form inputs
        const payload = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            model: formData.get("model"),
            message: formData.get("message")
        };

        // UI UX Configuration: Loading status states
        button.textContent = "Sending...";
        button.disabled = true;
        if (status) status.textContent = "";

        try {
            // POST data payload directly to your Node server endpoint rule
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to submit request.");
            }

            // Success configuration Layouts
            if (status) {
                status.style.color = "#4caf50"; // Green text color
                status.textContent = "Request sent successfully. We will contact you soon.";
            }
            button.textContent = "Request Sent";
            contactForm.reset();

        } catch (error) {
            console.error("Submission Error:", error);
            if (status) {
                status.style.color = "#f44336"; // Red text color
                status.textContent = "Error: " + error.message;
            }
        } finally {
            // Restore form button interactive elements 
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1800);
        }
    });
}
