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
        
        // Setup Glassmorphism effect
        setupGlassmorphismEffect();
        
        // Update glassmorphism effect when template changes
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', function() {
                setTimeout(setupGlassmorphismEffect, 100); // Add delay to ensure DOM is updated
            });
        });
        
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
    
    // Check if required libraries are loaded
    if (typeof html2canvas === 'undefined') {
        console.warn('html2canvas library not found - export to PNG/PDF may not work');
    }
    
    if (typeof jspdf === 'undefined') {
        console.warn('jsPDF library not found - export to PDF may not work');
    }
    
    // Check if templates and layouts objects exist
    if (typeof templates === 'undefined') {
        console.error('Templates object is not defined. Make sure templates.js is loaded before main.js');
        showToast('Error: Templates not loaded properly. Check console for details.', true);
        return;
    }
    
    if (typeof layouts === 'undefined') {
        console.error('Layouts object is not defined. Make sure templates.js is loaded before main.js');
        showToast('Error: Layouts not loaded properly. Check console for details.', true);
        return;
    }
    
    console.log('Found templates:', Object.keys(templates).length);
    console.log('Found layouts:', Object.keys(layouts).length);
    
    // Add premium badges to premium templates
    const templateSelect = document.getElementById('templateSelector');
    if (templateSelect) {
        for (const [key, template] of Object.entries(templates)) {
            if (template.premium) {
                const option = templateSelect.querySelector(`option[value="${key}"]`);
                if (option) {
                    option.innerHTML = `${template.name} <span class="premium-badge">Premium</span>`;
                }
            }
        }
        console.log('Added premium badges to template selector');
    } else {
        console.error('Template selector element not found');
    }
    
    // Add premium badges to premium layouts
    const layoutSelect = document.getElementById('layoutSelector');
    if (layoutSelect) {
        for (const [key, layout] of Object.entries(layouts)) {
            if (layout.premium) {
                const option = layoutSelect.querySelector(`option[value="${key}"]`);
                if (option) {
                    option.innerHTML = `${layout.name} <span class="premium-badge">Premium</span>`;
                }
            }
        }
        console.log('Added premium badges to layout selector');
    } else {
        console.error('Layout selector element not found');
    }
}

// Add event listeners to all form controls
function addEventListeners() {
    console.log('Adding event listeners to form controls');
    
    // Form controls
    const inputs = document.querySelectorAll('#announcementForm input, #announcementForm textarea, #announcementForm select');
    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                console.log('Input changed:', input.id || input.name || input.type);
                updatePreview();
            });
            console.log('Added input listener to:', input.id || input.name || input.type);
        });
    } else {
        console.error('No form inputs found in #announcementForm');
    }
    
    // Logo upload
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        logoUpload.addEventListener('change', handleLogoUpload);
        console.log('Added change listener to logo upload');
    } else {
        console.error('Logo upload element not found');
    }
    
    // Template selector
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        console.log('Found template selector with options:', templateSelector.options.length);
        templateSelector.addEventListener('change', function() {
            currentTemplate = this.value;
            console.log('Template changed to:', currentTemplate);
            applyTemplate();
        });
        console.log('Added change listener to template selector');
    } else {
        console.error('Template selector element not found');
    }
    
    // Layout selector
    const layoutSelector = document.getElementById('layoutSelector');
    if (layoutSelector) {
        console.log('Found layout selector with options:', layoutSelector.options.length);
        layoutSelector.addEventListener('change', function() {
            currentLayout = this.value;
            console.log('Layout changed to:', currentLayout);
            applyLayout();
        });
        console.log('Added change listener to layout selector');
    } else {
        console.error('Layout selector element not found');
    }
    
    // Preset selector
    const presetSelector = document.getElementById('presetSelector');
    if (presetSelector) {
        console.log('Found preset selector with options:', presetSelector.options.length);
        presetSelector.addEventListener('change', function() {
            const preset = this.value;
            if (preset && preset !== '') {
                console.log('Loading preset:', preset);
                loadTemplatePreset(preset);
            }
        });
        console.log('Added change listener to preset selector');
    } else {
        console.error('Preset selector element not found');
    }
    
    // Color theme options
    const colorOptions = document.querySelectorAll('.color-option');
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Get color values from the selected theme
                const primaryColor = this.getAttribute('data-primary');
                const secondaryColor = this.getAttribute('data-secondary');
                const accentColor = this.getAttribute('data-accent');
                
                console.log('Color theme selected:', this.getAttribute('data-theme'));
                console.log('Colors:', { primaryColor, secondaryColor, accentColor });
                
                // Update color pickers
                const primaryPicker = document.querySelector('[data-target="primary"]');
                const secondaryPicker = document.querySelector('[data-target="secondary"]');
                const accentPicker = document.querySelector('[data-target="accent"]');
                
                if (primaryPicker) primaryPicker.value = primaryColor;
                if (secondaryPicker) secondaryPicker.value = secondaryColor;
                if (accentPicker) accentPicker.value = accentColor;
                
                // Update preview
                updatePreview();
            });
        });
        console.log('Added click listeners to', colorOptions.length, 'color options');
    } else {
        console.error('No color option elements found');
    }
    
    // Color picker inputs
    const colorPickers = document.querySelectorAll('input[type="color"]');
    if (colorPickers.length > 0) {
        colorPickers.forEach(picker => {
            picker.addEventListener('input', function() {
                console.log('Color picker changed:', picker.getAttribute('data-target'), 'to', picker.value);
                updatePreview();
            });
        });
        console.log('Added input listeners to', colorPickers.length, 'color pickers');
    } else {
        console.error('No color picker elements found');
    }
    
    // Language toggle
    const languageOptions = document.querySelectorAll('.language-option');
    if (languageOptions.length > 0) {
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                languageOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                currentLanguage = this.getAttribute('data-lang');
                console.log('Language changed to:', currentLanguage);
                toggleLanguage(currentLanguage);
            });
        });
        console.log('Added click listeners to', languageOptions.length, 'language options');
    } else {
        console.error('No language option elements found');
    }
    
    // Download buttons
    const downloadPngBtn = document.getElementById('downloadPng');
    if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', function() {
            console.log('Download PNG button clicked');
            downloadAsPng();
        });
        console.log('Added click listener to download PNG button');
    } else {
        console.error('Download PNG button not found');
    }
    
    const downloadPdfBtn = document.getElementById('downloadPdf');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            console.log('Download PDF button clicked');
            downloadAsPdf();
        });
        console.log('Added click listener to download PDF button');
    } else {
        console.error('Download PDF button not found');
    }
    
    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            console.log('Print button clicked');
            window.print();
        });
        console.log('Added click listener to print button');
    } else {
        console.error('Print button not found');
    }
    
    // Save data button
    const saveDataBtn = document.getElementById('saveDataBtn');
    if (saveDataBtn) {
        saveDataBtn.addEventListener('click', function() {
            console.log('Save data button clicked');
            const formData = getCurrentFormData();
            exportAsJSON(formData);
        });
        console.log('Added click listener to save data button');
    } else {
        console.error('Save data button not found');
    }
    
    // Load data button and input
    const loadDataBtn = document.getElementById('loadDataBtn');
    const loadDataInput = document.getElementById('loadDataInput');
    
    if (loadDataBtn && loadDataInput) {
        loadDataBtn.addEventListener('click', function() {
            console.log('Load data button clicked');
            loadDataInput.click();
        });
        
        loadDataInput.addEventListener('change', function(event) {
            console.log('Load data input changed');
            if (event.target.files.length > 0) {
                const file = event.target.files[0];
                importFromJSON(file)
                    .then(data => {
                        console.log('Data imported successfully');
                        applyImportedData(data);
                    })
                    .catch(error => {
                        console.error('Error importing data:', error);
                        showToast('Error loading data: ' + error.message, true);
                    });
                
                // Reset the input to allow loading the same file again
                this.value = '';
            }
        });
        console.log('Added click/change listeners to load data button/input');
    } else {
        console.error('Load data button or input not found');
    }
    
    // Reset form button
    const resetFormBtn = document.getElementById('resetForm');
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            console.log('Reset form button clicked');
            resetForm();
        });
        console.log('Added click listener to reset form button');
    } else {
        console.error('Reset form button not found');
    }
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
    applyLayout();
}

