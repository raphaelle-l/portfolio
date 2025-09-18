// Mouse movement gradient effect with smooth delay
let mouseX = 60; // Starting slightly to the right instead of 50
let mouseY = 50;
let currentX = 60; // Starting slightly to the right instead of 50
let currentY = 50;

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updateGradient() {
    // Smoothly interpolate towards target position with faster response
    currentX = lerp(currentX, mouseX, 0.08); // Increased from 0.005 to 0.08 for more responsive movement
    currentY = lerp(currentY, mouseY, 0.08);
    
    const gradient = document.querySelector('.bg-gradient');
    if (gradient) {
        gradient.style.setProperty('--x', currentX + '%');
        gradient.style.setProperty('--y', currentY + '%');
    }
    
    // Continue animation
    requestAnimationFrame(updateGradient);
}

document.addEventListener('mousemove', (e) => {
    // Calculate X position normally
    mouseX = (e.clientX / window.innerWidth) * 100;
    
    // For Y position, we need to account for the gradient being 200vh tall
    // but positioned from viewport top. So we scale the viewport position
    // to the gradient's coordinate system.
    mouseY = (e.clientY / window.innerHeight) * 50; // Scale to first 50% of 200vh gradient
});

// Start the animation loop
updateGradient();

// Hero title language toggle - toggle mode instead of hover
const heroTitle = document.getElementById('hero-title');
const englishText = "Hey! My name is Raphaelle.";
const frenchText = "Salut! Je m'appelle Raphaelle.";

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

// Sticker system
const stickerPaths = [
    'sticker1.png',
    'sticker2.png', 
    'sticker3.png',
    'sticker4.png',
    'sticker5.png',
    'sticker6.png',
    'sticker7.png'
];

let stickerContainer;
let isHeroSection = false;

function initStickerSystem() {
    stickerContainer = document.getElementById('sticker-container');
    
    if (!stickerContainer) {
        console.error('Sticker container not found in DOM!');
        return;
    }
    
    console.log('Sticker system initialized successfully');
    
    // Check if we're in hero section when page loads
    updateHeroStatus();
    
    // Listen for scroll to check if we're in hero section
    window.addEventListener('scroll', updateHeroStatus);
    
    // Add click listener to document
    document.addEventListener('click', handleStickerClick);
}

function updateHeroStatus() {
    const heroSection = document.querySelector('.hero');
    const heroRect = heroSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if hero section is visible (at least 30% visible)
    isHeroSection = heroRect.bottom > windowHeight * 0.3 && heroRect.top < windowHeight * 0.7;
}

function handleStickerClick(e) {
    // Debug: Log click event
    console.log('Click detected at:', e.clientX, e.clientY);
    console.log('Is hero section:', isHeroSection);
    
    // Only trigger stickers in hero section
    if (!isHeroSection) {
        console.log('Not in hero section, skipping sticker');
        return;
    }
    
    // Don't trigger on interactive elements
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
        e.target.closest('nav') || e.target.closest('form')) {
        console.log('Clicked on interactive element, skipping sticker');
        return;
    }
    
    console.log('Creating sticker!');
    createSticker(e.clientX, e.clientY);
}

function createSticker(x, y) {
    console.log('Creating sticker at:', x, y);
    
    // Random sticker selection
    const randomSticker = stickerPaths[Math.floor(Math.random() * stickerPaths.length)];
    console.log('Selected sticker:', randomSticker);
    
    // Create sticker element
    const sticker = document.createElement('img');
    sticker.src = randomSticker;
    sticker.className = 'sticker';
    sticker.alt = 'Sticker';
    
    // Position sticker exactly at click location (perfectly centered on mouse)
    sticker.style.left = x + 'px';
    sticker.style.top = y + 'px';
    
    // Add random rotation variation
    const randomRotation = (Math.random() - 0.5) * 30; // -15 to +15 degrees
    
    // Add to container
    if (stickerContainer) {
        stickerContainer.appendChild(sticker);
        console.log('Sticker added to container');
    } else {
        console.error('Sticker container not found!');
        return;
    }
    
    // Handle image loading
    sticker.onload = function() {
        console.log('Sticker image loaded successfully');
    };
    
    sticker.onerror = function() {
        console.error('Failed to load sticker image:', randomSticker);
    };
    
    // Animate in
    requestAnimationFrame(() => {
        sticker.classList.add('show');
        sticker.style.transform = `translate(-50%, -50%) scale(1) rotate(${randomRotation}deg)`;
        console.log('Sticker animation started');
    });
    
    // Fade out and remove after 1 second
    setTimeout(() => {
        sticker.classList.add('fade-out');
        sticker.style.transform = `translate(-50%, -50%) scale(1.2) rotate(${randomRotation + 10}deg)`;
        
        // Remove from DOM after slower fade animation
        setTimeout(() => {
            if (sticker.parentNode) {
                sticker.parentNode.removeChild(sticker);
                console.log('Sticker removed from DOM');
            }
        }, 800); // Increased from 300ms to 800ms for slower fade
    }, 1000); // Changed from 3000ms to 1000ms (1 second)
}

