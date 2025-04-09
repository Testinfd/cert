// Template configurations
const templates = {
    standard: {
        name: 'Standard',
        fonts: [
            'Montserrat',
            'Raleway'
        ],
        colors: {
            primary: '#2a3b4c',
            secondary: '#ce8e2c',
            accent: '#134e65'
        },
        styles: {
            background: '#ffffff',
            padding: '50px'
        }
    },
    formal: {
        name: 'Formal',
        fonts: [
            'Montserrat',
            'Raleway'
        ],
        colors: {
            primary: '#1a2c3f',
            secondary: '#8a0202',
            accent: '#283e5d'
        },
        styles: {
            background: '#ffffff',
            padding: '50px',
            border: '10px solid #1a2c3f'
        }
    },
    elegant: {
        name: 'Elegant',
        fonts: [
            'Cormorant Garamond',
            'Montserrat',
            'Great Vibes'
        ],
        colors: {
            primary: '#76323f',
            secondary: '#c09f80',
            accent: '#565656'
        },
        styles: {
            background: '#fffdf9',
            padding: '50px',
            border: '1px solid #c09f80'
        }
    },
    modern: {
        name: 'Modern',
        fonts: [
            'Space Grotesk',
            'Inter'
        ],
        colors: {
            primary: '#16213e',
            secondary: '#e94560',
            accent: '#0f3460'
        },
        styles: {
            background: '#ffffff',
            padding: '50px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }
    },
    festive: {
        name: 'Festive',
        fonts: [
            'Poppins',
            'Raleway'
        ],
        colors: {
            primary: '#5c2a9d',
            secondary: '#fdca40',
            accent: '#0a81ab'
        },
        styles: {
            background: '#fffbf4',
            padding: '50px',
            position: 'relative',
            overflow: 'hidden'
        }
    },
    minimal: {
        name: 'Minimal',
        fonts: [
            'Inter',
            'Space Grotesk'
        ],
        colors: {
            primary: '#333333',
            secondary: '#666666',
            accent: '#999999'
        },
        styles: {
            background: '#ffffff',
            padding: '60px',
            border: '1px solid #eeeeee',
            boxShadow: 'none'
        }
    },
    corporate: {
        name: 'Corporate',
        fonts: [
            'Montserrat',
            'Inter'
        ],
        colors: {
            primary: '#1c273c',
            secondary: '#3d7b90',
            accent: '#5c93a7'
        },
        styles: {
            background: '#ffffff',
            padding: '50px',
            borderLeft: '5px solid #1c273c'
        }
    },
    gradient: {
        name: 'Gradient',
        fonts: [
            'Poppins',
            'Inter'
        ],
        colors: {
            primary: '#3a1c71',
            secondary: '#d76d77',
            accent: '#ffaf7b'
        },
        styles: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
            padding: '50px'
        }
    },
    brutalist: {
        name: 'Brutalist',
        fonts: [
            'Space Grotesk',
            'Inter'
        ],
        colors: {
            primary: '#000000',
            secondary: '#000000',
            accent: '#000000'
        },
        styles: {
            background: '#f0f0f0',
            padding: '50px',
            border: '3px solid #000000',
            boxShadow: '10px 10px 0 rgba(0,0,0,0.9)'
        }
    },
    glassmorphism: {
        name: 'Glassmorphism',
        fonts: [
            'Inter',
            'Poppins'
        ],
        colors: {
            primary: '#3a1c71',
            secondary: '#d76d77',
            accent: '#ffaf7b'
        },
        styles: {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4))',
            padding: '50px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
        }
    },
    '3d': {
        name: '3D Effect',
        fonts: [
            'Montserrat',
            'Space Grotesk'
        ],
        colors: {
            primary: '#2a3b4c',
            secondary: '#ce8e2c',
            accent: '#134e65'
        },
        styles: {
            background: '#ffffff',
            padding: '50px',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            transform: 'rotateX(5deg) rotateY(-5deg)',
            boxShadow: '20px 20px 60px rgba(0,0,0,0.1), -20px -20px 60px rgba(255,255,255,0.8)'
        },
        premium: true
    },
    'parallax': {
        name: 'Parallax',
        fonts: [
            'Poppins',
            'Inter'
        ],
        colors: {
            primary: '#1e3c72',
            secondary: '#2a5298',
            accent: '#4776ad'
        },
        styles: {
            background: '#ffffff',
            padding: '50px',
            position: 'relative',
            overflow: 'hidden'
        },
        premium: true
    },
    'neon': {
        name: 'Neon',
        fonts: [
            'Space Grotesk',
            'Inter'
        ],
        colors: {
            primary: '#6d00cc',
            secondary: '#ff00e6',
            accent: '#00e4ff'
        },
        styles: {
            background: '#0a0a0a',
            padding: '50px',
            border: '1px solid rgba(255, 0, 230, 0.5)',
            boxShadow: '0 0 20px rgba(255, 0, 230, 0.5), inset 0 0 20px rgba(255, 0, 230, 0.2)'
        },
        premium: true
    },
    'paper': {
        name: 'Paper',
        fonts: [
            'Courier New',
            'monospace'
        ],
        colors: {
            primary: '#8b5a3c',
            secondary: '#9c6644',
            accent: '#7d5c45'
        },
        styles: {
            background: '#f9f5e9',
            padding: '50px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid #e4dcbe',
            position: 'relative'
        },
        premium: true
    },
    'magazine': {
        name: 'Magazine',
        fonts: [
            'Space Grotesk',
            'Inter'
        ],
        colors: {
            primary: '#000000',
            secondary: '#000000',
            accent: '#333333'
        },
        styles: {
            background: '#ffffff',
            padding: '40px'
        },
        premium: true
    }
};

