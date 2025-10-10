document.addEventListener('DOMContentLoaded', function () {
    // Create particles
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const isSolar = Math.random() > 0.7;
        if (isSolar) {
            particle.classList.add('solar');
        } else {
            particle.classList.add('wind');
        }
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 22 + 's';
        particle.style.animationDuration = (18 + Math.random() * 12) + 's';
        particle.style.opacity = 0;
        setTimeout(() => {
            particle.style.opacity = Math.random() * 0.8 + 0.4;
        }, Math.random() * 4500);
        particlesContainer.appendChild(particle);
    }

    // Create background elements
    const bgElements = document.getElementById('bgElements');
    for (let i = 0; i < 4; i++) {
        const circle = document.createElement('div');
        circle.classList.add('bg-circle');
        const isSolar = Math.random() > 0.7;
        if (isSolar) {
            circle.classList.add('solar');
        } else {
            circle.classList.add('wind');
        }
        const size = 120 + Math.random() * 180;
        circle.style.width = size + 'px';
        circle.style.height = size + 'px';
        circle.style.left = Math.random() * 100 + '%';
        circle.style.top = Math.random() * 100 + '%';
        circle.style.animationDelay = Math.random() * 8 + 's';
        circle.style.animationDuration = (10 + Math.random() * 8) + 's';
        bgElements.appendChild(circle);
    }
    for (let i = 0; i < 2; i++) {
        const wave = document.createElement('div');
        wave.classList.add('bg-wave');
        wave.style.bottom = (i * 30) + 'px';
        wave.style.animationDelay = (i * 3) + 's';
        wave.style.opacity = 0.2 - (i * 0.05);
        wave.style.animationDuration = (12 + i * 2) + 's';
        bgElements.appendChild(wave);
    }

    // Gallery 3D slider functionality
    const gallery3dSlider = document.getElementById('gallery3dSlider');
    const gallery3dSlides = document.querySelectorAll('.gallery-3d-slide');
    const gallery3dPrev = document.querySelector('.gallery-3d-prev');
    const gallery3dNext = document.querySelector('.gallery-3d-next');
    const gallery3dNav = document.getElementById('gallery3dNav');
    let currentSlide = 0;
    const totalSlides = gallery3dSlides.length;
    let autoSlideInterval;
    let isTransitioning = false;

    // Create navigation dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('gallery-3d-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(i);
                resetAutoSlide();
            }
        });
        gallery3dNav.appendChild(dot);
    }
    const gallery3dDots = document.querySelectorAll('.gallery-3d-dot');

    // Position slides in 3D space
    function positionSlides() {
        const angleStep = 360 / totalSlides;
        gallery3dSlides.forEach((slide, index) => {
            const angle = angleStep * index;
            const z = 400;
            const rotateY = angle;
            const translateZ = -z;
            slide.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
            if (index === currentSlide) {
                slide.style.opacity = 1;
                slide.style.transform += ' scale(1.1)';
                slide.style.zIndex = 10;
            } else {
                slide.style.opacity = 0.7;
                slide.style.zIndex = 1;
            }
        });
    }

    // Navigate to specific slide
    function goToSlide(slideIndex) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide = slideIndex;
        const angleStep = 360 / totalSlides;
        const rotateY = -angleStep * slideIndex;
        gallery3dSlider.style.transform = `rotateY(${rotateY}deg)`;
        gallery3dDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        positionSlides();
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    // Navigation functions
    function nextSlide() {
        if (!isTransitioning) {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }
    }

    function prevSlide() {
        if (!isTransitioning) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        }
    }

    // Auto-slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event listeners for navigation
    gallery3dNext.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    gallery3dPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    gallery3dSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gallery3dSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            resetAutoSlide();
        } else if (touchEndX > touchStartX + 50) {
            prevSlide();
            resetAutoSlide();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('gallery-page').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlide();
            }
        }
    });

    // Initialize gallery
    positionSlides();
    startAutoSlide();

    // Smooth scrolling for anchor links
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

    // Page navigation functionality with centered loader
    function showPage(pageId) {
        const pageLoader = document.getElementById('pageLoader');
        pageLoader.classList.add('active');
        setTimeout(() => {
            const pageSections = document.querySelectorAll('.page-section');
            pageSections.forEach(section => {
                section.classList.remove('active');
            });
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-page') === pageId) {
                        link.classList.add('active');
                    }
                });

                // Update mobile nav active state
                const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-page') === pageId) {
                        link.classList.add('active');
                    }
                });

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                if (pageId === 'gallery') {
                    currentSlide = 0;
                    goToSlide(0);
                    resetAutoSlide();
                }
            }
            pageLoader.classList.remove('active');
        }, 200); // Further reduced page loader time
    }

    // Navigation event listeners
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.getElementById('mobileNavToggle').classList.remove('active');
                document.getElementById('mobileNavMenu').classList.remove('active');
            }
        });
    });

    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Mobile navigation toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileNavMenu = document.getElementById('mobileNavMenu');

    mobileNavToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileNavMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!mobileNavToggle.contains(e.target) && !mobileNavMenu.contains(e.target)) {
            mobileNavToggle.classList.remove('active');
            mobileNavMenu.classList.remove('active');
        }
    });

    // Intersection Observer for section animations
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -55px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });

    // Page section observer for animation control
    const pageSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            } else {
                entry.target.style.animationPlayState = 'paused';
            }
        });
    }, { threshold: 0.1 });
    const pageSections = document.querySelectorAll('.page-section');
    pageSections.forEach(section => {
        pageSectionObserver.observe(section);
    });

    // Split Screen Loader - Centered for all devices with reduced timing
    const splitLoader = document.getElementById('splitLoader');
    const websiteContent = document.getElementById('websiteContent');
    const mainHeader = document.getElementById('mainHeader');
    let percentage = 0;

    // Simulate loading progress with faster increments
    const percentageInterval = setInterval(() => {
        // Larger increment for faster loading
        percentage += 25;
        if (percentage > 100) percentage = 100;

        if (percentage >= 100) {
            clearInterval(percentageInterval);

            // Hide the split loader after loading is complete with reduced delay
            setTimeout(() => {
                splitLoader.classList.add('hide');

                // Show website content immediately after split animation starts
                setTimeout(() => {
                    websiteContent.classList.add('visible');

                    // Show the header
                    setTimeout(() => {
                        mainHeader.classList.add('visible');
                    }, 300);

                    // Add loaded class to body to remove bubble background
                    document.body.classList.add('loaded');

                    // Reset for next use
                    setTimeout(() => {
                        splitLoader.style.display = 'none';
                        percentage = 0;
                        splitLoader.classList.remove('hide');
                    }, 1200);
                }, 300); // Short delay to ensure smooth transition
            }, 150); // Further reduced delay
        }
    }, 50); // Much faster interval for quickest loading

    // Mobile header hide/show on scroll
    let lastScrollTop = 0;
    const header = document.getElementById('mainHeader');
    let scrollTimeout;

    // Function to handle scroll behavior
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Only apply this behavior on mobile devices
        if (window.innerWidth <= 768) {
            // Clear any existing timeout
            clearTimeout(scrollTimeout);

            // If scrolling down and past the header height
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                // Scrolling down - hide header
                header.classList.add('header-hidden');
            } else {
                // Scrolling up - show header
                header.classList.remove('header-hidden');
            }

            // Set a timeout to ensure header stays visible when user stops scrolling
            scrollTimeout = setTimeout(function () {
                header.classList.remove('header-hidden');
            }, 3000);
        }

        // Update last scroll position
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Add resize event listener to handle orientation changes
    window.addEventListener('resize', function () {
        // If switching to desktop view, ensure header is visible
        if (window.innerWidth > 768) {
            header.classList.remove('header-hidden');
        }
    });
});
