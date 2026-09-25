// ==========================================================================
// Master Portfolio Controller — Akbar Darma Saputra, S.Tr.T.
// Exact Rivalta Architecture: Horizontal Accordion Deck & 3D Interactive
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initAccordionDeck();
    initTabCapsule();
    initHangingCard3D();
    initMobileNav();
    initModalHandlers();
    initCardSlideshow();
});

// 1. Horizontal Accordion Deck (Rivalta's Signature Drawing Deck)
function initAccordionDeck() {
    const cards = document.querySelectorAll('.accordion-card');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent collapsing if clicking an interactive action link inside expanded card
            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }

            if (!card.classList.contains('expanded')) {
                cards.forEach(c => c.classList.remove('expanded'));
                card.classList.add('expanded');
            }
        });
    });
}

// 2. Tab Capsule Switcher (Drawings & Projects, Achievements & ISO, Tools)
function initTabCapsule() {
    const tabs = document.querySelectorAll('.tab-pill-btn');
    const panels = document.querySelectorAll('.tab-content-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(p => {
                if (p.id === targetId) {
                    p.classList.remove('hidden');
                    p.classList.add('block');
                } else {
                    p.classList.add('hidden');
                    p.classList.remove('block');
                }
            });
        });
    });

    // Deep link support via hash (e.g. #tab-achievements)
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        const targetTab = document.querySelector(`.tab-pill-btn[data-tab="${initialHash}"]`);
        if (targetTab) targetTab.click();
    }
}

// 3. Hanging Photo 3D Tilt Effect on Mouse Movement (Rivalta Swivel)
function initHangingCard3D() {
    const card = document.getElementById('hanging-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 14;
        const rotateY = (x / (rect.width / 2)) * 14;

        card.style.transform = `perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}

// 4. Mobile Navigation Drawer
function initMobileNav() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });

        // Close on link click
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    }
}

// 5. Modal Controllers
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.openCertModal = function(data) {
    if (!data) return;
    const tagEl = document.getElementById('cert-modal-tag');
    const titleEl = document.getElementById('cert-modal-title');
    const issuerEl = document.getElementById('cert-modal-issuer');
    const regEl = document.getElementById('cert-modal-reg');
    const descEl = document.getElementById('cert-modal-desc');
    const imgEl = document.getElementById('cert-modal-img');
    const linkEl = document.getElementById('cert-modal-viewlink');

    if (tagEl) tagEl.textContent = data.tag || 'KREDENSIAL TERVERIFIKASI';
    if (titleEl) titleEl.textContent = data.title || 'Sertifikat';
    if (issuerEl) issuerEl.textContent = data.issuer || '';
    if (regEl) regEl.textContent = data.regNo || '-';
    if (descEl) descEl.textContent = data.desc || '';
    if (imgEl && data.imgSrc) {
        imgEl.src = data.imgSrc;
        imgEl.alt = data.title || 'Pratinjau Sertifikat';
    }
    if (linkEl && data.imgSrc) {
        linkEl.href = data.imgSrc;
    }
    openModal('modal-cert');
};

function initModalHandlers() {
    // Close modal on background click
    document.querySelectorAll('.spec-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.spec-modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// 6. Copy to Clipboard Toast
window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('copy-toast');
        const toastText = document.getElementById('toast-text');
        if (toast) {
            if (toastText) toastText.textContent = `${label} berhasil disalin: ${text}`;
            toast.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'pointer-events-none');
            }, 3000);
        }
    }).catch(err => {
        console.warn('Clipboard write failed:', err);
    });
};

// 7. Background Slideshow Controller (Auto Cross-Fade for CNC & BNI Project Cards)
function initCardSlideshow() {
    const slideshows = document.querySelectorAll('.card-bg-slideshow');
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.card-bg-slide');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }, 3600);
    });
}
