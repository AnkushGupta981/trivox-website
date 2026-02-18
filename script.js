// Global State
const state = {
    csvData: null,
    originalData: null,
    isDarkMode: false,
    currentFile: null
};

// DOM Elements
const elements = {
    darkToggle: document.querySelector('.dark-toggle'),
    backToTop: document.querySelector('.back-to-top'),
    processBtn: document.getElementById('processBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    jsonBtn: document.getElementById('jsonBtn'),
    csvFile: document.getElementById('csvFile'),
    fileInfo: document.getElementById('fileInfo'),
    previewTable: document.getElementById('previewTable'),
    stats: document.getElementById('stats')
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    initEventListeners();
    initScrollReveal();
    initSmoothScroll();
    loadTheme();
    setupCSVHandlers();
}

// Event Listeners
function initEventListeners() {
    // Dark mode toggle
    elements.darkToggle?.addEventListener('click', toggleDarkMode);
    
    // File upload
    elements.csvFile?.addEventListener('change', handleFileUpload);
    
    // Process button
    elements.processBtn?.addEventListener('click', processCSV);
    
    // Download buttons
    elements.downloadBtn?.addEventListener('click', downloadCleanCSV);
    elements.jsonBtn?.addEventListener('click', downloadJSON);
    
    // Navbar links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
}

// Dark Mode
function toggleDarkMode() {
    state.isDarkMode = !state.isDarkMode;
    document.documentElement.setAttribute('data-theme', state.isDarkMode ? 'dark' : 'light');
    localStorage.setItem('trivox-theme', state.isDarkMode ? 'dark' : 'light');
    elements.darkToggle.textContent = state.isDarkMode ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('trivox-theme') || 'light';
    state.isDarkMode = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    elements.darkToggle.textContent = state.isDarkMode ? '☀️' : '🌙';
}

// CSV Tool Functionality
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('File too large. Max 10MB.', 'error');
        return;
    }

    state.currentFile = file;
    elements.fileInfo.innerHTML = `
        <div class="file-info">
            📄 ${file.name}<br>
            📏 ${formatFileSize(file.size)} 
        </div>
    `;
    
    parseCSV(file);
    elements.processBtn.disabled = false;
}

function parseCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            state.originalData = parseCSVContent(e.target.result);
            renderPreview(state.originalData);
            updateStats(state.originalData);
        } catch (error) {
            showToast('Invalid CSV file.', 'error');
        }
    };
    reader.readAsText(file);
}

function parseCSVContent(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) throw new Error('Empty file');
    
    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(line => parseCSVLine(line));
    
    return { headers, rows };
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

function processCSV() {
    if (!state.originalData) return;
    
    elements.processBtn.innerHTML = '<span class="loading"></span> Processing...';
    elements.processBtn.disabled = true;
    
    setTimeout(() => {
        const options = {
            removeDuplicates: document.getElementById('removeDuplicates').checked,
            trimSpaces: document.getElementById('trimSpaces').checked,
            normalizeCase: document.getElementById('normalizeCase').checked,
            removeEmpty: document.getElementById('removeEmpty').checked
        };
        
        state.csvData = cleanCSVData(state.originalData, options);
        renderPreview(state.csvData);
        updateStats(state.csvData);
        
        elements.downloadBtn.disabled = false;
        elements.jsonBtn.disabled = false;
        elements.processBtn.innerHTML = '✅ Processed!';
        
        showToast('CSV cleaned successfully!', 'success');
    }, 500);
}

function cleanCSVData(data, options) {
    let rows = [...data.rows];
    
    // Remove empty rows
    if (options.removeEmpty) {
        rows = rows.filter(row => row.some(cell => cell && cell.trim()));
    }
    
    // Trim spaces
    if (options.trimSpaces) {
        rows = rows.map(row => row.map(cell => cell ? cell.trim() : ''));
    }
    
    // Normalize case
    if (options.normalizeCase) {
        rows = rows.map(row => row.map(cell => cell ? cell.toLowerCase() : ''));
    }
    
    // Remove duplicates
    if (options.removeDuplicates) {
        const seen = new Set();
        rows = rows.filter(row => {
            const key = JSON.stringify(row);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    return { ...data, rows };
}

function renderPreview(data) {
    if (!data) return;
    
    let html = `<thead><tr>${data.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>`;
    
    // Show first 10 rows max
    const rowsToShow = data.rows.slice(0, 10);
    rowsToShow.forEach(row => {
        html += `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`;
    });
    
    if (data.rows.length > 10) {
        html += `<tr><td colspan="${data.headers.length}" style="text-align:center; padding:2rem;">
            ... and ${data.rows.length - 10} more rows
        </td></tr>`;
    }
    
    html += '</tbody>';
    elements.previewTable.innerHTML = html;
}

function updateStats(data) {
    if (!data) return;
    
    const totalRows = data.rows.length;
    const totalCols = data.headers.length;
    const emptyCells = data.rows.reduce((count, row) => 
        count + row.filter(cell => !cell || !cell.trim()).length, 0);
    
    elements.stats.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${totalRows.toLocaleString()}</div>
            <div class="stat-label">Rows</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${totalCols}</div>
            <div class="stat-label">Columns</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${Math.round(emptyCells / (totalRows * totalCols) * 100)}%</div>
            <div class="stat-label">Empty Cells</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${formatFileSize(estimateFileSize(data))}</div>
            <div class="stat-label">Est. Size</div>
        </div>
    `;
}

function downloadCleanCSV() {
    if (!state.csvData) return;
    
    const csvContent = generateCSV(state.csvData);
    downloadFile(csvContent, state.currentFile.name.replace('.csv', '_cleaned.csv'), 'text/csv');
}

function downloadJSON() {
    if (!state.csvData) return;
    
    const jsonData = {
        headers: state.csvData.headers,
        rows: state.csvData.rows,
        generated: new Date().toISOString()
    };
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    downloadFile(jsonContent, state.currentFile.name.replace('.csv', '_cleaned.json'), 'application/json');
}

function generateCSV(data) {
    const headerRow = data.headers.join(',');
    const rows = data.rows.map(row => row.join(','));
    return [headerRow, ...rows].join('\n');
}

// Utilities
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function estimateFileSize(data) {
    const csvSize = generateCSV(data).length;
    return csvSize * 1.2; // Rough estimate
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// UI Interactions
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

function initSmoothScroll() {
    // Back to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            elements.backToTop.classList.add('show');
        } else {
            elements.backToTop.classList.remove('show');
        }
    });
    
    elements.backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupCSVHandlers() {
    // Only run on tools page
    if (!elements.csvFile) return;
    
    // Enable/disable process button based on checkboxes
    document.querySelectorAll('.cleaning-options input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            elements.processBtn.disabled = !state.currentFile;
        });
    });
}

// Add toast styles to existing CSS via JS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    .toast { box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
`;
document.head.appendChild(toastStyle);
