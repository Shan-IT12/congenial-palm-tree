// Track current step
let currentStep = 0;
const totalSteps = 6; // 0: welcome, 1-4: steps, 5: finish

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    loadProgress();
});

// Navigate to next step
function nextStep() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
        saveProgress();
        scrollToTop();
    }
}

// Navigate to previous step
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        saveProgress();
        scrollToTop();
    }
}

// Show specific step
function showStep(stepNumber) {
    // Hide all sections
    const sections = document.querySelectorAll('.step-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show the current section
    const stepIds = ['welcome', 'step-1', 'step-2', 'step-3', 'step-4', 'finish'];
    const currentSection = document.getElementById(stepIds[stepNumber]);
    if (currentSection) {
        currentSection.classList.add('active');
    }

    // Update progress indicator
    updateProgress();
}

// Update progress indicator
function updateProgress() {
    // Check if progress indicator exists, if not create it
    let progressContainer = document.querySelector('.progress-indicator');
    if (!progressContainer) {
        progressContainer = document.createElement('div');
        progressContainer.className = 'progress-indicator';
        progressContainer.setAttribute('role', 'navigation');
        progressContainer.setAttribute('aria-label', 'Course progress');
        
        const header = document.querySelector('header .container');
        if (header) {
            header.appendChild(progressContainer);
        }
    }

    // Clear existing dots
    progressContainer.innerHTML = '';

    // Create progress dots
    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `Go to step ${i + 1}`);
        
        if (i === currentStep) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'step');
        } else if (i < currentStep) {
            dot.classList.add('completed');
        }
        
        // Click handler
        dot.onclick = () => {
            currentStep = i;
            showStep(i);
            saveProgress();
        };
        
        // Keyboard handler for accessibility
        dot.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentStep = i;
                showStep(i);
                saveProgress();
            }
        };
        
        progressContainer.appendChild(dot);
    }
}

// Save progress to localStorage
function saveProgress() {
    try {
        localStorage.setItem('github-walkthrough-progress', currentStep.toString());
    } catch (e) {
        console.log('Unable to save progress:', e);
    }
}

// Load progress from localStorage
function loadProgress() {
    try {
        const savedProgress = localStorage.getItem('github-walkthrough-progress');
        if (savedProgress !== null) {
            currentStep = parseInt(savedProgress, 10);
            showStep(currentStep);
        } else {
            showStep(0); // Start at welcome
        }
    } catch (e) {
        console.log('Unable to load progress:', e);
        showStep(0);
    }
}

// Scroll to top of page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Left arrow for previous
    if (event.key === 'ArrowLeft' && currentStep > 0) {
        event.preventDefault();
        prevStep();
    }
    // Right arrow or enter for next
    else if ((event.key === 'ArrowRight' || event.key === 'Enter') && currentStep < totalSteps - 1) {
        // Don't trigger on Enter if user is focused on a button or link
        if (event.key === 'Enter' && (event.target.tagName === 'BUTTON' || event.target.tagName === 'A')) {
            return;
        }
        event.preventDefault();
        nextStep();
    }
});

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Console easter egg
console.log('%c🎉 Welcome to the GitHub Introduction Walkthrough!', 'font-size: 20px; color: #2da44e; font-weight: bold;');
console.log('%cUse Arrow Keys or Enter to navigate between steps!', 'font-size: 14px; color: #0969da;');
console.log('%cHappy learning! 🚀', 'font-size: 14px; color: #1a7f37;');