// Apply template class to preview
function applyTemplate() {
    const previewContainer = document.querySelector('.announcement-preview');
    if (!previewContainer) {
        console.error('Preview container not found');
        return;
    }

    console.log('Applying template:', currentTemplate);

    // Ensure template exists
    if (!templates[currentTemplate]) {
        console.error('Template not found:', currentTemplate);
        showToast(`Template "${currentTemplate}" not found`, true);
        currentTemplate = 'standard'; // Fall back to default
    }

    // Remove all template classes
    const allTemplateClasses = Object.keys(templates).map(key => `template-${key}`);
    allTemplateClasses.forEach(cls => {
        previewContainer.classList.remove(cls);
    });

    // Add current template class
    previewContainer.classList.add(`template-${currentTemplate}`);
    
    // Reset any inline styles that might interfere with the template
    previewContainer.style = '';
    
    // Get the template configuration
    const templateConfig = templates[currentTemplate];
    if (!templateConfig) {
        console.error('Template config not found for:', currentTemplate);
        return;
    }

    // Apply template colors if available
    if (templateConfig.colors) {
        const colors = templateConfig.colors;

        // Update color pickers with template colors
        const primaryColorPicker = document.querySelector('[data-target="primary"]');
        const secondaryColorPicker = document.querySelector('[data-target="secondary"]');
        const accentColorPicker = document.querySelector('[data-target="accent"]');

        if (primaryColorPicker) primaryColorPicker.value = colors.primary;
        if (secondaryColorPicker) secondaryColorPicker.value = colors.secondary;
        if (accentColorPicker) accentColorPicker.value = colors.accent;

        // Set CSS variables
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--accent-color', colors.accent);

        // Set RGB variables for effects
        const primaryRgb = hexToRgb(colors.primary);
        const secondaryRgb = hexToRgb(colors.secondary);
        const accentRgb = hexToRgb(colors.accent);

        if (primaryRgb) document.documentElement.style.setProperty('--primary-color-rgb', primaryRgb);
        if (secondaryRgb) document.documentElement.style.setProperty('--secondary-color-rgb', secondaryRgb);
        if (accentRgb) document.documentElement.style.setProperty('--accent-color-rgb', accentRgb);
    }

    // Apply template styles
    if (templateConfig.styles) {
        console.log('Applying template styles:', templateConfig.styles);
        for (const [property, value] of Object.entries(templateConfig.styles)) {
            previewContainer.style[property] = value;
        }
    }

    // Apply template specific effects
    switch (currentTemplate) {
        case '3d':
            previewContainer.style.transformStyle = 'preserve-3d';
            previewContainer.style.perspective = '1000px';
            previewContainer.style.transform = 'rotateX(5deg) rotateY(-5deg)';
            break;
        case 'parallax':
            initParallaxEffect();
            break;
        case 'neon':
            addNeonGlowEffect();
            break;
        case 'paper':
            addPaperTexture();
            break;
        case 'magazine':
            setupMagazineStyle();
            break;
        case 'glassmorphism':
            setupGlassmorphismEffect();
            break;
        default:
            // Reset transform styles for other templates
            previewContainer.style.transformStyle = '';
            previewContainer.style.perspective = '';
            previewContainer.style.transform = '';
            break;
    }

    // Update color theme selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');

        // Check if this option matches the current colors
        const primaryColor = option.getAttribute('data-primary');
        const secondaryColor = option.getAttribute('data-secondary');
        const accentColor = option.getAttribute('data-accent');

        const currentPrimaryColor = document.querySelector('[data-target="primary"]')?.value;
        const currentSecondaryColor = document.querySelector('[data-target="secondary"]')?.value;
        const currentAccentColor = document.querySelector('[data-target="accent"]')?.value;

        if (primaryColor === currentPrimaryColor &&
            secondaryColor === currentSecondaryColor &&
            accentColor === currentAccentColor) {
            option.classList.add('selected');
        }
    });

    // Update preview with new template styling
    updatePreview();
    
    // Debug info
    console.log('Applied template:', currentTemplate);
    console.log('Preview classes:', previewContainer.className);
    console.log('Preview styles:', previewContainer.getAttribute('style'));
}

