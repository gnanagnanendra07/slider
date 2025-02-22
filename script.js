document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progress = document.querySelector('.progress');
    
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isAnimating = false;
    
    // Function to update progress bar
    function updateProgress() {
        const progressWidth = ((currentSlide + 1) / slides.length) * 100;
        progress.style.transform = `translateX(${progressWidth - 100}%)`;
    }
    
    // Function to show a specific slide
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Remove all classes from slides
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        
        // Remove active class from thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Calculate prev and next indices
        const prevIndex = (index - 1 + slides.length) % slides.length;
        const nextIndex = (index + 1) % slides.length;
        
        // Add appropriate classes
        slides[prevIndex].classList.add('prev');
        slides[index].classList.add('active');
        slides[nextIndex].classList.add('next');
        thumbnails[index].classList.add('active');
        
        // Update current slide
        currentSlide = index;
        
        // Update progress bar
        updateProgress();
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Next slide
    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }
    
    // Previous slide
    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    // Event listeners for buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    // Event listeners for thumbnails
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });
    
    // Touch events for mobile swipe
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (isAnimating) return;
        e.preventDefault();
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX;
        
        // Add a subtle transform effect while dragging
        slider.style.transform = `translateX(${diff * 0.5}px)`;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        slider.style.transform = '';
    });
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            resetAutoPlay();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });
    
    // Auto-play functionality
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 seconds
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Pause auto-play on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    
    // Initialize slider
    showSlide(0);
    startAutoPlay();
    
    // Add 3D tilt effect
    slider.addEventListener('mousemove', (e) => {
        if (isAnimating) return;
        
        const { left, top, width, height } = slider.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const tiltX = (y - 0.5) * 10;
        const tiltY = (x - 0.5) * -10;
        
        slider.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    slider.addEventListener('mouseleave', () => {
        slider.style.transform = '';
    });
    
    // Preload next image
    function preloadNextImage() {
        const nextIndex = (currentSlide + 1) % slides.length;
        const nextImage = slides[nextIndex].querySelector('img');
        const imageUrl = nextImage.src;
        new Image().src = imageUrl;
    }
    
    // Preload images when changing slides
    slides.forEach((slide, index) => {
        slide.addEventListener('transitionend', () => {
            if (index === currentSlide) {
                preloadNextImage();
            }
        });
    });
});
