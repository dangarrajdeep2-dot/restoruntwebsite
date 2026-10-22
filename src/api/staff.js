// Staff management API for Admin, Waiter, and Cook users
const STORAGE_KEY = 'nandanvan_staff_users';

export const initialStaffUsers = [
  {
    id: 'staff-admin-01',
    full_name: 'Maharaj Digvijay (Owner / Admin)',
    email: 'admin@nandanvan.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98250 84721',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    is_active: true
  },
  {
    id: 'staff-waiter-01',
    full_name: 'Ramesh Bhai (Floor Captain)',
    email: 'waiter@nandanvan.com',
    password: 'waiter123',
    role: 'waiter',
    phone: '+91 98250 11111',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    is_active: true
  },
  {
    id: 'staff-cook-01',
    full_name: 'Maharaj Ketan (Head Chef)',
    email: 'cook@nandanvan.com',
    password: 'cook123',
    role: 'cook',
    phone: '+91 98250 22222',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    is_active: true
  }
];

export function getLocalStaff() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStaffUsers));
    return initialStaffUsers;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialStaffUsers;
  } catch {
    return initialStaffUsers;
  }
}

export function saveLocalStaff(staffList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
}

export async function getStaffList() {
  return { data: getLocalStaff(), error: null };
}

export async function createStaffUser({ full_name, email, password, role, phone }) {
  const staff = getLocalStaff();
  const existing = staff.find(
    s => s.email.trim().toLowerCase() === email.trim().toLowerCase()
  );
  if (existing) {
    return { data: null, error: new Error('User with this email/username already exists') };
  }

  const newUser = {
    id: `staff-${Date.now()}`,
    full_name: full_name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    role: role || 'waiter', // 'waiter' | 'cook' | 'admin'
    phone: phone || '',
    created_at: new Date().toISOString(),
    is_active: true
  };

  staff.push(newUser);
  saveLocalStaff(staff);
  return { data: newUser, error: null };
}

export async function updateStaffUser(id, updates) {
  const staff = getLocalStaff();
  const idx = staff.findIndex(s => s.id === id);
  if (idx === -1) {
    return { data: null, error: new Error('Staff user not found') };
  }

  staff[idx] = { ...staff[idx], ...updates, updated_at: new Date().toISOString() };
  saveLocalStaff(staff);
  return { data: staff[idx], error: null };
}

export async function deleteStaffUser(id) {
  const staff = getLocalStaff();
  const userToDelete = staff.find(s => s.id === id);
  if (userToDelete && userToDelete.email === 'admin@nandanvan.com') {
    return { data: null, error: new Error('Primary admin account cannot be deleted') };
  }
  const filtered = staff.filter(s => s.id !== id);
  saveLocalStaff(filtered);
  return { data: { success: true }, error: null };
}

export async function authenticateStaff(usernameOrEmail, password) {
  const staff = getLocalStaff();
  const cleanId = usernameOrEmail.trim().toLowerCase();
  const cleanPass = password.trim();

  // Also support owner@nandanvan.com alias
  const user = staff.find(
    s => (s.email.toLowerCase() === cleanId || (cleanId === 'owner@nandanvan.com' && s.role === 'admin')) &&
         s.password === cleanPass
  );

  if (!user) {
    return { data: null, error: new Error('Invalid credentials. Please verify your email/username and password.') };
  }

  if (!user.is_active) {
    return { data: null, error: new Error('This account has been deactivated by the Admin.') };
  }

  return { data: user, error: null };
}
