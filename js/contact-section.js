document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.querySelector('.section_contact_form');
    const bgContainer = document.querySelector('.contact_bg_container');

    const borderContainer = document.querySelector('.page_border_container');

    let contactTm;

    if (contactSection) {

        setTimeout(() => {
            contactTm = gsap.timeline({
                scrollTrigger: {
                    trigger: contactSection,
                    // markers: true,
                    start: () => {
                        let startPoint = 'top 10%';
                        if (window.innerWidth <= 991) {
                            startPoint = 'top 8%';
                        }
                        return startPoint
                    },
                    scrub: false,
                    toggleActions: 'play none none reverse',
                    onEnter: () => {
                        document.querySelector('body').classList.add('red');
                        contactSection.classList.add('active');

                        borderContainer.classList.add('over_contact');

                        if (document.querySelector('[data-wf--contact-form--variant="generic"]')) {
                            borderContainer.classList.add('secondary');
                        }
                    },
                    onLeave: () => {
                        document.querySelector('body').classList.remove('red');
                        contactSection.classList.remove('active');

                        borderContainer.classList.remove('over_contact');
                    },
                    onEnterBack: () => {
                        document.querySelector('body').classList.add('red');
                        contactSection.classList.add('active');
                    },
                    onLeaveBack: () => {
                        document.querySelector('body').classList.remove('red');
                        contactSection.classList.remove('active');

                        borderContainer.classList.remove('secondary');
                        borderContainer.classList.remove('over_contact');
                    }
                }
            });

            if (bgContainer) {
                contactTm.from(bgContainer, {
                    opacity: 0,
                    duration: .5,
                    ease: 'power2.out'
                }).to('.contact-circle-section .center_circle', {
                    opacity: 1,
                    duration: .25,
                    ease: 'power2.out'
                }, "<")
                    .to('.navbar', {
                        css: {
                            borderColor: 'rgba(240, 231, 233, 0.16)'
                        },
                        duration: .2,
                        ease: 'power2.out'
                    }, "<");
            }
        }, "2000");

        ScrollTrigger.refresh();
    }
});