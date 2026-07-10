
);
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

    window.addEventListener("scroll", () => {
        if (nav.classList.contains("is-open")) {
            nav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const contactForm = document.querySelector(".contact form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = contactForm.querySelector("button");
        const status = contactForm.querySelector(".form-status");
        const originalText = button.textContent;
        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        button.textContent = "Sending...";
        button.disabled = true;
        status.textContent = "";

        try {
            const { error } = await supabase
                .from("customer_requests")
                .insert([payload]);

            if (error) {
                throw error;
            }

            status.textContent = "Request sent successfully. We will contact you soon.";
            button.textContent = "Request Sent";
            contactForm.reset();
        } catch (error) {
            status.textContent = "Error sending request. Please try again or call us directly at 0942377454.";
            button.textContent = originalText;
        } finally {
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1800);
        }
    });
}