// Color themes
const colorThemes = [
    {
        name: 'Default',
        id: 'default',
        colors: {
            primary: '#2a3b4c',
            secondary: '#ce8e2c',
            accent: '#134e65'
        }
    },
    {
        name: 'Navy Gold',
        id: 'navy-gold',
        colors: {
            primary: '#0c2340',
            secondary: '#b4975a',
            accent: '#1d4e8f'
        }
    },
    {
        name: 'Forest',
        id: 'forest',
        colors: {
            primary: '#2c3e50',
            secondary: '#27ae60',
            accent: '#16a085'
        }
    },
    {
        name: 'Wine',
        id: 'wine',
        colors: {
            primary: '#591c21',
            secondary: '#a39171',
            accent: '#88292f'
        }
    },
    {
        name: 'Monochrome',
        id: 'monochrome',
        colors: {
            primary: '#222222',
            secondary: '#666666',
            accent: '#999999'
        }
    },
    {
        name: 'Pastel',
        id: 'pastel',
        colors: {
            primary: '#6b9080',
            secondary: '#f6aa1c',
            accent: '#a4c3b2'
        }
    },
    {
        name: 'Slate',
        id: 'slate',
        colors: {
            primary: '#34495e',
            secondary: '#9b59b6',
            accent: '#8e44ad'
        }
    },
    {
        name: 'Sunset',
        id: 'sunset',
        colors: {
            primary: '#2c3e50',
            secondary: '#e67e22',
            accent: '#d35400'
        }
    },
    {
        name: 'Oceanic',
        id: 'oceanic',
        colors: {
            primary: '#1e3a8a',
            secondary: '#0ea5e9',
            accent: '#0369a1'
        }
    },
    {
        name: 'Business',
        id: 'business',
        colors: {
            primary: '#212529',
            secondary: '#6c757d',
            accent: '#495057'
        }
    }
];

// Layout configurations
const layouts = {
    default: {
        name: 'Default',
        className: ''
    },
    centered: {
        name: 'Centered',
        className: 'layout-centered'
    },
    split: {
        name: 'Split',
        className: 'layout-split'
    },
    card: {
        name: 'Card',
        className: 'layout-card'
    },
    'magazine-split': {
        name: 'Magazine Split',
        className: 'layout-magazine-split',
        premium: true
    },
    'grid': {
        name: 'Grid',
        className: 'layout-grid',
        premium: true
    },
    'hero': {
        name: 'Hero',
        className: 'layout-hero',
        premium: true
    }
};

// Template presets with pre-populated content
const templatePresets = {
    event: {
        title: 'Event Announcement',
        content: 'We are excited to announce our upcoming event [Event Name] that will take place on [Event Date] at [Event Location]. This event will feature [Event Features].\n\nRegistration is open from [Start Date] to [End Date]. Please register before the deadline to secure your spot.\n\nFor more information, please contact the organizing committee.',
        noticeType: 'EVENT'
    },
    meeting: {
        title: 'Meeting Notice',
        content: 'This is to inform all members that a meeting has been scheduled for [Meeting Date] at [Meeting Time] in [Meeting Location].\n\nAgenda:\n1. [Agenda Item 1]\n2. [Agenda Item 2]\n3. [Agenda Item 3]\n\nAll members are requested to attend this meeting without fail. Please bring all necessary documents and be punctual.',
        noticeType: 'MEETING'
    },
    general: {
        title: 'General Announcement',
        content: 'This is to inform all concerned that [Announcement Content].\n\nEffective Date: [Effective Date]\n\nAll are requested to take note of this announcement and act accordingly.',
        noticeType: 'NOTICE'
    },
    holiday: {
        title: 'Holiday Announcement',
        content: 'This is to inform all that the office/institution will remain closed on [Holiday Date] on account of [Holiday Name].\n\nNormal operations will resume on [Resumption Date].\n\nFor any urgent matters during the holiday, please contact [Emergency Contact].',
        noticeType: 'HOLIDAY'
    },
    achievement: {
        title: 'Achievement Announcement',
        content: 'We are proud to announce that [Person/Team Name] has achieved [Achievement Details] on [Achievement Date].\n\nThis remarkable achievement reflects the dedication and hard work put in by [Person/Team Name].\n\nPlease join us in congratulating [Person/Team Name] for this outstanding accomplishment.',
        noticeType: 'ACHIEVEMENT'
    }
};

