/* ==========================================
   BIRTHDAY CELEBRATION — veryniceglory
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    //  NAVBAR — Scroll & Mobile Toggle
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navAnchors.forEach(a => {
        a.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        });
    }
    window.addEventListener('scroll', updateActiveLink);


    // ==========================================
    //  CONFETTI CANVAS (Hero Background)
    // ==========================================
    const confettiCanvas = document.getElementById('confettiCanvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let confettiParticles = [];

    function resizeConfetti() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);

    class ConfettiPiece {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
            this.size = Math.random() * 6 + 3;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            this.opacity = Math.random() * 0.6 + 0.2;
            const colors = ['#FF2D95', '#8B5CF6', '#FFD700', '#22d3ee', '#ff6b9d', '#a855f7'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > confettiCanvas.height + 20) this.reset();
        }
        draw() {
            confettiCtx.save();
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.globalAlpha = this.opacity;
            confettiCtx.fillStyle = this.color;
            if (this.shape === 'rect') {
                confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            } else {
                confettiCtx.beginPath();
                confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                confettiCtx.fill();
            }
            confettiCtx.restore();
        }
    }

    for (let i = 0; i < 80; i++) {
        const piece = new ConfettiPiece();
        piece.y = Math.random() * confettiCanvas.height;
        confettiParticles.push(piece);
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();


    // ==========================================
    //  LIVE BIRTHDAY COUNTER (Hours/Mins/Secs of today)
    // ==========================================
    function updateLiveCounter() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const elapsed = now - startOfDay;

        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const mins = Math.floor((elapsed / (1000 * 60)) % 60);
        const secs = Math.floor((elapsed / 1000) % 60);

        const elH = document.getElementById('liveHours');
        const elM = document.getElementById('liveMins');
        const elS = document.getElementById('liveSecs');
        if (elH) elH.textContent = String(hours).padStart(2, '0');
        if (elM) elM.textContent = String(mins).padStart(2, '0');
        if (elS) elS.textContent = String(secs).padStart(2, '0');
    }
    updateLiveCounter();
    setInterval(updateLiveCounter, 1000);


    // ==========================================
    //  SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    //  STAT COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                if (target > 0) animateCounter(el, target);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }


    // ==========================================
    //  WISH FORM + BIRTHDAY WALL
    // ==========================================
    const wishForm = document.getElementById('wishForm');
    const wishNameInput = document.getElementById('wishName');
    const wishMessageInput = document.getElementById('wishMessage');
    const charCount = document.getElementById('charCount');
    const emojiPicker = document.getElementById('emojiPicker');
    const wishSubmitBtn = document.getElementById('wishSubmitBtn');
    const wishesWall = document.getElementById('wishesWall');
    const wallEmptyMsg = document.getElementById('wallEmptyMsg');
    const wishCountBadge = document.getElementById('wishCountBadge');
    let selectedEmoji = '🎈';
    let wishes = [];

    // Load wishes from backend (Real-time Sync)
    async function loadWishes(isPolling = false) {
        try {
            const res = await fetch('/.netlify/functions/get-wishes');
            if (!res.ok) throw new Error(`Backend returned ${res.status}`);
            
            const data = await res.json();
            if (data.wishes && data.wishes.length > wishes.length) {
                wishes = data.wishes;
                wishesWall.innerHTML = '';
                wishes.forEach(w => renderWish(w));
                updateWishCount();
            }
        } catch (e) {
            console.error('Failed to load real-time wishes:', e);
            // Fallback to localStorage if API fails or backend isn't reachable
            if (!isPolling && wishes.length === 0) {
                const stored = localStorage.getItem('birthdayWishes_veryniceglory');
                if (stored) {
                    wishes = JSON.parse(stored);
                    wishes.forEach(w => renderWish(w));
                    updateWishCount();
                }
            }
        }
    }
    
    // Initial load
    loadWishes();
    
    // Poll for new wishes every 15 seconds to keep the wall alive!
    setInterval(() => loadWishes(true), 15000);

    // Char count
    wishMessageInput.addEventListener('input', () => {
        charCount.textContent = wishMessageInput.value.length;
    });

    // Emoji picker
    emojiPicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.emoji-option');
        if (!btn) return;
        emojiPicker.querySelectorAll('.emoji-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedEmoji = btn.dataset.emoji;
    });

    // Submit wish
    wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = wishNameInput.value.trim();
        const message = wishMessageInput.value.trim();
        if (!name || !message) return;

        const wish = {
            name,
            message,
            emoji: selectedEmoji,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        // Optimistically update the UI locally
        wishes.push(wish);
        renderWish(wish);
        updateWishCount();

        // Save to localStorage as a fallback backup
        localStorage.setItem('birthdayWishes_veryniceglory', JSON.stringify(wishes));

        // Submit to the real-time backend
        try {
            const btnOriginalText = wishSubmitBtn.textContent;
            wishSubmitBtn.textContent = '⏳ Posting...';
            
            await fetch('/.netlify/functions/submit-wish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wish)
            });
        } catch (err) {
            console.error('Failed to sync wish to server:', err);
            // It's still in the UI and localStorage, so it won't disappear for this user
        }

        // Reset form
        wishForm.reset();
        charCount.textContent = '0';
        emojiPicker.querySelectorAll('.emoji-option').forEach(b => b.classList.remove('active'));
        emojiPicker.querySelector('[data-emoji="🎈"]').classList.add('active');
        selectedEmoji = '🎈';

        // Button feedback
        wishSubmitBtn.textContent = '✅ Wish Posted!';
        wishSubmitBtn.classList.add('success');
        setTimeout(() => {
            wishSubmitBtn.textContent = '🎉 Post Your Wish';
            wishSubmitBtn.classList.remove('success');
        }, 2000);
    });

    function renderWish(wish) {
        wallEmptyMsg.classList.add('hidden');
        const card = document.createElement('div');
        card.className = 'wish-card glass-card';
        card.innerHTML = `
            <div class="wish-emoji">${wish.emoji}</div>
            <p class="wish-text">"${escapeHtml(wish.message)}"</p>
            <span class="wish-from">— ${escapeHtml(wish.name)}</span>
            <span class="wish-time">${wish.time}</span>
        `;
        wishesWall.prepend(card);
    }

    function updateWishCount() {
        wishCountBadge.textContent = wishes.length;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }


    // ==========================================
    //  FUN FACTS QUIZ
    // ==========================================
    const quizQuestions = [
        {
            question: "🎂 What date is veryniceglory's birthday?",
            options: ["January 1st", "March 20th", "December 25th", "July 4th"],
            correct: 1,
            funFact: "That's right! March 20th — the first day of spring! 🌸"
        },
        {
            question: "🎨 What's veryniceglory's superpower?",
            options: ["Flying", "Making everything look legendary", "Time travel", "Invisibility"],
            correct: 1,
            funFact: "Obviously! veryniceglory turns everything into gold ✨"
        },
        {
            question: "🎵 What gets veryniceglory hyped?",
            options: ["Elevator music", "Good vibes & great beats", "Complete silence", "Car alarms"],
            correct: 1,
            funFact: "Good vibes only! The playlist stays immaculate 🎶"
        },
        {
            question: "🔥 How would friends describe veryniceglory?",
            options: ["Very quiet and shy", "100% that person — the blueprint", "Boring and predictable", "Average at best"],
            correct: 1,
            funFact: "The blueprint, the original, the one and only! 👑"
        },
        {
            question: "🚀 What's veryniceglory's motto?",
            options: ["'Meh, good enough'", "'I'll do it tomorrow'", "'No limits, just glory'", "'Let someone else do it'"],
            correct: 2,
            funFact: "No limits, just glory — it's in the name! 🏆"
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let quizActive = true;

    const quizCard = document.getElementById('quizCard');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizProgressBar = document.getElementById('quizProgressBar');
    const quizProgressText = document.getElementById('quizProgressText');
    const quizScore = document.getElementById('quizScore');
    const quizRestartBtn = document.getElementById('quizRestartBtn');

    function loadQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            showScore();
            return;
        }

        const q = quizQuestions[currentQuestion];
        quizQuestion.textContent = q.question;
        quizOptions.innerHTML = '';
        quizFeedback.className = 'quiz-feedback';
        quizFeedback.style.display = 'none';

        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
            btn.addEventListener('click', () => selectAnswer(i));
            quizOptions.appendChild(btn);
        });

        // Update progress
        const progress = ((currentQuestion) / quizQuestions.length) * 100;
        quizProgressBar.style.width = progress + '%';
        quizProgressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    }

    function selectAnswer(index) {
        if (!quizActive) return;
        quizActive = false;

        const q = quizQuestions[currentQuestion];
        const buttons = quizOptions.querySelectorAll('.quiz-option-btn');

        // Mark all disabled
        buttons.forEach(b => b.classList.add('disabled'));

        // Highlight correct and wrong
        buttons[q.correct].classList.add('correct');
        if (index !== q.correct) {
            buttons[index].classList.add('wrong');
        } else {
            score++;
        }

        // Show feedback
        quizFeedback.style.display = 'block';
        if (index === q.correct) {
            quizFeedback.className = 'quiz-feedback show correct';
            quizFeedback.textContent = `✅ Correct! ${q.funFact}`;
        } else {
            quizFeedback.className = 'quiz-feedback show wrong';
            quizFeedback.textContent = `❌ Not quite! ${q.funFact}`;
        }

        // Auto-advance after delay
        setTimeout(() => {
            currentQuestion++;
            quizActive = true;
            loadQuestion();
        }, 2500);
    }

    function showScore() {
        quizCard.style.display = 'none';
        quizScore.style.display = 'block';
        quizProgressBar.style.width = '100%';
        quizProgressText.textContent = 'Quiz Complete!';

        const pct = Math.round((score / quizQuestions.length) * 100);
        const scoreEmoji = document.getElementById('scoreEmoji');
        const scoreTitle = document.getElementById('scoreTitle');
        const scoreText = document.getElementById('scoreText');
        const scoreBar = document.getElementById('scoreBar');

        if (pct === 100) {
            scoreEmoji.textContent = '🏆';
            scoreTitle.textContent = 'Perfect Score!';
            scoreText.textContent = `You got ${score}/${quizQuestions.length} — You truly know veryniceglory inside and out! 👑`;
        } else if (pct >= 60) {
            scoreEmoji.textContent = '🌟';
            scoreTitle.textContent = 'Great Job!';
            scoreText.textContent = `You got ${score}/${quizQuestions.length} — You know veryniceglory pretty well! 🎉`;
        } else {
            scoreEmoji.textContent = '💪';
            scoreTitle.textContent = 'Nice Try!';
            scoreText.textContent = `You got ${score}/${quizQuestions.length} — Time to get to know veryniceglory better! 😄`;
        }

        setTimeout(() => {
            scoreBar.style.width = pct + '%';
        }, 300);
    }

    quizRestartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        quizActive = true;
        quizCard.style.display = 'block';
        quizScore.style.display = 'none';
        loadQuestion();
    });

    // Initialize quiz
    loadQuestion();


    // ==========================================
    //  PLAYLIST (Visual Interaction & Audio)
    // ==========================================
    const tracks = document.querySelectorAll('.track');
    const vinylRecord = document.getElementById('vinylRecord');
    const equalizer = document.getElementById('equalizer');
    let activeTrack = null;
    
    // YouTube API Integration
    let ytPlayer = null;
    let isPlayerReady = false;

    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('youtubePlayer', {
            height: '0',
            width: '0',
            playerVars: {
                'playsinline': 1,
                'rel': 0,
                'showinfo': 0,
                'controls': 0
            },
            events: {
                'onReady': () => { isPlayerReady = true; },
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerStateChange(event) {
        // When video ends (state = 0), reset the UI
        if (event.data === 0 && activeTrack) {
             activeTrack.classList.remove('active');
             activeTrack.querySelector('.play-btn').textContent = '▶';
             vinylRecord.classList.remove('spinning');
             equalizer.classList.remove('active');
             activeTrack = null;
        }
    }

    tracks.forEach(track => {
        const playBtn = track.querySelector('.play-btn');
        function toggleTrack() {
            if (!isPlayerReady || !ytPlayer) {
                console.log("Player not ready yet");
                return;
            }

            const ytId = track.dataset.ytId;
            // Catch error if getVideoData isn't available right away
            let currentVideoId = '';
            try {
                currentVideoId = ytPlayer.getVideoData().video_id || '';
            } catch(e) {}

            if (activeTrack === track) {
                // Pause current track
                track.classList.remove('active');
                playBtn.textContent = '▶';
                vinylRecord.classList.remove('spinning');
                equalizer.classList.remove('active');
                activeTrack = null;
                ytPlayer.pauseVideo();
            } else {
                // Play selected track
                tracks.forEach(t => {
                    t.classList.remove('active');
                    t.querySelector('.play-btn').textContent = '▶';
                });
                
                track.classList.add('active');
                playBtn.textContent = '⏸';
                vinylRecord.classList.add('spinning');
                equalizer.classList.add('active');
                activeTrack = track;
                
                if (currentVideoId !== ytId) {
                    ytPlayer.loadVideoById(ytId);
                } else {
                    ytPlayer.playVideo();
                }
            }
        }
        playBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleTrack(); });
        track.addEventListener('click', toggleTrack);
    });


    // ==========================================
    //  CAKE — BLOW OUT CANDLES
    // ==========================================
    const candles = document.querySelectorAll('.candle');
    const blowAllBtn = document.getElementById('blowAllBtn');
    const cakeInstruction = document.getElementById('cakeInstruction');
    const wishModal = document.getElementById('wishModal');
    const wishCloseBtn = document.getElementById('wishCloseBtn');
    let candlesBlown = 0;

    function blowCandle(candle) {
        if (!candle.classList.contains('blown')) {
            candle.classList.remove('lit');
            candle.classList.add('blown');
            candlesBlown++;
            if (candlesBlown === candles.length) allCandlesBlown();
        }
    }

    candles.forEach(c => c.addEventListener('click', () => blowCandle(c)));

    blowAllBtn.addEventListener('click', () => {
        let delay = 0;
        candles.forEach(c => { setTimeout(() => blowCandle(c), delay); delay += 150; });
    });

    function allCandlesBlown() {
        cakeInstruction.textContent = '🎉 You did it! Make a wish, veryniceglory! 🎉';
        cakeInstruction.style.color = '#FFD700';
        launchFireworks();
        setTimeout(() => wishModal.classList.add('active'), 2500);
    }

    wishCloseBtn.addEventListener('click', () => wishModal.classList.remove('active'));
    wishModal.addEventListener('click', (e) => { if (e.target === wishModal) wishModal.classList.remove('active'); });


    // ==========================================
    //  FIREWORKS CANVAS
    // ==========================================
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    let fwCtx = null, fireworks = [], fwParticles = [], fwAnimating = false;

    function initFireworks() {
        const rect = fireworksCanvas.parentElement.getBoundingClientRect();
        fireworksCanvas.width = rect.width;
        fireworksCanvas.height = rect.height;
        fwCtx = fireworksCanvas.getContext('2d');
    }

    class Firework {
        constructor(x, targetY) {
            this.x = x; this.y = fireworksCanvas.height;
            this.targetY = targetY; this.speed = 4 + Math.random() * 3; this.alive = true;
            this.color = ['#FF2D95', '#8B5CF6', '#FFD700', '#22d3ee', '#ff6b9d'][Math.floor(Math.random() * 5)];
        }
        update() { this.y -= this.speed; if (this.y <= this.targetY) { this.alive = false; this.explode(); } }
        explode() {
            const count = 40 + Math.floor(Math.random() * 30);
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i;
                fwParticles.push(new FWParticle(this.x, this.y, angle, 1 + Math.random() * 4, this.color));
            }
        }
        draw() {
            fwCtx.beginPath(); fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color; fwCtx.fill();
        }
    }

    class FWParticle {
        constructor(x, y, angle, speed, color) {
            this.x = x; this.y = y;
            this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
            this.gravity = 0.04; this.friction = 0.98; this.opacity = 1;
            this.color = color; this.size = 2 + Math.random() * 2;
        }
        update() { this.vx *= this.friction; this.vy *= this.friction; this.vy += this.gravity; this.x += this.vx; this.y += this.vy; this.opacity -= 0.012; }
        draw() {
            fwCtx.globalAlpha = Math.max(this.opacity, 0);
            fwCtx.beginPath(); fwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color; fwCtx.fill(); fwCtx.globalAlpha = 1;
        }
    }

    function launchFireworks() {
        initFireworks(); fwAnimating = true;
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const x = Math.random() * fireworksCanvas.width * 0.8 + fireworksCanvas.width * 0.1;
                fireworks.push(new Firework(x, Math.random() * fireworksCanvas.height * 0.4 + 30));
            }, i * 300);
        }
        animateFireworks();
        setTimeout(() => { fwAnimating = false; }, 6000);
    }

    function animateFireworks() {
        if (!fwAnimating && fireworks.length === 0 && fwParticles.length === 0) return;
        fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        fireworks = fireworks.filter(fw => { fw.update(); if (fw.alive) fw.draw(); return fw.alive; });
        fwParticles = fwParticles.filter(p => { p.update(); p.draw(); return p.opacity > 0; });
        requestAnimationFrame(animateFireworks);
    }


    // ==========================================
    //  SHARE BUTTONS
    // ==========================================
    const shareURL = window.location.href;
    const shareText = '🎂 Happy Birthday veryniceglory! Check out this celebration! 🎉';

    document.getElementById('shareWhatsapp')?.addEventListener('click', () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareURL)}`, '_blank');
    });
    document.getElementById('shareTwitter')?.addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`, '_blank');
    });
    document.getElementById('shareCopy')?.addEventListener('click', () => {
        navigator.clipboard.writeText(shareURL).then(() => {
            const btn = document.getElementById('shareCopy');
            const original = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => { btn.textContent = original; }, 2000);
        });
    });


    // ==========================================
    //  HERO FLOATING PARTICLES
    // ==========================================
    const particleContainer = document.getElementById('heroParticles');
    const particleEmojis = ['✨', '⭐', '🌟', '💖', '🎈', '🎉', '🎊', '🎁'];
    for (let i = 0; i < 20; i++) {
        const el = document.createElement('span');
        el.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
        el.style.cssText = `
            position: absolute;
            font-size: ${12 + Math.random() * 20}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${0.2 + Math.random() * 0.4};
            pointer-events: none;
            animation: float ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(el);
    }

    // ==========================================
    //  BACK TO TOP ROCKET
    // ==========================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.classList.remove('launching'); // reset rocket state safely
            }
        });

        backToTopBtn.addEventListener('click', () => {
            // Rocket launch animation
            backToTopBtn.classList.add('launching');
            
            // Fast rocket scroll
            const startY = window.scrollY;
            const duration = 300; // 300ms speed for a rocket
            const startTime = performance.now();

            function scrollTick(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // easeInCubic for exponential rocket feel
                const easeProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startY * (1 - easeProgress));
                
                if (progress < 1) {
                    requestAnimationFrame(scrollTick);
                }
            }
            requestAnimationFrame(scrollTick);
        });
    }

    // ==========================================
    //  CHARITY HEART POLLING
    // ==========================================
    const charityAmountEl = document.getElementById('charityAmount');
    let currentTotal = 0;

    async function fetchCharityCount() {
        try {
            // Fetch from the Netlify Function
            const response = await fetch('/.netlify/functions/get-charity-count');
            if (!response.ok) return;
            
            const data = await response.json();
            const newTotal = data.total || 0;
            
            if (newTotal > currentTotal) {
                currentTotal = newTotal;
                
                // Format the amount (assuming dollars, but could be adjusted based on the Snippe configuration)
                charityAmountEl.textContent = `$${currentTotal.toLocaleString()}`;
                
                // Add pop animation for excitement
                charityAmountEl.classList.remove('updated');
                // Trigger reflow to restart animation
                void charityAmountEl.offsetWidth;
                charityAmountEl.classList.add('updated');
                
                setTimeout(() => {
                    charityAmountEl.classList.remove('updated');
                }, 1000);
            } else if (currentTotal === 0 && newTotal === 0) {
                 charityAmountEl.textContent = `$0`;
            }
        } catch (error) {
            console.error('Error fetching charity count:', error);
        }
    }

    // Initial fetch and set interval
    if (charityAmountEl) {
        fetchCharityCount();
        // Poll every 10 seconds to keep UI synced without spamming the function
        setInterval(fetchCharityCount, 10000);
    }

});
