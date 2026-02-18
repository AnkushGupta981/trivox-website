let rawData = [];
let headers = [];

// 1. CSV File Processing
document.getElementById('csvInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        
        headers = rows[0];
        rawData = rows.slice(1).filter(row => row.length === headers.length);
        
        updateUI();
        showToast("File Uploaded Successfully");
    };
    reader.readAsText(file);
});

function updateUI() {
    document.getElementById('dropZone').style.display = 'none';
    document.getElementById('toolControls').style.display = 'block';
    document.getElementById('rowCount').innerText = `Rows: ${rawData.length}`;
    document.getElementById('colCount').innerText = `Columns: ${headers.length}`;
    renderPreview();
}

function renderPreview() {
    const table = document.getElementById('previewTable');
    let html = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    html += `<tbody>${rawData.slice(0, 5).map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
    table.innerHTML = html;
}

// 2. Cleaning Functions
function cleanData(type) {
    switch(type) {
        case 'trim':
            rawData = rawData.map(row => row.map(cell => cell.trim()));
            showToast("Spaces Trimmed");
            break;
        case 'duplicates':
            const seen = new Set();
            rawData = rawData.filter(row => {
                const s = JSON.stringify(row);
                return seen.has(s) ? false : seen.add(s);
            });
            showToast("Duplicates Removed");
            break;
        case 'empty':
            rawData = rawData.filter(row => row.some(cell => cell !== ""));
            showToast("Empty Rows Dropped");
            break;
    }
    updateUI();
}

// 3. Export Logic
function downloadCSV() {
    const csvContent = [headers, ...rawData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "trivox_cleaned_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 4. Utility Functions
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) nav.style.background = "rgba(10, 0, 18, 0.95)";
    else nav.style.background = "rgba(10, 0, 18, 0.8)";
});
