/**
 * Gyanendra Kushwaha - Personal Portfolio JavaScript
 * Handles Theme Toggling, Sticky Nav, Mobile Menu, Project Filters, Modals, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Dark & Light Mode) with LocalStorage
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Initialize theme from storage or default to dark
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!prefersDarkScheme.matches) {
    // If system prefers light and user hasn't explicitly set, default to dark for aesthetic,
    // or respect system preference:
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Navbar & Active Section Highlighting
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // Sticky background toggle
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active nav link highlight
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // --------------------------------------------------------------------------
  // 3. Mobile Hamburger Menu Toggle
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
      const isExpanded = hamburgerBtn.classList.contains('active');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking nav items
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Animated Skills Progress Bar on Scroll
  // --------------------------------------------------------------------------
  const skillProgressFills = document.querySelectorAll('.skill-progress-fill');
  
  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.skill-progress-fill');
          progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress');
            bar.style.width = `${targetWidth}%`;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsObserver.observe(skillsSection);
    }
  } else {
    // Fallback for older browsers
    skillProgressFills.forEach(bar => {
      const targetWidth = bar.getAttribute('data-progress');
      bar.style.width = `${targetWidth}%`;
    });
  }

  // --------------------------------------------------------------------------
  // 6. Skills Category Tabs Filter
  // --------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const selectedCategory = tab.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Projects Filter Tabs
  // --------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Interactive Project Details Modal
  // --------------------------------------------------------------------------
  const projectData = {
    '1': {
      title: 'Modern Responsive Agency Website',
      category: 'Web Development',
      badge: 'HTML5 & CSS3',
      image: 'assets/images/project-responsive-web.svg',
      description: 'A fully responsive, multi-section web layout designed and built from scratch using semantic HTML5 and modern CSS3. Features custom flexbox and grid layouts, modern typography pairing, subtle hover transitions, and a mobile-first responsive layout.',
      tech: ['HTML5', 'CSS3', 'Flexbox & CSS Grid', 'Responsive Media Queries'],
      features: [
        'Multi-column layout with fluid responsiveness for mobile, tablet, and desktop',
        'Clean semantic markup optimized for accessibility and structure',
        'CSS variables for modular color management',
        'Attractive call-to-action sections with smooth hover interactions'
      ],
      role: 'Frontend Layout & Responsive Web Design',
      timeline: 'College Project & Practice'
    },
    '2': {
      title: 'Glassmorphic Login & Authentication UI',
      category: 'UI/UX Design',
      badge: 'UI/UX & CSS',
      image: 'assets/images/project-login-ui.svg',
      description: 'An aesthetic authentication interface concept exploring glassmorphism design trends. Built with multi-layered backdrop filters, glowing blurred gradient ambient spheres, and refined micro-interactions.',
      tech: ['UI/UX Design', 'CSS Glassmorphism', 'Backdrop Filters', 'Micro-interactions'],
      features: [
        'Frosted glass card interface with translucent borders',
        'Form input states with glowing indigo focus outlines',
        'Interactive password reveal and remember-me controls',
        'High visual polish suitable for modern SaaS products'
      ],
      role: 'UI Concept, Visual Design & CSS Styling',
      timeline: 'Personal Design Experiment'
    },
    '3': {
      title: 'Personal Developer & Designer Portfolio',
      category: 'Web Development',
      badge: 'HTML, CSS & JS',
      image: 'assets/images/project-portfolio.svg',
      description: 'A comprehensive personal website showcasing technical and creative capabilities. Built with clean vanilla technologies featuring Dark/Light mode theme switching, interactive project modals, responsive navigation, and smooth scroll animations.',
      tech: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Local Storage API'],
      features: [
        'Interactive dark and light theme switching with state persistence',
        'Modular modal popups for deep-dive project previews',
        'Custom SVG graphic assets optimized for ultra-fast load times',
        'Fully accessible keyboard navigation and mobile drawer'
      ],
      role: 'Complete Design & Development',
      timeline: 'Live Portfolio (Current)'
    },
    '4': {
      title: 'Brand Identity & Visual Graphics Pack',
      category: 'Graphic Design',
      badge: 'Graphic Design',
      image: 'assets/images/project-graphic-design.svg',
      description: 'A cohesive brand identity system including minimalist logo mark development, complementary color palette formulation, typography hierarchy guidelines, and social media promotional banner mockups.',
      tech: ['Graphic Design', 'Logo Creation', 'Color Theory', 'Typography', 'Visual Composition'],
      features: [
        'Geometric vector mark with versatile monochrome & gradient variations',
        'Harmonious four-tier color scheme with hex code specifications',
        'Social media banner templates adhering to standard aspect ratios',
        'Consistent visual hierarchy across print and digital media'
      ],
      role: 'Graphic Designer & Visual Conceptualizer',
      timeline: 'Creative Portfolio Project'
    },
    '5': {
      title: 'Mobile App UI/UX Prototype',
      category: 'UI/UX Design',
      badge: 'Adobe XD',
      image: 'assets/images/project-mobile-ux.svg',
      description: 'A mobile finance and transaction management application concept created in Adobe XD. Explores user flows from low-fidelity wireframing to interactive high-fidelity screens with reusable UI components.',
      tech: ['Adobe XD', 'UI/UX Wireframing', 'Prototyping', 'Component Architecture'],
      features: [
        'User onboarding flow with clean card-based screen progression',
        'Financial balance overview and categorized spending breakdown charts',
        'Transaction list with visual debit/credit indicators',
        'Interactive click-through prototype simulating realistic mobile transitions'
      ],
      role: 'UI/UX Designer (Adobe XD)',
      timeline: 'UI/UX Case Study'
    },
    '6': {
      title: 'Motion Graphics & Video Editing Reel',
      category: 'Creative & Video',
      badge: 'Ae & Premiere Pro',
      image: 'assets/images/project-video-editing.svg',
      description: 'A creative showcase reel demonstrating video editing and motion graphics techniques. Features dynamic cut pacing, audio waveform synchronization, lower thirds, title cards, and transition effects built in Adobe Premiere Pro and After Effects.',
      tech: ['Adobe Premiere Pro', 'Adobe After Effects', 'Motion Graphics', 'Audio Sync'],
      features: [
        'Multi-track video sequencing and seamless cut transitions',
        'Custom kinetic typography and animated title sequences in After Effects',
        'Color grading and ambient sound design alignment',
        'Optimized export settings for YouTube, Reels, and presentation playback'
      ],
      role: 'Video Editor & Motion Designer',
      timeline: 'Creative Media Showcase'
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalRole = document.getElementById('modal-role');
  const modalTimeline = document.getElementById('modal-timeline');
  const modalTechStack = document.getElementById('modal-tech-stack');
  const modalFeaturesList = document.getElementById('modal-features-list');

  const openProjectModal = (projectId) => {
    const data = projectData[projectId];
    if (!data || !modalBackdrop) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalCategory.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalRole.textContent = data.role;
    modalTimeline.textContent = data.timeline;

    // Render tech tags
    modalTechStack.innerHTML = '';
    data.tech.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = item;
      modalTechStack.appendChild(tag);
    });

    // Render feature bullet points
    modalFeaturesList.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.style.fontSize = '0.9rem';
      li.style.color = 'var(--text-secondary)';
      li.style.marginBottom = '0.4rem';
      li.textContent = `• ${feat}`;
      modalFeaturesList.appendChild(li);
    });

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  };

  const closeProjectModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Attach event listener to all "View Project" buttons
  document.querySelectorAll('.open-modal-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = button.getAttribute('data-id');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Contact Form Validation & Submission Simulation
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      // Basic validation
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill out all required fields.');
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      // Button loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Sending Message...
      `;

      // Simulate sending delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Show success toast
        if (formToast) {
          formToast.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. I'll get back to you soon.`;
          formToast.classList.add('active');

          setTimeout(() => {
            formToast.classList.remove('active');
          }, 6000);
        }

        contactForm.reset();
      }, 1000);
    });
  }

  // --------------------------------------------------------------------------
  // 10. Scroll Reveal Animation for Elements
  // --------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('in-view'));
  }

  // --------------------------------------------------------------------------
  // 11. Dynamic Year in Footer
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
