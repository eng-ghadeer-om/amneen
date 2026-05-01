// --- 1. STATE & TRANSLATION MANAGEMENT ---
// Using a dictionary allows us to flip the entire UI instantly without page reloads.
const i18n = {
    en: {
        title: "AMNEEN",
        panic: "Quick Clear",
        lang: "عربي",
        discreetOn: "Discreet Mode",
        discreetOff: "Normal Mode",
        subLanding: "Nothing is saved. Everything is temporary.",
        placeholder: "The canvas is yours. No one is watching, and nothing is saved. What is weighing on your heart right now?",
        btnBurn: "Release to the Canvas",
        sosText: "Need support?",
        sosLink: "Whispers of Serenity (Oman)",
        subSomatic: "Take a deep breath. Notice the tension in your shoulders. Exhale, and let it go with the words.",
        subReframing: "Ready to let go? Watch your worries transform into something peaceful.",
        subRelease: "It is gone.<br><br>You are safe.",
        subClear: "Canvas cleared. You are safe."
    },
    ar: {
        title: "آمنين",
        panic: "مسح سريع",
        lang: "English",
        discreetOn: "الوضع الخفي",
        discreetOff: "الوضع العادي",
        subLanding: "لا شيء يُحفظ. كل شيء مؤقت.",
        placeholder: "المساحة لك. لا أحد يراقب، ولا شيء يُحفظ. ما الذي يثقل قلبك الآن؟",
        btnBurn: "حررها للوحة",
        sosText: "تحتاج إلى دعم؟",
        sosLink: "همسات السكون (عُمان)",
        subSomatic: "خذ نفساً عميقاً. لاحظ التوتر في كتفيك. ازفر، ودعه يرحل مع الكلمات.",
        subReframing: "مستعد للتخلي؟ راقب همومك تتحول إلى شيء هادئ.",
        subRelease: "لقد رحلت.<br><br>أنت في أمان.",
        subClear: "تم مسح اللوحة. أنت في أمان."
    }
};

let currentLang = 'en';
let currentSubState = 'subLanding'; // Tracks which subtitle is currently active
let somaticTriggered = false;

// DOM Elements mapped once for performance
const els = {
    title: document.getElementById('app-title'),
    panicBtn: document.getElementById('panic-btn'),
    langBtn: document.getElementById('lang-btn'),
    discreetBtn: document.getElementById('discreet-btn'),
    subtitle: document.getElementById('dynamic-subtitle'),
    canvas: document.getElementById('canvas'),
    burnBtn: document.getElementById('burn-btn'),
    sosText: document.getElementById('sos-text'),
    sosLink: document.getElementById('sos-link'),
    pattern: document.getElementById('geometric-overlay')
};

// --- 2. BILINGUAL TOGGLE LOGIC ---
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    
    // Switch document direction for native Arabic flow
    document.documentElement.dir = currentLang === 'en' ? 'ltr' : 'rtl';
    
    // Update static UI elements
    els.title.innerText = i18n[currentLang].title;
    els.panicBtn.innerText = i18n[currentLang].panic;
    els.langBtn.innerText = i18n[currentLang].lang;
    els.canvas.placeholder = i18n[currentLang].placeholder;
    els.burnBtn.innerText = i18n[currentLang].btnBurn;
    els.sosText.innerText = i18n[currentLang].sosText;
    els.sosLink.innerText = i18n[currentLang].sosLink;

    // Update dynamic elements based on their current state
    els.subtitle.innerHTML = i18n[currentLang][currentSubState];
    
    // Sync discreet button text
    const isDiscreet = document.body.classList.contains('discreet-mode');
    els.discreetBtn.innerText = isDiscreet ? i18n[currentLang].discreetOff : i18n[currentLang].discreetOn;
}

// --- 3. DISCREET MODE ---
function toggleDiscreetMode() {
    document.body.classList.toggle('discreet-mode');
    const isDiscreet = document.body.classList.contains('discreet-mode');
    els.discreetBtn.innerText = isDiscreet ? i18n[currentLang].discreetOff : i18n[currentLang].discreetOn;
}

// --- 4. THE PSYCHOLOGICAL JOURNEY (TYPING & SOMATIC PROMPT) ---
els.canvas.addEventListener('input', () => {
    // Phase 1 Logic: Trigger somatic prompt smoothly at 30 chars
    if (els.canvas.value.length > 30 && !somaticTriggered) {
        updateSubtitle('subSomatic');
        somaticTriggered = true; 
    }
});

// Helper function to handle smooth text transitions
function updateSubtitle(stateKey, customStyles = {}) {
    currentSubState = stateKey;
    els.subtitle.style.opacity = '0'; 
    
    setTimeout(() => {
        els.subtitle.innerHTML = i18n[currentLang][stateKey];
        Object.assign(els.subtitle.style, customStyles); // Apply any special styling (like font size changes)
        els.subtitle.style.opacity = '1';
    }, 1000); // Wait for fade out before changing text
}

// --- 5. THE BURN & RELEASE FLOW ---
function initiateBurn() {
    if(els.canvas.value.trim() === "") return; // Don't burn empty air

    // 1. Externalization State: Blur and float text away
    els.canvas.classList.add('dissolving');
    if (els.pattern) els.pattern.classList.add('show-pattern');

    // Hide the button smoothly
    els.burnBtn.style.pointerEvents = "none";
    els.burnBtn.style.opacity = "0";
    
    // 2. Cognitive Reframing State
    updateSubtitle('subReframing');

    // 3. Complete Release State
    setTimeout(() => {
        els.canvas.value = ""; 
        els.canvas.style.visibility = "hidden";
        els.burnBtn.style.display = "none";
        
        // Final calming message, styled slightly larger
        updateSubtitle('subRelease', { fontSize: "1.5rem", marginTop: "30px" });
    }, 4000); // Ties perfectly to the 4s CSS transition
}

// --- 6. EMERGENCY CLEAR (PANIC) ---
function emergencyClear() {
    // 1. Instant Data Wipe
    els.canvas.value = "";
    
    // 2. Reset DOM visual states instantly
    els.canvas.classList.remove('dissolving');
    els.canvas.style.visibility = "visible";
    
    els.burnBtn.style.display = "inline-block";
    els.burnBtn.style.opacity = "1";
    els.burnBtn.style.pointerEvents = "auto";
    
    if (els.pattern) els.pattern.classList.remove('show-pattern');
    
    // 3. Reset to safety prompt
    updateSubtitle('subClear', { fontSize: "1.1rem", marginTop: "0px" });
    
    // Allow the somatic journey to happen again
    somaticTriggered = false; 
}