// Apply layout class to preview
function applyLayout() {
    const previewContainer = document.querySelector('.announcement-preview');
    if (!previewContainer) {
        console.error('Preview container not found');
        return;
    }
    
    console.log('Applying layout:', currentLayout);
    
    // Ensure layout exists
    if (!layouts[currentLayout]) {
        console.error('Layout not found:', currentLayout);
        showToast(`Layout "${currentLayout}" not found`, true);
        currentLayout = 'default'; // Fall back to default
    }
    
    // Remove all layout classes
    const layoutClasses = ['layout-default', 'layout-centered', 'layout-split', 'layout-card', 'layout-magazine-split', 'layout-grid', 'layout-hero'];
    layoutClasses.forEach(cls => {
        previewContainer.classList.remove(cls);
    });
    
    // Add selected layout class
    previewContainer.classList.add(`layout-${currentLayout}`);
    
    // Get the content element
    const content = previewContainer.querySelector('.announcement-content');
    if (!content) {
        console.error('Content element not found');
        return;
    }
    
    // Reset any layout specific classes on content
    content.className = 'announcement-content';
    
    // Apply special layout effects based on selected layout
    switch (currentLayout) {
        case 'magazine-split':
            setupMagazineSplitLayout();
            break;
        case 'grid':
            setupGridLayout();
            break;
        case 'hero':
            setupHeroLayout();
            break;
        case 'centered':
        case 'split':
        case 'card':
            // These layouts are handled purely by CSS classes
            // First reset any complex layout structures
            if (content) {
                // Only reset if there are special layout elements
                if (content.querySelector('.magazine-column-left') || 
                    content.querySelector('.grid-container')) {
                    
                    // Get the raw content and reformat it
                    const contentText = content.textContent;
                    
                    // Format it properly with paragraphs
                    const formattedContent = contentText
                        .split('\n\n')
                        .filter(para => para.trim() !== '')
                        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
                        .join('');
                    
                    // Update the content
                    content.innerHTML = formattedContent;
                }
            }
            break;
        default:
            // Reset any specific layout effects for other layouts
            if (content) {
                // Restore original content structure if it was modified by specific layouts
                if (content.querySelector('.magazine-column-left') || 
                    content.querySelector('.grid-container')) {
                    
                    // Get the raw content without special layout elements
                    const contentText = content.textContent;
                    
                    // Format it properly with paragraphs
                    const formattedContent = contentText
                        .split('\n\n')
                        .filter(para => para.trim() !== '')
                        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
                        .join('');
                    
                    // Update the content
                    content.innerHTML = formattedContent;
                }
            }
            
            // Remove any layout-specific elements
            const overlays = previewContainer.querySelectorAll('.hero-overlay, .grid-container');
            overlays.forEach(overlay => overlay.remove());
            break;
    }
    
    // Update preview with updated layout
    updatePreview();
    
    // Debug info
    console.log('Applied layout:', currentLayout);
    console.log('Preview classes after layout:', previewContainer.className);
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
    
    // Create columns for magazine split layout
    content.innerHTML = `<div class="magazine-column-left">${content.innerHTML}</div><div class="magazine-column-right"></div>`;
    
    // Move some elements to right column
    const rightColumn = content.querySelector('.magazine-column-right');
    const leftColumn = content.querySelector('.magazine-column-left');
    
    if (!rightColumn || !leftColumn) {
        console.error('Magazine columns not created properly');
        return;
    }
    
    const paragraphs = leftColumn.querySelectorAll('p');
    if (paragraphs.length > 2) {
        // Move half of paragraphs to right column
        for (let i = Math.ceil(paragraphs.length / 2); i < paragraphs.length; i++) {
            rightColumn.appendChild(paragraphs[i]);
        }
    }
}

