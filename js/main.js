document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application');

    try {
        // Check if the scripts are loaded correctly
        if (typeof templates === 'undefined') {
            console.error('Templates object is not defined. Make sure templates.js is loaded correctly.');
            showToast('Error: Templates not loaded properly. Check console for details.', true);
            return;
        }
        
        // Create common elements like loading spinner and toast
        createCommonElements();
        
        // Initialize elements
        initializeElements();
        
        // Add event listeners to form controls
        addEventListeners();
        
        // Initialize templates
        initializeTemplates();
        
        // Set defaults
        setDefaults();
        
        // Initialize premium features
        initializePremiumFeatures();
        
        // Update preview on load
        updatePreview();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showToast('Error initializing application. Check console for details.', true);
    }
});

// Create common elements like loading spinner and toast
function createCommonElements() {
    // Add loading spinner for asynchronous operations
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading hidden';
    loadingEl.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingEl);
    
    // Add toast notification if it doesn't exist
    if (!document.getElementById('toast')) {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast';
        toastEl.id = 'toast';
        document.body.appendChild(toastEl);
    }
    
    // Create debug info panel if debug parameter is in URL
    if (window.location.search.includes('debug')) {
        const debugPanel = document.createElement('div');
        debugPanel.className = 'debug-info';
        debugPanel.id = 'debugInfo';
        debugPanel.innerHTML = 'Debug mode enabled';
        document.body.appendChild(debugPanel);
        
        // Update debug info
        updateDebugInfo();
        
        // Enable template and layout indicators
        const style = document.createElement('style');
        style.textContent = `
            .announcement-preview {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('Common elements created');
}

// Show toast notification
function showToast(message, isError = false) {
    console.log('Toast:', message, isError ? '(error)' : '');
    
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and style
    toast.textContent = message;
    
    if (isError) {
        toast.style.backgroundColor = '#d9534f';
    } else {
        toast.style.backgroundColor = 'var(--primary-color, #2a3b4c)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show loading spinner
function showLoading() {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
        loadingEl.classList.remove('hidden');
    } else {
        console.error('Loading element not found');
    }
}

// Hide loading spinner
function hideLoading() {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
        loadingEl.classList.add('hidden');
    } else {
        console.error('Loading element not found');
    }
}

// Handle logo upload
function handleLogoUpload(event) {
    console.log('Logo upload changed');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoElement = document.getElementById('announcementLogo');
            if (logoElement) {
                // Set background image
                logoElement.style.backgroundImage = `url(${e.target.result})`;
                logoElement.style.backgroundSize = 'cover';
                logoElement.style.backgroundPosition = 'center';
                logoElement.textContent = '';
                logoElement.classList.add('has-image');
                customLogoLoaded = true;
                console.log('Logo image loaded successfully');
            }
        };
        reader.readAsDataURL(file);
    }
}

// Global variables
let currentLanguage = 'english';
let currentTemplate = 'standard';
let currentLayout = 'default';
let customLogoLoaded = false;
let colorTheme = null;
let isPremium = false;

// Initialize key DOM elements
function initializeElements() {
    console.log('Initializing elements');
    
    // Create common UI elements
    createCommonElements();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize templates
    initializeTemplates();
    
    // Set default values
    setDefaults();
    
    // Initialize premium features
    initializePremiumFeatures();
    
    // Make preview elements editable
    makePreviewEditable();
    
    // Update debug info if enabled
    updateDebugInfo();
    
    console.log('Elements initialized successfully');
}

// Add event listeners to all form controls
function addEventListeners() {
    console.log('Adding event listeners to form controls');
    
    // Add listeners to all input elements
    const inputs = document.querySelectorAll('#announcementForm input, #announcementForm textarea, #announcementForm select');
    inputs.forEach(input => {
        if (input.id !== 'loadDataInput') { // Skip the file input for loading data
            input.addEventListener('input', function() {
                console.log('Added input listener to:', input.id);
                updatePreview();
            });
        }
    });
    
    // Add special handler for logo upload
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        logoUpload.addEventListener('change', handleLogoUpload);
    }
    
    // Add template selector event listener
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.addEventListener('change', function() {
            currentTemplate = this.value;
            console.log('Template changed to:', currentTemplate);
            applyTemplate();
        });
    }
    
    // Add layout selector event listener
    const layoutSelector = document.getElementById('layoutSelector');
    if (layoutSelector) {
        layoutSelector.addEventListener('change', function() {
            currentLayout = this.value;
            console.log('Layout changed to:', currentLayout);
            applyLayout(currentLayout);
        });
    }
    
    // Add click listeners to color theme options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Get theme colors from data attributes
            const primary = this.getAttribute('data-primary');
            const secondary = this.getAttribute('data-secondary');
            const accent = this.getAttribute('data-accent');
            
            // Update color inputs
            document.getElementById('primaryColor').value = primary;
            document.getElementById('secondaryColor').value = secondary;
            document.getElementById('accentColor').value = accent;
            
            // Update preview
            updatePreview();
        });
    });
    
    // Add click/change listeners to language options
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            languageOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update current language
            currentLanguage = this.getAttribute('data-lang');
            
            // Toggle language in UI
            toggleLanguage(currentLanguage);
            
            // Update preview
            updatePreview();
        });
    });
    
    // Add listener for reset button
    const resetButton = document.getElementById('resetForm');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            console.log('Added click listener to reset form button');
            resetForm();
        });
    }
    
    // Add listeners for export buttons
    const downloadPngButton = document.getElementById('downloadPng');
    if (downloadPngButton) {
        downloadPngButton.addEventListener('click', function() {
            console.log('Download PNG button clicked');
            const previewElement = document.querySelector('.announcement-preview');
            if (previewElement) {
                exportAsPNG(previewElement);
            } else {
                console.error('Preview element not found');
                showToast('Error: Preview element not found', true);
            }
        });
    }
    
    const downloadPdfButton = document.getElementById('downloadPdf');
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', function() {
            console.log('Download PDF button clicked');
            const previewElement = document.querySelector('.announcement-preview');
            if (previewElement) {
                exportAsPDF(previewElement);
            } else {
                console.error('Preview element not found');
                showToast('Error: Preview element not found', true);
            }
        });
    }
    
    console.log('Event listeners added successfully');
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    
    return { r, g, b };
}

// Set default values for the form
function setDefaults() {
    console.log('Setting defaults');
    
    // Set default date to today
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        dateInput.value = formattedDate;
    }
    
    // Set default logo text
    const logoTextInput = document.getElementById('logoTextInput');
    if (logoTextInput && !logoTextInput.value) {
        logoTextInput.value = 'RB';
    }
    
    // Set default title
    const titleInput = document.getElementById('titleInput');
    if (titleInput && !titleInput.value) {
        titleInput.value = 'Announcement Title';
    }
    
    // Set default signer info
    const signerNameInput = document.getElementById('signerNameInput');
    if (signerNameInput && !signerNameInput.value) {
        signerNameInput.value = 'John Doe';
    }
    
    const signerTitleInput = document.getElementById('signerTitleInput');
    if (signerTitleInput && !signerTitleInput.value) {
        signerTitleInput.value = 'Director';
    }
    
    const contactInfoInput = document.getElementById('contactInfoInput');
    if (contactInfoInput && !contactInfoInput.value) {
        contactInfoInput.value = 'Email: example@email.com | Phone: 555-1234';
    }
    
    // Set default content if empty
    const contentInput = document.getElementById('contentInput');
    if (contentInput && !contentInput.value) {
        contentInput.value = 'This is a sample announcement content. Replace this with your actual announcement text.';
    }
    
    // Update preview with defaults
    updatePreview();
    
    console.log('Defaults set successfully');
}

// Initialize premium features
function initializePremiumFeatures() {
    console.log('Initializing premium features');
    
    // Check if premium features are enabled (e.g., via localStorage or URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const hasPremiumParam = urlParams.has('premium');
    const hasPremiumStorage = localStorage.getItem('premiumEnabled') === 'true';
    
    isPremium = hasPremiumParam || hasPremiumStorage;
    
    if (isPremium) {
        console.log('Premium features are enabled');
        
        // Store premium state
        localStorage.setItem('premiumEnabled', 'true');
        
        // Enable premium templates and layouts in selectors
        const premiumTemplates = document.querySelectorAll('#templateSelector option[data-premium="true"]');
        premiumTemplates.forEach(option => {
            option.disabled = false;
        });
        
        const premiumLayouts = document.querySelectorAll('#layoutSelector option[data-premium="true"]');
        premiumLayouts.forEach(option => {
            option.disabled = false;
        });
        
        // Add premium badge to the header
        const header = document.querySelector('header');
        if (header && !document.querySelector('.premium-badge')) {
            const premiumBadge = document.createElement('div');
            premiumBadge.className = 'premium-badge';
            premiumBadge.textContent = 'PREMIUM';
            header.appendChild(premiumBadge);
            
            // Add premium badge styles
            if (!document.getElementById('premium-badge-style')) {
                const style = document.createElement('style');
                style.id = 'premium-badge-style';
                style.textContent = `
                    .premium-badge {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background-color: var(--secondary-color, gold);
                        color: var(--primary-color, #333);
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-size: 12px;
                        font-weight: bold;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    }
                `;
                document.head.appendChild(style);
            }
        }
    } else {
        console.log('Premium features are not enabled');
        
        // Disable premium templates and layouts in selectors
        const premiumTemplates = document.querySelectorAll('#templateSelector option[data-premium="true"]');
        premiumTemplates.forEach(option => {
            option.disabled = true;
        });
        
        const premiumLayouts = document.querySelectorAll('#layoutSelector option[data-premium="true"]');
        premiumLayouts.forEach(option => {
            option.disabled = true;
        });
    }
    
    console.log('Premium features initialization complete');
}

// Initialize templates
function initializeTemplates() {
    const previewContainer = document.querySelector('.announcement-preview');
    if (!previewContainer) {
        console.error('Preview container not found');
        return;
    }
    
    // Check for dropdown selectors (index.html)
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        currentTemplate = templateSelector.value || 'standard';
        console.log('Template selected from dropdown:', currentTemplate);
    } else {
        // Fallback to default
        currentTemplate = 'standard';
        console.log('Using default template:', currentTemplate);
    }
    
    // Check for dropdown layout selector (index.html)
    const layoutSelector = document.getElementById('layoutSelector');
    if (layoutSelector) {
        currentLayout = layoutSelector.value || 'default';
        console.log('Layout selected from dropdown:', currentLayout);
    } else {
        // Fallback to default
        currentLayout = 'default';
        console.log('Using default layout:', currentLayout);
    }
    
    // Apply template and layout
    applyTemplate();
    applyLayout(currentLayout);
}

// Apply template styling to preview
function applyTemplate() {
    console.log('Applying template');
    
    try {
        const previewContainer = document.querySelector('.announcement-preview');
        if (!previewContainer) {
            console.error('Preview container not found');
            return;
        }

        // Get selected template
        const templateSelector = document.getElementById('templateSelector');
        if (!templateSelector) {
            console.error('Template selector not found');
            return;
        }
        
        const selectedTemplate = templateSelector.value;
        currentTemplate = selectedTemplate;
        
        // Get template config
        const templateConfig = templates[selectedTemplate] || templates.standard;
        console.log('Template config:', templateConfig);
        
        // First reset styles to defaults
        previewContainer.style = '';
        
        // Remove all template classes
        for (const template in templates) {
            previewContainer.classList.remove(`template-${template}`);
        }
        
        // Add selected template class
        previewContainer.classList.add(`template-${selectedTemplate}`);
        
        // Apply fonts
        if (templateConfig.fonts) {
            document.documentElement.style.setProperty('--heading-font', Array.isArray(templateConfig.fonts) ? templateConfig.fonts[0] : templateConfig.fonts.heading);
            document.documentElement.style.setProperty('--body-font', Array.isArray(templateConfig.fonts) ? templateConfig.fonts[1] || templateConfig.fonts[0] : templateConfig.fonts.body);
        }
        
        // Apply colors
        if (templateConfig.colors) {
            document.documentElement.style.setProperty('--primary-color', templateConfig.colors.primary);
            document.documentElement.style.setProperty('--secondary-color', templateConfig.colors.secondary);
            document.documentElement.style.setProperty('--accent-color', templateConfig.colors.accent);
            
            // Update color RGB variables
            const primaryRGB = hexToRgb(templateConfig.colors.primary);
            const secondaryRGB = hexToRgb(templateConfig.colors.secondary);
            const accentRGB = hexToRgb(templateConfig.colors.accent);
            
            if (primaryRGB) document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
            if (secondaryRGB) document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}`);
            if (accentRGB) document.documentElement.style.setProperty('--accent-color-rgb', `${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}`);
            
            // Update color inputs
            const primaryColor = document.getElementById('primaryColor');
            const secondaryColor = document.getElementById('secondaryColor');
            const accentColor = document.getElementById('accentColor');
            
            if (primaryColor) primaryColor.value = templateConfig.colors.primary;
            if (secondaryColor) secondaryColor.value = templateConfig.colors.secondary;
            if (accentColor) accentColor.value = templateConfig.colors.accent;
        }
        
        // Apply styles
        if (templateConfig.styles) {
            if (templateConfig.styles.background) previewContainer.style.background = templateConfig.styles.background;
            if (templateConfig.styles.padding) previewContainer.style.padding = templateConfig.styles.padding;
            if (templateConfig.styles.border) previewContainer.style.border = templateConfig.styles.border;
            if (templateConfig.styles.borderLeft) previewContainer.style.borderLeft = templateConfig.styles.borderLeft;
            if (templateConfig.styles.outline) previewContainer.style.outline = templateConfig.styles.outline;
            if (templateConfig.styles.borderRadius) previewContainer.style.borderRadius = templateConfig.styles.borderRadius;
            if (templateConfig.styles.boxShadow) previewContainer.style.boxShadow = templateConfig.styles.boxShadow;
            if (templateConfig.styles.color) previewContainer.style.color = templateConfig.styles.color;
            
            // Advanced styles
            if (templateConfig.styles.backdropFilter) {
                previewContainer.style.backdropFilter = templateConfig.styles.backdropFilter;
                previewContainer.style.webkitBackdropFilter = templateConfig.styles.backdropFilter;
            }
        }
        
        // Apply template-specific effects after a small delay to ensure DOM updates
        setTimeout(() => {
            applyTemplateEffects(selectedTemplate, templateConfig);
            // Update debug info if enabled
            updateDebugInfo();
        }, 100);
        
        console.log('Template applied successfully');
        return true;
    } catch (error) {
        console.error('Error applying template:', error);
        return false;
    }
}

