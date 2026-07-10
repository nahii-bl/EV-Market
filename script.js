// Mobile menu toggle
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle) {
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

// Reveal animations on scroll
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

// Contact form handling
const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            name: contactForm.name.value,
            phone: contactForm.phone.value,
            model: contactForm.model.value,
            message: contactForm.message.value
        };

        const statusEl = contactForm.querySelector(".form-status");

        try {
            statusEl.textContent = "Sending...";

            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                statusEl.textContent = "✓ Request sent successfully!";
                contactForm.reset();
                setTimeout(() => {
                    statusEl.textContent = "";
                }, 4000);
            } else {
                statusEl.textContent = "✗ " + (result.message || "Error sending request");
            }
        } catch (error) {
            statusEl.textContent = "✗ Network error. Please try again.";
            console.error("Form error:", error);
        }
    });
}
