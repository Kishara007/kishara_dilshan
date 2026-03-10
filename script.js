// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Link Lenis scroll to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 2. Canvas Image Sequence Setup
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

// Constants - Folder has 91 frames
const frameCount = 91; // ezgif-frame-001.jpg up to 091.jpg
const currentFrame = index => (
    `ezgif-4f8079f95e741c0b-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const seq = { frame: 0 };

// Preload images aggressively
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Function to calculate render dimensions relative to canvas (object-fit: cover equivalent for canvas)
function render() {
    if (!images[seq.frame]) return;

    const img = images[seq.frame];
    // Don't render if not fully loaded yet
    if (!img.complete || img.naturalWidth === 0) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        // Canvas is wider than image aspect ratio
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        // Canvas is taller than image aspect ratio
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw with slight smoothing for a better anti-aliasing look
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Handle resize and initial setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}

window.addEventListener("resize", resizeCanvas);

// Render initial frame when first image loads
images[0].onload = () => {
    resizeCanvas();
};

// Ensure canvas is right dimensions right away
resizeCanvas();

// ScrollTrigger for Canvas Sequence Scrubbing
gsap.to(seq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: ".content-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1 // Smooth scrub
    },
    onUpdate: render
});


// 3. UI and Content Animations

// Hero Section Intro
const heroTl = gsap.timeline();
heroTl.from(".hero-title", {
    duration: 1.5,
    y: 80,
    opacity: 0,
    ease: "power4.out",
    delay: 0.2
}).from(".hero-subtitle", {
    duration: 1.5,
    y: 40,
    opacity: 0,
    ease: "power4.out"
}, "-=1.2");

// About Section Fade/Float
gsap.from(".about-text", {
    scrollTrigger: {
        trigger: ".about",
        start: "top 75%",
        end: "center center",
        scrub: 1
    },
    y: 100,
    opacity: 0,
    scale: 0.95,
    ease: "power2.out"
});

// Experience Parallax (Staggered Timeline Items)
const timelineItems = gsap.utils.toArray('.timeline-item');
timelineItems.forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
            end: "top 60%",
            scrub: 1
        },
        x: 100,
        opacity: 0,
        ease: "power2.out"
    });
});

// Education Section
gsap.from(".edu-card", {
    scrollTrigger: {
        trigger: ".education",
        start: "top 85%",
        end: "top 55%",
        scrub: 1
    },
    y: 80,
    opacity: 0,
    rotation: -1,
    ease: "power2.out"
});

// Contact Section
gsap.from(".email-link", {
    scrollTrigger: {
        trigger: ".contact",
        start: "top 85%",
        end: "center 70%",
        scrub: 1
    },
    y: 50,
    opacity: 0,
    scale: 0.9,
    ease: "back.out(1.7)"
});