// Apply template-specific effects
function applyTemplateEffects(templateName, templateConfig) {
    console.log('Applying template effects for', templateName);
    const previewContainer = document.querySelector('.announcement-preview');
    if (!previewContainer) return;
    
    // Reset any existing effects
    removeAllTemplateEffects(previewContainer);
    
    // If no effects defined, return
    if (!templateConfig || !templateConfig.effects) return;
    
    const effects = templateConfig.effects;
    
    try {
        // Apply standard effects
        if (effects.softShadow) {
            previewContainer.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
        }
        
        if (effects.subtlePattern) {
            const patternOverlay = document.createElement('div');
            patternOverlay.className = 'pattern-overlay';
            patternOverlay.style.position = 'absolute';
            patternOverlay.style.top = '0';
            patternOverlay.style.left = '0';
            patternOverlay.style.width = '100%';
            patternOverlay.style.height = '100%';
            patternOverlay.style.opacity = '0.03';
            patternOverlay.style.zIndex = '0';
            patternOverlay.style.pointerEvents = 'none';
            patternOverlay.style.backgroundImage = 'radial-gradient(var(--primary-color) 1px, transparent 1px)';
            patternOverlay.style.backgroundSize = '20px 20px';
            previewContainer.prepend(patternOverlay);
        }
        
        // Apply minimal template effects
        if (effects.cleanLines) {
            const sections = previewContainer.querySelectorAll('.announcement-header, .announcement-body, .announcement-footer');
            sections.forEach(section => {
                section.style.position = 'relative';
                section.style.zIndex = '1';
            });
            
            previewContainer.style.letterSpacing = '0.3px';
        }
        
        if (effects.thinBorders) {
            const content = previewContainer.querySelector('.announcement-content');
            if (content) {
                content.style.borderTop = '1px solid rgba(var(--primary-color-rgb), 0.1)';
                content.style.borderBottom = '1px solid rgba(var(--primary-color-rgb), 0.1)';
                content.style.padding = '25px 0';
                content.style.margin = '25px 0';
            }
        }
        
        // Apply vibrant template effects
        if (effects.colorBurst) {
            // Add color burst elements
            const burstContainer = document.createElement('div');
            burstContainer.className = 'color-burst-container';
            burstContainer.style.position = 'absolute';
            burstContainer.style.top = '0';
            burstContainer.style.left = '0';
            burstContainer.style.width = '100%';
            burstContainer.style.height = '100%';
            burstContainer.style.overflow = 'hidden';
            burstContainer.style.zIndex = '0';
            burstContainer.style.opacity = '0.05';
            burstContainer.style.pointerEvents = 'none';
            
            // Add multiple color circles
            const colors = [
                'var(--primary-color)',
                'var(--secondary-color)',
                'var(--accent-color)'
            ];
            
            for (let i = 0; i < 3; i++) {
                const burst = document.createElement('div');
                burst.className = 'color-burst';
                burst.style.position = 'absolute';
                burst.style.borderRadius = '50%';
                burst.style.background = colors[i % colors.length];
                
                const size = Math.floor(Math.random() * 200) + 100;
                burst.style.width = `${size}px`;
                burst.style.height = `${size}px`;
                
                // Position randomly
                burst.style.top = `${Math.floor(Math.random() * 100)}%`;
                burst.style.left = `${Math.floor(Math.random() * 100)}%`;
                burst.style.transform = 'translate(-50%, -50%)';
                
                burstContainer.appendChild(burst);
            }
            
            previewContainer.prepend(burstContainer);
        }
        
        if (effects.subtleAnimation) {
            // Add subtle animations as a style element
            if (!document.getElementById('subtle-animation-style')) {
                const style = document.createElement('style');
                style.id = 'subtle-animation-style';
                style.textContent = `
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                    
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    
                    .announcement-title {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .announcement-logo {
                        animation: pulse 4s ease-in-out infinite;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        if (effects.accentCorners) {
            // Add accent corners
            const corners = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
            corners.forEach(corner => {
                const accentCorner = document.createElement('div');
                accentCorner.className = `accent-corner accent-${corner}`;
                accentCorner.style.position = 'absolute';
                accentCorner.style.width = '20px';
                accentCorner.style.height = '20px';
                accentCorner.style.backgroundColor = 'var(--secondary-color)';
                accentCorner.style.opacity = '0.3';
                
                if (corner === 'top-left') {
                    accentCorner.style.top = '0';
                    accentCorner.style.left = '0';
                    accentCorner.style.borderTopLeftRadius = '0';
                    accentCorner.style.borderBottomRightRadius = '100%';
                } else if (corner === 'top-right') {
                    accentCorner.style.top = '0';
                    accentCorner.style.right = '0';
                    accentCorner.style.borderTopRightRadius = '0';
                    accentCorner.style.borderBottomLeftRadius = '100%';
                } else if (corner === 'bottom-right') {
                    accentCorner.style.bottom = '0';
                    accentCorner.style.right = '0';
                    accentCorner.style.borderBottomRightRadius = '0';
                    accentCorner.style.borderTopLeftRadius = '100%';
                } else if (corner === 'bottom-left') {
                    accentCorner.style.bottom = '0';
                    accentCorner.style.left = '0';
                    accentCorner.style.borderBottomLeftRadius = '0';
                    accentCorner.style.borderTopRightRadius = '100%';
                }
                
                previewContainer.appendChild(accentCorner);
            });
        }
        
        // Enhanced modern effects
        if (effects.floatingElements) {
            const title = previewContainer.querySelector('.announcement-title');
            const logo = previewContainer.querySelector('.announcement-logo');
            
            if (title) {
                title.style.position = 'relative';
                title.style.zIndex = '2';
                title.style.transition = 'transform 0.3s ease';
                
                title.addEventListener('mouseover', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                
                title.addEventListener('mouseout', function() {
                    this.style.transform = 'translateY(0)';
                });
            }
            
            if (logo) {
                logo.style.position = 'relative';
                logo.style.zIndex = '2';
                logo.style.transition = 'transform 0.3s ease';
                
                logo.addEventListener('mouseover', function() {
                    this.style.transform = 'scale(1.1)';
                });
                
                logo.addEventListener('mouseout', function() {
                    this.style.transform = 'scale(1)';
                });
            }
        }
        
        // Enhanced corporate effects
        if (effects.enhancedSections) {
            const sections = previewContainer.querySelectorAll('.announcement-header, .announcement-content, .announcement-footer');
            sections.forEach((section, index) => {
                section.style.position = 'relative';
                section.style.zIndex = '1';
                
                // Add subtle top border to sections (except first)
                if (index > 0) {
                    section.style.borderTop = '1px solid rgba(var(--primary-color-rgb), 0.1)';
                    section.style.paddingTop = '20px';
                    section.style.marginTop = '20px';
                }
            });
        }
        
        // Enhanced gradient effects
        if (effects.glowingEdges) {
            previewContainer.style.boxShadow = '0 25px 50px rgba(var(--secondary-color-rgb), 0.1), 0 0 0 1px rgba(var(--secondary-color-rgb), 0.05)';
            
            // Add glow on hover
            previewContainer.style.transition = 'box-shadow 0.3s ease';
            
            previewContainer.addEventListener('mouseover', function() {
                this.style.boxShadow = '0 30px 60px rgba(var(--secondary-color-rgb), 0.15), 0 0 0 2px rgba(var(--secondary-color-rgb), 0.1)';
            });
            
            previewContainer.addEventListener('mouseout', function() {
                this.style.boxShadow = '0 25px 50px rgba(var(--secondary-color-rgb), 0.1), 0 0 0 1px rgba(var(--secondary-color-rgb), 0.05)';
            });
        }
        
        // Enhanced glassmorphism effects
        if (effects.depthLayers) {
            // Add depth layers
            const layers = ['back', 'middle', 'front'];
            const elements = [
                previewContainer.querySelector('.announcement-logo'),
                previewContainer.querySelector('.announcement-title'),
                previewContainer.querySelector('.announcement-content')
            ];
            
            elements.forEach((element, index) => {
                if (element) {
                    element.style.position = 'relative';
                    element.style.zIndex = (index + 1).toString();
                    element.style.transition = 'transform 0.2s ease';
                    
                    // Add different transform amounts based on layer
                    element.addEventListener('mouseover', function() {
                        const moveAmount = (3 - index) * 5; // More movement for back elements
                        this.style.transform = `translateY(-${moveAmount}px)`;
                    });
                    
                    element.addEventListener('mouseout', function() {
                        this.style.transform = 'translateY(0)';
                    });
                }
            });
        }
        
        // Enhanced neon effects
        if (effects.neonGrid) {
            if (!document.getElementById('neon-grid-style')) {
                const style = document.createElement('style');
                style.id = 'neon-grid-style';
                style.textContent = `
                    @keyframes neonGridMovement {
                        0% {
                            background-position: 0 0;
                            opacity: 0.05;
                        }
                        50% {
                            opacity: 0.15;
                        }
                        100% {
                            background-position: 40px 40px;
                            opacity: 0.05;
                        }
                    }
                    
                    .neon-grid {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-image: 
                            linear-gradient(rgba(var(--secondary-color-rgb), 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(var(--secondary-color-rgb), 0.3) 1px, transparent 1px);
                        background-size: 20px 20px;
                        z-index: 0;
                        opacity: 0.05;
                        animation: neonGridMovement 15s linear infinite;
                        pointer-events: none;
                    }
                `;
                document.head.appendChild(style);
            }
            
            const neonGrid = document.createElement('div');
            neonGrid.className = 'neon-grid';
            previewContainer.prepend(neonGrid);
        }
        
        // Enhanced cinematic effects
        if (effects.cinematicBars) {
            const topBar = document.createElement('div');
            topBar.className = 'cinematic-bar cinematic-bar-top';
            topBar.style.position = 'absolute';
            topBar.style.top = '0';
            topBar.style.left = '0';
            topBar.style.width = '100%';
            topBar.style.height = '15px';
            topBar.style.backgroundColor = '#000';
            topBar.style.zIndex = '10';
            
            const bottomBar = document.createElement('div');
            bottomBar.className = 'cinematic-bar cinematic-bar-bottom';
            bottomBar.style.position = 'absolute';
            bottomBar.style.bottom = '0';
            bottomBar.style.left = '0';
            bottomBar.style.width = '100%';
            bottomBar.style.height = '15px';
            bottomBar.style.backgroundColor = '#000';
            bottomBar.style.zIndex = '10';
            
            previewContainer.appendChild(topBar);
            previewContainer.appendChild(bottomBar);
        }
        
        // Enhanced certificate effects
        if (effects.decorativeBorders) {
            // Add decorative border corners
            const corners = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
            corners.forEach(corner => {
                const decorativeCorner = document.createElement('div');
                decorativeCorner.className = `decorative-corner decorative-${corner}`;
                decorativeCorner.style.position = 'absolute';
                decorativeCorner.style.width = '30px';
                decorativeCorner.style.height = '30px';
                decorativeCorner.style.borderColor = 'var(--secondary-color)';
                decorativeCorner.style.borderStyle = 'solid';
                decorativeCorner.style.borderWidth = '0';
                
                if (corner === 'top-left') {
                    decorativeCorner.style.top = '10px';
                    decorativeCorner.style.left = '10px';
                    decorativeCorner.style.borderTopWidth = '3px';
                    decorativeCorner.style.borderLeftWidth = '3px';
                } else if (corner === 'top-right') {
                    decorativeCorner.style.top = '10px';
                    decorativeCorner.style.right = '10px';
                    decorativeCorner.style.borderTopWidth = '3px';
                    decorativeCorner.style.borderRightWidth = '3px';
                } else if (corner === 'bottom-right') {
                    decorativeCorner.style.bottom = '10px';
                    decorativeCorner.style.right = '10px';
                    decorativeCorner.style.borderBottomWidth = '3px';
                    decorativeCorner.style.borderRightWidth = '3px';
                } else if (corner === 'bottom-left') {
                    decorativeCorner.style.bottom = '10px';
                    decorativeCorner.style.left = '10px';
                    decorativeCorner.style.borderBottomWidth = '3px';
                    decorativeCorner.style.borderLeftWidth = '3px';
                }
                
                previewContainer.appendChild(decorativeCorner);
            });
        }
        
        // Apply template-specific effects
        if (templateName === 'glassmorphism') {
            setupGlassmorphismEffect();
        }
        
        if (templateName === 'neon') {
            addNeonGlowEffect();
        }
        
        // Apply watermark effect
        if (effects.watermark) {
            const watermark = document.createElement('div');
            watermark.className = 'watermark';
            watermark.innerHTML = 'OFFICIAL DOCUMENT';
            previewContainer.appendChild(watermark);
            
            // Add watermark styles if they don't exist
            if (!document.getElementById('watermark-style')) {
                const style = document.createElement('style');
                style.id = 'watermark-style';
                style.textContent = `
                    .watermark {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 6em;
                        opacity: 0.06;
                        font-weight: 900;
                        color: var(--primary-color);
                        pointer-events: none;
                        white-space: nowrap;
                        z-index: 0;
                        font-family: 'Montserrat', sans-serif;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Apply other effects only if they are defined
        if (effects.emboss) {
            const title = previewContainer.querySelector('.announcement-title');
            if (title) {
                title.style.textShadow = '0 1px 1px rgba(255,255,255,0.5), 0 -1px 1px rgba(0,0,0,0.2)';
            }
        }
        
        if (effects.flourish) {
            const heading = previewContainer.querySelector('.announcement-heading');
            if (heading) {
                // Create flourish elements if they don't exist
                if (!previewContainer.querySelector('.flourish-left')) {
                    const flourishLeft = document.createElement('div');
                    flourishLeft.className = 'flourish flourish-left';
                    flourishLeft.innerHTML = '❦';
                    heading.appendChild(flourishLeft);
                }
                
                if (!previewContainer.querySelector('.flourish-right')) {
                    const flourishRight = document.createElement('div');
                    flourishRight.className = 'flourish flourish-right';
                    flourishRight.innerHTML = '❦';
                    heading.appendChild(flourishRight);
                }
                
                // Add flourish styles if they don't exist
                if (!document.getElementById('flourish-style')) {
                    const style = document.createElement('style');
                    style.id = 'flourish-style';
                    style.textContent = `
                        .flourish {
                            position: absolute;
                            font-size: 1.5em;
                            color: var(--secondary-color);
                            opacity: 0.7;
                        }
                        .flourish-left {
                            left: -40px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        .flourish-right {
                            right: -40px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }
        
        // Update debug info
        updateDebugInfo();
        
        console.log('Effects applied successfully');
    } catch (error) {
        console.error('Error applying template effects:', error);
    }
}

// Remove all template effects safely
function removeAllTemplateEffects(container) {
    try {
        if (!container) return;
        
        // Remove watermark
        const watermark = container.querySelector('.watermark');
        if (watermark) watermark.remove();
        
        // Remove flourishes
        const flourishes = container.querySelectorAll('.flourish');
        flourishes.forEach(flourish => flourish.remove());
        
        // Remove pattern overlay
        const patternOverlay = container.querySelector('.pattern-overlay');
        if (patternOverlay) patternOverlay.remove();
        
        // Remove drop cap class
        const content = container.querySelector('.announcement-content');
        if (content) content.classList.remove('drop-cap');
        
        // Remove grid background
        const gridBackground = container.querySelector('.grid-background');
        if (gridBackground) gridBackground.remove();
        
        // Remove gradient overlay
        const gradientOverlay = container.querySelector('.gradient-overlay');
        if (gradientOverlay) gradientOverlay.remove();
        
        // Remove certificate seal
        const seal = container.querySelector('.certificate-seal');
        if (seal) seal.remove();
        
        // Remove diagonal glow
        const diagonalGlow = container.querySelector('.diagonal-glow');
        if (diagonalGlow) diagonalGlow.remove();
        
        // Reset 3D transform
        container.style.transform = '';
        
        // Remove neon effects
        const neonEffects = container.querySelectorAll('.neon-grid, .neon-line, .neon-background');
        neonEffects.forEach(effect => effect.remove());
        
        // Reset title styles for text gradient effect
        const title = container.querySelector('.announcement-title');
        if (title) {
            title.style.background = '';
            title.style.webkitBackgroundClip = '';
            title.style.backgroundClip = '';
            title.style.webkitTextFillColor = '';
            title.style.display = '';
            title.style.textShadow = '';
            title.classList.remove('neon-flicker');
            title.style.animation = '';
        }
        
        // Reset other elements that might have special effects
        const logo = container.querySelector('.announcement-logo');
        if (logo) {
            logo.style.boxShadow = '';
            logo.style.border = '';
            logo.style.animation = '';
        }
        
        const date = container.querySelector('.announcement-date');
        if (date) {
            date.style.textShadow = '';
            date.style.animation = '';
        }
        
    } catch (error) {
        console.error('Error removing template effects:', error);
    }
}

// Update preview content with form values
function updatePreview() {
    try {
        console.log('Updating preview');
        
        // Get form data
        const formData = getCurrentFormData();
        
        // Update title
        const titleElement = document.getElementById('announcementTitle');
        if (titleElement && formData.title) {
            titleElement.textContent = formData.title;
        }
        
        // Update date
        const dateElement = document.getElementById('announcementDate');
        if (dateElement && formData.date) {
            const dateLabel = currentLanguage === 'assamese' ? 'তাৰিখ:' : 'Date:';
            dateElement.textContent = `${dateLabel} ${formData.date}`;
        }
        
        // Update content
        const contentElement = document.getElementById('announcementContent');
        if (contentElement && formData.content) {
            contentElement.textContent = formData.content;
        }
        
        // Update logo
        const logoElement = document.getElementById('announcementLogo');
        if (logoElement && formData.logoText) {
            if (!customLogoLoaded) {
                logoElement.textContent = formData.logoText;
                logoElement.classList.remove('has-image');
            }
        }
        
        // Update signer info
        const signerNameElement = document.querySelector('.signer-name');
        if (signerNameElement && formData.signerName) {
            signerNameElement.textContent = formData.signerName;
        }
        
        const signerTitleElement = document.querySelector('.signer-title');
        if (signerTitleElement && formData.signerTitle) {
            signerTitleElement.textContent = formData.signerTitle;
        }
        
        const contactInfoElement = document.querySelector('.contact-info');
        if (contactInfoElement && formData.contactInfo) {
            contactInfoElement.textContent = formData.contactInfo;
        }
        
        // Apply template and layout
        applyTemplate();
        applyLayout(currentLayout);
        
        console.log('Preview updated successfully');
    } catch (error) {
        console.error('Error updating preview:', error);
    }
}

// Apply layout class to preview
function applyLayout(layout) {
    console.log('Applying layout:', layout);
    
    // Get the preview container
    const previewContainer = document.querySelector('.preview-container');
    if (!previewContainer) {
        console.error('Preview container not found');
        return;
    }
    
    // Remove existing layout classes
    const layoutClasses = [
        'layout-default', 
        'layout-split', 
        'layout-f-pattern', 
        'layout-magazine-split', 
        'layout-business-card',
        'layout-grid',
        'layout-timeline',
        'layout-card-grid',
        'layout-centered', // Added missing layout
        'layout-card' // Added missing layout
    ];
    
    layoutClasses.forEach(layoutClass => {
        previewContainer.classList.remove(layoutClass);
    });
    
    // Add new layout class based on currentLayout
    const layoutClass = 'layout-' + layout;
    previewContainer.classList.add(layoutClass);
    
    // Initialize layout-specific features
    try {
        // Clean up existing layout elements
        const existingLayoutElements = previewContainer.querySelectorAll('.layout-element');
        existingLayoutElements.forEach(element => {
            element.remove();
        });
        
        // Apply layout-specific initialization
        switch(layout) {
            case 'default':
                // Default layout doesn't need special initialization
                break;
            case 'centered':
                // Apply centered layout styles
                setupCenteredLayout();
                break;
            case 'split':
                setupSplitLayout();
                break;
            case 'f-pattern':
                setupFPatternLayout();
                break;
            case 'magazine-split':
                setupMagazineSplitLayout();
                break;
            case 'business-card':
                setupBusinessCardLayout();
                break;
            case 'card':
                // Setup basic card layout
                setupCardLayout();
                break;
            case 'grid':
                setupGridLayout();
                break;
            case 'timeline':
                setupTimelineLayout();
                break;
            case 'card-grid':
                setupCardGridLayout();
                break;
        }
        
        console.log('Layout applied successfully:', layout);
        } catch (error) {
        console.error('Error applying layout:', error);
    }
}

// Setup special layouts
function setupMagazineSplitLayout() {
    const preview = document.querySelector('.announcement-preview');
    const content = preview?.querySelector('.announcement-content');
    
    if (!preview || !content) {
        console.error('Preview or content elements not found for magazine-split layout');
        return;
    }
    
    console.log('Setting up magazine-split layout');
    
    // Store original content for possible restoration
    const originalContent = content.innerHTML;
    
    try {
        // Create a more modern magazine split layout
        const magazineContainer = document.createElement('div');
        magazineContainer.className = 'magazine-container layout-element';
        magazineContainer.style.display = 'flex';
        magazineContainer.style.gap = '35px';
        magazineContainer.style.position = 'relative';
        
        // Create fancy title area that spans both columns
        const titleArea = document.createElement('div');
        titleArea.className = 'magazine-title-area layout-element';
        titleArea.style.marginBottom = '30px';
        titleArea.style.borderBottom = '2px solid var(--secondary-color)';
        titleArea.style.paddingBottom = '20px';
        titleArea.style.display = 'flex';
        titleArea.style.alignItems = 'center';
        titleArea.style.justifyContent = 'space-between';
        
        // Add decorative elements to title area
        const titleDecoration = document.createElement('div');
        titleDecoration.className = 'magazine-title-decoration layout-element';
        titleDecoration.style.width = '80px';
        titleDecoration.style.height = '8px';
        titleDecoration.style.backgroundColor = 'var(--accent-color)';
        titleDecoration.style.marginRight = '20px';
        
        const titleHeading = document.createElement('h3');
        titleHeading.className = 'magazine-heading layout-element';
        titleHeading.textContent = 'Featured Article';
        titleHeading.style.margin = '0';
        titleHeading.style.flex = '1';
        titleHeading.style.fontFamily = 'var(--heading-font)';
        titleHeading.style.fontSize = '1.4rem';
        
        titleArea.appendChild(titleDecoration);
        titleArea.appendChild(titleHeading);
        
        // Create columns wrapper
        const columnsWrapper = document.createElement('div');
        columnsWrapper.className = 'magazine-columns-wrapper layout-element';
        columnsWrapper.style.display = 'flex';
        columnsWrapper.style.gap = '35px';
        
        // Create left column with enhanced styling
        const leftColumn = document.createElement('div');
        leftColumn.className = 'magazine-column-left layout-element';
        leftColumn.style.flex = '1';
        leftColumn.style.minWidth = '0'; // Prevent overflow
        leftColumn.style.position = 'relative';
        leftColumn.style.paddingRight = '35px';
        leftColumn.style.borderRight = '1px solid rgba(var(--primary-color-rgb), 0.1)';
        
        // Create right column with enhanced styling
        const rightColumn = document.createElement('div');
        rightColumn.className = 'magazine-column-right layout-element';
        rightColumn.style.flex = '1';
        rightColumn.style.minWidth = '0'; // Prevent overflow
        rightColumn.style.position = 'relative';
        
        // Parse existing content for paragraphs
        const paragraphs = content.querySelectorAll('p');
        
        // Create drop cap for first paragraph
        if (paragraphs.length > 0) {
            const firstParagraph = paragraphs[0].cloneNode(true);
            const firstParagraphText = firstParagraph.textContent;
            
            if (firstParagraphText.length > 0) {
                const firstLetter = firstParagraphText.charAt(0);
                const restOfText = firstParagraphText.substring(1);
                
                const dropCap = document.createElement('span');
                dropCap.className = 'magazine-drop-cap';
                dropCap.textContent = firstLetter;
                dropCap.style.float = 'left';
                dropCap.style.fontSize = '3.5em';
                dropCap.style.lineHeight = '0.8';
                dropCap.style.paddingRight = '8px';
                dropCap.style.paddingTop = '4px';
                dropCap.style.color = 'var(--secondary-color)';
                dropCap.style.fontWeight = 'bold';
                dropCap.style.fontFamily = 'var(--heading-font)';
                
                const newFirstParagraph = document.createElement('p');
                newFirstParagraph.appendChild(dropCap);
                newFirstParagraph.appendChild(document.createTextNode(restOfText));
                newFirstParagraph.style.marginTop = '0';
                newFirstParagraph.style.fontSize = '1.1em';
                newFirstParagraph.style.lineHeight = '1.7';
                
                leftColumn.appendChild(newFirstParagraph);
            } else {
                leftColumn.appendChild(firstParagraph.cloneNode(true));
            }
        }
        
        // Add a decorative quote box to improve visual appeal
        const quoteBox = document.createElement('div');
        quoteBox.className = 'magazine-quote-box layout-element';
        quoteBox.style.margin = '25px 0';
        quoteBox.style.padding = '25px';
        quoteBox.style.backgroundColor = 'rgba(var(--secondary-color-rgb), 0.08)';
        quoteBox.style.borderLeft = '4px solid var(--secondary-color)';
        quoteBox.style.fontStyle = 'italic';
        quoteBox.style.fontSize = '1.1em';
        quoteBox.style.lineHeight = '1.6';
        quoteBox.style.position = 'relative';
        
        // Add quote marks
        const quoteIcon = document.createElement('span');
        quoteIcon.innerHTML = '&ldquo;';
        quoteIcon.style.position = 'absolute';
        quoteIcon.style.top = '-15px';
        quoteIcon.style.left = '10px';
        quoteIcon.style.fontSize = '3em';
        quoteIcon.style.color = 'rgba(var(--secondary-color-rgb), 0.2)';
        quoteIcon.style.fontFamily = 'Georgia, serif';
        
        quoteBox.appendChild(quoteIcon);
        
        // Add a quote from one of the middle paragraphs, or default text
        if (paragraphs.length > 2) {
            quoteBox.appendChild(document.createTextNode(paragraphs[2].textContent));
        } else {
            quoteBox.appendChild(document.createTextNode('A notable quote or highlight from your announcement would go here, drawing attention to key points.'));
        }
        
        // Balance paragraphs between columns for better readability
        const totalParagraphs = paragraphs.length;
        
        // Skip the first paragraph as it's already added with drop cap
        let leftColumnParagraphs = Math.ceil((totalParagraphs - 1) / 2);
        let rightColumnParagraphs = totalParagraphs - 1 - leftColumnParagraphs;
        
        // Make sure right column gets at least one paragraph
        if (rightColumnParagraphs < 1 && totalParagraphs > 1) {
            leftColumnParagraphs -= 1;
            rightColumnParagraphs += 1;
        }
        
        // Add paragraphs to left column (skipping the already added first paragraph)
        for (let i = 1; i <= leftColumnParagraphs; i++) {
            if (i < paragraphs.length) {
                const paragraph = paragraphs[i].cloneNode(true);
                paragraph.style.lineHeight = '1.7';
                leftColumn.appendChild(paragraph);
            }
        }
        
        // Add the quote box after a few paragraphs in the left column
        if (leftColumnParagraphs >= 1) {
            leftColumn.appendChild(quoteBox);
        } else {
            rightColumn.appendChild(quoteBox);
        }
        
        // Add paragraphs to right column
        const startRightIndex = leftColumnParagraphs + 1; // +1 for 0-index
        for (let i = 0; i < rightColumnParagraphs; i++) {
            if (startRightIndex + i < paragraphs.length) {
                const paragraph = paragraphs[startRightIndex + i].cloneNode(true);
                paragraph.style.lineHeight = '1.7';
                rightColumn.appendChild(paragraph);
            }
        }
        
        // Add a visual separator to right column
        const separator = document.createElement('div');
        separator.className = 'magazine-separator layout-element';
        separator.style.width = '40px';
        separator.style.height = '4px';
        separator.style.backgroundColor = 'var(--secondary-color)';
        separator.style.margin = '25px 0';
        
        // Add separator at the beginning of right column for visual interest
        if (rightColumn.firstChild) {
            rightColumn.insertBefore(separator, rightColumn.firstChild);
        } else {
            rightColumn.appendChild(separator);
        }
        
        // Add a read more link at the end of right column
        const readMore = document.createElement('div');
        readMore.className = 'magazine-read-more layout-element';
        readMore.style.marginTop = '30px';
        readMore.style.paddingTop = '15px';
        readMore.style.borderTop = '1px solid rgba(var(--primary-color-rgb), 0.1)';
        readMore.style.textAlign = 'right';
        readMore.style.fontStyle = 'italic';
        readMore.style.fontSize = '0.9em';
        readMore.innerHTML = 'Continued on next page...';
        
        rightColumn.appendChild(readMore);
        
        // Assemble the layout
        columnsWrapper.appendChild(leftColumn);
        columnsWrapper.appendChild(rightColumn);
        
        magazineContainer.appendChild(titleArea);
        magazineContainer.appendChild(columnsWrapper);
        
        // Replace the content with our magazine layout
        content.innerHTML = '';
        content.appendChild(magazineContainer);
        
        // Add responsive styling for mobile
        if (!document.getElementById('magazine-responsive-style')) {
            const style = document.createElement('style');
            style.id = 'magazine-responsive-style';
            style.textContent = `
                @media (max-width: 768px) {
                    .magazine-columns-wrapper {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .magazine-column-left {
                        padding-right: 0 !important;
                        border-right: none !important;
                        border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.1);
                        padding-bottom: 20px;
                    }
                    
                    .magazine-quote-box {
                        margin: 20px 0 !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('Magazine split layout setup complete');
    } catch (error) {
        console.error('Error setting up magazine split layout:', error);
        // Restore original content
        content.innerHTML = originalContent;
    }
}

function setupFPatternLayout() {
    // ... existing code ...
}

// Reset form to defaults
function resetForm() {
    console.log('Resetting form');
    
    // Reset the form element
    const form = document.getElementById('announcementForm');
    if (form) {
        form.reset();
    }
    
    // Reset custom logo
    customLogoLoaded = false;
    const logoElement = document.getElementById('announcementLogo');
    if (logoElement) {
        logoElement.style.backgroundImage = '';
        logoElement.classList.remove('has-image');
    }
    
    // Reset template and layout to defaults
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.value = 'standard';
        currentTemplate = 'standard';
    }
    
    const layoutSelector = document.getElementById('layoutSelector');
    if (layoutSelector) {
        layoutSelector.value = 'default';
        currentLayout = 'default';
    }
    
    // Reset color theme
    const defaultColorOption = document.querySelector('.color-option[data-theme="default"]');
    if (defaultColorOption) {
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => option.classList.remove('selected'));
        defaultColorOption.classList.add('selected');
    }
    
    // Reset color pickers
    document.getElementById('primaryColor').value = '#2a3b4c';
    document.getElementById('secondaryColor').value = '#ce8e2c';
    document.getElementById('accentColor').value = '#134e65';
    
    // Reset language
    const englishOption = document.querySelector('.language-option[data-lang="english"]');
    if (englishOption) {
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => option.classList.remove('active'));
        englishOption.classList.add('active');
        currentLanguage = 'english';
        toggleLanguage('english');
    }
    
    // Set default values
    setDefaults();
    
    // Update the preview
    updatePreview();
    
    console.log('Form reset complete');
    showToast('Form has been reset to defaults');
}

function setupBusinessCardLayout() {
    console.log('Setting up business card layout');
    
    const preview = document.querySelector('.announcement-preview');
    const content = preview?.querySelector('.announcement-content');
    const title = preview?.querySelector('.announcement-title');
    const header = preview?.querySelector('.announcement-header');
    const logo = preview?.querySelector('.announcement-logo');
    const footer = preview?.querySelector('.announcement-footer');
    
    if (!preview || !content || !title || !header || !logo || !footer) {
        console.error('Required elements not found for business card layout');
        return;
    }
    
    // Store original state
    const originalContent = content.innerHTML;
    const originalStyles = {
        preview: preview.style.cssText,
        content: content.style.cssText,
        header: header.style.cssText,
        footer: footer.style.cssText
    };
    
    try {
        // Create a professional business card layout
        
        // First, adjust the container to have proper business card dimensions
        preview.style.maxWidth = '600px';
        preview.style.margin = '0 auto';
        preview.style.aspectRatio = '1.7777 / 1'; // 16:9 aspect ratio
        preview.style.display = 'flex';
        preview.style.flexDirection = 'column';
        preview.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)';
        preview.style.position = 'relative';
        preview.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        preview.style.overflow = 'hidden';
        
        // Add a subtle hover effect
        preview.addEventListener('mouseover', function() {
            this.style.transform = 'rotateY(5deg) rotateX(2deg)';
            this.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
        });
        
        preview.addEventListener('mouseout', function() {
            this.style.transform = 'rotateY(0) rotateX(0)';
            this.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)';
        });
        
        // Add a decorative pattern to the background
        const patternOverlay = document.createElement('div');
        patternOverlay.className = 'business-card-pattern layout-element';
        patternOverlay.style.position = 'absolute';
        patternOverlay.style.top = '0';
        patternOverlay.style.left = '0';
        patternOverlay.style.width = '100%';
        patternOverlay.style.height = '100%';
        patternOverlay.style.opacity = '0.03';
        patternOverlay.style.pointerEvents = 'none';
        patternOverlay.style.backgroundImage = 'radial-gradient(circle at 2px 2px, var(--primary-color) 1px, transparent 0)';
        patternOverlay.style.backgroundSize = '20px 20px';
        patternOverlay.style.zIndex = '0';
        
        // Add colors strip on the side
        const colorStrip = document.createElement('div');
        colorStrip.className = 'business-card-color-strip layout-element';
        colorStrip.style.position = 'absolute';
        colorStrip.style.top = '0';
        colorStrip.style.left = '0';
        colorStrip.style.width = '15px';
        colorStrip.style.height = '100%';
        colorStrip.style.background = `linear-gradient(to bottom, 
            var(--primary-color), 
            var(--secondary-color),
            var(--accent-color))`;
        colorStrip.style.zIndex = '1';
        
        // Enhanced header styling
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '30px 30px 20px 45px'; // Extra padding left due to color strip
        header.style.position = 'relative';
        header.style.zIndex = '2';
        
        // Enhance logo styling
        logo.style.width = '70px';
        logo.style.height = '70px';
        logo.style.borderRadius = '50%';
        logo.style.display = 'flex';
        logo.style.alignItems = 'center';
        logo.style.justifyContent = 'center';
        logo.style.fontFamily = 'var(--heading-font, "Montserrat", sans-serif)';
        logo.style.fontWeight = 'bold';
        logo.style.fontSize = '1.8em';
        logo.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        logo.style.border = '2px solid rgba(var(--primary-color-rgb), 0.1)';
        
        // Clear the content area and create a fresh layout
        content.style.flexGrow = '1';
        content.style.display = 'flex'; 
        content.style.flexDirection = 'column';
        content.style.justifyContent = 'center';
        content.style.padding = '0 30px 0 45px'; // Extra padding left due to color strip
        content.style.zIndex = '2';
        content.style.position = 'relative';
        
        // Clean existing content and add properly styled elements
        content.innerHTML = '';
        
        // Add tagline/role
        const tagline = document.createElement('div');
        tagline.className = 'business-card-tagline layout-element';
        tagline.textContent = 'Professional Title / Role';
        tagline.style.fontSize = '1.1em';
        tagline.style.color = 'var(--accent-color)';
        tagline.style.fontWeight = '500';
        tagline.style.marginBottom = '10px';
        tagline.style.opacity = '0.8';
        
        // Enhance title styling
        title.style.fontSize = '1.8em';
        title.style.fontWeight = 'bold';
        title.style.margin = '0 0 5px 0';
        title.style.fontFamily = 'var(--heading-font, "Montserrat", sans-serif)';
        
        // Add brief description
        const description = document.createElement('p');
        description.className = 'business-card-description layout-element';
        description.textContent = 'Brief description or company slogan would go here. Just a sentence to describe services or expertise.';
        description.style.fontSize = '0.95em';
        description.style.lineHeight = '1.6';
        description.style.opacity = '0.75';
        description.style.margin = '15px 0';
        
        // Enhanced footer styling
        footer.style.padding = '20px 30px 30px 45px'; // Extra padding left due to color strip
        footer.style.borderTop = '1px solid rgba(var(--primary-color-rgb), 0.1)';
        footer.style.display = 'flex';
        footer.style.flexDirection = 'column';
        footer.style.position = 'relative';
        footer.style.zIndex = '2';
        
        // Contact info styling
        const contactInfo = document.querySelector('.announcement-contact');
        if (contactInfo) {
            contactInfo.style.fontSize = '0.9em';
            contactInfo.style.opacity = '0.8';
            contactInfo.style.display = 'flex';
            contactInfo.style.flexWrap = 'wrap';
            contactInfo.style.gap = '10px 20px';
        }
        
        // Add social media icons (as text for simplicity)
        const socialMedia = document.createElement('div');
        socialMedia.className = 'business-card-social layout-element';
        socialMedia.style.display = 'flex';
        socialMedia.style.gap = '15px';
        socialMedia.style.marginTop = '15px';
        
        const socialIcons = [
            { text: 'in', title: 'LinkedIn' },
            { text: 'tw', title: 'Twitter' },
            { text: 'fb', title: 'Facebook' },
            { text: 'ig', title: 'Instagram' }
        ];
        
        socialIcons.forEach(icon => {
            const socialIcon = document.createElement('div');
            socialIcon.className = 'social-icon layout-element';
            socialIcon.textContent = icon.text;
            socialIcon.title = icon.title;
            socialIcon.style.width = '30px';
            socialIcon.style.height = '30px';
            socialIcon.style.borderRadius = '50%';
            socialIcon.style.backgroundColor = 'var(--primary-color)';
            socialIcon.style.color = 'white';
            socialIcon.style.display = 'flex';
            socialIcon.style.alignItems = 'center';
            socialIcon.style.justifyContent = 'center';
            socialIcon.style.fontSize = '0.75em';
            socialIcon.style.fontWeight = 'bold';
            socialIcon.style.cursor = 'pointer';
            socialIcon.style.transition = 'all 0.2s ease';
            
            socialIcon.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.1)';
                this.style.backgroundColor = 'var(--secondary-color)';
            });
            
            socialIcon.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.backgroundColor = 'var(--primary-color)';
            });
            
            socialMedia.appendChild(socialIcon);
        });
        
        // Assemble the layout
        content.appendChild(tagline);
        content.appendChild(description);
        footer.appendChild(socialMedia);
        preview.prepend(patternOverlay);
        preview.prepend(colorStrip);
        
        // Add responsive styling for mobile
        if (!document.getElementById('business-card-responsive-style')) {
            const style = document.createElement('style');
            style.id = 'business-card-responsive-style';
            style.textContent = `
                @media (max-width: 500px) {
                    .announcement-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                        padding: 25px 20px 15px 30px !important;
                    }
                    
                    .announcement-content {
                        padding: 10px 20px 10px 30px !important;
                    }
                    
                    .announcement-footer {
                        padding: 15px 20px 25px 30px !important;
                    }
                    
                    .business-card-social {
                        margin-top: 10px !important;
                    }
                    
                    .announcement-logo {
                        width: 60px !important;
                        height: 60px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('Business card layout setup complete');
    } catch (error) {
        console.error('Error setting up business card layout:', error);
        
        // Restore original styles
        preview.style.cssText = originalStyles.preview;
        content.style.cssText = originalStyles.content;
        header.style.cssText = originalStyles.header;
        footer.style.cssText = originalStyles.footer;
        
        // Restore original content
        content.innerHTML = originalContent;
    }
}

// Make preview elements directly editable
function makePreviewEditable() {
    console.log('Making preview elements editable');
    
    // Get the elements that should be editable
    const titleEl = document.getElementById('announcementTitle');
    const contentEl = document.getElementById('announcementContent');
    const signerNameEl = document.getElementById('announcementSignerName');
    const signerTitleEl = document.getElementById('announcementSignerTitle');
    const contactInfoEl = document.getElementById('announcementContactInfo');
    const dateEl = document.getElementById('announcementDate');
    
    // Make elements editable
    if (titleEl) {
        titleEl.contentEditable = 'true';
        titleEl.classList.add('editable-element');
        
        // Sync changes back to form input
        titleEl.addEventListener('blur', function() {
            const titleInput = document.getElementById('titleInput');
            if (titleInput) {
                titleInput.value = this.textContent;
            }
        });
    }
    
    if (contentEl) {
        contentEl.contentEditable = 'true';
        contentEl.classList.add('editable-element');
        
        // Sync changes back to form input
        contentEl.addEventListener('blur', function() {
            const contentInput = document.getElementById('contentInput');
            if (contentInput) {
                // Convert HTML to plain text with line breaks
                let content = this.innerHTML
                    .replace(/<p>/g, '')
                    .replace(/<\/p>/g, '\n\n')
                    .replace(/<br>/g, '\n')
                    .replace(/<div>/g, '')
                    .replace(/<\/div>/g, '\n');
                
                // Clean up extra whitespace
                content = content.replace(/\n{3,}/g, '\n\n').trim();
                
                contentInput.value = content;
            }
        });
    }
    
    if (signerNameEl) {
        signerNameEl.contentEditable = 'true';
        signerNameEl.classList.add('editable-element');
        
        // Sync changes back to form input
        signerNameEl.addEventListener('blur', function() {
            const signerNameInput = document.getElementById('signerNameInput');
            if (signerNameInput) {
                signerNameInput.value = this.textContent;
            }
        });
    }
    
    if (signerTitleEl) {
        signerTitleEl.contentEditable = 'true';
        signerTitleEl.classList.add('editable-element');
        
        // Sync changes back to form input
        signerTitleEl.addEventListener('blur', function() {
            const signerTitleInput = document.getElementById('signerTitleInput');
            if (signerTitleInput) {
                signerTitleInput.value = this.textContent;
            }
        });
    }
    
    if (contactInfoEl) {
        contactInfoEl.contentEditable = 'true';
        contactInfoEl.classList.add('editable-element');
        
        // Sync changes back to form input
        contactInfoEl.addEventListener('blur', function() {
            const contactInfoInput = document.getElementById('contactInfoInput');
            if (contactInfoInput) {
                contactInfoInput.value = this.textContent;
            }
        });
    }
    
    if (dateEl) {
        dateEl.contentEditable = 'true';
        dateEl.classList.add('editable-element');
        
        // No direct sync for date since format differs, but we can store the edited value
        dateEl.addEventListener('blur', function() {
            // Store the value in a data attribute for now
            this.dataset.customValue = this.textContent;
        });
    }
    
    // Add styling for editable elements if not already added
    if (!document.getElementById('editable-elements-style')) {
        const style = document.createElement('style');
        style.id = 'editable-elements-style';
        style.textContent = `
            .editable-element {
                position: relative;
                outline: none;
                transition: background-color 0.2s ease;
            }
            
            .editable-element:hover {
                background-color: rgba(var(--primary-color-rgb), 0.05);
            }
            
            .editable-element:focus {
                background-color: rgba(var(--primary-color-rgb), 0.1);
            }
            
            .editable-element::after {
                content: '✎';
                position: absolute;
                top: 0;
                right: -20px;
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .editable-element:hover::after {
                opacity: 0.5;
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('Preview elements are now editable');
}

// Update debug information panel
function updateDebugInfo() {
    const debugPanel = document.getElementById('debugInfo');
    if (!debugPanel) return;
    
    // Get current state information
    const templateInfo = document.getElementById('templateSelector')?.value || currentTemplate;
    const layoutInfo = document.getElementById('layoutSelector')?.value || currentLayout;
    const languageInfo = currentLanguage;
    
    // Get color information
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    
    // Update debug panel content
    debugPanel.innerHTML = `
        <h3>Debug Info</h3>
        <p><strong>Template:</strong> ${templateInfo}</p>
        <p><strong>Layout:</strong> ${layoutInfo}</p>
        <p><strong>Language:</strong> ${languageInfo}</p>
        <p><strong>Colors:</strong> 
           <span style="color:${primaryColor}">■</span> 
           <span style="color:${secondaryColor}">■</span> 
           <span style="color:${accentColor}">■</span>
        </p>
        <p><strong>Premium:</strong> ${isPremium ? 'Enabled' : 'Disabled'}</p>
    `;
}

// Toggle language between English and Assamese
function toggleLanguage(language) {
    console.log('Toggling language to:', language);
    
    // Update UI elements based on language
    if (language === 'assamese') {
        // Assamese translations
        const translations = {
            'Date:': 'তাৰিখ:',
            'Director': 'সঞ্চালক',
            'Email:': 'ই-মেইল:',
            'Phone:': 'ফোন:',
        };
        
        // Update date label
        const dateEl = document.getElementById('announcementDate');
        if (dateEl) {
            let dateText = dateEl.textContent;
            dateText = dateText.replace('Date:', translations['Date:']);
            dateEl.textContent = dateText;
        }
        
        // Update signer title if it matches a translation
        const signerTitleEl = document.getElementById('announcementSignerTitle');
        if (signerTitleEl && translations[signerTitleEl.textContent]) {
            signerTitleEl.textContent = translations[signerTitleEl.textContent];
        }
        
        // Update contact info
        const contactInfoEl = document.getElementById('announcementContactInfo');
        if (contactInfoEl) {
            let contactText = contactInfoEl.textContent;
            Object.keys(translations).forEach(key => {
                contactText = contactText.replace(key, translations[key]);
            });
            contactInfoEl.textContent = contactText;
        }
        
        // Update form labels
        document.querySelectorAll('label').forEach(label => {
            const originalText = label.getAttribute('data-original-text') || label.textContent;
            if (!label.getAttribute('data-original-text')) {
                label.setAttribute('data-original-text', originalText);
            }
            
            // Translate label text if available in translations
            if (translations[originalText]) {
                label.textContent = translations[originalText];
            }
        });
        
    } else {
        // Revert to English
        
        // Restore original form labels
        document.querySelectorAll('label[data-original-text]').forEach(label => {
            label.textContent = label.getAttribute('data-original-text');
        });
        
        // Update date label
        const dateEl = document.getElementById('announcementDate');
        if (dateEl) {
            let dateText = dateEl.textContent;
            dateText = dateText.replace('তাৰিখ:', 'Date:');
            dateEl.textContent = dateText;
        }
    }
    
    console.log('Language toggle complete');
}

// Setup glassmorphism effect
function setupGlassmorphismEffect() {
    console.log('Setting up glassmorphism effect');
    
    const preview = document.querySelector('.announcement-preview');
    if (!preview) return;
    
    // Add orbs/bubbles for glassmorphism effect
    const colors = [
        'var(--primary-color)',
        'var(--secondary-color)',
        'var(--accent-color)'
    ];
    
    // Remove existing orbs if any
    const existingOrbs = preview.querySelectorAll('.glassmorphism-orb');
    existingOrbs.forEach(orb => orb.remove());
    
    // Create new orbs
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'glassmorphism-orb';
        orb.style.position = 'absolute';
        orb.style.borderRadius = '50%';
        orb.style.background = colors[i % colors.length];
        
        // Random size between 50px and 150px
        const size = Math.floor(Math.random() * 100) + 50;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        
        // Random position
        orb.style.top = `${Math.floor(Math.random() * 100)}%`;
        orb.style.left = `${Math.floor(Math.random() * 100)}%`;
        
        // Make it blurry and transparent
        orb.style.filter = 'blur(40px)';
        orb.style.opacity = '0.15';
        orb.style.zIndex = '0';
        orb.style.transform = 'translate(-50%, -50%)';
        orb.style.pointerEvents = 'none';
        
        preview.appendChild(orb);
    }
    
    // Add subtle animation to orbs if not already added
    if (!document.getElementById('glassmorphism-animation')) {
        const style = document.createElement('style');
        style.id = 'glassmorphism-animation';
        style.textContent = `
            @keyframes float {
                0% { transform: translate(-50%, -50%); }
                50% { transform: translate(-50%, -60%); }
                100% { transform: translate(-50%, -50%); }
            }
            
            .glassmorphism-orb {
                animation: float 15s ease-in-out infinite;
                animation-delay: var(--delay, 0s);
            }
        `;
        document.head.appendChild(style);
        
        // Add different animation delays to each orb
        const orbs = preview.querySelectorAll('.glassmorphism-orb');
        orbs.forEach((orb, index) => {
            orb.style.setProperty('--delay', `${index * 2}s`);
        });
    }
    
    console.log('Glassmorphism effect setup complete');
}

// Add setup functions for the missing layouts
function setupCenteredLayout() {
    console.log('Setting up centered layout');
    
    const preview = document.querySelector('.announcement-preview');
    const content = preview?.querySelector('.announcement-content');
    
    if (!preview || !content) {
        console.error('Preview or content elements not found for centered layout');
        return;
    }
    
    // Store original styles
    const originalStyles = {
        content: content.style.cssText
    };
    
    try {
        // Center-align text throughout the announcement
        content.style.textAlign = 'center';
        content.style.margin = '0 auto';
        content.style.maxWidth = '90%';
        
        // Add a subtle divider
        const divider = document.createElement('div');
        divider.className = 'centered-divider layout-element';
        divider.style.width = '50%';
        divider.style.height = '2px';
        divider.style.backgroundColor = 'var(--secondary-color)';
        divider.style.margin = '20px auto';
        divider.style.opacity = '0.5';
        
        // Add divider after first paragraph if any
        const firstParagraph = content.querySelector('p');
        if (firstParagraph && firstParagraph.nextSibling) {
            content.insertBefore(divider, firstParagraph.nextSibling);
        } else {
            content.appendChild(divider);
        }
        
        console.log('Centered layout setup complete');
    } catch (error) {
        console.error('Error setting up centered layout:', error);
        // Restore original styles
        content.style.cssText = originalStyles.content;
    }
}

function setupCardLayout() {
    console.log('Setting up card layout');
    
    const preview = document.querySelector('.announcement-preview');
    const content = preview?.querySelector('.announcement-content');
    
    if (!preview || !content) {
        console.error('Preview or content elements not found for card layout');
        return;
    }
    
    // Store original content for possible restoration
    const originalContent = content.innerHTML;
    
    try {
        // Create a card-style layout
        preview.style.maxWidth = '600px';
        preview.style.margin = '0 auto';
        preview.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        preview.style.borderRadius = '8px';
        preview.style.overflow = 'hidden';
        
        // Enhance content with card styling
        content.style.padding = '20px';
        
        // Add a subtle highlight bar at the top
        const highlightBar = document.createElement('div');
        highlightBar.className = 'card-highlight-bar layout-element';
        highlightBar.style.height = '6px';
        highlightBar.style.width = '100%';
        highlightBar.style.backgroundColor = 'var(--secondary-color)';
        highlightBar.style.position = 'relative';
        
        // Add to the top of the preview
        if (preview.firstChild) {
            preview.insertBefore(highlightBar, preview.firstChild);
        } else {
            preview.appendChild(highlightBar);
        }
        
        console.log('Card layout setup complete');
    } catch (error) {
        console.error('Error setting up card layout:', error);
        // Restore original content
        content.innerHTML = originalContent;
    }
}