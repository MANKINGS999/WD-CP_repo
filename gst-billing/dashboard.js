$(function () {

  /* ── 1. Today's Date ──────────────────────────── */
  const today = new Date();
  const opts  = { day:'2-digit', month:'short', year:'numeric' };
  $('#today-date').text(today.toLocaleDateString('en-IN', opts));

  /* ── 2. Invoice Data ──────────────────────────── */
  const invoices = [
    { no:'INV-10024', customer:'Rahul Traders',       date:'20 May 2024', amount:2360, status:'Paid'    },
    { no:'INV-10023', customer:'Sharma Enterprises',  date:'19 May 2024', amount:5900, status:'Paid'    },
    { no:'INV-10022', customer:'Kiran Stores',         date:'18 May 2024', amount:1180, status:'Unpaid'  },
    { no:'INV-10021', customer:'Amit Sales',           date:'17 May 2024', amount:3540, status:'Paid'    },
  ];

  function renderTable(data) {
    const tbody = $('#invoices-table tbody');
    tbody.empty();
    $.each(data, function (i, inv) {
      const cls = inv.status === 'Paid' ? 'paid' : inv.status === 'Unpaid' ? 'unpaid' : 'pending';
      const row = `
        <tr>
          <td><span style="font-weight:600;color:var(--accent)">${inv.no}</span></td>
          <td>${inv.customer}</td>
          <td style="color:var(--text-muted)">${inv.date}</td>
          <td style="font-weight:600">₹${inv.amount.toLocaleString('en-IN')}</td>
          <td><span class="status-badge ${cls}">${inv.status}</span></td>
        </tr>`;
      tbody.append(row);
    });
  }
  renderTable(invoices);

  /* ── 3. View All toggle ───────────────────────── */
  let showingAll = false;
  const allInvoices = [
    ...invoices,
    { no:'INV-10020', customer:'Priya Retail',    date:'16 May 2024', amount:2100, status:'Pending' },
    { no:'INV-10019', customer:'Gupta Brothers',  date:'15 May 2024', amount:4400, status:'Paid'    },
  ];
  $('#view-all-btn').on('click', function () {
    showingAll = !showingAll;
    renderTable(showingAll ? allInvoices : invoices);
    $(this).text(showingAll ? 'Show Less' : 'View All');
    showToast(showingAll ? 'Showing all invoices' : 'Showing recent invoices', 'info');
  });

  /* ── 4. Animated Counter ──────────────────────── */
  function animateCounters() {
    $('.counter').each(function () {
      const $el  = $(this);
      const end  = parseInt($el.data('target'));
      const dur  = 1400; // ms
      const step = 16;
      const inc  = end / (dur / step);
      let cur = 0;
      const timer = setInterval(function () {
        cur += inc;
        if (cur >= end) { cur = end; clearInterval(timer); }
        $el.text(Math.floor(cur).toLocaleString('en-IN'));
      }, step);
    });
  }
  animateCounters();

  /* ── 5. GST Progress Bars ─────────────────────── */
  setTimeout(function () {
    $('.gst-fill').each(function () {
      $(this).css('width', $(this).data('pct') + '%');
    });
  }, 400);

  /* ── 6. Sidebar Toggle (mobile) ──────────────── */
  $('#sidebar-toggle').on('click', function () {
    $('#sidebar').toggleClass('open');
  });
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#sidebar, #sidebar-toggle').length) {
      $('#sidebar').removeClass('open');
    }
  });

  /* ── 7. Logout confirm ────────────────────────── */
  $('#logout-btn').on('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      showToast('Logged out successfully!', 'success');
    }
  });

  /* ── 8. Print demo ────────────────────────────── */
  $('#print-demo').on('click', function (e) {
    e.preventDefault();
    showToast('Print / Download feature coming soon!', 'warning');
  });

  /* ── 9. Toast helper ──────────────────────────── */
  function showToast(msg, type) {
    const colors = {
      success: '#10b981', info: '#0368ff',
      warning: '#f59e0b', danger: '#ef4444'
    };
    const icons  = {
      success:'check-circle', info:'info-circle',
      warning:'exclamation-triangle', danger:'x-circle'
    };
    const id = 'toast-' + Date.now();
    const html = `
      <div id="${id}" style="
        background:#fff; border-radius:12px; padding:14px 18px;
        box-shadow:0 8px 30px rgba(0,0,0,.14); display:flex;
        align-items:center; gap:12px; margin-top:10px;
        min-width:260px; border-left:4px solid ${colors[type]};
        animation: slideIn .3s ease;
      ">
        <i class="bi bi-${icons[type]}" style="font-size:18px;color:${colors[type]}"></i>
        <span style="font-size:13px;font-weight:500;color:#1a2540">${msg}</span>
      </div>`;
    $('#toast-wrap').append(html);
    setTimeout(function () { $(`#${id}`).fadeOut(300, function(){ $(this).remove(); }); }, 3000);
  }

  /* ── 10. Highlight active nav on click ───────── */
  $('.nav-link').on('click', function () {
    if (!$(this).is('#logout-btn')) {
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    }
  });

  /* ── CSS keyframe for toast ───────────────────── */
  $('<style>@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}</style>')
    .appendTo('head');

});