function setupGridLayout() {
    const preview = document.querySelector('.announcement-preview');
    const content = preview?.querySelector('.announcement-content');
    
    if (!preview || !content) {
        console.error('Preview or content elements not found for grid layout');
        return;
    }
    
    console.log('Setting up grid layout');
    
    // Create grid container
    content.classList.add('grid-container');
    
    // Add grid classes to paragraphs
    const paragraphs = content.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        p.classList.add('grid-item');
        p.classList.add(`grid-item-${index + 1}`);
    });
}

function setupHeroLayout() {
    const preview = document.querySelector('.announcement-preview');
    const title = preview?.querySelector('.announcement-title');
    
    if (!preview || !title) {
        console.error('Preview or title elements not found for hero layout');
        return;
    }
    
    console.log('Setting up hero layout');
    
    // Make title larger for hero layout
    title.classList.add('hero-title');
    
    // Add background overlay for better contrast if it doesn't exist already
    if (!preview.querySelector('.hero-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'hero-overlay';
        preview.insertBefore(overlay, preview.firstChild);
    }
}

// Special template effects
function initParallaxEffect() {
    const preview = document.querySelector('.announcement-preview');
    if (!preview) {
        console.error('Preview element not found for parallax effect');
        return;
    }
    
    console.log('Setting up parallax effect');
    
    // Create layers for parallax effect
    const title = preview.querySelector('.announcement-title');
    const content = preview.querySelector('.announcement-content');
    
    if (!title || !content) {
        console.error('Title or content elements not found for parallax effect');
        return;
    }
    
    title.classList.add('parallax-layer', 'parallax-layer-back');
    content.classList.add('parallax-layer', 'parallax-layer-front');
    
    // Add parallax mouse move event
    preview.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        title.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        content.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });
}

function addNeonGlowEffect() {
    const preview = document.querySelector('.announcement-preview');
    if (!preview) {
        console.error('Preview element not found for neon effect');
        return;
    }
    
    console.log('Adding neon glow effect');
    
    const title = preview.querySelector('.announcement-title');
    
    if (!title) {
        console.error('Title element not found for neon effect');
        return;
    }
    
    title.classList.add('neon-text');
    
    // Animate neon flicker
    setTimeout(() => {
        title.classList.add('neon-flicker');
    }, 2000);
}

function addPaperTexture() {
    const preview = document.querySelector('.announcement-preview');
    if (!preview) {
        console.error('Preview element not found for paper texture');
        return;
    }
    
    console.log('Adding paper texture');
    
    // Check if paper texture already exists
    if (!preview.querySelector('.paper-texture')) {
        // Add paper texture overlay
        const texture = document.createElement('div');
        texture.className = 'paper-texture';
        preview.appendChild(texture);
        
        // Add slight rotation for realistic paper effect
        preview.style.transform = 'rotate(0.5deg)';
    }
}

function setupMagazineStyle() {
    const preview = document.querySelector('.announcement-preview');
    if (!preview) {
        console.error('Preview element not found for magazine style');
        return;
    }
    
    console.log('Setting up magazine style');
    
    const title = preview.querySelector('.announcement-title');
    const content = preview.querySelector('.announcement-content');
    
    if (!title || !content) {
        console.error('Title or content elements not found for magazine style');
        return;
    }
    
    // Create magazine style header
    title.classList.add('magazine-title');
    
    // Style first paragraph as magazine lead
    const firstP = content.querySelector('p');
    if (firstP) {
        firstP.classList.add('magazine-lead');
    }
}

