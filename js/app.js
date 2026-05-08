// ========== Shared Application Logic ==========

// ========== Auth Guards ==========
function requireUser() {
  if (localStorage.getItem('user') !== '1') {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function requireAdmin() {
  if (localStorage.getItem('admin') !== '1') {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// ========== Toast Notifications ==========
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ========== Sidebar Rendering ==========
function renderSidebar(activePage) {
  const isAdmin = localStorage.getItem('admin') === '1';
  const username = localStorage.getItem('username') || (isAdmin ? '管理员' : '用户');

  let menuItems = '';
  if (isAdmin) {
    menuItems = `
      <a href="classes.html" class="${activePage === 'classes' ? 'active' : ''}"><i class="bi bi-table"></i><span>班次管理</span></a>
      <a href="stats.html" class="${activePage === 'stats' ? 'active' : ''}"><i class="bi bi-bar-chart"></i><span>售票统计</span></a>
      <a href="purchase.html" class="${activePage === 'purchase' ? 'active' : ''}"><i class="bi bi-ticket-perforated"></i><span>售票</span></a>
      <a href="refund.html" class="${activePage === 'refund' ? 'active' : ''}"><i class="bi bi-arrow-return-left"></i><span>退票</span></a>
      <a href="import-export.html" class="${activePage === 'import-export' ? 'active' : ''}"><i class="bi bi-box-arrow-in-down"></i><span>导入导出</span></a>
    `;
  } else {
    menuItems = `
      <a href="purchase.html" class="${activePage === 'purchase' ? 'active' : ''}"><i class="bi bi-ticket-perforated"></i><span>购票</span></a>
      <a href="refund.html" class="${activePage === 'refund' ? 'active' : ''}"><i class="bi bi-arrow-return-left"></i><span>退票</span></a>
    `;
  }

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo"><i class="bi bi-bus-front"></i> 车票管理系统</div>
    <nav class="sidebar-nav">${menuItems}</nav>
    <div class="sidebar-footer">
      <div class="user-info"><i class="bi bi-person-circle"></i> ${username}</div>
      <button class="btn-logout" onclick="logout()"><i class="bi bi-box-arrow-right"></i> 退出登录</button>
    </div>
  `;
}

// ========== Logout ==========
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('admin');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  if (localStorage.getItem('admin') === null && localStorage.getItem('user') === null) {
    // already cleared
  }
  window.location.href = 'index.html';
}

// ========== Slider Verification ==========
function initSliderVerify(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const track = container.querySelector('.slider-track');
  const thumb = container.querySelector('.slider-thumb');
  const fill = container.querySelector('.slider-track-fill');
  const text = container.querySelector('.slider-track-text');

  let isDragging = false;
  let startX = 0;
  let verified = false;

  function getMaxLeft() {
    return track.offsetWidth - thumb.offsetWidth;
  }

  function onPointerDown(e) {
    if (verified) return;
    isDragging = true;
    startX = (e.clientX || e.touches[0].clientX) - thumb.offsetLeft;
    thumb.style.transition = 'none';
    fill.style.transition = 'none';
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging || verified) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    let newLeft = clientX - startX;
    const maxLeft = getMaxLeft();
    if (newLeft < 0) newLeft = 0;
    if (newLeft > maxLeft) newLeft = maxLeft;
    thumb.style.left = newLeft + 'px';
    fill.style.width = (newLeft + thumb.offsetWidth) + 'px';
  }

  function onPointerUp() {
    if (!isDragging || verified) return;
    isDragging = false;
    const maxLeft = getMaxLeft();
    const currentLeft = thumb.offsetLeft;

    if (currentLeft >= maxLeft - 5) {
      // Verified
      verified = true;
      thumb.style.left = maxLeft + 'px';
      fill.style.width = '100%';
      thumb.classList.add('verified');
      text.textContent = '验证通过';
      text.classList.add('verified');
      thumb.innerHTML = '<i class="bi bi-check-lg"></i>';
      container.dataset.verified = 'true';
    } else {
      // Reset
      thumb.style.transition = 'left 0.3s';
      fill.style.transition = 'width 0.3s';
      thumb.style.left = '0px';
      fill.style.width = '0px';
    }
  }

  thumb.addEventListener('mousedown', onPointerDown);
  thumb.addEventListener('touchstart', onPointerDown, { passive: false });
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('touchmove', onPointerMove, { passive: false });
  document.addEventListener('mouseup', onPointerUp);
  document.addEventListener('touchend', onPointerUp);

  return {
    isVerified: () => container.dataset.verified === 'true',
    reset: () => {
      verified = false;
      container.dataset.verified = 'false';
      thumb.style.transition = 'left 0.3s';
      fill.style.transition = 'width 0.3s';
      thumb.style.left = '0px';
      fill.style.width = '0px';
      thumb.classList.remove('verified');
      text.textContent = '向右拖动滑块验证';
      text.classList.remove('verified');
      thumb.innerHTML = '<i class="bi bi-chevron-double-right"></i>';
    }
  };
}

// ========== CSV Export ==========
function exportCSV(data, filename, headers) {
  let csv = '\uFEFF'; // BOM for Chinese support in Excel
  if (headers) {
    csv += headers.join(',') + '\n';
  }
  data.forEach(row => {
    csv += row.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ========== CSV Import ==========
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const result = [];
  for (let i = 1; i < lines.length; i++) { // Skip header
    const cols = lines[i].split(',').map(s => s.trim());
    if (cols.length >= 6) {
      result.push(cols);
    }
  }
  return result;
}

// ========== Date/Time Helpers ==========
function formatDateTime(date) {
  const d = date || new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function canRefund(classId) {
  const cls = getClassById(classId);
  if (!cls) return false;
  const now = new Date();
  const [hours, minutes] = cls.departure.split(':').map(Number);
  // Assume departure is today for simplicity
  const departureTime = new Date();
  departureTime.setHours(hours, minutes, 0, 0);
  const diff = departureTime - now;
  // Cannot refund if less than 1 hour before departure
  return diff > 60 * 60 * 1000;
}

function getClassStatus(classId) {
  const cls = getClassById(classId);
  if (!cls) return 'unknown';
  const now = new Date();
  const [hours, minutes] = cls.departure.split(':').map(Number);
  const departureTime = new Date();
  departureTime.setHours(hours, minutes, 0, 0);
  return now > departureTime ? 'departed' : 'pending';
}

// ========== Generate Ticket ID ==========
function generateTicketId() {
  const tickets = getTickets();
  const maxNum = tickets.reduce((max, t) => {
    const num = parseInt(t.id.replace('T', ''));
    return num > max ? num : max;
  }, 0);
  return 'T' + String(maxNum + 1).padStart(8, '0');
}

// ========== Generate Class ID ==========
function generateClassId() {
  const classes = getClasses();
  const maxNum = classes.reduce((max, c) => {
    const num = parseInt(c.id.replace('K', ''));
    return num > max ? num : max;
  }, 0);
  return 'K' + String(maxNum + 1).padStart(4, '0');
}
