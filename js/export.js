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

// Export announcement data as JSON
function exportAsJSON(formData, filename = 'announcement-data.json') {
    try {
        // Convert form data to JSON string
        const jsonStr = JSON.stringify(formData, null, 2);
        
        // Create and trigger download
        const blob = new Blob([jsonStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `announcement-data-${getCurrentDateString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show success notification
        showToast('Announcement data exported successfully!');
        return true;
    } catch (error) {
        console.error('Error exporting as JSON:', error);
        showToast('Error exporting data. Please try again.', true);
        return false;
    }
}

// Import announcement data from JSON file
function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                // Parse JSON data
                const data = JSON.parse(event.target.result);
                
                // Validate data structure
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid data format');
                }
                
                resolve(data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                reject(error);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file);
    });
}

// Apply imported data to the form
function applyImportedData(data) {
    try {
        // Apply basic fields
        if (data.title) document.getElementById('titleInput').value = data.title;
        if (data.content) document.getElementById('contentInput').value = data.content;
        if (data.date) document.getElementById('dateInput').value = data.date;
        if (data.signerName) document.getElementById('signerNameInput').value = data.signerName;
        if (data.signerTitle) document.getElementById('signerTitleInput').value = data.signerTitle;
        if (data.contactInfo) document.getElementById('contactInfoInput').value = data.contactInfo;
        if (data.logoText) document.getElementById('logoTextInput').value = data.logoText;
        
        // Apply template
        if (data.template) {
            const templateSelector = document.getElementById('templateSelector');
            if (templateSelector) {
                templateSelector.value = data.template;
                applyTemplate(data.template);
            }
        }
        
        // Apply colors
        if (data.colors) {
            if (data.colors.primary) document.querySelector('[data-target="primary"]').value = data.colors.primary;
            if (data.colors.secondary) document.querySelector('[data-target="secondary"]').value = data.colors.secondary;
            if (data.colors.accent) document.querySelector('[data-target="accent"]').value = data.colors.accent;
        }
        
        // Apply language
        if (data.language) {
            currentLanguage = data.language;
            document.querySelectorAll('.language-option').forEach(opt => {
                opt.classList.toggle('active', opt.getAttribute('data-lang') === data.language);
            });
            toggleLanguage(data.language);
        }
        
        // Update preview
        updatePreview();
        
        // Show success notification
        showToast('Announcement data imported successfully!');
        return true;
    } catch (error) {
        console.error('Error applying imported data:', error);
        showToast('Error applying imported data. Please try again.', true);
        return false;
    }
}

// Get current form data
function getCurrentFormData() {
    const data = {
        title: document.getElementById('titleInput').value,
        content: document.getElementById('contentInput').value,
        date: document.getElementById('dateInput').value,
        signerName: document.getElementById('signerNameInput').value,
        signerTitle: document.getElementById('signerTitleInput').value,
        contactInfo: document.getElementById('contactInfoInput').value,
        logoText: document.getElementById('logoTextInput').value,
        template: document.getElementById('templateSelector').value,
        language: currentLanguage,
        colors: {
            primary: document.querySelector('[data-target="primary"]').value,
            secondary: document.querySelector('[data-target="secondary"]').value,
            accent: document.querySelector('[data-target="accent"]').value
        },
        exportDate: new Date().toISOString()
    };
    
    return data;
}

// Export as printer-friendly HTML
function exportAsPrintableHTML() {
    try {
        const previewElement = document.querySelector('.announcement-preview');
        if (!previewElement) throw new Error('Preview element not found');
        
        // Clone the preview for printing
        const printContent = previewElement.cloneNode(true);
        
        // Create a new window
        const printWindow = window.open('', '_blank');
        
        // Write HTML content
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Printable Announcement</title>
                <style>
                    @media print {
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                    
                    .announcement-container {
                        width: 21cm;
                        height: 29.7cm;
                        position: relative;
                        margin: 0 auto;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    ${document.querySelector('style').innerHTML}
                </style>
                ${Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                    .map(link => link.outerHTML)
                    .join('\n')}
            </head>
            <body>
                <div class="announcement-container">${printContent.outerHTML}</div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        
        // Close document
        printWindow.document.close();
        
        return true;
    } catch (error) {
        console.error('Error creating printable version:', error);
        showToast('Error creating printable version. Please try again.', true);
        return false;
    }
} 