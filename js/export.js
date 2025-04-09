// Export functionality for announcement generator

// Export announcement as PNG with higher quality
async function exportAsPNG(previewElement, filename = 'announcement.png') {
    // Show loading indicator
    showLoading();
    
    try {
        // Capture the announcement preview with html2canvas
        const canvas = await html2canvas(previewElement, {
            scale: 2, // Higher quality with 2x scale
            useCORS: true, // Allow loading cross-origin images
            allowTaint: true, // Allow exporting tainted canvas
            logging: false, // Disable logging
            backgroundColor: null, // Transparent background
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        });
        
        // Convert to image data
        const imageData = canvas.toDataURL('image/png');
        
        // Create and trigger download
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename || `announcement-${getCurrentDateString()}.png`;
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
        
        // Show success notification
        showToast('PNG image downloaded successfully!');
        return true;
    } catch (error) {
        console.error('Error exporting as PNG:', error);
        showToast('Error generating PNG image. Please try again.', true);
        return false;
    } finally {
        // Hide loading indicator
        hideLoading();
    }
}

// Export announcement as PDF
async function exportAsPDF(previewElement, filename = 'announcement.pdf') {
    // Show loading indicator
    showLoading();
    
    try {
        // Capture the announcement preview with html2canvas
        const canvas = await html2canvas(previewElement, {
            scale: 2, // Higher quality with 2x scale
            useCORS: true, // Allow loading cross-origin images
            allowTaint: true, // Allow exporting tainted canvas
            logging: false, // Disable logging
            backgroundColor: null // Transparent background
        });
        
        // Get image data
        const imgData = canvas.toDataURL('image/png');
        
        // Create PDF document with jsPDF
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Calculate dimensions to fit A4 page
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Save PDF
        pdf.save(filename || `announcement-${getCurrentDateString()}.pdf`);
        
        // Show success notification
        showToast('PDF downloaded successfully!');
        return true;
    } catch (error) {
        console.error('Error exporting as PDF:', error);
        showToast('Error generating PDF. Please try again.', true);
        return false;
    } finally {
        // Hide loading indicator
        hideLoading();
    }
}

// Export announcement as JSON
function exportAsJSON(data) {
    try {
        console.log('Exporting as JSON:', data);
        // Convert the form data to a JSON string
        const jsonString = JSON.stringify(data, null, 2);
        
        // Create a blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = `announcement-${getCurrentDateString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
        showToast('Announcement data saved successfully!');
    } catch (error) {
        console.error('Error exporting to JSON:', error);
        showToast('Error saving data. Please try again.', true);
    }
}

// Import announcement from JSON file
async function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                resolve(data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                reject(new Error('Invalid JSON file'));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file);
    });
}

// Apply imported data to the form and preview
function applyImportedData(data) {
    try {
        console.log('Applying imported data:', data);
        
        // Update template
        if (data.template) {
            const templateSelector = document.getElementById('templateSelector');
            if (templateSelector) {
                templateSelector.value = data.template;
                currentTemplate = data.template;
            }
        }
        
        // Update layout
        if (data.layout) {
            const layoutSelector = document.getElementById('layoutSelector');
            if (layoutSelector) {
                layoutSelector.value = data.layout;
                currentLayout = data.layout;
            }
        }
        
        // Update text inputs
        const textFields = ['title', 'content', 'signerName', 'signerTitle', 'contactInfo', 'logoText'];
        textFields.forEach(field => {
            if (data[field]) {
                const input = document.getElementById(`${field}Input`);
                if (input) input.value = data[field];
            }
        });
        
        // Update date
        if (data.date) {
            const dateInput = document.getElementById('dateInput');
            if (dateInput) dateInput.value = data.date;
        }
        
        // Update colors
        if (data.colors) {
            const colorInputs = {
                primary: document.getElementById('primaryColor'),
                secondary: document.getElementById('secondaryColor'),
                accent: document.getElementById('accentColor')
            };
            
            for (const [key, value] of Object.entries(data.colors)) {
                if (colorInputs[key]) {
                    colorInputs[key].value = value;
                }
            }
            
            // Find and select matching color theme
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.classList.remove('selected');
                
                if (option.getAttribute('data-primary') === data.colors.primary &&
                    option.getAttribute('data-secondary') === data.colors.secondary &&
                    option.getAttribute('data-accent') === data.colors.accent) {
                    option.classList.add('selected');
                }
            });
        }
        
        // Apply template and layout
        applyTemplate();
        applyLayout();
        
        // Update preview
        updatePreview();
        
        showToast('Data loaded successfully!');
    } catch (error) {
        console.error('Error applying imported data:', error);
        showToast('Error applying imported data. Please try again.', true);
    }
}

// Get current form data
function getCurrentFormData() {
    const data = {
        template: currentTemplate,
        layout: currentLayout,
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
    
    return data;
}

// Export as printable HTML
function exportAsPrintableHTML() {
    try {
        // Create a new window
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('Popup blocked. Please allow popups for this site.');
        }
        
        // Get the announcement preview
        const previewEl = document.querySelector('.announcement-preview');
        if (!previewEl) {
            throw new Error('Preview element not found');
        }
        
        // Get all styles
        const styles = Array.from(document.styleSheets)
            .map(styleSheet => {
                try {
                    return Array.from(styleSheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n');
                } catch (e) {
                    console.warn('Could not read stylesheet:', e);
                    return '';
                }
            })
            .join('\n');
        
        // Clone the preview element
        const clonedPreview = previewEl.cloneNode(true);
        
        // Remove debug elements from the clone
        const debugElements = clonedPreview.querySelectorAll('.debug-info, [class*="template-"]::before, [class*="layout-"]::after');
        debugElements.forEach(el => el.remove());
        
        // Create HTML content for the new window
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Printable Announcement</title>
                <style>
                    ${styles}
                    body {
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background-color: #f5f5f5;
                    }
                    .announcement-preview {
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                        margin: 0 auto;
                    }
                    @media print {
                        body {
                            background-color: white;
                            padding: 0;
                        }
                        .announcement-preview {
                            box-shadow: none;
                            margin: 0;
                        }
                    }
                    /* Hide any debug elements */
                    .debug-info, [class*="template-"]::before, [class*="layout-"]::after {
                        display: none !important;
                    }
                </style>
            </head>
            <body>
                ${clonedPreview.outerHTML}
                <script>
                    // Auto print
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `;
        
        // Write the content to the new window
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
    } catch (error) {
        console.error('Error exporting as printable HTML:', error);
        showToast('Error creating printable version. Please try again.', true);
    }
} 