class RotatingServicesDiagram {
    constructor(parentSection = null) {
        this.parentSection = parentSection;
        this.rotatingLine = document.querySelector('.diagram_rotating_line');
        this.services = document.querySelectorAll('.service_content');
        this.currentAngle = 0;

        this.updateContent(0);
        this.setupEventListeners();
    }

    getCenter() {
        // Since we position the line at 50%,50% of parent with transform-origin 0% 50%,
        // the rotation point is at the center of the parent container
        const rect = this.parentSection.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        return center;
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e.clientX, e.clientY);
        });
    }

    handleMouseMove(mouseX, mouseY) {
        const center = this.getCenter();

        const deltaX = mouseX - center.x;
        const deltaY = mouseY - center.y;

        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        let normalizedAngle = angle < 0 ? angle + 360 : angle;


        // Check if the rotating line element exists and has proper transform-origin
        if (this.rotatingLine) {
            const computedStyle = window.getComputedStyle(this.rotatingLine);
        }

        gsap.set(this.rotatingLine, {
            rotation: normalizedAngle
        });

        gsap.set('.diagram_central_circle', {
            rotation: normalizedAngle
        });

        this.currentAngle = normalizedAngle;
        this.updateContent(normalizedAngle);
    }

    updateContent(angle) {
        let activeServiceIndex = -1;

        this.services.forEach((service, i) => {
            const angles = service.dataset.angles.split(',').map(a => parseFloat(a));
            const startAngle = angles[0];
            const endAngle = angles[1];

            let isInRange = false;

            if (startAngle > endAngle) {
                isInRange = angle >= startAngle || angle <= endAngle;
            } else {
                isInRange = angle >= startAngle && angle <= endAngle;
            }

            if (isInRange) {
                service.classList.add('active');
                activeServiceIndex = i;
            } else {
                service.classList.remove('active');
            }
        });

        this.services.forEach((service, i) => {
            service.classList.remove('neighbor_service');

            if (activeServiceIndex !== -1) {
                const totalServices = this.services.length;
                const prevIndex = (activeServiceIndex - 1 + totalServices) % totalServices;
                const nextIndex = (activeServiceIndex + 1) % totalServices;

                if (i === prevIndex || i === nextIndex) {
                    service.classList.add('neighbor_service');
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const diagramSection = document.querySelector('.services_diagram_section .diagram_content');

    if (diagramSection && window.innerWidth > 991) {
        // Fix the transform-origin for the rotating line
        const rotatingLine = document.querySelector('.diagram_rotating_line');
        if (rotatingLine) {
            // Override flex centering and position the line manually
            rotatingLine.style.position = 'absolute';
            rotatingLine.style.left = '50%';
            rotatingLine.style.top = '50%';

            // Set transform-origin to rotate from left edge (start of line)
            rotatingLine.style.transformOrigin = '0% 50%';

            // Reset any flex-related positioning
            rotatingLine.style.margin = '0';
        }

        const diagram = new RotatingServicesDiagram(diagramSection);

        gsap.to('.diagram_central_dot', {
            scale: 1.2,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
});