// Function to load a template preset
function loadTemplatePreset(presetId) {
    console.log('Loading preset:', presetId);
    
    // Define preset content
    const presets = {
        'event': {
            title: 'Event Announcement',
            content: 'We are pleased to announce that our annual conference will take place on [date] at [venue].\n\nThis year\'s theme is "[theme]" and we have an exciting lineup of speakers and activities planned.\n\nRegistration is now open. Early bird tickets are available until [early bird deadline].',
            signerName: 'Event Coordinator',
            signerTitle: 'Events Team',
            contactInfo: 'events@example.com | +1-555-1234'
        },
        'meeting': {
            title: 'Meeting Notice',
            content: 'A meeting of the [committee/team] will be held on [date] at [time] in [location].\n\nAgenda:\n1. Welcome and Introduction\n2. Review of Previous Minutes\n3. Discussion of [main topic]\n4. Any Other Business\n5. Date of Next Meeting\n\nPlease confirm your attendance by replying to this notice.',
            signerName: 'Committee Chair',
            signerTitle: 'Secretary',
            contactInfo: 'secretary@example.com | Ext. 5678'
        },
        'general': {
            title: 'General Announcement',
            content: 'This is to inform all concerned that [announcement details].\n\nThis change will take effect from [effective date].\n\nFor any queries or clarification, please contact the undersigned.',
            signerName: 'John Smith',
            signerTitle: 'Director',
            contactInfo: 'john.smith@example.com | +1-555-7890'
        },
        'holiday': {
            title: 'Holiday Announcement',
            content: 'We wish to inform all employees that our office will remain closed from [start date] to [end date] on account of [holiday/festival].\n\nRegular operations will resume on [resumption date].\n\nWishing everyone a pleasant holiday!',
            signerName: 'HR Manager',
            signerTitle: 'Human Resources',
            contactInfo: 'hr@example.com | +1-555-4321'
        },
        'achievement': {
            title: 'Achievement Announcement',
            content: 'We are proud to announce that [person/team] has [achievement details].\n\nThis outstanding achievement highlights our commitment to excellence and continuous improvement.\n\nPlease join us in congratulating [them/him/her] on this remarkable accomplishment.',
            signerName: 'CEO',
            signerTitle: 'Chief Executive Officer',
            contactInfo: 'ceo@example.com | +1-555-8765'
        }
    };
    
    // Get selected preset
    const preset = presets[presetId];
    if (!preset) {
        console.error('Preset not found:', presetId);
        return;
    }
    
    // Update form fields with preset content
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const signerNameInput = document.getElementById('signerNameInput');
    const signerTitleInput = document.getElementById('signerTitleInput');
    const contactInfoInput = document.getElementById('contactInfoInput');
    
    // Update form inputs
    if (titleInput) titleInput.value = preset.title;
    if (contentInput) contentInput.value = preset.content;
    if (signerNameInput) signerNameInput.value = preset.signerName;
    if (signerTitleInput) signerTitleInput.value = preset.signerTitle;
    if (contactInfoInput) contactInfoInput.value = preset.contactInfo;
    
    // Force an update of the preview
    if (typeof updatePreview === 'function') {
        console.log('Updating preview after loading preset');
        updatePreview();
    } else {
        console.error('updatePreview function not found');
    }
    
    console.log('Preset loaded successfully:', presetId);
}

// Function to get template configuration
function getTemplateConfig(templateId) {
    return templates[templateId] || templates.standard;
}

// Function to apply a color theme
function applyColorTheme(themeId) {
    const theme = colorThemes.find(theme => theme.id === themeId);
    if (!theme) return false;
    
    // Update color pickers
    document.querySelector('[data-target="primary"]').value = theme.colors.primary;
    document.querySelector('[data-target="secondary"]').value = theme.colors.secondary;
    document.querySelector('[data-target="accent"]').value = theme.colors.accent;
    
    // Update preview
    updatePreview();
    
    return true;
} 