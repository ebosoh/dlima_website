/* ==========================================================================
   Dr. Melvin D'Lima professional interaction scripting
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Theme Switcher (Light / Dark Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light');
    
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.className;
        const newTheme = currentTheme === 'theme-light' ? 'theme-dark' : 'theme-light';
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'theme-dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // ==========================================================================
    // 2. Mobile Responsive Menu
    // ==========================================================================
    const hamburgerBtn = document.getElementById('menu-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================================================
    // 3. Navbar Scroll Highlight & Glass Effect
    // ==========================================================================
    const mainNavbar = document.getElementById('main-navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNavbar.classList.add('scrolled');
        } else {
            mainNavbar.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Dynamic Navigation Scroll Tracking
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollY = window.pageYOffset + 120; // offset navbar height
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // 4. Interactive Modified Dental Anxiety Scale (MDAS) Quiz
    // ==========================================================================
    const mdasForm = document.getElementById('mdas-form');
    const mdasResultPanel = document.getElementById('mdas-result');
    const mdasScoreVal = document.getElementById('mdas-score-val');
    const mdasInterpretation = document.getElementById('mdas-interpretation');
    const resetMdasBtn = document.getElementById('reset-mdas');
    
    // Radio button styling toggle
    const radioLabels = document.querySelectorAll('.radio-label');
    radioLabels.forEach(label => {
        const input = label.querySelector('input');
        input.addEventListener('change', () => {
            // Uncheck other elements in this question
            const siblings = label.parentElement.querySelectorAll('.radio-label');
            siblings.forEach(sib => sib.classList.remove('checked'));
            if (input.checked) {
                label.classList.add('checked');
            }
        });
    });

    mdasForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Sum values of 5 questions
        let score = 0;
        for (let i = 1; i <= 5; i++) {
            const answer = document.querySelector(`input[name="mdas-q${i}"]:checked`);
            if (answer) {
                score += parseInt(answer.value, 10);
            }
        }
        
        mdasScoreVal.textContent = score;
        
        let interpretationText = '';
        if (score >= 5 && score <= 11) {
            interpretationText = `<strong>Minimal to Low Anxiety (Score ${score}/25)</strong>: You are generally comfortable with standard dental care. Regular checkups and standard procedures should not pose major emotional concerns. Keep up the preventive health visits!`;
        } else if (score >= 12 && score <= 18) {
            interpretationText = `<strong>Moderate Dental Anxiety (Score ${score}/25)</strong>: You feel notable apprehension sitting in the waiting room or facing clinical procedures. We recommend informing your practitioner about this score. Simple breathing techniques, open clinical communication, or scheduling shorter appointments can help ease your stress.`;
        } else {
            interpretationText = `<strong>High Dental Anxiety / Phobia (Score ${score}/25)</strong>: You have severe anxiety or a significant clinical phobia. High fear causes many patients to postpone essential treatment until severe infections set in. <strong>Dr. Melvin D'Lima recommends trying the non-pharmaceutical Dentacalm Patch</strong>. Applied 3 days prior to your clinical visit, it stabilizes cognitive anxiety parameters without systemic drug side-effects. Get in touch with us to coordinate with your dentist.`;
        }
        
        mdasInterpretation.innerHTML = interpretationText;
        mdasForm.classList.add('d-none');
        mdasResultPanel.classList.remove('d-none');
    });
    
    resetMdasBtn.addEventListener('click', () => {
        mdasForm.reset();
        radioLabels.forEach(sib => sib.classList.remove('checked'));
        mdasResultPanel.classList.add('d-none');
        mdasForm.classList.remove('d-none');
    });

    // ==========================================================================
    // 5. Data Repositories (Blogs & Poems)
    // ==========================================================================
    let blogsData = {
        "1": {
            title: "Don’t start a dental clinic in Kenya right now (Unless you understand this first)",
            date: "Wednesday, March 15, 2026",
            tag: "Clinic Startups",
            img: "150326.jpg",
            content: `
                <p>The world feels unstable. The Middle East is on fire. Oil prices threaten to rise. Household budgets everywhere are tightening. When the cost of living rises, something has to give. Very often, dental care is the first thing people postpone.</p>
                <p>So if you are a dentist thinking of opening a clinic today, the obvious advice might be this: <strong>Don’t do it.</strong></p>
                <p>Yes. Don’t start a dental clinic. Not until you understand the forces shaping the dental marketplace. Let me explain what I saw last week alone. I had conversations with several dentists in Kenya. Each conversation told a different story. Some clinic owners want to sell part or all of their shares. Some senior dentists are winding down. They are finishing their patient cases and spending more time in their retirement homes. Then there is a third group. Young dentists. Well-trained. Ambitious. Financially capable. They want to take the plunge and start their own clinics.</p>
                <p>Something else has changed. The demographics of private dentists in Kenya are shifting. More women are entering private practice and leadership positions in dentistry. That shift will reshape the industry.</p>
                <h3>Dentistry: Necessity or luxury?</h3>
                <p>Dentists will tell you something important: Dentistry is a necessity. They are right. Pain, infection, and trauma demand immediate treatment. However, for many families struggling with rising food, rent, and fuel prices, dentistry can feel like a luxury. When household budgets tighten, people postpone cosmetic treatments, routine check-ups, and elective procedures, waiting until something hurts.</p>
                <h3>The paradox every dentist must understand</h3>
                <p>Even as household budgets tighten, the overall demand for dentistry is rising due to:</p>
                <ol>
                    <li><strong>Rapid population growth</strong> across Kenya's urban areas.</li>
                    <li><strong>Greater awareness</strong> of preventive oral health and aesthetics.</li>
                    <li><strong>Advanced clinical capabilities</strong> like dental implants, cosmetics, and orthodontics expanding the scope of private work.</li>
                </ol>
                <p>Opening a clinic today makes perfect sense, but only if it is executed strategically.</p>
                <h3>The 4 Pillars of Clinical Practice Strategy</h3>
                <p>A successful clinic rests on four pillars: <strong>Staff, Systems, Strategy, and Structure</strong>. Many practitioners buy expensive dental chairs and sign leases without considering these pillars. Avoid that backward approach.</p>
                <p>If you are planning to open a clinic, or scale your existing practice, get the strategy right. Starting a dental clinic is easy; building one that survives the next decade is something else entirely.</p>
            `
        },
        "2": {
            title: "Dentists — are you leaving your KMPDC licence to chance?",
            date: "Wednesday, April 15, 2026",
            tag: "Practice Strategy",
            img: "dentist-4373290_1280.jpg",
            content: `
                <p>Regulatory compliance is the bedrock of clinical longevity. The Kenya Medical Practitioners and Dentists Council (KMPDC) enforces strict guidelines concerning facility standards, safety protocols, and professional credentialing.</p>
                <p>Many clinic owners focus so heavily on patient acquisition and cosmetic dentistry that they leave basic licensing tasks to the last minute. This creates immense vulnerability. If an inspector walks into your facility, are your policies up to date?</p>
                <h3>Critical Licensing Safeguards:</h3>
                <ul>
                    <li><strong>Annual Practice Licences</strong>: Ensure all resident doctors and consulting specialists have active KMPDC licenses pinned clearly in the reception area.</li>
                    <li><strong>Clinical Waste Protocols</strong>: Maintain verified waste collection agreements with licensed hazardous waste firms. Proper separation of biological and chemical waste is non-negotiable.</li>
                    <li><strong>Facility Audits</strong>: Periodically review clinic square footage, lighting guidelines, autoclave tracking charts, and emergency exit signage.</li>
                </ul>
                <p>As a public health professional and advisory chair, I regularly help healthcare clinics structure compliance calendars. Never let administrative oversight compromise your professional clinical standing.</p>
            `
        },
        "3": {
            title: "Navigating Pre-Election Strategies & Insurance Riders",
            date: "Friday, February 27, 2026",
            tag: "Finance & Insurance",
            img: "150326.jpg",
            content: `
                <p>January and February are over. As you march into a new month as a dental clinic owner in Kenya, how did you score on navigating pre-election cycles and forecasted changes in dental insurance riders to medical policies?</p>
                <p>These lessons were heavily reinforced during our recent breakfast meeting in Westlands organized alongside industry experts <strong>Martin Mutuku and Joyce Kayima, FCCA of Founders Freedom</strong>.</p>
                <h3>The Four Operational Scorecard Indicators:</h3>
                <ol>
                    <li><strong>Strategy</strong>: Navigating policy transitions and shifts in insurer packages. Undergoing robust scenario planning.</li>
                    <li><strong>Staffing</strong>: Recruiting for clinical efficiency and administrative effectiveness rather than emotional convenience.</li>
                    <li><strong>Systems</strong>: Ensuring clinical, operational, and financial frameworks are completely automated.</li>
                    <li><strong>Structure</strong>: Do you have a competent Board of Advisors? Are your 2025 income tax returns, accounts receivable, and monthly bank reconciliations complete?</li>
                </ol>
                <p>Bottom line: Oversight, accountability, and strong board direction are essential for your clinic’s survival. Take time to review your financial policy frameworks today.</p>
            `
        },
        "4": {
            title: "If It Ain’t Broke, Don’t Fix It? Why That Phrase Is Dangerous",
            date: "Saturday, November 8, 2025",
            tag: "Practice Strategy",
            img: "dentalclinicstartup.jpg",
            content: `
                <p>In dentistry, waiting for a system to break down before upgrading is catastrophic. A sudden server crash during peak morning hours can corrupt digital patient records. A failing compressor can stall three active surgeries. An outdated accounting practice can mask cash flow leakages for months.</p>
                <p>Proactive clinic audits and system redundancies are not luxuries; they are fundamental to scaling operations safely.</p>
                <h3>Upgrade Before the Failure Point:</h3>
                <ul>
                    <li><strong>Automate Records Backups</strong>: Secure daily cloud backups to protect clinical x-rays and financial history.</li>
                    <li><strong>Equipment Schedules</strong>: Set strict monthly preventative maintenance checks for dental chairs, suction lines, autoclaves, and diagnostic machinery.</li>
                    <li><strong>Reconcile Daily</strong>: Don't wait until the end of the quarter. Match physical invoices against banking tallies every evening.</li>
                </ul>
                <p>Shift your dental clinic operations from a reactive firefight to a highly structured, scalable business system.</p>
            `
        }
    };

    // Load blogs dynamically from server API or local blogs.json file
    async function fetchDynamicBlogs() {
        try {
            let res = await fetch('/api/blogs');
            if (!res.ok) throw new Error('API fetch failed');
            const list = await res.json();
            if (Array.isArray(list) && list.length > 0) {
                updateBlogsFromList(list);
            }
        } catch (e) {
            try {
                let res = await fetch('blogs.json');
                if (res.ok) {
                    const list = await res.json();
                    if (Array.isArray(list) && list.length > 0) {
                        updateBlogsFromList(list);
                    }
                }
            } catch (err) {
                console.log('Using default inline blogs repository');
            }
        }
    }

    function updateBlogsFromList(list) {
        blogsData = {};
        const grid = document.getElementById('blogs-grid');
        let html = '';

        list.forEach(article => {
            if (article.status && article.status !== 'published') return;
            const id = String(article.id);
            blogsData[id] = {
                title: article.title,
                date: article.date,
                tag: article.tag,
                img: article.img || '150326.jpg',
                content: article.content
            };

            const cat = article.category || ((article.tag || '').toLowerCase().includes('startup') ? 'startup' : (((article.tag || '').toLowerCase().includes('insurance') ? 'insurance' : 'strategy')));
            const searchTitle = (article.title || '').toLowerCase();
            const excerpt = article.excerpt || (article.content ? article.content.replace(/<[^>]+>/g, '').substring(0, 180) + '...' : '');

            html += `
                <article class="blog-card" data-category="${cat}" data-title="${searchTitle}">
                    <div class="blog-image">
                        <img src="${article.img || '150326.jpg'}" alt="${article.title}">
                        <span class="blog-tag">${article.tag || 'Strategy'}</span>
                    </div>
                    <div class="blog-body">
                        <span class="blog-date">${article.date}</span>
                        <h3>${article.title}</h3>
                        <p>${excerpt}</p>
                        <button class="btn btn-text open-blog-btn" data-blog-id="${id}">Read Strategic Outline <i class="fas fa-arrow-right"></i></button>
                    </div>
                </article>
            `;
        });

        if (grid && html) {
            grid.innerHTML = html;
            rebindBlogModalButtons();
        }
    }

    fetchDynamicBlogs();

    const poemsData = {
        "1": {
            title: "The Silent Healer",
            body: `Between the clinical lights that shine so bright,
                   And the silent fears that walk the quiet night,
                   There lies a bridge of safety, calm and absolute.
                   
                   A simple touch, a quiet word of grace,
                   To soothe the pacing mind within this clinical space.
                   No longer driven by the ancient chemical fright,
                   We restore the smile, bringing back the inner light.
                   
                   For dentistry is more than steel and stone,
                   It is holding hands, ensuring you are not alone.`
        },
        "2": {
            title: "Matters of Money & Mind",
            body: `We stack the ledgers, count the clinic coins,
                   Yet forget the steady hand that daily joins,
                   The strategic pillars of a future plan.
                   
                   A doctor’s labor spans a shifting lease,
                   But family wealth requires lasting peace,
                   Built on systems structured to outlast the active run.
                   
                   NLP reminds the nervous clinical mind:
                   The greatest wealth is deep inside aligned.`
        }
    };

    const legalData = {
        "terms": {
            title: "Terms of Use",
            content: `
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using this website, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.</p>

                <h3>2. Scope of Services & Disclaimer</h3>
                <p>Dr. Melvin D'Lima provides dental practice consulting, certified NLP executive coaching, and career mentoring services. All information, resources, and articles published on this website are for general educational, strategic, and informational purposes only. They do not constitute clinical, financial, tax, legal, or licensed medical advice. Clients are encouraged to perform their own due diligence or consult with appropriate professional bodies (such as the KMPDC) before making business or health transitions.</p>

                <h3>3. Intellectual Property</h3>
                <p>All content on this website, including text, blogs, poems, logos, branding, graphics, and layout, is the intellectual property of Dr. Melvin D'Lima and TechBrain, unless otherwise noted. Unauthorized reproduction, distribution, or commercial exploitation of this material is strictly prohibited without prior written consent.</p>

                <h3>4. Third-Party Links</h3>
                <p>This website contains links to external, third-party sites (e.g., Dental Aptitude College, Naturally Patch Ltd, Progressive Credit, etc.). Dr. Melvin D'Lima does not own, control, or assume liability for the content, privacy policies, or practices of any third-party websites.</p>

                <h3>5. Limitation of Liability</h3>
                <p>In no event shall Dr. Melvin D'Lima, his affiliates, or TechBrain be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with your use of this website, its services, or reliance on any strategy described herein.</p>

                <h3>6. Governing Law</h3>
                <p>These terms are governed by and construed in accordance with the laws of Kenya. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.</p>
            `
        },
        "privacy": {
            title: "Privacy Policy",
            content: `
                <h3>1. Information We Collect</h3>
                <p>We collect information you voluntarily provide when using our contact forms, subscribing to updates, or scheduling consulting sessions. This information may include your name, email address, phone number, and details related to your practice or coaching inquiry.</p>

                <h3>2. How We Use Your Information</h3>
                <p>We use the collected information solely to:
                <ul>
                    <li>Respond directly to your inquiries and support requests.</li>
                    <li>Schedule and customize your coaching and consulting sessions.</li>
                    <li>Send occasional newsletters, updates, or educational articles if you have opted in.</li>
                </ul>
                </p>

                <h3>3. Data Storage & Protection</h3>
                <p>Your privacy is paramount. All client information is stored securely on local hard disks and encrypted storage systems. We do not sell, trade, rent, or lease your personal information to third parties. Access to your personal data is restricted to authorized personnel managing your consultations.</p>

                <h3>4. Cookies & Log Files</h3>
                <p>This website may use standard cookies to improve your user experience, track page navigation, and capture basic web analytics (such as browser type and session duration). You can configure your browser to reject cookies, though some interactive elements of the website may change.</p>

                <h3>5. Your Rights</h3>
                <p>You have the right to request access to the personal data we hold about you, request corrections to inaccurate information, or request the deletion of your data from our systems. To exercise these rights, please email us directly at <strong>info@melvindlima.com</strong>.</p>

                <h3>6. Changes to this Policy</h3>
                <p>We reserve the right to modify this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date.</p>
            `
        }
    };

    // ==========================================================================
    // 6. Interactive Modal Handlers (Blogs & Poems)
    // ==========================================================================
    const blogModal = document.getElementById('blog-modal');
    const blogCloseBtn = document.getElementById('blog-modal-close');
    const modalBlogTitle = document.getElementById('modal-blog-title');
    const modalBlogDate = document.getElementById('modal-blog-date');
    const modalBlogTag = document.getElementById('modal-blog-tag');
    const modalBlogImg = document.getElementById('modal-blog-img');
    const modalBlogBody = document.getElementById('modal-blog-body');
    
    const poemModal = document.getElementById('poem-modal');
    const poemCloseBtn = document.getElementById('poem-modal-close');
    const modalPoemTitle = document.getElementById('modal-poem-title');
    const modalPoemBody = document.getElementById('modal-poem-body');

    const legalModal = document.getElementById('legal-modal');
    const legalCloseBtn = document.getElementById('legal-modal-close');
    const modalLegalTitle = document.getElementById('modal-legal-title');
    const modalLegalBody = document.getElementById('modal-legal-body');
    const termsLink = document.getElementById('terms-link');
    const privacyLink = document.getElementById('privacy-link');

    // Open Blog Modal
    function rebindBlogModalButtons() {
        document.querySelectorAll('.open-blog-btn').forEach(btn => {
            // Remove previous listener by replacing element or adding single event listener
            btn.onclick = () => {
                const blogId = btn.getAttribute('data-blog-id');
                const data = blogsData[blogId];
                
                if (data) {
                    modalBlogTitle.textContent = data.title;
                    modalBlogDate.textContent = data.date;
                    modalBlogTag.textContent = data.tag;
                    modalBlogImg.src = data.img;
                    modalBlogImg.alt = data.title;
                    modalBlogBody.innerHTML = data.content;
                    
                    blogModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // prevent scrolling
                }
            };
        });
    }
    rebindBlogModalButtons();

    // Close Blog Modal
    blogCloseBtn.addEventListener('click', () => {
        blogModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Open Poem Modal
    document.querySelectorAll('.read-poem-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const poemId = btn.getAttribute('data-poem-id');
            const data = poemsData[poemId];
            
            if (data) {
                modalPoemTitle.textContent = data.title;
                modalPoemBody.textContent = data.body;
                
                poemModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Poem Modal
    poemCloseBtn.addEventListener('click', () => {
        poemModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Open Legal Modal (Terms of Use)
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const data = legalData["terms"];
            if (data) {
                modalLegalTitle.textContent = data.title;
                modalLegalBody.innerHTML = data.content;
                legalModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Open Legal Modal (Privacy Policy)
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            const data = legalData["privacy"];
            if (data) {
                modalLegalTitle.textContent = data.title;
                modalLegalBody.innerHTML = data.content;
                legalModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close Legal Modal
    if (legalCloseBtn) {
        legalCloseBtn.addEventListener('click', () => {
            legalModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modals on clicking overlay background
    window.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            blogModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (e.target === poemModal) {
            poemModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (e.target === legalModal) {
            legalModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ==========================================================================
    // 7. Dynamic Strategy Blog Search and Category Filters
    // ==========================================================================
    const blogSearchInput = document.getElementById('blog-search');
    const filterChips = document.querySelectorAll('.chip');
    const blogCards = document.querySelectorAll('.blog-card');
    
    let activeCategory = 'all';
    let searchQuery = '';

    // Search Input Event
    blogSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterBlogs();
    });

    // Category Chip Event
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.getAttribute('data-category');
            filterBlogs();
        });
    });

    function filterBlogs() {
        const currentCards = document.querySelectorAll('.blog-card');
        currentCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title');
            
            const categoryMatches = (activeCategory === 'all' || category === activeCategory);
            const searchMatches = (searchQuery === '' || title.includes(searchQuery));
            
            if (categoryMatches && searchMatches) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
            }
        });
    }

    // ==========================================================================
    // 8. Contact Form Validator & Interactive Submissions
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const successCard = document.getElementById('contact-success');
    const sendAnotherBtn = document.getElementById('btn-another-inquiry');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple client side checks
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const service = document.getElementById('form-service').value;
        const message = document.getElementById('form-message').value.trim();
        
        if (name && email && phone && service && message) {
            // Elegant micro-animation for submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Securing Connection...';
            
            setTimeout(() => {
                contactForm.classList.add('d-none');
                successCard.classList.remove('d-none');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1200);
        }
    });

    sendAnotherBtn.addEventListener('click', () => {
        contactForm.reset();
        successCard.classList.add('d-none');
        contactForm.classList.remove('d-none');
    });

    // ==========================================================================
    // 9. Interactive Experience Counter Animation
    // ==========================================================================
    const counterElement = document.getElementById('exp-counter');
    if (counterElement) {
        let animationFrameId = null;
        let animated = false;
        
        const animateCounter = () => {
            if (animated) return;
            animated = true;
            
            const target = parseInt(counterElement.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds duration (feels punchy and premium)
            const startTime = performance.now();
            
            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad formula: progress * (2 - progress)
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                counterElement.textContent = currentValue;
                
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(updateCount);
                } else {
                    counterElement.textContent = target; // Ensure it ends exactly at target
                }
            };
            
            animationFrameId = requestAnimationFrame(updateCount);
        };
        
        // Premium Intersection Observer trigger
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter();
                        observer.unobserve(entry.target); // Stop observing once animated
                    }
                });
            }, { threshold: 0.05 }); // Lower threshold to ensure easy triggering
            
            observer.observe(counterElement);
        } else {
            // Fallback for older browsers
            animateCounter();
        }
        
        // Safety fallback: if it hasn't animated after 1.5 seconds, trigger it anyway
        setTimeout(() => {
            if (!animated) {
                animateCounter();
            }
        }, 1500);
    }

    // ==========================================================================
    // X. Video Advert Widget Controller
    // ==========================================================================
    const videoWidget = document.getElementById('video-advert-widget');
    const advertVideo = document.getElementById('advert-video');
    const closeWidgetBtn = document.getElementById('widget-close-btn');
    const muteWidgetBtn = document.getElementById('widget-mute-btn');
    const muteIcon = muteWidgetBtn ? muteWidgetBtn.querySelector('i') : null;

    if (videoWidget && advertVideo) {
        // Check if user dismissed the widget in this session
        const isDismissed = sessionStorage.getItem('video-advert-dismissed');
        if (isDismissed === 'true') {
            videoWidget.style.display = 'none';
        } else {
            // Handle Close Action
            if (closeWidgetBtn) {
                closeWidgetBtn.addEventListener('click', () => {
                    videoWidget.classList.add('dismissed');
                    sessionStorage.setItem('video-advert-dismissed', 'true');
                    // Pause video when dismissed to save bandwidth/CPU
                    advertVideo.pause();
                    // Remove from layout entirely after animation
                    setTimeout(() => {
                        videoWidget.style.display = 'none';
                    }, 600); // Matches transition-smooth (0.4s-0.6s)
                });
            }

            // Handle Mute/Unmute Toggle
            if (muteWidgetBtn && muteIcon) {
                muteWidgetBtn.addEventListener('click', () => {
                    if (advertVideo.muted) {
                        advertVideo.muted = false;
                        muteIcon.className = 'fas fa-volume-up';
                        muteWidgetBtn.setAttribute('aria-label', 'Mute Sound');
                    } else {
                        advertVideo.muted = true;
                        muteIcon.className = 'fas fa-volume-mute';
                        muteWidgetBtn.setAttribute('aria-label', 'Unmute Sound');
                    }
                });
            }

            // Browser Autoplay Policy Fallback handling
            // Modern browsers block autoplay with sound. We ensure it starts muted.
            advertVideo.muted = true; 
            
            // Programmatically trigger play in case browser blocked it
            const playPromise = advertVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Video autoplay failed or was prevented by browser:', error);
                    // Autoplay fallback: retry playing on any user interaction
                    const playOnInteraction = () => {
                        advertVideo.play();
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('touchstart', playOnInteraction);
                    };
                    document.addEventListener('click', playOnInteraction);
                    document.addEventListener('touchstart', playOnInteraction);
                });
            }
        }
    }
});
