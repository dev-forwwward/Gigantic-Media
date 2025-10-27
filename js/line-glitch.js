document.addEventListener('DOMContentLoaded', () => {

    // get all .glitch elements
    const glitchElements = document.querySelectorAll('.glitch');

    // run only in desktop
    if (window.innerWidth > 991 && glitchElements.length > 0) {

        // generate noise pattern
        function generateNoisePattern(density = .2) {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');

            const particleSize = 100;

            for (let y = 0; y < canvas.height; y += particleSize) {
                for (let x = 0; x < canvas.width; x += particleSize) {
                    const noise = Math.random();
                    if (noise > density) {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(x, y, particleSize, particleSize);
                    }
                }
            }

            return canvas.toDataURL();
        }

        glitchElements.forEach((el, index) => {
            // update noise for current element
            function updateNoise() {
                const noiseUrl = generateNoisePattern(gsap.utils.random(0.1, 0.35));
                el.style.maskImage = `url(${noiseUrl})`;
                el.style.webkitMaskImage = `url(${noiseUrl})`;
            }

            // remove mask (fully visible)
            function clearMask() {
                el.style.maskImage = 'none';
                el.style.webkitMaskImage = 'none';
            }

            // clearMask();


            const tl = gsap.timeline({ repeat: -1 });

            // normal state (fully visible - no glitch)
            // tl.to({}, { duration: gsap.utils.random(.25, .5) })
            //     // start glitching
            //     .call(updateNoise)
            //     .to({}, { duration: gsap.utils.random(0.05, 0.25) })
            //     .call(updateNoise)
            //     .to({}, { duration: gsap.utils.random(0.1, 0.2) })
            //     // back to normal
            //     .call(clearMask)
            //     .to({}, { duration: gsap.utils.random(0, .25) })
            //     // glitch burst
            //     .call(updateNoise)
            //     .to({}, { duration: gsap.utils.random(0.2, 0.4) })
            //     .call(updateNoise)
            //     .to({}, { duration: gsap.utils.random(0.1, 0.2) })
            //     // back to normal
            //     .call(clearMask);

            // glitch burst timeline - randomly wait 1-5s before starting each time
            tl.to({}, { delay: gsap.utils.random(1, 5), duration: gsap.utils.random(.25, .5) })
                // start glitching
                .call(updateNoise)
                .to({}, { duration: gsap.utils.random(0.05, 0.25) })
                .call(updateNoise)
                .to({}, { duration: gsap.utils.random(0.1, 0.2) })
                // back to normal
                .call(clearMask)
        });

    }

});