// Set default values
function setDefaults() {
    // Set current date as default
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().substring(0, 10);
        dateInput.value = formattedDate;
        
        // Also update the date in the preview
        const dateEl = document.getElementById('announcementDate');
        if (dateEl) {
            const displayDate = today.toLocaleDateString(
                currentLanguage === 'assamese' ? 'as-IN' : 'en-US',
                {year: 'numeric', month: 'long', day: 'numeric'}
            );
            dateEl.textContent = `Date: ${displayDate}`;
        }
    }
    
    // Set default template and layout
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
    
    // Set default colors
    const primaryColorPicker = document.querySelector('[data-target="primary"]');
    const secondaryColorPicker = document.querySelector('[data-target="secondary"]');
    const accentColorPicker = document.querySelector('[data-target="accent"]');
    
    if (primaryColorPicker && secondaryColorPicker && accentColorPicker) {
        const defaultColors = templates['standard'].colors;
        
        primaryColorPicker.value = defaultColors.primary;
        secondaryColorPicker.value = defaultColors.secondary;
        accentColorPicker.value = defaultColors.accent;
        
        document.documentElement.style.setProperty('--primary-color', defaultColors.primary);
        document.documentElement.style.setProperty('--secondary-color', defaultColors.secondary);
        document.documentElement.style.setProperty('--accent-color', defaultColors.accent);
        
        // Update RGB variables for shadow effects
        const primaryRgb = hexToRgb(defaultColors.primary);
        const secondaryRgb = hexToRgb(defaultColors.secondary);
        const accentRgb = hexToRgb(defaultColors.accent);
        
        if (primaryRgb) document.documentElement.style.setProperty('--primary-color-rgb', primaryRgb);
        if (secondaryRgb) document.documentElement.style.setProperty('--secondary-color-rgb', secondaryRgb);
        if (accentRgb) document.documentElement.style.setProperty('--accent-color-rgb', accentRgb);
    }
    
    // Set default color theme option as selected
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => option.classList.remove('selected'));
    const defaultColorOption = document.querySelector('.color-option[data-theme="default"]');
    if (defaultColorOption) {
        defaultColorOption.classList.add('selected');
    }
    
    // Set default notice type
    const noticeType = document.getElementById('noticeType');
    if (noticeType) {
        noticeType.textContent = 'ANNOUNCEMENT';
    }
    
    // Set default title and content if they're empty
    const titleInput = document.getElementById('titleInput');
    if (titleInput && !titleInput.value) {
        titleInput.value = 'Important Announcement';
        const titleEl = document.getElementById('announcementTitle');
        if (titleEl) titleEl.textContent = 'Important Announcement';
    }
    
    const contentInput = document.getElementById('contentInput');
    if (contentInput && !contentInput.value) {
        contentInput.value = 'We are excited to announce some important changes taking place in our organization.';
        const contentEl = document.getElementById('announcementContent');
        if (contentEl) contentEl.innerHTML = '<p>We are excited to announce some important changes taking place in our organization.</p>';
    }
    
    // Set default logo text
    const logoTextInput = document.getElementById('logoTextInput');
    if (logoTextInput && !logoTextInput.value) {
        logoTextInput.value = 'RB';
        const logoEl = document.getElementById('announcementLogo');
        if (logoEl) logoEl.innerHTML = 'RB';
    }
    
    // Set default signer info
    const signerNameInput = document.getElementById('signerNameInput');
    if (signerNameInput && !signerNameInput.value) {
        signerNameInput.value = 'John Doe';
        const signerNameEl = document.getElementById('announcementSignerName');
        if (signerNameEl) signerNameEl.textContent = 'John Doe';
    }
    
    const signerTitleInput = document.getElementById('signerTitleInput');
    if (signerTitleInput && !signerTitleInput.value) {
        signerTitleInput.value = 'Director';
        const signerTitleEl = document.getElementById('announcementSignerTitle');
        if (signerTitleEl) signerTitleEl.textContent = 'Director';
    }
    
    const contactInfoInput = document.getElementById('contactInfoInput');
    if (contactInfoInput && !contactInfoInput.value) {
        contactInfoInput.value = 'Email: example@email.com | Phone: 555-1234';
        const contactInfoEl = document.getElementById('announcementContactInfo');
        if (contactInfoEl) contactInfoEl.textContent = 'Email: example@email.com | Phone: 555-1234';
    }
    
    // Apply template and layout
    applyTemplate();
    applyLayout();
}

// Reset form to defaults
function resetForm() {
    // Reset template
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.value = 'standard';
        currentTemplate = 'standard';
    }
    
    // Reset layout
    const layoutSelector = document.getElementById('layoutSelector');
    if (layoutSelector) {
        layoutSelector.value = 'default';
        currentLayout = 'default';
    }
    
    // Reset preset selector
    const presetSelector = document.getElementById('presetSelector');
    if (presetSelector) {
        presetSelector.value = '';
    }
    
    // Reset form inputs
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const dateInput = document.getElementById('dateInput');
    const signerNameInput = document.getElementById('signerNameInput');
    const signerTitleInput = document.getElementById('signerTitleInput');
    const contactInfoInput = document.getElementById('contactInfoInput');
    const logoTextInput = document.getElementById('logoTextInput');
    
    if (titleInput) titleInput.value = 'Important Announcement';
    if (contentInput) contentInput.value = 'We are excited to announce some important changes taking place in our organization.';
    if (dateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().substring(0, 10);
        dateInput.value = formattedDate;
    }
    if (signerNameInput) signerNameInput.value = 'John Doe';
    if (signerTitleInput) signerTitleInput.value = 'Director';
    if (contactInfoInput) contactInfoInput.value = 'Email: example@email.com | Phone: 555-1234';
    if (logoTextInput) logoTextInput.value = 'RB';
    
    // Reset logo
    const logoEl = document.getElementById('announcementLogo');
    if (logoEl) {
        logoEl.innerHTML = 'RB';
        logoEl.classList.remove('has-image');
        customLogoLoaded = false;
    }
    
    // Reset logo upload input
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        logoUpload.value = '';
    }
    
    // Reset color theme to default
    const defaultColors = templates['standard'].colors;
    
    // Update color pickers
    const primaryColorPicker = document.querySelector('[data-target="primary"]');
    const secondaryColorPicker = document.querySelector('[data-target="secondary"]');
    const accentColorPicker = document.querySelector('[data-target="accent"]');
    
    if (primaryColorPicker) primaryColorPicker.value = defaultColors.primary;
    if (secondaryColorPicker) secondaryColorPicker.value = defaultColors.secondary;
    if (accentColorPicker) accentColorPicker.value = defaultColors.accent;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', defaultColors.primary);
    document.documentElement.style.setProperty('--secondary-color', defaultColors.secondary);
    document.documentElement.style.setProperty('--accent-color', defaultColors.accent);
    
    // Reset RGB variables
    const primaryRgb = hexToRgb(defaultColors.primary);
    const secondaryRgb = hexToRgb(defaultColors.secondary);
    const accentRgb = hexToRgb(defaultColors.accent);
    
    if (primaryRgb) document.documentElement.style.setProperty('--primary-color-rgb', primaryRgb);
    if (secondaryRgb) document.documentElement.style.setProperty('--secondary-color-rgb', secondaryRgb);
    if (accentRgb) document.documentElement.style.setProperty('--accent-color-rgb', accentRgb);
    
    // Reset color theme selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => option.classList.remove('selected'));
    const defaultColorOption = document.querySelector('.color-option[data-theme="default"]');
    if (defaultColorOption) {
        defaultColorOption.classList.add('selected');
    }
    
    // Reset language
    currentLanguage = 'english';
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(opt => opt.classList.remove('active'));
    const englishOption = document.querySelector('.language-option[data-lang="english"]');
    if (englishOption) englishOption.classList.add('active');
    
    // Apply template and layout
    applyTemplate();
    applyLayout();
    
    // Update preview with defaults
    updatePreview();
    
    showToast('Form has been reset to defaults');
}

