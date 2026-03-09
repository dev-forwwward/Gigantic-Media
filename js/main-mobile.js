// NOTE: this script pertains only to the mobile version of the HOMEPAGE
console.log("running latest version - march 6 2026");
let mobileBreakpoint = 991;

if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not loaded');
    returns
}

if (window.innerWidth <= mobileBreakpoint) {
    ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
        type: "touch",       // limit to touch only on mobile
        fastScrollEnd: true,
    });
}

if (document.readyState === 'complete') {
    init(); // page is already fully loaded
} else {
    window.addEventListener('load', init); // wait for it
}

// ScrollTrigger.normalizeScroll({
//     allowNestedScroll: true,
//     type: "touch,wheel,pointer",
//     fastScrollEnd: true,  // Helps with momentum scrolling on mobile
//     autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
// });

function init() {
    if (window.innerWidth <= mobileBreakpoint && document.querySelector('.circle-section')) {

        console.log("Running homepage mobile script");

        const body = document.body;
        const circleSection = document.querySelector('.circle-section');
        const borderContainer = document.querySelector('.page_border_container');
        const contactSection = document.querySelector('.section_contact_form');

        setSliceLineWidth();

        gsap.set('.circle-list-el-content, .slice-line-divider-id', {
            opacity: 0,
        });

        // hero title size reduction into nav
        gsap.timeline({
            scrollTrigger: {
                trigger: '.hero_section',
                start: 'top top',
                end: 'bottom 60%',
                scrub: true,
            },
        }).to('.hero_title', {
            paddingTop: "0rem",
            fontSize: "2.5rem",
            top: '0'
        }).to('.hero_title_heading', {
            height: '1.5vw'
        }, "<");

        // hero circles rotation into 2nd section
        gsap.timeline({
            scrollTrigger: {
                trigger: '.hero_section',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        }).to('.circle-section-container', {
            rotate: 0,
            ease: 'power2.out'
        }).to('.circle-section, .init-circle-section', {
            left: '0vw',
            ease: 'power2.out'
        }, "<");

        // circle intersection
        gsap.timeline({
            scrollTrigger: {
                trigger: '.intersection_triggger',
                start: 'top-=5% bottom',
                end: '+=160%',
                scrub: true,
            }
        })
            .to('.circle-section, .init-circle-section', {
                // delay: 1.2,
                width: '105vw',
                height: '105vw',
                top: '0vw',
                rotate: '45deg',
                duration: 2,
                ease: 'power2.out'
            })
            .to('.init-circle-section', {
                left: '-2.5vw',
                duration: 1
            }, "<")
            .fromTo('.text-zoom-in-first', {
                yPercent: 10,
                opacity: .2,
                // scale: .7
            }, {
                delay: .25,
                opacity: 1,
                // scale: 1.05,
                yPercent: 0,
                duration: .5,
            }, "<");


        //corner lines close in to form an X
        gsap.timeline({
            scrollTrigger: {
                trigger: '.unified_lines_trigger',
                start: 'top 75%',
                end: '+=100%',
                scrub: true,
                // markers: true,
            }
        })
            .to('.advantages_section', {
                opacity: 0,
                duration: .25
            })
            .to('.slice-line-divider.main-2', {
                opacity: 0, duration: 0
            }, "<")
            .to('.init-circle-section', {
                opacity: 0,
                duration: .2
            }, "<")
            .fromTo('.text-zoom-in-second', {
                yPercent: 0,
                scale: 1
            }, {
                scale: 1.05,
                yPercent: -10,
                duration: 1,
            }, "<")
            .from('.border_square', {
                opacity: 0,
                duration: .2
            }, "<")
            .from('.border_square.left', {
                delay: .2,
                xPercent: -100,
                duration: 1,
                ease: 'power2.out'
            }, "<")
            .from('.border_square.right', {
                xPercent: 100,
                duration: 1,
                ease: 'power2.out'
            }, "<")
            .to('.init_lines_container', {
                opacity: 0,
                duration: 0
            })
            .to('.slice-line-divider.main', {
                css: {
                    display: 'flex'
                },
                duration: 0
            }, "<")
            .to('.init-circle-section', {
                css: {
                    display: 'none'
                },
                duration: 0
            }, "<")
            .to('.main-2', {
                opacity: 1,
                duration: .25
            }, "<")
            .fromTo('.center_circle', {
                opacity: 0
            }, {
                opacity: 1,
                duration: 0,
                immediateRender: false
            }, "<")
            .fromTo('.circle-section', {
                width: '105vw',
                height: '105vw',
            }, {
                width: '95vw',
                height: '95vw',
                duration: 1
            }, "<")
            .to('.main-2 .slice-line-divider-inner', {
                duration: 1,
                opacity: 0
            }, "<");

        let classSwitched = false;
        let logoClassSwitched = false;
        gsap.timeline({
            scrollTrigger: {
                trigger: '.circle_mask_zoom_trigger',
                start: 'top bottom+=5%',
                end: '+=300%',
                scrub: true,
                onUpdate: (self) => {
                    if (self.progress > .48 && !classSwitched) {
                        body.classList.add('dark');
                        body.classList.add('dark-nav');
                        classSwitched = true;
                    } else if (self.progress <= .48 && classSwitched) {
                        body.classList.remove('dark');
                        body.classList.remove('dark-nav');
                        classSwitched = false;
                    }

                    if (self.progress > .425 && !logoClassSwitched) {
                        body.classList.add('nav-logo-light');
                        logoClassSwitched = true;
                    } else if (self.progress <= .425 && logoClassSwitched) {
                        body.classList.remove('nav-logo-light');
                        logoClassSwitched = false;
                    }
                },
            },
        })
            .to('.main-2 .slice-line-divider-inner', {
                opacity: .6,
                duration: .25,
            }, "<")
            .fromTo('.circle_mask', {
                width: '0vw',
                height: '0vw',
            }, {
                width: '125vh',
                height: '125vh',
                duration: .2,
                immediateRender: false
            }, "<")
            .to('.circumference', {
                opacity: .6,
                duration: .25,
            }, "<");

        // note: zooms AND turns a bit
        gsap.timeline({
            scrollTrigger: {
                trigger: '.zoom-left-trigger',
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
                onLeaveBack: () => {
                    body.classList.remove('dark');
                },
                onUpdate: self => {
                    const progress = self.progress;
                    if (progress > .9) {
                        body.classList.add('dark');
                    } else if (progress <= .1) {
                        body.classList.remove('dark');
                    }
                },
                onEnterBack: () => {
                    body.classList.add('dark');
                },
            },
        })
            .to('.circle-section .circle_orbit_element', {
                opacity: 0,
                duration: .25,
                ease: 'power2.out'
            })
            .to('.circle-section :not(.main-2) .slice-line-divider', {
                opacity: .6,
                duration: .5,
                ease: 'power2.out'
            }, "<")
            .fromTo('.circle-section', {
                left: '0vw',
                width: '95vw',
                height: '95vw',
                rotate: '45deg',
            }, {
                delay: 1,
                left: '-110vw',
                width: '150vw',
                height: '150vw',
                rotate: '35deg',
                duration: 2,
                immediateRender: false
            })
            .from('.circle-list-el-content', {
                opacity: 0,
                duration: 1,
                immediateRender: false
            }, "<");

        gsap.timeline({
            scrollTrigger: {
                trigger: '.circle_mask_light_zoom_trigger',
                start: 'top 55%',
                end: '+=150%',
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: self => {
                    const progress = self.progress;

                    // handle bg color
                    if (progress <= .68) {
                        body.classList.add('dark');
                    } else {
                        body.classList.remove('dark');
                    }

                    // handle nav buttons color
                    if (progress >= .32) {
                        body.classList.remove('dark-nav');
                    } else {
                        body.classList.add('dark-nav');
                    }

                    // handle nav logo color
                    if (progress >= .45) {
                        body.classList.remove('nav-logo-light');
                    } else {
                        body.classList.add('nav-logo-light');
                    }
                },
            },
        })
            .fromTo('.circle_mask_light', {
                width: '0vw',
                height: '0vw',
            }, {
                width: '400vw',
                height: '400vw',
                duration: 1,
                immediateRender: false
            })
            .to('.slice-line-divider, .circumference', {
                opacity: 1,
                duration: .8,
                ease: 'power2.out'
            }, "<")
            .fromTo('.circle-list-el-content, .slice-line-divider-id .text-weight-medium', {
                opacity: 0,
            }, {
                opacity: .2,
                duration: 0,
                immediateRender: false
            }, "<")
            .to('.slice-line-divider-id', {
                delay: .5,
                opacity: 1,
                duration: .2
            }, "<");


        // CIRCLE INNER SECTIONS ROTATION
        // fuller turn after initial small turn with zoom

        const circleElements = gsap.utils.toArray('.circle-list-el-content');
        const textElements = gsap.utils.toArray('.slice-line-divider-id .text-weight-medium');
        const dotElements = textElements.map(text => text.previousSibling).filter(Boolean);

        // Initialize will-change for GPU acceleration (one-time cost)
        dotElements.forEach(dot => {
            if (dot) {
                dot.style.willChange = 'transform, filter';
            }
        });

        // Use GSAP's ticker for optimal performance
        let latestProgress = 0;
        let needsUpdate = false;

        function updateElements() {
            if (!needsUpdate) return;

            const progress = latestProgress;
            const totalElements = circleElements.length;

            // Batch all reads first, then batch all writes
            const updates = circleElements.map((_circle, index) => {
                const elementProgress = (progress * totalElements) - index;

                const fadeInStart = -0.3;
                const fadeInEnd = 0.35;
                const fadeOutStart = 1.5;
                const fadeOutEnd = 2.2;

                let opacity, dotSize, dotLeft, dotBlur;

                if (elementProgress <= fadeInStart) {
                    opacity = 0;
                    dotSize = 4;
                    dotLeft = 2;
                    dotBlur = 2;
                } else if (elementProgress <= fadeInEnd) {
                    const fadeInProgress = (elementProgress - fadeInStart) / (fadeInEnd - fadeInStart);
                    opacity = fadeInProgress;
                    dotSize = 4 + (fadeInProgress * 6);
                    dotLeft = 2 + (fadeInProgress * 3);
                    dotBlur = 2 + (fadeInProgress * 2);
                } else if (elementProgress <= fadeOutStart) {
                    opacity = 1;
                    dotSize = 10;
                    dotLeft = 5;
                    dotBlur = 4;
                } else if (elementProgress <= fadeOutEnd) {
                    const fadeOutProgress = (elementProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
                    opacity = 1 - fadeOutProgress;
                    dotSize = 10 - (fadeOutProgress * 6);
                    dotLeft = 5 - (fadeOutProgress * 3);
                    dotBlur = 4 - (fadeOutProgress * 2);
                } else {
                    opacity = 0;
                    dotSize = 4;
                    dotLeft = 2;
                    dotBlur = 2;
                }

                return { index, opacity, dotSize, dotLeft, dotBlur };
            });

            // Apply all updates in one batch
            updates.forEach(({ index, opacity, dotSize, dotLeft, dotBlur }) => {
                const circle = circleElements[index];
                const text = textElements[index];
                const dot = dotElements[index];

                if (!dot) return;

                circle.style.opacity = opacity;
                text.style.opacity = opacity;
                dot.style.width = dotSize + 'px';
                dot.style.height = dotSize + 'px';
                dot.style.transform = `translateX(${-dotLeft}px)`;
                dot.style.filter = `blur(${dotBlur}px)`;
            });

            needsUpdate = false;
        }

        // Add to GSAP's ticker for optimal timing
        gsap.ticker.add(updateElements);

        gsap.timeline({
            scrollTrigger: {
                trigger: '.rotation_trigger',
                start: "top top",
                end: "+=650%",
                scrub: true,
                invalidateOnRefresh: true,
                anticipatePin: .5,
                pin: true,
                onUpdate: self => {
                    latestProgress = self.progress;
                    needsUpdate = true;
                },
                onLeave: () => {
                    gsap.ticker.remove(updateElements);
                },
                onEnterBack: () => {
                    gsap.ticker.add(updateElements);
                }
            }
        })
            .to('.circle-section', {
                rotate: "-172deg",
                immediateRender: false,
                duration: 1,
                ease: 'linear'
            });



        // BRAND CAROUSEL
        // move circle up
        gsap.timeline({
            scrollTrigger: {
                trigger: '.brand_carousel_trigger',
                start: 'top bottom',
                end: '+=102%',
                scrub: true,
                invalidateOnRefresh: true,
            },
        })
            .to('.circle-list-el-content', {
                opacity: 0,
                immediateRender: false,
                duration: .2
            })
            .to('.circle-section', {
                top: '-75vw',
                left: '-65vw',
                rotate: "-190deg",
                duration: .8,
                ease: 'power2.inOut',
                immediateRender: false,
            }, "<");


        // rotate circle again - with brand boxes horizontal scroll over lines
        gsap.timeline({
            scrollTrigger: {
                trigger: '.brand_carousel_trigger',
                start: 'top 70%',
                end: '+=150%',
                // markers: true,
                scrub: true,
                onUpdate: self => {
                    const progress = self.progress;

                    // handle nav logo color and buttons
                    if (progress >= 1) {
                        body.classList.add('nav-logo-light');
                        body.classList.add('dark-nav');
                        body.classList.add('dark');
                        gsap.set('.circle_mask_light', {
                            opacity: 0,
                        });
                    } else {
                        body.classList.remove('nav-logo-light');
                        body.classList.remove('dark-nav');
                        body.classList.remove('dark');
                        gsap.set('.circle_mask_light', {
                            opacity: 1,
                        });
                    }
                }
            },
        })
            .to('.circle-section', {
                rotation: '-378deg',
                immediateRender: false,
                duration: 2,
                ease: 'power2.in',
            })
            .to('.circle-list-el-content', {
                opacity: 0,
                duration: .5,
                immediateRender: false
            }, "<")
            .to('.rect_mask', {
                delay: 1.2,
                opacity: 1,
                duration: 0,
            }, "<")
            .to('.circle-list-container', {
                opacity: 0,
                duration: .8,
                onStart: () => {
                    circleSection.classList.add('hide-pseudo-el');
                },
                onReverseComplete: () => {
                    circleSection.classList.remove('hide-pseudo-el');
                }
            }, "=-.5");
        // .fromTo('.circle_mask_light', {
        //     opacity: 1,
        // }, {
        //     opacity: 0,
        //     duration: 0,
        //     immediateRender: false
        // }, "<");


        function setSliceLineWidth() {
            let lines = document.querySelectorAll('.slice-line-divider');

            // set line width to always be as wide as the viewport's diagonal*1.2 (largest possible visible line and a little more)
            lines.forEach((line) => {
                line.style.width = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.2 + "px";
            });
        }

        // debounced screen resizing handler
        // let resizeTimeout;
        // window.addEventListener('resize', () => {
        //     clearTimeout(resizeTimeout);
        //     resizeTimeout = setTimeout(() => {
        //         setSliceLineWidth();
        //         ScrollTrigger.refresh();
        //     }, 250);
        // });
        // ScrollTrigger resize handler
        ScrollTrigger.addEventListener('refreshInit', setSliceLineWidth);


        // center circle element on scroll to Contact section
        gsap.timeline({
            scrollTrigger: {
                trigger: '.contact_section',
                start: 'top 80%',
                end: 'top 3.4rem',
                scrub: true,
                onEnter: () => {
                    circleSection.classList.remove('hide-pseudo-el');
                    body.classList.add('over_contact_section');
                },
                onLeaveBack: () => {
                    circleSection.classList.add('hide-pseudo-el');
                    body.classList.remove('over_contact_section');
                }
            }
        })
            .fromTo('.circle_mask_red', {
                width: '0vw',
                height: '0vw',
            }, {
                width: '220vw',
                height: '220vw',
                duration: 1,
                immediateRender: false
            })
            .to('.box_row_container', {
                opacity: 0,
                duration: .4
            }, "<")
            .to('.slice-line-divider-inner', {
                backgroundColor: 'rgba(240, 231, 233, 0.16)',
            }, "<")
            .to('.circumference', {
                css: {
                    borderColor: 'rgba(240, 231, 233, 0.16)',
                }
            }, "<")
            .to('.navbar', {
                css: {
                    borderColor: 'rgba(240, 231, 233, 0.16)'
                }
            }, "<")
            .to('.slice-line-divider', {
                opacity: .3,
                duration: 0
            }, "<")
            .to('.slice-line-divider-id', {
                opacity: 0,
                duration: 0
            }, "<")
            .to('.circle-section', {
                top: 'auto',
                bottom: '0vw',
                left: 'auto',
                right: 'auto',
                // rotate: '-45deg',
                rotate: '+=18deg',

                // width: '55vw',
                // height: '55vw',
                immediateRender: false,
                duration: 1,
                onStart: () => {
                    borderContainer.classList.add('secondary');
                    contactSection.classList.add('active');
                },
                onReverseComplete: () => {
                    borderContainer.classList.remove('secondary');
                    contactSection.classList.remove('active');
                }
            }, "<")
            .to('.circle-list-container', {
                opacity: 1,
                duration: .1,
            }, "<")
            .to('.circle-section .circle_orbit_element', {
                opacity: 1,
                duration: 1,
                ease: 'power2.in',
                immediateRender: false
            }, "<")
            .to('.slice-line-divider:not(.main, .main-2)', {
                opacity: 0,
                duration: 1,
                immediateRender: false
            }, "<")
            .to(".circle_orbit_element, .center_circle", {
                css: {
                    backgroundColor: "#fff",
                },
                duration: 1,
            }, "<");

        // ScrollTrigger.refresh();
    }
}