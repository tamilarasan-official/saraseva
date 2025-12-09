/**
 * Testimonials Column Animation - Vanilla JS
 * Converts React Framer Motion testimonials to pure CSS/JS
 */

class TestimonialsManager {
    constructor() {
        this.testimonials = [{
                text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
                image: "https://randomuser.me/api/portraits/women/1.jpg",
                name: "Briana Patton",
                role: "Operations Manager",
            },
            {
                text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
                image: "https://randomuser.me/api/portraits/men/2.jpg",
                name: "Bilal Ahmed",
                role: "IT Manager",
            },
            {
                text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
                image: "https://randomuser.me/api/portraits/women/3.jpg",
                name: "Saman Malik",
                role: "Customer Support Lead",
            },
            {
                text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
                image: "https://randomuser.me/api/portraits/men/4.jpg",
                name: "Omar Raza",
                role: "CEO",
            },
            {
                text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
                image: "https://randomuser.me/api/portraits/women/5.jpg",
                name: "Zainab Hussain",
                role: "Project Manager",
            },
            {
                text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
                image: "https://randomuser.me/api/portraits/women/6.jpg",
                name: "Aliza Khan",
                role: "Business Analyst",
            },
            {
                text: "Our business functions improved with a user-friendly design and positive customer feedback.",
                image: "https://randomuser.me/api/portraits/men/7.jpg",
                name: "Farhan Siddiqui",
                role: "Marketing Director",
            },
            {
                text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
                image: "https://randomuser.me/api/portraits/women/8.jpg",
                name: "Sana Sheikh",
                role: "Sales Manager",
            },
            {
                text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
                image: "https://randomuser.me/api/portraits/men/9.jpg",
                name: "Hassan Ali",
                role: "E-commerce Manager",
            },
        ];

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    createTestimonialCard(testimonial) {
        return `
            <div class="testimonial-card">
                <div class="testimonial-text">${testimonial.text}</div>
                <div class="testimonial-author">
                    <img 
                        src="${testimonial.image}" 
                        alt="${testimonial.name}"
                        class="author-image"
                        loading="lazy"
                    />
                    <div class="author-info">
                        <div class="author-name">${testimonial.name}</div>
                        <div class="author-role">${testimonial.role}</div>
                    </div>
                </div>
            </div>
        `;
    }

    createColumn(testimonials, duration = 15) {
        const cards = testimonials.map(t => this.createTestimonialCard(t)).join('');

        return `
            <div class="testimonial-column" style="--duration: ${duration}s">
                <div class="testimonial-track">
                    ${cards}
                    ${cards} <!-- Duplicate for seamless loop -->
                </div>
            </div>
        `;
    }

    render() {
        const container = document.getElementById('testimonials-columns');
        if (!container) return;

        const firstColumn = this.testimonials.slice(0, 3);
        const secondColumn = this.testimonials.slice(3, 6);
        const thirdColumn = this.testimonials.slice(6, 9);

        container.innerHTML = `
            ${this.createColumn(firstColumn, 15)}
            ${this.createColumn(secondColumn, 19)}
            ${this.createColumn(thirdColumn, 17)}
        `;

        // Add intersection observer for animation
        this.observeAnimation();
    }

    observeAnimation() {
        const section = document.getElementById('testimonials-section');
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        section.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 }
        );

        observer.observe(section);
    }
}

// Initialize testimonials when script loads
new TestimonialsManager();