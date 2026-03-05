console.log("Sound checked IOS");

const bgSound = document.getElementById("bg-sound");
const hoverSound = document.getElementById("hover-sound");

// Audio settings
const BG_VOLUME = 0.3;
const HOVER_VOLUME = 1.0;

let masterCoef = 1;
let audioMuted = false;
let audioStarted = false;
let audioContext = null;

// Attach to window object for cross-file access
window.toggleMute = toggleMute;

function applyVolumes() {
    bgSound.volume = clamp01(BG_VOLUME * masterCoef);
}

function clamp01(v) {
    return Math.max(0, Math.min(1, v));
}

// Smooth fade of masterCoef using GSAP
function fadeMaster(to = 1, durMs = 600) {
    gsap.to(
        { masterCoef },
        {
            masterCoef: to,
            duration: durMs / 1000,
            ease: "power3.out",
            onUpdate: function () {
                masterCoef = this.targets()[0].masterCoef;
                applyVolumes();
            },
        }
    );
}

// Create AudioContext – MUST be called inside a user gesture handler
// bgSound is kept as a plain HTML element; AudioContext is only needed to satisfy
// iOS's "must create inside gesture" requirement and for visibility-change resume.
async function initAudioContext() {
    if (audioContext) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
        console.warn('AudioContext initialization failed:', error);
    }
}

// Start audio – must be called within a user gesture
async function startAudioImmediate() {
    try {
        await initAudioContext();

        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        masterCoef = 1;
        applyVolumes();

        // Set audioStarted before play() so hover sounds work even if play() is slow/fails
        audioStarted = true;

        if (!audioMuted) {
            bgSound.play().catch(err => console.warn('bgSound play failed:', err));
        }

        return true;
    } catch (error) {
        console.error('Failed to start audio:', error);
        audioStarted = true; // still allow hover sounds
        return false;
    }
}

// Mobile user-interaction handler (touchend only – avoids touchstart/touchend double-fire race)
const startAudioOnInteraction = async (event) => {
    if (!audioStarted) {
        await startAudioImmediate();
    }
};

// Mute / unmute
async function toggleMute() {
    audioMuted = !audioMuted; // flip first so fadeMaster receives the correct target
    sessionStorage.setItem("pageMute", audioMuted ? "true" : "false");

    if (audioMuted) {
        fadeMaster(0, 600);
        bgSound.pause(); // volume fade alone doesn't stop playback on iOS
    } else {
        // Un-muting – ensure AudioContext is ready (handles "first interaction = mute button tap" on iOS)
        await initAudioContext();

        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        masterCoef = 1;
        applyVolumes();
        fadeMaster(1, 600);

        bgSound.play().then(() => {
            audioStarted = true;
        }).catch(() => {
            console.warn('Resume background audio failed');
        });
    }
}

// Hover sound
const playHoverSound = () => {
    if (audioMuted || !audioStarted) return;

    try {
        hoverSound.currentTime = 0;
        const playPromise = hoverSound.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.error("Hover sound failed to play:", error);
            });
        }
    } catch (error) {
        console.error("Hover sound error:", error);
    }
};

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0);
}

// Main setup
window.addEventListener('DOMContentLoaded', () => {
    // Preload files here – AudioContext must wait for a user gesture
    bgSound.load();
    hoverSound.load();
    bgSound.preload = 'auto';
    hoverSound.preload = 'auto';
    bgSound.loop = true;

    if (sessionStorage.getItem("pageMute") === null) {
        sessionStorage.setItem("pageMute", "false");
    }

    audioMuted = sessionStorage.getItem("pageMute") === "true";

    // Button hover sounds
    const buttons = document.querySelectorAll(".button, .s_cfo_form_btn");
    buttons.forEach((button) => {
        button.addEventListener("mouseenter", playHoverSound);
        button.addEventListener("touchstart", playHoverSound, { passive: true });
    });

    if (isMobileDevice()) {
        // touchend only – avoids the touchstart+touchend double-play race on iOS
        document.addEventListener('touchend', startAudioOnInteraction, {
            capture: true,
            once: true,
            passive: true
        });
        document.addEventListener('click', startAudioOnInteraction, {
            capture: true,
            once: true
        });
    } else {
        // Desktop: try autoplay, fall back to first click
        if (!audioMuted) {
            applyVolumes();
            bgSound.play().then(() => {
                audioStarted = true;
                console.log("Desktop audio started successfully");
            }).catch(() => {
                console.log("Desktop audio failed, waiting for click");
                document.addEventListener('click', startAudioOnInteraction);
            });
        }
    }
});

// Handle tab switching (iOS Safari + desktop)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (audioContext && audioContext.state === 'running') {
            audioContext.suspend();
        }
    } else if (audioStarted && !audioMuted) {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                bgSound.play().catch(() => { });
            });
        } else {
            // No AudioContext (desktop autoplay path) – resume directly
            bgSound.play().catch(() => { });
        }
    }
});
