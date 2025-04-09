document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    initializeElements();
    
    // Add event listeners to form controls
    addEventListeners();
    
    // Initialize templates
    initializeTemplates();
    
    // Set defaults
    setDefaults();
});

// Global variables
let currentLanguage = 'english';
let currentTemplate = 'standard';
let currentLayout = 'default';
let customLogoLoaded = false;

// Initialize key DOM elements
function initializeElements() {
    // Add loading spinner for asynchronous operations
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading hidden';
    loadingEl.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingEl);
    
    // Add toast notification
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.id = 'toast';
    document.body.appendChild(toastEl);
}

// Add event listeners to all form controls
function addEventListeners() {
    // Form controls
    const inputs = document.querySelectorAll('.controls input, .controls textarea, .controls select');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Logo upload
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        logoUpload.addEventListener('change', handleLogoUpload);
    }
    
    // Template selector
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.addEventListener('change', function() {
            currentTemplate = this.value;
            applyTemplate(currentTemplate);
            updatePreview();
        });
    }
    
    // Layout selector
    const layoutSelector = document.getElementById('layoutSelector');
    if (layoutSelector) {
        layoutSelector.addEventListener('change', function() {
            currentLayout = this.value;
            applyLayout(currentLayout);
            updatePreview();
        });
    }
    
    // Color theme options
    const colorOptions = document.querySelectorAll('.color-option');
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
            
            // Update color pickers
            document.querySelector('[data-target="primary"]').value = primaryColor;
            document.querySelector('[data-target="secondary"]').value = secondaryColor;
            document.querySelector('[data-target="accent"]').value = accentColor;
            
            // Update preview
            updatePreview();
        });
    });
    
    // Language toggle
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentLanguage = this.getAttribute('data-lang');
            toggleLanguage(currentLanguage);
        });
    });
    
    // Download buttons
    const downloadPngBtn = document.getElementById('downloadPng');
    if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', function() {
            downloadAsPng();
        });
    }
    
    const downloadPdfBtn = document.getElementById('downloadPdf');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            downloadAsPdf();
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetForm');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetForm();
        });
    }
}

// Initialize templates
function initializeTemplates() {
    const previewContainer = document.querySelector('.announcement-preview');
    if (!previewContainer) return;
    
    // Add template class to preview container based on selected template
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        currentTemplate = templateSelector.value;
        applyTemplate(currentTemplate);
    }
    
    // Add layout class to preview container based on selected layout
    const layoutSelector = document.getElementById('layoutSelector');
    if (layoutSelector) {
        currentLayout = layoutSelector.value;
        applyLayout(currentLayout);
    }
}

// Apply template class to preview
function applyTemplate(template) {
    const previewContainer = document.querySelector('.announcement-preview');
    if (!previewContainer) return;
    
    // Remove all template classes
    Object.keys(templates).forEach(template => {
        previewContainer.classList.remove(`template-${template}`);
    });
    
    // Add selected template class
    previewContainer.classList.add(`template-${template}`);
}

// Apply layout class to preview
function applyLayout(layout) {
    const previewContainer = document.querySelector('.announcement-preview');
    if (!previewContainer) return;
    
    // Remove all layout classes
    Object.keys(layouts).forEach(layoutKey => {
        if (layoutKey !== 'default') {
            previewContainer.classList.remove(`layout-${layoutKey}`);
        }
    });
    
    // Add selected layout class if not default
    if (layout !== 'default') {
        previewContainer.classList.add(`layout-${layout}`);
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
    }
    
    // Set default notice type
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector && templateSelector.value) {
        document.getElementById('noticeType').textContent = templateSelector.value.toUpperCase();
    }
    
    // Trigger initial preview update
    updatePreview();
}

