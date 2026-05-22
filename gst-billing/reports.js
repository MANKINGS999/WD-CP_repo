// Filter functionality
function applyFilters() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const filterBy = document.getElementById('filterBy').value;

    // Validate dates
    if (!fromDate || !toDate) {
        alert('Please select both From Date and To Date');
        return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
        alert('From Date cannot be greater than To Date');
        return;
    }

    console.log('Filters applied:', { fromDate, toDate, filterBy });
    
    // Show confirmation
    let statusText = filterBy ? (filterBy === 'paid' ? 'Paid Invoices' : 'Unpaid Invoices') : 'All Invoices';
    alert(`Filters Applied!\n\nFrom: ${fromDate}\nTo: ${toDate}\nStatus: ${statusText}`);

    // Here you would typically make an API call
    // fetchReportData(fromDate, toDate, filterBy);
}

// Pagination functions
let currentPage = 1;
const itemsPerPage = 8;

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
    }
}

function nextPage() {
    currentPage++;
    loadPage(currentPage);
}

function loadPage(pageNum) {
    console.log('Loading page:', pageNum);
    // Update pagination UI
    updatePaginationUI(pageNum);
    // Scroll to table
    document.querySelector('.table-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updatePaginationUI(pageNum) {
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.classList.remove('active');
    });
    // Add active class to current page link
    if (paginationLinks[pageNum - 1]) {
        paginationLinks[pageNum - 1].classList.add('active');
    }
}

// Sidebar active menu item
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    
    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Date filter with default values
function initializeDateFilters() {
    const toDate = new Date();
    const fromDate = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - 20);

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');

    if (fromDateInput) fromDateInput.value = formatDate(fromDate);
    if (toDateInput) toDateInput.value = formatDate(toDate);
}

// Export report as CSV
function exportReport() {
    const table = document.querySelector('.report-table');
    let csv = [];
    
    // Get headers
    const headers = [];
    table.querySelectorAll('th').forEach(th => {
        headers.push(th.textContent.trim());
    });
    csv.push(headers.join(','));

    // Get rows
    table.querySelectorAll('tbody tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push('"' + td.textContent.trim() + '"');
        });
        csv.push(row.join(','));
    });

    // Create CSV file and download
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Print report
function printReport() {
    window.print();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setActiveMenu();
    initializeDateFilters();

    // Add keyboard shortcut for filter (Ctrl+Enter)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            applyFilters();
        }
    });

    // Add enter key listener to date inputs
    document.getElementById('fromDate')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applyFilters();
    });

    document.getElementById('toDate')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applyFilters();
    });
});

// Mock API call (replace with actual API endpoint)
async function fetchReportData(fromDate, toDate, filterBy) {
    try {
        console.log('Fetching report data...', { fromDate, toDate, filterBy });
        // const response = await fetch(`/api/reports?fromDate=${fromDate}&toDate=${toDate}&status=${filterBy}`);
        // const data = await response.json();
        // updateTableData(data);
    } catch (error) {
        console.error('Error fetching report data:', error);
        alert('Error loading report data. Please try again.');
    }
}

// Update table with new data
function updateTableData(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">No records found</td></tr>';
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.date}</td>
            <td>${row.invoiceNo}</td>
            <td>${row.customer}</td>
            <td class="text-right">₹${row.taxableAmount.toLocaleString()}</td>
            <td class="text-right">₹${row.cgst.toLocaleString()}</td>
            <td class="text-right">₹${row.sgst.toLocaleString()}</td>
            <td class="text-right">₹${row.total.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Search functionality
function searchInTable(searchTerm) {
    const tableRows = document.querySelectorAll('.report-table tbody tr');
    const term = searchTerm.toLowerCase();

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Sort table by column
function sortTable(columnIndex) {
    const table = document.querySelector('.report-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.querySelectorAll('td')[columnIndex].textContent.trim();
        const bValue = b.querySelectorAll('td')[columnIndex].textContent.trim();

        // Try numeric sort first
        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }

        // Fallback to string sort
        return aValue.localeCompare(bValue);
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session/localStorage
        localStorage.clear();
        sessionStorage.clear();
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Make logout button work
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
