<<<<<<< HEAD
// Mouse movement gradient effect with smooth delay
let mouseX = 50;
let mouseY = 50;
let currentX = 50;
let currentY = 50;

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updateGradient() {
    // Smoothly interpolate towards target position
    currentX = lerp(currentX, mouseX, 0.01); // 0.05 = delay factor (lower = more delay)
    currentY = lerp(currentY, mouseY, 0.01);
    
    const gradient = document.querySelector('.bg-gradient');
    gradient.style.setProperty('--x', currentX + '%');
    gradient.style.setProperty('--y', currentY + '%');
    
    // Continue animation
    requestAnimationFrame(updateGradient);
=======
// Mouse movement gradient effect with throttling
let mouseX = 50;
let mouseY = 50;
let animationId = null;

function updateGradient() {
    const gradient = document.querySelector('.bg-gradient');
    gradient.style.setProperty('--x', mouseX + '%');
    gradient.style.setProperty('--y', mouseY + '%');
    animationId = null;
>>>>>>> 8bce4b2e5865c4380424dc0c6e8d18894c7fb357
}

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
<<<<<<< HEAD
});

// Start the animation loop
updateGradient();

=======
    
    if (animationId === null) {
        animationId = requestAnimationFrame(updateGradient);
    }
});

>>>>>>> 8bce4b2e5865c4380424dc0c6e8d18894c7fb357
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
<<<<<<< HEAD
// Hero title language toggle with consistent dimensions
const heroTitle = document.getElementById('hero-title');
const englishText = "Hello, my name is Raphaelle.";
const frenchText = "Bonjour, je m'appelle Raphaelle.";

// Set initial width based on the longer text
function setConsistentWidth() {
    heroTitle.style.width = 'auto';
    const originalText = heroTitle.textContent;
    
    // Temporarily set to longer text to measure
    heroTitle.textContent = frenchText;
    const frenchWidth = heroTitle.offsetWidth;
    
    heroTitle.textContent = englishText;
    const englishWidth = heroTitle.offsetWidth;
    
    // Set width to accommodate the longer text
    const maxWidth = Math.max(frenchWidth, englishWidth);
    heroTitle.style.width = maxWidth + 'px';
    heroTitle.style.textAlign = 'center';
}

// Initialize width on page load
window.addEventListener('load', setConsistentWidth);

heroTitle.addEventListener('mouseenter', function() {
    this.textContent = frenchText;
});

heroTitle.addEventListener('mouseleave', function() {
    this.textContent = englishText;
});
=======
>>>>>>> 8bce4b2e5865c4380424dc0c6e8d18894c7fb357

// Form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for reaching out! I\'ll get back to you soon.');
    this.reset();
});

// Update time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const timeElement = document.querySelector('.hero-location');
    if (timeElement) {
        timeElement.innerHTML = `Based in Boulder <span class="arrow">→</span> ${timeString}`;
    }
}

// Update time every second
setInterval(updateTime, 1000);
<<<<<<< HEAD
updateTime(); // Initial call
=======
updateTime(); // Initial call
>>>>>>> 8bce4b2e5865c4380424dc0c6e8d18894c7fb357
