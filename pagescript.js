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
    currentX = lerp(currentX, mouseX, 0.005); // 0.05 = delay factor (lower = more delay)
    currentY = lerp(currentY, mouseY, 0.005);
    
    const gradient = document.querySelector('.bg-gradient');
    gradient.style.setProperty('--x', currentX + '%');
    gradient.style.setProperty('--y', currentY + '%');
    
    // Continue animation
    requestAnimationFrame(updateGradient);
}

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
});

// Start the animation loop
updateGradient();

// Hero title language toggle with letter flipping animation
const heroTitle = document.getElementById('hero-title');
const englishText = "Hello, my name is Raphaelle.";
const frenchText = "Bonjour, je m'appelle Raphaelle.";

// More stable character set - similar widths to reduce movement
const characters = "abcdefghijklmnopqrstuvwxyz";

let isAnimating = false;

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

function animateTextTransition(fromText, toText, callback) {
    if (isAnimating) return;
    isAnimating = true;
    
    const maxLength = Math.max(fromText.length, toText.length);
    let currentText = fromText.padEnd(maxLength, ' ');
    const targetText = toText.padEnd(maxLength, ' ');
    
    const animationDuration = 400; // Slightly shorter duration
    const charactersPerPosition = 5; // Fewer random characters per position
    const staggerDelay = 20; // Slightly faster stagger
    
    // Create array to track animation state for each position
    const positionStates = new Array(maxLength).fill(0);
    const positionComplete = new Array(maxLength).fill(false);
    
    function updateDisplay() {
        let displayText = '';
        for (let i = 0; i < maxLength; i++) {
            if (positionComplete[i]) {
                displayText += targetText[i];
            } else if (positionStates[i] > 0) {
                // For spaces and punctuation, don't animate - keep them stable
                if (targetText[i] === ' ' || /[.,!?]/.test(targetText[i])) {
                    displayText += targetText[i];
                } else {
                    // Show random character while animating, but only uppercase letters
                    displayText += characters[Math.floor(Math.random() * characters.length)];
                }
            } else {
                displayText += currentText[i];
            }
        }
        heroTitle.textContent = displayText.trimEnd();
    }
    
    // Start animation for each position with staggered timing
    for (let i = 0; i < maxLength; i++) {
        setTimeout(() => {
            // Skip animation for spaces and punctuation - they stay stable
            if (targetText[i] === ' ' || /[.,!?]/.test(targetText[i])) {
                positionComplete[i] = true;
                return;
            }
            
            positionStates[i] = 1;
            
            // After showing random characters, settle on target
            setTimeout(() => {
                positionComplete[i] = true;
                
                // Check if all positions are complete
                if (positionComplete.every(complete => complete)) {
                    heroTitle.textContent = toText;
                    isAnimating = false;
                    if (callback) callback();
                }
            }, charactersPerPosition * 25); // Shorter duration per character
            
        }, i * staggerDelay);
    }
    
    // Update display less frequently for smoother appearance
    const displayInterval = setInterval(() => {
        if (!isAnimating) {
            clearInterval(displayInterval);
            return;
        }
        updateDisplay();
    }, 40); // Slower update rate
}

// Initialize width on page load
window.addEventListener('load', setConsistentWidth);

heroTitle.addEventListener('mouseenter', function() {
    animateTextTransition(englishText, frenchText);
});

heroTitle.addEventListener('mouseleave', function() {
    animateTextTransition(frenchText, englishText);
});

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
updateTime(); // Initial call