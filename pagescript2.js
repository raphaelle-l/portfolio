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

// Hero title language toggle - toggle mode instead of hover
const heroTitle = document.getElementById('hero-title');
const englishText = "Hello, my name is Raphaelle.";
const frenchText = "Bonjour, je m'appelle Raphaelle.";

let isAnimating = false;
let currentLanguage = 'english'; // Track current state

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

function typewriterTransition(fromText, toText, callback) {
    if (isAnimating) return;
    isAnimating = true;
    
    let currentText = fromText;
    heroTitle.textContent = currentText;
    
    // Phase 1: Erase the current text
    const eraseInterval = setInterval(() => {
        if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
            heroTitle.textContent = currentText + '|'; // Add cursor
        } else {
            clearInterval(eraseInterval);
            
            // Short pause before typing
            setTimeout(() => {
                // Phase 2: Type the new text
                let typedText = '';
                let charIndex = 0;
                
                const typeInterval = setInterval(() => {
                    if (charIndex < toText.length) {
                        typedText += toText[charIndex];
                        heroTitle.textContent = typedText + '|'; // Add cursor
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        
                        // Remove cursor and finish
                        setTimeout(() => {
                            heroTitle.textContent = toText;
                            isAnimating = false;
                            if (callback) callback();
                        }, 200);
                    }
                }, 50); // Typing speed (50ms per character)
                
            }, 400); // Pause between erase and type
        }
    }, 30); // Erasing speed (30ms per character)
}

// Initialize width on page load
window.addEventListener('load', setConsistentWidth);

// Toggle between languages on hover
heroTitle.addEventListener('mouseenter', function() {
    if (currentLanguage === 'english') {
        typewriterTransition(englishText, frenchText, () => {
            currentLanguage = 'french';
        });
    } else {
        typewriterTransition(frenchText, englishText, () => {
            currentLanguage = 'english';
        });
    }
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

// Folder functionality with seamless zoom
document.addEventListener('DOMContentLoaded', function() {
    const folderItems = document.querySelectorAll('.folder-item');
    const folderFullscreen = document.getElementById('folder-fullscreen');
// Removed closeFolder since we're using back button instead
    const folderYearTitle = document.querySelector('.folder-year-title');
    const navLinks = document.querySelectorAll('.nav-links a, .social-links a'); // All nav links

    folderItems.forEach(folder => {
        folder.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            folderYearTitle.textContent = year + ' Work';
            
            // Get folder position and size
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Set initial position and scale of fullscreen to match folder
            folderFullscreen.style.transformOrigin = `${centerX}px ${centerY}px`;
            folderFullscreen.style.transform = `scale(${rect.width / window.innerWidth})`;
            folderFullscreen.style.opacity = '1';
            folderFullscreen.style.visibility = 'visible';
            
            // Hide original folder during animation
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.1s ease';
            
            // Trigger smooth scale to full size
            requestAnimationFrame(() => {
                folderFullscreen.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
                folderFullscreen.style.transform = 'scale(1)';
            });
            
            document.body.style.overflow = 'hidden';
            
            // Reset folder opacity after animation completes
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 800);
        });
    });

    function closeFolderView() {
        // Check if folder is currently open
        if (folderFullscreen.style.visibility !== 'visible') return;
        
        // Find which folder was clicked (the one that's currently visible)
        const activeFolder = Array.from(folderItems).find(folder => 
            getComputedStyle(folder).opacity === '1' || !folder.style.opacity
        );
        
        if (activeFolder) {
            const rect = activeFolder.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Scale back down to folder size
            folderFullscreen.style.transformOrigin = `${centerX}px ${centerY}px`;
            folderFullscreen.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            folderFullscreen.style.transform = `scale(${rect.width / window.innerWidth})`;
            folderFullscreen.style.opacity = '0';
            
            setTimeout(() => {
                folderFullscreen.style.visibility = 'hidden';
                folderFullscreen.style.transform = 'scale(0.3)';
                folderFullscreen.style.transformOrigin = 'center center';
                folderFullscreen.style.transition = 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
            }, 600);
        } else {
            // Fallback if we can't find the folder
            folderFullscreen.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            folderFullscreen.style.transform = 'scale(0.3)';
            folderFullscreen.style.opacity = '0';
            
            setTimeout(() => {
                folderFullscreen.style.visibility = 'hidden';
            }, 600);
        }
        
        document.body.style.overflow = 'auto';
    }


    // Close folder when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If folder is open, close it first, then proceed with navigation
            if (folderFullscreen.style.visibility === 'visible') {
                closeFolderView();
            }
        });
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && folderFullscreen.style.visibility === 'visible') {
            closeFolderView();
        }
    });

 // Close when clicking outside content
 folderFullscreen.addEventListener('click', function(e) {
    if (e.target === folderFullscreen) {
        closeFolderView();
    }
});

// Add back button functionality
const backButton = document.querySelector('.back-button');
if (backButton) {
    backButton.addEventListener('click', closeFolderView);
}
});