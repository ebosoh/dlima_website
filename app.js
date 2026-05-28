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
    const blogsData = {
        "1": {
            title: "Don’t start a dental clinic in Kenya right now (Unless you understand this first)",
            date: "Wednesday, March 15, 2026",
            tag: "Clinic Startups",
            img: "https://melvindlima.com/data/files/150326.jpg",
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
            img: "https://melvindlima.com/data/files/dentist-4373290_1280.jpg",
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
            img: "https://melvindlima.com/data/files/150326.jpg",
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
            img: "https://melvindlima.com/data/files/dentalclinicstartup.jpg",
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

    // Open Blog Modal
    document.querySelectorAll('.open-blog-btn').forEach(btn => {
        btn.addEventListener('click', () => {
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
        });
    });

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
        blogCards.forEach(card => {
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
        const animateCounter = () => {
            const target = parseInt(counterElement.getAttribute('data-target'), 10);
            const duration = 1800; // 1.8 seconds duration
            const startTime = performance.now();
            
            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad formula: progress * (2 - progress)
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                counterElement.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counterElement.textContent = target; // Ensure it ends exactly at target
                }
            };
            
            requestAnimationFrame(updateCount);
        };
        
        // Premium Intersection Observer trigger
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(counterElement);
        } else {
            // Fallback for older browsers
            animateCounter();
        }
    }
});
