const bgSound = document.getElementById("bg-sound");
const hoverSound = document.getElementById("hover-sound");

// Audio settings
const BG_VOLUME = 0.3;
const HOVER_VOLUME = 1.0;

let masterCoef = 1;
let audioMuted = false;
let audioStarted = false;
let audioContext = null; // For iOS Web Audio API compatibility

// Attach to window object for cross-file access
window.toggleMute = toggleMute;

// Mobile-specific audio initialization
function initializeMobileAudio() {
    try {
        // Create AudioContext for iOS compatibility
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Load and prepare audio elements
        bgSound.load();
        hoverSound.load();

        // Set initial properties
        bgSound.preload = 'auto';
        hoverSound.preload = 'auto';
        bgSound.loop = true;

        // iOS-specific: Set audio session properties
        if (bgSound.webkitAudioContext) {
            bgSound.webkitAudioContext = audioContext;
        }

        return true;
    } catch (error) {
        console.warn('Audio initialization failed:', error);
        return false;
    }
}

function applyVolumes() {
    bgSound.volume = clamp01(BG_VOLUME * masterCoef);
    // hoverSound.volume = clamp01(HOVER_VOLUME * masterCoef);
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

// Enhanced mobile-compatible audio start
async function startAudioImmediate() {
    try {
        // Resume AudioContext if needed (iOS requirement)
        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        // Apply volumes first
        applyVolumes();

        // Play background sound immediately (within user interaction context)
        if (!audioMuted) {
            // Use play() without .catch() to stay in user interaction context
            const playPromise = bgSound.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    console.warn('Background audio play failed');
                });
            }
        }

        audioStarted = true;
        return true;
    } catch (error) {
        console.error('Failed to start audio:', error);
        return false;
    }
}

// Mobile-optimized user interaction handler
const startAudioOnInteraction = async (event) => {
    if (!audioStarted) {
        // Initialize audio first if not done
        if (!audioContext) {
            initializeMobileAudio();
        }

        // Start audio immediately within the event handler
        await startAudioImmediate();

        // Remove listeners after first successful interaction - redundant due to { once: true }
        // document.removeEventListener('click', startAudioOnInteraction, true);
        // document.removeEventListener('touchstart', startAudioOnInteraction, true);
        // document.removeEventListener('touchend', startAudioOnInteraction, true);
    }
};

// Mute/unmute functionality
function toggleMute() {
    if (audioMuted) {
        applyVolumes();


        // page loaded while muted - init now
        if (!audioStarted) {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            bgSound.play().catch(() => {
                console.warn('Background audio play failed');
            });
            audioStarted = true;
        } else {
            // audio was already started - resume it
            bgSound.play().catch(() => {
                console.warn('Resume background audio failed');
            });
        }
    }

    audioMuted = !audioMuted;
    sessionStorage.setItem("pageMute", audioMuted ? "true" : "false");

    fadeMaster(audioMuted ? 0 : 1, 600);
}

// Enhanced hover sound for mobile compatibility
const playHoverSound = () => {

    if (audioMuted || !audioStarted) {
        return;
    }

    try {
        hoverSound.currentTime = 0;
        // hoverSound.volume = clamp01(HOVER_VOLUME * masterCoef);

        const playPromise = hoverSound.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // console.log("Hover sound play succeeded");
            }).catch((error) => {
                console.error("Hover sound failed to play:", error);
            });
        }
    } catch (error) {
        console.error("Hover sound error:", error);
    }
};


// Enhanced mobile event detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0);
}

// Main setup
window.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile audio
    initializeMobileAudio();

    // Check session mute state
    if (sessionStorage.getItem("pageMute") === null) {
        sessionStorage.setItem("pageMute", "false");
    }

    // console.log("pageMute: ", sessionStorage.getItem("pageMute"));
    // console.log("audioMuted: ", audioMuted);

    audioMuted = sessionStorage.getItem("pageMute") === "true";

    // Setup button hover sounds
    const buttons = document.querySelectorAll(".button, .s_cfo_form_btn");
    buttons.forEach((button) => {
        // console.log("button in");
        // Use both mouse and touch events for compatibility
        button.addEventListener("mouseenter", playHoverSound);
        button.addEventListener("touchstart", playHoverSound, { passive: true });
    });

    // Mobile-specific audio handling
    if (isMobileDevice()) {
        // Use capture phase for better mobile compatibility
        document.addEventListener('touchstart', startAudioOnInteraction, {
            capture: true,
            once: true,
            passive: true
        });
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
        // Desktop: try to start immediately, fall back to user interaction
        if (!audioMuted) {
            applyVolumes();
            bgSound.play().then(() => {
                audioStarted = true;
                // sessionStorage.setItem("pageMute", "true");

                console.log("Desktop audio started successfully");
            }).catch(() => {
                console.log("Desktop audio failed, adding click listener");
                document.addEventListener('click', startAudioOnInteraction);
            });
        }
    }
});

// Additional mobile-specific handlers
document.addEventListener('visibilitychange', () => {
    // Handle page visibility changes (iOS Safari tab switching)
    if (document.hidden) {
        if (audioContext && audioContext.state === 'running') {
            audioContext.suspend();
        }
    } else {
        if (audioContext && audioContext.state === 'suspended' && audioStarted) {
            audioContext.resume().then(() => {
                if (!audioMuted && audioStarted) {
                    bgSound.play().catch(() => { });
                }
            });
        }
    }
});