// Real-time preview update function
function updatePreview() {
    console.log('Updating preview with current values');
    
    // Get form input values
    const titleEl = document.getElementById('announcementTitle');
    const contentEl = document.getElementById('announcementContent');
    const dateEl = document.getElementById('announcementDate');
    const logoEl = document.getElementById('announcementLogo');
    const signerNameEl = document.getElementById('announcementSignerName');
    const signerTitleEl = document.getElementById('announcementSignerTitle');
    const contactInfoEl = document.getElementById('announcementContactInfo');
    
    const title = document.getElementById('titleInput')?.value;
    const content = document.getElementById('contentInput')?.value;
    const date = document.getElementById('dateInput')?.value;
    const logoText = document.getElementById('logoTextInput')?.value || 'RB';
    const signerName = document.getElementById('signerNameInput')?.value;
    const signerTitle = document.getElementById('signerTitleInput')?.value;
    const contactInfo = document.getElementById('contactInfoInput')?.value;

    console.log('Input values:', { 
        title, 
        contentLength: content?.length,
        date,
        logoText, 
        signerName, 
        signerTitle, 
        contactInfo 
    });
    
    console.log('Preview elements found:', {
        titleEl: !!titleEl,
        contentEl: !!contentEl,
        dateEl: !!dateEl,
        logoEl: !!logoEl,
        signerNameEl: !!signerNameEl,
        signerTitleEl: !!signerTitleEl,
        contactInfoEl: !!contactInfoEl
    });

    // Update text content in preview
    if (title && titleEl) {
        titleEl.textContent = title;
        console.log('Updated title element');
    }

    if (content && contentEl) {
        // Process content - convert newlines to paragraphs
        const formattedContent = content
            .split('\n\n')
            .filter(para => para.trim() !== '')
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');

        console.log('Formatted content created with', formattedContent.length, 'characters');
        
        // Update content without disrupting layout styles
        if (currentLayout === 'magazine-split') {
            // Special handling for magazine-split layout
            if (!contentEl.querySelector('.magazine-column-left')) {
                contentEl.innerHTML = `<div class="magazine-column-left">${formattedContent}</div><div class="magazine-column-right"></div>`;
                // Distribute paragraphs
                setupMagazineSplitLayout();
            } else {
                // Update only the content in left column
                const leftCol = contentEl.querySelector('.magazine-column-left');
                leftCol.innerHTML = formattedContent;
                setupMagazineSplitLayout();
            }
        } else if (currentLayout === 'grid') {
            // Special handling for grid layout
            contentEl.innerHTML = formattedContent;
            setupGridLayout();
        } else {
            // Standard content update
            contentEl.innerHTML = formattedContent;
        }
        console.log('Updated content element with current layout:', currentLayout);
    }

    if (date && dateEl) {
        const formattedDate = new Date(date).toLocaleDateString(
            currentLanguage === 'assamese' ? 'as-IN' : 'en-US',
            {year: 'numeric', month: 'long', day: 'numeric'}
        );
        dateEl.textContent = `Date: ${formattedDate}`;
        console.log('Updated date element');
    }

    // Update logo text if no image is loaded
    if (logoEl && !customLogoLoaded && logoText) {
        logoEl.innerHTML = logoText;
        console.log('Updated logo element');
    }

    // Update signer information
    if (signerName && signerNameEl) {
        signerNameEl.textContent = signerName;
        console.log('Updated signer name element');
    }

    if (signerTitle && signerTitleEl) {
        signerTitleEl.textContent = signerTitle;
        console.log('Updated signer title element');
    }

    if (contactInfo && contactInfoEl) {
        contactInfoEl.textContent = contactInfo;
        console.log('Updated contact info element');
    }

    // Update theme colors
    const primaryColor = document.querySelector('[data-target="primary"]')?.value;
    const secondaryColor = document.querySelector('[data-target="secondary"]')?.value;
    const accentColor = document.querySelector('[data-target="accent"]')?.value;

    if (primaryColor) document.documentElement.style.setProperty('--primary-color', primaryColor);
    if (secondaryColor) document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    if (accentColor) document.documentElement.style.setProperty('--accent-color', accentColor);

    // Update RGB variables for shadow effects
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);
    const accentRgb = hexToRgb(accentColor);

    if (primaryRgb) document.documentElement.style.setProperty('--primary-color-rgb', primaryRgb);
    if (secondaryRgb) document.documentElement.style.setProperty('--secondary-color-rgb', secondaryRgb);
    if (accentRgb) document.documentElement.style.setProperty('--accent-color-rgb', accentRgb);
    
    console.log('Preview update completed');
}

