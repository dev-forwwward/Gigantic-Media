document.addEventListener("DOMContentLoaded", function () {
    // ---------------------------------------
    // NAV MENU
    const trigger = document.querySelector('#menu-trigger');
    const menuNavBar = document.querySelector(".mobile-dropdown-menu");
    const navLinks = document.querySelectorAll('.menu-link');
    const html = document.documentElement;
    const body = document.body;

    const borderContainer = document.querySelector('.page_border_container');


    // color handler over dark-bg sections (not homepage)
    const darkSections = document.querySelectorAll('section.dark');
    darkSections.forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 2%',
            end: 'bottom 5%',
            onEnter: () => {
                document.body.classList.add('dark-nav');
            },
            onLeaveBack: () => {
                document.body.classList.remove('dark-nav');
            },
            onEnterBack: () => {
                document.body.classList.add('dark-nav');
            },
            onLeave: () => {
                document.body.classList.remove('dark-nav');
            }
        });
    });


    // mobile dropdown container position init
    gsap.set('.mobile-dropdown-menu', { display: 'none' });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => trigger.click());
    });

    trigger.addEventListener("click", function (event) {
        // event.stopPropagation();

        const isOpen = menuNavBar.classList.contains("w--open");

        // close nav menu
        if (isOpen) {
            body.classList.remove("navbar-menu-open");
            html.classList.remove("lock-viewport"); // remove scroll lock

            // border dropshadow color handle
            if (!document.querySelector('.section_contact_form.active')) {
                borderContainer.classList.remove('secondary');
            }

            gsap.timeline({ defaults: { overwrite: true } })
                .to('.mobile-dropdown-menu', {
                    opacity: 0,
                    duration: 0.3,
                    onStart: () => {
                        setTimeout(() => {
                            menuNavBar.classList.remove("w--open");
                            gsap.set('.mobile-dropdown-menu', { display: 'none' });
                        }, 150);

                        requestAnimationFrame(() => {
                            lenis.start(); // Re-enable scroll
                        });
                    }
                });
            // .to('.navbar', {
            //     css: {
            //         borderColor: '#ae9ea1a8'
            //     }
            // }, "<");

        } else {
            // open nav menu
            body.classList.add("navbar-menu-open");

            // border dropshadow color handle
            borderContainer.classList.add('secondary');

            gsap.timeline({
                defaults: { overwrite: true },
                toggleActions: 'play none none reverse'
            })
                .fromTo('.mobile-dropdown-menu', { opacity: 0 }, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    onStart: () => {
                        menuNavBar.classList.add("w--open");
                        gsap.set('.mobile-dropdown-menu', { display: 'flex' });
                        html.classList.add("lock-viewport"); // lock scroll

                        requestAnimationFrame(() => {
                            lenis.stop(); // Disable scroll
                        });
                    }
                })
                // .to('.navbar', {
                //     css: {
                //         borderColor: 'rgba(240, 231, 233, 0.16)'
                //     },
                //     duration: .2,
                //     ease: 'power2.out'
                // }, "<")
                .fromTo('.nav_menu_bg_gradient', { opacity: 0 }, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out'
                }, "<")
                .fromTo('.menu-link-container, .mobile-dropdown-menu .button, .text-size-medium', {
                    opacity: 0,
                    yPercent: 10
                }, {
                    opacity: 1,
                    yPercent: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power2.out'
                }, "<");
        }
    });

    // ---------------------------------------
    // THEME TOGGLE
    // const themeOptions = document.querySelectorAll(".theme-option");
    // const indicator = document.querySelector(".theme-indicator");

    // function applyTheme(theme) {
    //     if (theme === "system") {
    //         const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    //         body.classList.toggle("u-theme-dark", prefersDark);
    //     } else {
    //         body.classList.toggle("u-theme-dark", theme === "dark");
    //     }
    // }

    // function setActiveIndicator(index) {
    //     const targetBtn = themeOptions[index];
    //     const offsetLeft = targetBtn.offsetLeft;
    //     const btnWidth = targetBtn.offsetWidth;

    //     indicator.style.transform = `translateX(${offsetLeft}px)`;
    //     //indicator.style.width = `${btnWidth}px`;
    // }

    // function saveTheme(theme) {
    //     localStorage.setItem("theme", theme);
    // }

    // function getStoredTheme() {
    //     return localStorage.getItem("theme") || "system";
    // }

    // // Wait until layout is ready
    // requestAnimationFrame(() => {
    //     const initialTheme = getStoredTheme();
    //     const activeIndex = { system: 0, light: 1, dark: 2 }[initialTheme];

    //     applyTheme(initialTheme);
    //     setActiveIndicator(activeIndex);

    //     body.classList.add("js-loaded");

    //     // Watch for system changes
    //     if (initialTheme === "system") {
    //         window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    //             applyTheme("system");
    //         });
    //     }
    // });

    // // Theme button events
    // themeOptions.forEach((btn, i) => {
    //     btn.addEventListener("click", () => {
    //         const theme = btn.dataset.theme;
    //         applyTheme(theme);
    //         setActiveIndicator(i);
    //         saveTheme(theme);
    //     });
    // });



    // ---------------------------------------
    // MENU PLANS - ACCORDION
    //https://webflow.com/made-in-webflow/website/pageblock-accordion-with-plus

    class PBAccordionMenu {
        constructor() {
            this.cleanupInitialState();
            this.init();
        }

        cleanupInitialState() {
            document.querySelectorAll('[pb-component-menu="accordion"]').forEach(accordion => {
                const group = accordion.querySelector('[pb-accordion-element-menu="group"]');
                if (!group) return;

                const items = group.querySelectorAll('[pb-accordion-element-menu="accordion"]');
                items.forEach(item => {
                    const content = item.querySelector('[pb-accordion-element-menu="content"]');
                    const trigger = item.querySelector('[pb-accordion-element-menu="trigger"]');
                    const arrow = item.querySelector('[pb-accordion-element-menu="arrow"]');
                    const plus = item.querySelector('[pb-accordion-element-menu="plus"]');

                    if (content) {
                        content.style.maxHeight = '0';
                        content.style.opacity = '0';
                        content.style.visibility = 'hidden';
                        content.style.display = 'none';
                    }
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');

                    item.classList.remove('is-active-accordion');
                    content?.classList.remove('is-active-accordion');
                    if (arrow) arrow.classList.remove('is-active-accordion');
                    if (plus) plus.classList.remove('is-active-accordion');
                });

                const initial = group.getAttribute('pb-accordion-initial');
                if (initial && initial !== 'none') {
                    const initialItem = items[parseInt(initial) - 1];
                    if (initialItem) {
                        this.openAccordion(initialItem);
                    }
                }
            });
        }

        init() {
            document.querySelectorAll('[pb-component-menu="accordion"]').forEach(accordion => {
                const group = accordion.querySelector('[pb-accordion-element-menu="group"]');
                if (!group) return;
                group.addEventListener('click', (e) => this.handleClick(e, group));
            });
        }

        handleClick(event, group) {
            const triggerClicked = event.target.closest('[pb-accordion-element-menu="trigger"]');
            if (!triggerClicked) return; // only toggle if the trigger itself (or a child of it) was clicked

            const accordionItem = triggerClicked.closest('[pb-accordion-element-menu="accordion"]');
            if (!accordionItem) return;

            const isOpen = accordionItem.classList.contains('is-active-accordion');
            const isSingle = group.getAttribute('pb-accordion-single-menu') === 'true';

            if (isSingle) {
                group.querySelectorAll('[pb-accordion-element-menu="accordion"]').forEach(item => {
                    if (item !== accordionItem && item.classList.contains('is-active-accordion')) {
                        this.closeAccordion(item);
                    }
                });
            }

            if (isOpen) {
                this.closeAccordion(accordionItem);
            } else {
                this.openAccordion(accordionItem);
            }
        }

        openAccordion(item) {
            const trigger = item.querySelector('[pb-accordion-element-menu="trigger"]');
            const content = item.querySelector('[pb-accordion-element-menu="content"]');
            const arrow = item.querySelector('[pb-accordion-element-menu="arrow"]');
            const plus = item.querySelector('[pb-accordion-element-menu="plus"]');

            content.style.visibility = 'visible';
            content.style.display = 'block';

            content.offsetHeight;

            const contentHeight = content.scrollHeight;

            requestAnimationFrame(() => {
                content.style.maxHeight = `${contentHeight}px`;
                content.style.opacity = '1';
                trigger.setAttribute('aria-expanded', 'true');
                item.classList.add('is-active-accordion');
                content.classList.add('is-active-accordion');
                if (arrow) arrow.classList.add('is-active-accordion');
                if (plus) plus.classList.add('is-active-accordion');
            });

            content.addEventListener('transitionend', () => {
                if (item.classList.contains('is-active-accordion')) {
                    content.style.maxHeight = 'none';
                }
            }, { once: true });
        }

        closeAccordion(item) {
            const trigger = item.querySelector('[pb-accordion-element-menu="trigger"]');
            const content = item.querySelector('[pb-accordion-element-menu="content"]');
            const arrow = item.querySelector('[pb-accordion-element-menu="arrow"]');
            const plus = item.querySelector('[pb-accordion-element-menu="plus"]');

            content.style.maxHeight = `${content.scrollHeight}px`;
            content.style.display = 'block';

            content.offsetHeight;

            requestAnimationFrame(() => {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                trigger.setAttribute('aria-expanded', 'false');
                item.classList.remove('is-active-accordion');
                content.classList.remove('is-active-accordion');
                if (arrow) arrow.classList.remove('is-active-accordion');
                if (plus) plus.classList.remove('is-active-accordion');
            });

            content.addEventListener('transitionend', () => {
                if (!item.classList.contains('is-active-accordion')) {
                    content.style.visibility = 'hidden';
                    content.style.display = 'none';
                }
            }, { once: true });
        }
    }

    // Initialize
    new PBAccordionMenu();

    ScrollTrigger.refresh();

});