// Initialize sticker system when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sticker system first
    initStickerSystem();
    const folderItems = document.querySelectorAll('.folder-item');
    const folderFullscreen = document.getElementById('folder-fullscreen');
    const folderYearTitle = document.querySelector('.folder-year-title');
    const navLinks = document.querySelectorAll('.nav-links a, .social-links a'); // All nav links
    const categoryFilter = document.getElementById('categoryFilter');
    const foldersView = document.getElementById('folders-view');
    const categoryView = document.getElementById('category-view');
    
    let openedFolder = null; // Track which folder is currently open

    // Sample project data organized by year and category
    const projectsData = {
        2025: [
            { title: "Interactive Digital Art Installation", category: "art", description: "An immersive digital experience combining motion sensors and generative art to create responsive visual narratives." },
            { title: "3D Printed Modular Furniture", category: "physical", description: "Sustainable furniture system using recycled plastic filament and parametric design principles." },
            { title: "Smart Garden Controller", category: "digital", description: "IoT device with custom PCB design for automated plant care with mobile app integration." }
        ],
        2024: [
            { title: "Interactive AR Paintings", category: "art", description: "Traditional paintings enhanced with augmented reality layers revealing hidden stories and animations." },
            { title: "Kinetic Light Sculpture", category: "physical", description: "Motion-activated sculpture combining woodworking, electronics, and programming for dynamic light patterns." },
            { title: "Custom PCB Audio Mixer", category: "digital", description: "Hand-soldered analog audio mixer with custom circuit board design and 3D printed enclosure." },
            { title: "Digital Portrait Series", category: "art", description: "Collection of digital illustrations exploring identity and technology through portraiture." }
        ],
        2023: [
            { title: "Ceramic & Electronics Hybrid", category: "physical", description: "Exploring the intersection of traditional ceramics with embedded LED technology." },
            { title: "Generative Art System", category: "art", description: "Algorithm-based art creation tool using Processing and machine learning for unique visual outputs." },
            { title: "Wearable Tech Prototype", category: "digital", description: "Health monitoring device with custom sensors and wireless data transmission." }
        ],
        2022: [
            { title: "Hand-drawn Animation Series", category: "art", description: "Traditional 2D animation exploring themes of growth and transformation." },
            { title: "Laser Cut Wooden Sculptures", category: "physical", description: "Geometric wooden sculptures created through parametric design and precision laser cutting." }
        ]
    };

    // Category filter functionality
    categoryFilter.addEventListener('change', function() {
        const selectedCategory = this.value;
        
        if (selectedCategory === 'all') {
            // Show original folder view
            foldersView.style.display = 'flex';
            categoryView.style.display = 'none';
        } else {
            // Show category filtered view
            foldersView.style.display = 'none';
            categoryView.style.display = 'block';
            displayCategoryProjects(selectedCategory);
        }
    });

    function displayCategoryProjects(category) {
        categoryView.innerHTML = '';
        
        // Get all years in descending order
        const years = Object.keys(projectsData).sort((a, b) => b - a);
        
        years.forEach(year => {
            // Filter projects by category for this year
            const categoryProjects = projectsData[year].filter(project => project.category === category);
            
            if (categoryProjects.length > 0) {
                // Create year group
                const yearGroup = document.createElement('div');
                yearGroup.className = 'year-group';
                
                const yearHeader = document.createElement('h3');
                yearHeader.className = 'year-header';
                yearHeader.textContent = year;
                yearGroup.appendChild(yearHeader);
                
                const projectGrid = document.createElement('div');
                projectGrid.className = 'category-project-grid';
                
                categoryProjects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'category-project-card';
                    
                    projectCard.innerHTML = `
                        <div class="category-project-image">PROJECT IMAGE</div>
                        <div class="project-category">${getCategoryDisplayName(project.category)}</div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    `;
                    
                    projectGrid.appendChild(projectCard);
                });
                
                yearGroup.appendChild(projectGrid);
                categoryView.appendChild(yearGroup);
            }
        });
    }

    function getCategoryDisplayName(category) {
        const categoryNames = {
            'art': 'Art',
            'physical': 'Physical Fabrication',
            'digital': 'Digital Fabrication'
        };
        return categoryNames[category] || category;
    }

    // Original folder click functionality
    folderItems.forEach(folder => {
        folder.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            folderYearTitle.textContent = year + ' Work';
            
            // Store reference to the opened folder
            openedFolder = this;
            
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
        
        // Use the tracked opened folder instead of trying to find it
        if (openedFolder) {
            const rect = openedFolder.getBoundingClientRect();
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
                openedFolder = null; // Clear the reference
            }, 600);
        } else {
            // Fallback if we can't find the folder
            folderFullscreen.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            folderFullscreen.style.transform = 'scale(0.3)';
            folderFullscreen.style.opacity = '0';
            
            setTimeout(() => {
                folderFullscreen.style.visibility = 'hidden';
                openedFolder = null; // Clear the reference
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
            
            // Reset category filter to show original folder view
            categoryFilter.value = 'all';
            foldersView.style.display = 'flex';
            categoryView.style.display = 'none';
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