// Handle logo upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoEl = document.getElementById('announcementLogo');
            if (logoEl) {
                logoEl.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
                logoEl.classList.add('has-image');
                customLogoLoaded = true;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Toggle between languages
function toggleLanguage(language) {
    const contentInput = document.getElementById('contentInput');
    const titleInput = document.getElementById('titleInput');
    
    // Add or remove Assamese font class based on selected language
    if (language === 'assamese') {
        contentInput.classList.add('assamese-text');
        titleInput.classList.add('assamese-text');
        document.getElementById('announcementContent').classList.add('assamese-text');
        document.getElementById('announcementTitle').classList.add('assamese-text');
    } else {
        contentInput.classList.remove('assamese-text');
        titleInput.classList.remove('assamese-text');
        document.getElementById('announcementContent').classList.remove('assamese-text');
        document.getElementById('announcementTitle').classList.remove('assamese-text');
    }
    
    // Update preview to refresh date format
    updatePreview();
}

// Download announcement as PNG
async function downloadAsPng() {
    showLoading();
    
    try {
        const previewEl = document.querySelector('.announcement-preview');
        
        if (!previewEl) {
            throw new Error('Preview element not found');
        }
        
        // Hide debug elements temporarily
        const debugPanel = document.getElementById('debugInfo');
        const debugVisible = debugPanel && window.getComputedStyle(debugPanel).display !== 'none';
        if (debugVisible) {
            debugPanel.style.display = 'none';
        }
        
        // Temporarily hide pseudo-elements with template and layout names
        const tempStyle = document.createElement('style');
        tempStyle.id = 'temp-hide-debug';
        tempStyle.innerHTML = `
            [class*="template-"]::before, [class*="layout-"]::after {
                display: none !important;
            }
        `;
        document.head.appendChild(tempStyle);
        
        // Use html2canvas to capture the announcement
        const canvas = await html2canvas(previewEl, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        // Restore debug elements
        if (debugVisible && debugPanel) {
            debugPanel.style.display = 'block';
        }
        
        // Remove temporary style
        document.getElementById('temp-hide-debug')?.remove();
        
        // Convert to data URL and trigger download
        const imageData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `announcement-${getCurrentDateString()}.png`;
        link.click();
        
        showToast('Image downloaded successfully!');
    } catch (error) {
        console.error('Error generating PNG:', error);
        showToast('Error generating image. Please try again.', true);
    } finally {
        hideLoading();
    }
}

// Download announcement as PDF
async function downloadAsPdf() {
    showLoading();
    
    try {
        const previewEl = document.querySelector('.announcement-preview');
        
        if (!previewEl) {
            throw new Error('Preview element not found');
        }
        
        // Hide debug elements temporarily
        const debugPanel = document.getElementById('debugInfo');
        const debugVisible = debugPanel && window.getComputedStyle(debugPanel).display !== 'none';
        if (debugVisible) {
            debugPanel.style.display = 'none';
        }
        
        // Temporarily hide pseudo-elements with template and layout names
        const tempStyle = document.createElement('style');
        tempStyle.id = 'temp-hide-debug';
        tempStyle.innerHTML = `
            [class*="template-"]::before, [class*="layout-"]::after {
                display: none !important;
            }
        `;
        document.head.appendChild(tempStyle);
        
        // Use html2canvas to capture the announcement
        const canvas = await html2canvas(previewEl, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        // Restore debug elements
        if (debugVisible && debugPanel) {
            debugPanel.style.display = 'block';
        }
        
        // Remove temporary style
        document.getElementById('temp-hide-debug')?.remove();
        
        // Check if jspdf is available
        if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
            // Fallback to downloadAsPng if jsPDF not available
            console.warn('jsPDF not available, falling back to PNG download');
            downloadAsPng();
            return;
        }
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Calculate dimensions to fit PDF
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`announcement-${getCurrentDateString()}.pdf`);
        
        showToast('PDF downloaded successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Error generating PDF. Please try again.', true);
    } finally {
        hideLoading();
    }
}

// Helper to format current date for filenames
function getCurrentDateString() {
    const date = new Date();
    return date.toISOString().slice(0, 10);
}

// Helper to convert hex to RGB
function hexToRgb(hex) {
    if (!hex) return null;
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
}

// Initialize premium features
function initializePremiumFeatures() {
    // Add premium badge to template options with data-premium attribute
    const premiumItems = document.querySelectorAll('[data-premium="true"]');
    
    premiumItems.forEach(item => {
        // Skip if already has a premium badge
        if (item.querySelector('.premium-badge')) return;
        
        const badge = document.createElement('span');
        badge.className = 'premium-badge';
        badge.textContent = 'PREMIUM';
        item.appendChild(badge);
        
        // Add click handler for premium features
        if (!item.hasAttribute('data-handler-attached')) {
            item.setAttribute('data-handler-attached', 'true');
            
            item.addEventListener('click', function(e) {
                // If not premium, show the premium modal
                if (!isPremium) {
                    e.preventDefault();
                    const premiumModal = document.getElementById('premium-modal');
                    if (premiumModal) {
                        premiumModal.style.display = 'flex';
                    }
                    return false;
                }
                return true;
            });
        }
    });
    
    // Setup premium modal
    const unlockPremiumBtn = document.getElementById('unlock-premium');
    const confirmPremiumBtn = document.getElementById('confirm-premium');
    const premiumModal = document.getElementById('premium-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    if (unlockPremiumBtn) {
        unlockPremiumBtn.addEventListener('click', function() {
            if (premiumModal) {
                premiumModal.style.display = 'flex';
            }
        });
    }
    
    if (confirmPremiumBtn) {
        confirmPremiumBtn.addEventListener('click', function() {
            // Simulate successful purchase
            isPremium = true;
            
            // Show premium badge in the preview
            const premiumStatus = document.getElementById('premium-status');
            if (premiumStatus) {
                premiumStatus.style.display = 'inline-block';
            }
            
            // Remove overlays from premium template and layout options
            const premiumOptions = document.querySelectorAll('[data-premium="true"]');
            premiumOptions.forEach(option => {
                option.style.opacity = '1';
                const overlay = option.querySelector('.premium-overlay');
                if (overlay) overlay.remove();
            });
            
            // Close modal
            if (premiumModal) {
                premiumModal.style.display = 'none';
            }
            
            // Show success message
            showToast('Premium features unlocked successfully!');
            
            // Remove premium section from controls
            const premiumSection = document.querySelector('.premium-section');
            if (premiumSection) {
                premiumSection.style.display = 'none';
            }
        });
    }
    
    // Close modal buttons
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (premiumModal) {
                    premiumModal.style.display = 'none';
                }
            });
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === premiumModal) {
            premiumModal.style.display = 'none';
        }
    });
}

