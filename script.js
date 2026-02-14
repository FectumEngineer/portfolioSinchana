/* ============================================
   SINCHANA L SHETTY - MODEL PORTFOLIO
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Preloader ----------
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            animateHero();
        }, 1500);
    });

    // Fallback in case load fires before DOMContentLoaded listener
    if (document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            animateHero();
        }, 1500);
    }

    // ---------- Custom Cursor ----------
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 4 + 'px';
            cursor.style.top = e.clientY - 4 + 'px';
            follower.style.left = e.clientX - 17.5 + 'px';
            follower.style.top = e.clientY - 17.5 + 'px';
        });

        const hoverTargets = document.querySelectorAll('a, button, .gallery-img-wrapper');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    // ---------- Hero Animation ----------
    function animateHero() {
        const heroImg = document.querySelector('.hero-img');
        if (heroImg) heroImg.classList.add('loaded');

        const heroElements = document.querySelectorAll('.hero-content [data-animate]');
        heroElements.forEach((el, i) => {
            const delay = parseInt(el.dataset.delay) || i * 200;
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, delay + 300);
        });
    }

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ---------- Mobile Menu ----------
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // ---------- Scroll Animations ----------
    const animatedElements = document.querySelectorAll('[data-animate]');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        // Don't observe hero elements (they animate separately)
        if (!el.closest('#hero')) {
            observer.observe(el);
        }
    });

    // Gallery items visibility
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    galleryItems.forEach(item => galleryObserver.observe(item));

    // ---------- Portfolio Filter ----------
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach((item, index) => {
                const categories = item.dataset.category;

                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hide');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // ---------- Lightbox ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let visibleImages = [];

    function updateVisibleImages() {
        visibleImages = [];
        galleryItems.forEach(item => {
            if (!item.classList.contains('hide')) {
                const img = item.querySelector('img');
                if (img) visibleImages.push(img.src);
            }
        });
        lightboxTotal.textContent = visibleImages.length;
    }

    function openLightbox(index) {
        updateVisibleImages();
        currentImageIndex = index;
        lightboxImg.src = visibleImages[currentImageIndex];
        lightboxCurrent.textContent = currentImageIndex + 1;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function navigateLightbox(direction) {
        currentImageIndex = (currentImageIndex + direction + visibleImages.length) % visibleImages.length;
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = visibleImages[currentImageIndex];
            lightboxCurrent.textContent = currentImageIndex + 1;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Calculate index among visible items
            let visibleIndex = 0;
            for (let i = 0; i < index; i++) {
                if (!galleryItems[i].classList.contains('hide')) {
                    visibleIndex++;
                }
            }
            openLightbox(visibleIndex);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ---------- Smooth Scroll for Nav Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- Image transition for lightbox ----------
    lightboxImg.style.transition = 'opacity 0.3s ease';

    // ---------- Touch Swipe for Lightbox ----------
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                navigateLightbox(1);  // Swipe left = next
            } else {
                navigateLightbox(-1); // Swipe right = prev
            }
        }
    }, { passive: true });

    // ---------- Prevent iOS Rubber Banding in Lightbox ----------
    lightbox.addEventListener('touchmove', (e) => {
        if (lightbox.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    // ---------- Disable Parallax on Mobile (performance) ----------
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
        window.addEventListener('scroll', () => {
            const heroImg = document.querySelector('.hero-img');
            if (heroImg) {
                const scrolled = window.scrollY;
                heroImg.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
            }
        });
    }

});