// Reset form to defaults
function resetForm() {
    const form = document.querySelector('.controls form');
    if (form) {
        form.reset();
        
        // Reset logo
        const logoEl = document.getElementById('announcementLogo');
        if (logoEl) {
            logoEl.innerHTML = document.getElementById('logoTextInput').value || 'RB';
            logoEl.classList.remove('has-image');
            customLogoLoaded = false;
        }
        
        // Reset template
        const templateSelector = document.getElementById('templateSelector');
        if (templateSelector) {
            templateSelector.value = 'standard';
            currentTemplate = 'standard';
            applyTemplate('standard');
        }
        
        // Reset layout
        const layoutSelector = document.getElementById('layoutSelector');
        if (layoutSelector) {
            layoutSelector.value = 'default';
            currentLayout = 'default';
            applyLayout('default');
        }
        
        // Reset colors to default
        const defaultColorOption = document.querySelector('.color-option[data-theme="default"]');
        if (defaultColorOption) {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            defaultColorOption.classList.add('selected');
            
            const primaryColor = defaultColorOption.getAttribute('data-primary');
            const secondaryColor = defaultColorOption.getAttribute('data-secondary');
            const accentColor = defaultColorOption.getAttribute('data-accent');
            
            document.querySelector('[data-target="primary"]').value = primaryColor;
            document.querySelector('[data-target="secondary"]').value = secondaryColor;
            document.querySelector('[data-target="accent"]').value = accentColor;
        }
        
        // Reset language
        currentLanguage = 'english';
        document.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.language-option[data-lang="english"]').classList.add('active');
        
        // Update preview with defaults
        setDefaults();
    }
}

// Real-time preview update function
function updatePreview() {
    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;
    const date = document.getElementById('dateInput').value;
    const signerName = document.getElementById('signerNameInput').value;
    const signerTitle = document.getElementById('signerTitleInput').value;
    const contactInfo = document.getElementById('contactInfoInput').value;
    const noticeType = document.getElementById('templateSelector').value.toUpperCase();
    const logoText = document.getElementById('logoTextInput').value || 'PA';
    
    // Update text content
    if (title) document.getElementById('announcementTitle').textContent = title;
    if (content) document.getElementById('announcementContent').textContent = content;
    if (date) {
        const formattedDate = new Date(date).toLocaleDateString(
            currentLanguage === 'assamese' ? 'as-IN' : 'en-US', 
            {year: 'numeric', month: 'long', day: 'numeric'}
        );
        document.getElementById('announcementDate').textContent = `Date: ${formattedDate}`;
    }
    if (signerName) document.getElementById('signerName').textContent = signerName;
    if (signerTitle) document.getElementById('signerTitle').textContent = signerTitle;
    if (contactInfo) document.getElementById('contactInfo').textContent = contactInfo;
    if (noticeType) document.getElementById('noticeType').textContent = noticeType;
    
    // Update logo text if no image is loaded
    const logoEl = document.getElementById('announcementLogo');
    if (logoEl && !customLogoLoaded) {
        logoEl.innerHTML = logoText;
    }
    
    // Update theme colors
    const primaryColor = document.querySelector('[data-target="primary"]').value;
    const secondaryColor = document.querySelector('[data-target="secondary"]').value;
    const accentColor = document.querySelector('[data-target="accent"]').value;
    
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Update RGB variables for shadow effects
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);
    const accentRgb = hexToRgb(accentColor);
    
    if (primaryRgb) document.documentElement.style.setProperty('--primary-color-rgb', primaryRgb);
    if (secondaryRgb) document.documentElement.style.setProperty('--secondary-color-rgb', secondaryRgb);
    if (accentRgb) document.documentElement.style.setProperty('--accent-color-rgb', accentRgb);
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
        
        // Use html2canvas to capture the announcement
        const canvas = await html2canvas(previewEl, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: null
        });
        
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
        
        // Use html2canvas to capture the announcement
        const canvas = await html2canvas(previewEl, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: null
        });
        
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

// Show loading spinner
function showLoading() {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
        loadingEl.classList.remove('hidden');
    }
}

// Hide loading spinner
function hideLoading() {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
        loadingEl.classList.add('hidden');
    }
}

// Show toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        
        if (isError) {
            toast.style.backgroundColor = '#d9534f';
        } else {
            toast.style.backgroundColor = 'var(--primary-color)';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
} 