/**
 * Services Scrolling Columns - Vanilla JS
 * Creates vertical scrolling animation for service cards
 */

class ServicesScrollManager {
    constructor() {
        this.services = [{
                icon: "fas fa-bolt",
                title: "EB Bill Management",
                description: "Name changes, bill corrections, connection issues, and payment guidance for electricity bills",
                items: [
                    "Name Change",
                    "Bill Correction",
                    "New Connection",
                    "Payment Issues"
                ]
            },
            {
                icon: "fas fa-file-alt",
                title: "Ration Card Services",
                description: "Update address, add family members, document verification, and subsidy tracking",
                items: [
                    "Address Update",
                    "Add Members",
                    "Verify Documents",
                    "Check Subsidy"
                ]
            },
            {
                icon: "fas fa-water",
                title: "Water Connection",
                description: "New connection applications, bill management, and complaint registration",
                items: [
                    "New Connection",
                    "Bill Issues",
                    "Complaint Filing",
                    "Service Request"
                ]
            },
            {
                icon: "fas fa-home",
                title: "Property Tax",
                description: "Property registration, tax calculation, and payment tracking",
                items: [
                    "Tax Calculation",
                    "Registration",
                    "Payment Status",
                    "Exemptions"
                ]
            },
            {
                icon: "fas fa-exclamation-triangle",
                title: "Police Complaints",
                description: "File FIR, track complaint status, and legal guidance",
                items: [
                    "File FIR",
                    "Track Status",
                    "Document Help",
                    "Legal Guidance"
                ]
            },
            {
                icon: "fas fa-city",
                title: "Civic Services",
                description: "Municipal services, road complaints, sanitation, and public utilities",
                items: [
                    "Road Issues",
                    "Sanitation",
                    "Public Utilities",
                    "Permits"
                ]
            }
        ];

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    createServiceCard(service) {
        const itemsHTML = service.items.map(item =>
            `<li><i class="fas fa-check"></i> ${item}</li>`
        ).join('');

        return `
            <div class="service-card-scroll">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <ul class="service-items">
                    ${itemsHTML}
                </ul>
                <button class="btn-explore" onclick="exploreService('${service.title}')">Learn More</button>
            </div>
        `;
    }

    createColumn(services, duration = 20) {
        const cards = services.map(s => this.createServiceCard(s)).join('');

        return `
            <div class="service-column" style="--duration: ${duration}s">
                <div class="service-track">
                    ${cards}
                    ${cards} <!-- Duplicate for seamless loop -->
                </div>
            </div>
        `;
    }

    render() {
        const container = document.getElementById('services-columns');
        if (!container) return;

        const firstColumn = this.services.slice(0, 2);
        const secondColumn = this.services.slice(2, 4);
        const thirdColumn = this.services.slice(4, 6);

        container.innerHTML = `
            ${this.createColumn(firstColumn, 25)}
            ${this.createColumn(secondColumn, 30)}
            ${this.createColumn(thirdColumn, 28)}
        `;

        this.observeAnimation();
    }

    observeAnimation() {
        const section = document.getElementById('services');
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

// Initialize services scroll when script loads
new ServicesScrollManager();