// Update debug info panel
function updateDebugInfo() {
    const debugPanel = document.getElementById('debugInfo');
    if (!debugPanel) return;
    
    // Update every second
    const updateInterval = setInterval(() => {
        const preview = document.querySelector('.announcement-preview');
        if (preview) {
            const classList = preview.classList.value;
            const styles = preview.getAttribute('style') || 'No inline styles';
            
            debugPanel.innerHTML = `
                <strong>Current Template:</strong> ${currentTemplate}<br>
                <strong>Current Layout:</strong> ${currentLayout}<br>
                <strong>Preview Class List:</strong> ${classList}<br>
                <strong>Inline Styles:</strong> ${styles}
            `;
        } else {
            debugPanel.innerHTML = 'Preview element not found';
        }
    }, 1000);
    
    // Clean up when page is unloaded
    window.addEventListener('beforeunload', () => {
        clearInterval(updateInterval);
    });
}

// Get current form data
function getCurrentFormData() {
    console.log('Getting current form data');
    
    // Collect all form data
    const data = {
        template: currentTemplate,
        layout: currentLayout,
        language: currentLanguage,
        title: document.getElementById('titleInput')?.value || '',
        content: document.getElementById('contentInput')?.value || '',
        date: document.getElementById('dateInput')?.value || '',
        signerName: document.getElementById('signerNameInput')?.value || '',
        signerTitle: document.getElementById('signerTitleInput')?.value || '',
        contactInfo: document.getElementById('contactInfoInput')?.value || '',
        logoText: document.getElementById('logoTextInput')?.value || '',
        colors: {
            primary: document.getElementById('primaryColor')?.value || '#2a3b4c',
            secondary: document.getElementById('secondaryColor')?.value || '#ce8e2c',
            accent: document.getElementById('accentColor')?.value || '#134e65'
        }
    };
    
    // Get selected color theme name if available
    const selectedTheme = document.querySelector('.color-option.selected');
    if (selectedTheme) {
        data.colorTheme = selectedTheme.getAttribute('data-theme');
    }
    
    // Add metadata
    data.exportDate = new Date().toISOString();
    data.version = "2.0";
    
    console.log('Form data collected:', data);
    return data;
}

// Setup glassmorphism floating elements
function setupGlassmorphismEffect() {
    const previews = document.querySelectorAll('.template-glassmorphism .announcement-preview');
    
    previews.forEach(preview => {
        // Remove any existing floating circles first
        const existingCircles = preview.querySelectorAll('.floating-circle');
        existingCircles.forEach(circle => circle.remove());
        
        // Get theme colors for gradients
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--primary-color').trim();
        const secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim();
        const accentColor = computedStyle.getPropertyValue('--accent-color').trim();
        
        // Create floating circles
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.classList.add('floating-circle');
            
            // Apply random sizes, positions and durations
            const size = 80 + Math.random() * 100;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            
            // Position circles
            if (i === 0) {
                circle.style.top = '-30px';
                circle.style.right = '-30px';
            } else if (i === 1) {
                circle.style.bottom = '50px';
                circle.style.left = '-20px';
            } else {
                circle.style.bottom = '-20px';
                circle.style.right = '30%';
            }
            
            // Add animation with different durations
            const duration = 12 + (i * 3);
            circle.style.animation = `float ${duration}s infinite ease-in-out`;
            circle.style.animationDelay = `${-i * 4}s`;
            circle.style.opacity = (0.8 - (i * 0.1)).toString();
            
            preview.appendChild(circle);
        }
        
        // Set preview styles if needed
        preview.style.position = 'relative';
        preview.style.overflow = 'hidden';
    });
} 