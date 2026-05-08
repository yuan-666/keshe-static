// ========== Mock Data for Ticket Management System ==========

const MOCK_USERS = [
  { id: 1, username: 'user1', password: '123456', role: 'user', name: '张三' },
  { id: 2, username: 'user2', password: '123456', role: 'user', name: '李四' },
  { id: 3, username: 'user3', password: '123456', role: 'user', name: '王五' },
  { id: 4, username: 'admin', password: 'admin123', role: 'admin', name: '管理员' }
];

const MOCK_CLASSES = [
  { id: 'K1001', departure: '08:00', origin: '北京', destination: '上海', duration: '5h30m', capacity: 50 },
  { id: 'K1002', departure: '09:30', origin: '北京', destination: '广州', duration: '8h00m', capacity: 45 },
  { id: 'K1003', departure: '10:00', origin: '上海', destination: '深圳', duration: '6h20m', capacity: 40 },
  { id: 'K1004', departure: '11:30', origin: '广州', destination: '成都', duration: '7h15m', capacity: 35 },
  { id: 'K1005', departure: '13:00', origin: '成都', destination: '重庆', duration: '2h00m', capacity: 60 },
  { id: 'K1006', departure: '14:00', origin: '北京', destination: '天津', duration: '1h00m', capacity: 80 },
  { id: 'K1007', departure: '15:30', origin: '上海', destination: '杭州', duration: '1h30m', capacity: 55 },
  { id: 'K1008', departure: '07:00', origin: '深圳', destination: '厦门', duration: '4h00m', capacity: 42 },
  { id: 'K1009', departure: '16:00', origin: '武汉', destination: '长沙', duration: '2h30m', capacity: 48 },
  { id: 'K1010', departure: '17:30', origin: '南京', destination: '合肥', duration: '1h45m', capacity: 50 },
  { id: 'K1011', departure: '19:00', origin: '杭州', destination: '宁波', duration: '1h20m', capacity: 38 },
  { id: 'K1012', departure: '20:30', origin: '重庆', destination: '贵阳', duration: '5h00m', capacity: 44 }
];

const MOCK_TICKETS = [
  { id: 'T20240001', passenger: '张三', classId: 'K1001', seatType: '靠窗/前排', purchaseTime: '2026-05-07 07:30', userId: 1 },
  { id: 'T20240002', passenger: '李四', classId: 'K1002', seatType: '过道/后排', purchaseTime: '2026-05-07 08:15', userId: 2 },
  { id: 'T20240003', passenger: '王五', classId: 'K1003', seatType: '靠窗/后排', purchaseTime: '2026-05-07 09:00', userId: 3 },
  { id: 'T20240004', passenger: '张三', classId: 'K1005', seatType: '过道/前排', purchaseTime: '2026-05-07 10:20', userId: 1 },
  { id: 'T20240005', passenger: '李四', classId: 'K1007', seatType: '靠窗/前排', purchaseTime: '2026-05-07 11:00', userId: 2 },
  { id: 'T20240006', passenger: '王五', classId: 'K1006', seatType: '靠窗/后排', purchaseTime: '2026-05-07 12:30', userId: 3 },
  { id: 'T20240007', passenger: '张三', classId: 'K1009', seatType: '过道/后排', purchaseTime: '2026-05-07 13:45', userId: 1 },
  { id: 'T20240008', passenger: '李四', classId: 'K1004', seatType: '靠窗/前排', purchaseTime: '2026-05-07 14:00', userId: 2 },
  { id: 'T20240009', passenger: '王五', classId: 'K1010', seatType: '过道/前排', purchaseTime: '2026-05-07 15:30', userId: 3 },
  { id: 'T20240010', passenger: '张三', classId: 'K1008', seatType: '靠窗/后排', purchaseTime: '2026-05-07 16:00', userId: 1 },
  { id: 'T20240011', passenger: '李四', classId: 'K1011', seatType: '过道/后排', purchaseTime: '2026-05-07 17:00', userId: 2 },
  { id: 'T20240012', passenger: '王五', classId: 'K1012', seatType: '靠窗/前排', purchaseTime: '2026-05-07 18:00', userId: 3 },
  { id: 'T20240013', passenger: '张三', classId: 'K1003', seatType: '过道/前排', purchaseTime: '2026-05-07 19:00', userId: 1 },
  { id: 'T20240014', passenger: '李四', classId: 'K1005', seatType: '靠窗/后排', purchaseTime: '2026-05-07 20:00', userId: 2 },
  { id: 'T20240015', passenger: '王五', classId: 'K1001', seatType: '过道/前排', purchaseTime: '2026-05-07 21:00', userId: 3 }
];

// ========== Initialize localStorage ==========
function initData() {
  if (!localStorage.getItem('initialized')) {
    localStorage.setItem('users', JSON.stringify(MOCK_USERS));
    localStorage.setItem('classes', JSON.stringify(MOCK_CLASSES));
    localStorage.setItem('tickets', JSON.stringify(MOCK_TICKETS));
    localStorage.setItem('initialized', 'true');
  }
}

// ========== Data Access Helpers ==========
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function getClasses() {
  return JSON.parse(localStorage.getItem('classes') || '[]');
}

function getTickets() {
  return JSON.parse(localStorage.getItem('tickets') || '[]');
}

function setClasses(data) {
  localStorage.setItem('classes', JSON.stringify(data));
}

function setTickets(data) {
  localStorage.setItem('tickets', JSON.stringify(data));
}

function setUsers(data) {
  localStorage.setItem('users', JSON.stringify(data));
}

function getClassById(classId) {
  return getClasses().find(c => c.id === classId);
}

function getTicketCountByClass(classId) {
  return getTickets().filter(t => t.classId === classId).length;
}

function getRemainingSeats(classId) {
  const cls = getClassById(classId);
  if (!cls) return 0;
  return cls.capacity - getTicketCountByClass(classId);
}

// Initialize on load
initData();
