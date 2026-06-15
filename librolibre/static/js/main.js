'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ============================================
    // MOBILE NAV TOGGLE
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // TOAST NOTIFICATION SYSTEM
    // ============================================
    window.showToast = (message, type = 'info') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const config = {
            success: { icon: '✓', class: 'toast-success' },
            error: { icon: '✗', class: 'toast-error' },
            info: { icon: 'ℹ', class: 'toast-info' },
            warning: { icon: '⚠', class: 'toast-warning' }
        };

        const { icon, toastClass } = config[type] || config.info;

        const toast = document.createElement('div');
        toast.className = `toast ${toastClass}`;
        toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
    };

    // ============================================
    // FILTER CHIPS
    // ============================================
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const bar = chip.closest('.filter-bar');
            if (bar) {
                bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            }
            chip.classList.add('active');

            const filter = chip.dataset.filter;
            const cards = document.querySelectorAll('.book-card');

            cards.forEach(card => {
                if (!filter || filter === 'todos') {
                    card.style.display = 'block';
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = '';
                } else {
                    const status = card.dataset.status;
                    if (status === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'none';
                        card.offsetHeight;
                        card.style.animation = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            const visible = document.querySelectorAll('.book-card[style*="display: block"], .book-card:not([style*="display: none"])');
            if (visible.length === 0 && cards.length > 0) {
                const empty = document.querySelector('.book-grid .empty-state');
                if (empty) {
                    empty.style.display = 'block';
                }
            }
        });
    });

    // ============================================
    // SEARCH
    // ============================================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                const cards = document.querySelectorAll('.book-card');
                let hasVisible = false;

                cards.forEach(card => {
                    const title = (card.querySelector('.book-title')?.textContent || '').toLowerCase();
                    const author = (card.querySelector('.book-author')?.textContent || '').toLowerCase();

                    const match = title.includes(query) || author.includes(query);

                    if (!query || match) {
                        card.style.display = 'block';
                        if (query && match) {
                            card.style.borderColor = 'rgba(108, 92, 231, 0.2)';
                        } else {
                            card.style.borderColor = '';
                        }
                        hasVisible = true;
                    } else {
                        card.style.display = 'none';
                    }
                });

                const emptyMsg = document.querySelector('.empty-state');
                if (emptyMsg && query) {
                    emptyMsg.style.display = hasVisible ? 'none' : 'block';
                    if (!hasVisible) {
                        emptyMsg.querySelector('h3').textContent = 'Sin resultados';
                        emptyMsg.querySelector('p').textContent = `No encontramos "${query}" en el catálogo`;
                    }
                }

                if (!query) {
                    cards.forEach(c => c.style.borderColor = '');
                }
            }, 250);
        });
    }

    // ============================================
    // BOOK CARD CLICK
    // ============================================
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.closest('.btn') || e.target.closest('a')) return;

            const title = this.querySelector('.book-title')?.textContent || 'este libro';
            showToast(`Has seleccionado "${title}"`, 'info');
        });
    });

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count) || 0;
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    const profileStatNumbers = document.querySelectorAll('.profile-stat-number');

    if (profileStatNumbers.length) {
        const profileCounterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count) || 0;
                    animateSimpleCounter(el, target);
                    profileCounterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        profileStatNumbers.forEach(el => profileCounterObserver.observe(el));
    }

    function animateCounter(element, target) {
        if (target === 0) {
            element.textContent = '0+';
            return;
        }

        let current = 0;
        const duration = 1500;
        const steps = 40;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + '+';
        }, stepTime);
    }

    function animateSimpleCounter(element, target) {
        if (target === 0) {
            element.textContent = '0';
            return;
        }

        let current = 0;
        const duration = 1000;
        const steps = 30;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, stepTime);
    }

    // ============================================
    // FORM VALIDATION
    // ============================================
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const requiredFields = form.querySelectorAll('[required]');
            let valid = true;
            const firstError = [];

            requiredFields.forEach(field => {
                const value = field.value.trim();

                if (!value) {
                    field.classList.add('error');
                    valid = false;
                    if (!firstError.length) firstError.push(field);

                    const label = form.querySelector(`label[for="${field.id}"]`);
                    const fieldName = label ? label.textContent.trim() : field.name || 'campo';
                    showToast(`El campo "${fieldName}" es obligatorio`, 'error');
                } else {
                    field.classList.remove('error');

                    if (field.type === 'email' && value.includes('@')) {
                        const domain = value.split('@')[1];
                        if (domain && !domain.includes('.')) {
                            field.classList.add('error');
                            valid = false;
                            if (!firstError.length) firstError.push(field);
                            showToast('Ingresa un correo electrónico válido', 'error');
                        }
                    }
                }
            });

            if (!valid) {
                e.preventDefault();
                if (firstError.length) {
                    firstError[0].focus();
                    firstError[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    const originalText = submitBtn.textContent.trim();
                    submitBtn.innerHTML = '<span class="toast-icon">⏳</span> Procesando...';

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }, 8000);
                }

                showToast('Formulario enviado con éxito', 'success');
            }
        });

        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                }
            });

            field.addEventListener('blur', () => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    field.classList.add('error');
                }
            });
        });
    });

    // ============================================
    // FILE INPUT PREVIEW
    // ============================================
    const fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const group = input.closest('.form-group');

            if (file) {
                const nameEl = group?.querySelector('.file-name');
                if (nameEl) {
                    nameEl.textContent = file.name;
                    nameEl.title = file.name;
                }

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const preview = group?.querySelector('.file-preview');
                        if (preview) {
                            preview.src = ev.target.result;
                            preview.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    });

    // ============================================
    // PASSWORD TOGGLE
    // ============================================
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (input) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                btn.textContent = isPassword ? '🙈' : '👁';
            }
        });
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // KEYBOARD SHORTCUT
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            const search = document.getElementById('searchInput');
            const active = document.activeElement;
            if (search && active !== search && !['INPUT', 'TEXTAREA', 'SELECT'].includes(active?.tagName)) {
                e.preventDefault();
                search.focus();
            }
        }

        if (e.key === 'Escape') {
            const openNav = document.querySelector('.nav-links.open');
            if (openNav) {
                document.querySelector('.nav-toggle')?.click();
            }

            const focused = document.querySelector('input:focus, textarea:focus');
            if (focused) {
                focused.blur();
            }
        }
    });

    console.log('%c📚 LibroLibre', 'font-size:1.5rem;font-weight:bold;color:#6C5CE7');
    console.log('%cPlataforma de intercambio de libros', 'font-size:0.9rem;color:#636E72');
    console.log('%cPresiona "/" para buscar rápidamente', 'font-size:0.8rem;color:#B2BEC3');

});
