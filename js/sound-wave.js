document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("wave");
    const ctx = canvas.getContext("2d");

    // Fixed wave configuration - optimized for 32x20 canvas
    const config = {
        FULL: 5,        // Increased amplitude for more vertical presence
        LOW: 1.5,       // Proportionally increased muted amplitude
        FREQ: 0.5,      // Wave frequency
        CYC: 1.2,       // Wave cycles across canvas
        DUR: 800        // Transition duration
    };

    // Get responsive line width based on screen size and pixel density
    function getLineWidth() {
        const dpr = devicePixelRatio || 1;
        const screenWidth = window.innerWidth;

        // Base line width for mobile
        let lineWidth = 0.5;

        // Increase line width for larger screens
        if (screenWidth >= 1200) {
            lineWidth = 1.2;
        } else if (screenWidth >= 768) {
            lineWidth = 0.8;
        }

        // Adjust for high-DPI displays
        return lineWidth * Math.min(dpr, 2);
    }

    // State
    let running = true;
    let phase = 0;
    let amp = config.FULL;

    // Transition state
    let isTransitioning = false;
    let transitionStart = null;
    let fromAmp = config.FULL;
    let toAmp = config.FULL;

    // Click debouncing
    let lastClickTime = 0;
    const CLICK_DEBOUNCE = 50;


    // Cache line width to avoid constant layout reflows (recalculations)
    let cachedLineWidth = getLineWidth();

    function resize() {
        // Scale canvas for high-DPI displays while keeping display size fixed
        const dpr = devicePixelRatio || 1;

        // Set internal canvas resolution for crisp rendering
        canvas.width = 32 * dpr;
        canvas.height = 20 * dpr;

        // Scale the context to match the device pixel ratio
        ctx.scale(dpr, dpr);

        // Ensure the canvas CSS size stays fixed at 32x20px
        canvas.style.width = '32px';
        canvas.style.height = '20px';

        // Update current amplitude if not transitioning
        if (!isTransitioning) {
            amp = running ? config.FULL : config.LOW;
        }
    }

    resize();
    window.addEventListener('resize', () => {
        resize();
        cachedLineWidth = getLineWidth();
    });


    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function setRunning(newRunningState) {
        const now = performance.now();

        if (now - lastClickTime < CLICK_DEBOUNCE) return;
        lastClickTime = now;

        if (running === newRunningState) return;

        if (typeof window.toggleMute === 'function') {
            window.toggleMute();
        } else {
            console.log('Audio controls not yet loaded');
        }

        running = newRunningState;

        // Set transition values
        fromAmp = amp;
        toAmp = running ? config.FULL : config.LOW;
        transitionStart = now;
        isTransitioning = true;

        // console.log("pageMute: ", sessionStorage.getItem("pageMute"));
        // console.log("audioMuted: ", audioMuted);
    }

    let last = performance.now();
    function tick(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        phase += 2 * Math.PI * config.FREQ * dt;

        // Handle amplitude transitions
        if (isTransitioning) {
            const elapsed = now - transitionStart;
            const progress = Math.min(1, elapsed / config.DUR);
            const easedProgress = easeOutCubic(progress);

            amp = fromAmp + (toAmp - fromAmp) * easedProgress;

            if (progress >= 1) {
                amp = toAmp;
                isTransitioning = false;
            }
        }

        // Drawing with fixed logical dimensions (32x20)
        const w = 32;
        const h = 20;
        const yMid = h / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        const samples = 80, span = config.CYC * 2 * Math.PI;
        for (let i = 0; i <= samples; i++) {
            const x = (i / samples) * w;
            const y = yMid + Math.sin((i / samples) * span + phase) * amp;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }

        // Dynamic stroke color
        if (document.body.classList.contains("dark-nav") ||
            document.body.classList.contains("navbar-menu-open") ||
            document.querySelector('.contact_section')?.classList.contains('active')) {
            ctx.strokeStyle = "#FFF";
        } else {
            ctx.strokeStyle = "#2A2A2A";
        }

        // Responsive line width
        // ctx.lineWidth = getLineWidth();
        ctx.lineWidth = cachedLineWidth;
        ctx.stroke();

        requestAnimationFrame(tick);
    }

    canvas.parentElement.addEventListener("click", () => {
        setRunning(!running);
    });

    requestAnimationFrame(tick);
    if (sessionStorage.getItem("pageMute") === "true") {
        running = false;
        amp = config.LOW;
    } else {
        running = true;
        amp = config.FULL;
    }
});