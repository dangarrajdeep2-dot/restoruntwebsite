import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ChefHat, 
  Utensils, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Trash2, 
  Key, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { getStaffList, createStaffUser, updateStaffUser, deleteStaffUser } from '../../api/staff';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // Form State
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'waiter',
    phone: '',
  });

  const loadStaff = async () => {
    setLoading(true);
    const { data } = await getStaffList();
    if (data) setStaff(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const showNotification = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3500);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const { data, error } = await createStaffUser(form);
    if (error) {
      showNotification(error.message, 'error');
      return;
    }

    showNotification(`New ${form.role.toUpperCase()} user "${form.full_name}" created successfully!`);
    setIsModalOpen(false);
    setForm({ full_name: '', email: '', password: '', role: 'waiter', phone: '' });
    loadStaff();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete staff user "${name}"?`)) return;
    const { error } = await deleteStaffUser(id);
    if (error) {
      showNotification(error.message, 'error');
      return;
    }
    showNotification(`User "${name}" deleted.`);
    loadStaff();
  };

  const togglePasswordReveal = (id) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyCredentials = (user) => {
    const text = `Nandanvan Portal Credentials:\nRole: ${user.role.toUpperCase()}\nUsername: ${user.email}\nPassword: ${user.password}\nPortal Link: ${window.location.origin}/#/portal`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    showNotification(`Copied credentials for ${user.full_name} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const waiters = staff.filter((s) => s.role === 'waiter');
  const cooks = staff.filter((s) => s.role === 'cook');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-cream flex items-center space-x-2">
            <Users className="w-5 h-5 text-gold" />
            <span>Staff & User Management</span>
          </h3>
          <p className="text-xs text-cream/60">
            Create and manage accounts and passwords for Waiters (Captains) and Kitchen Cookers
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-gold/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Staff User</span>
        </button>
      </div>

      {/* Notifications */}
      {statusMsg.text && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
            statusMsg.type === 'error'
              ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
          }`}
        >
          {statusMsg.type === 'error' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-cream/60 uppercase font-semibold block">Total Staff</span>
            <span className="font-serif text-2xl font-bold text-gold">{staff.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gold/15 text-gold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-cream/60 uppercase font-semibold block">Floor Waiters</span>
            <span className="font-serif text-2xl font-bold text-amber-300">{waiters.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-cream/60 uppercase font-semibold block">Kitchen Cookers</span>
            <span className="font-serif text-2xl font-bold text-saffron">{cooks.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-saffron/15 text-saffron">
            <ChefHat className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Staff Accounts Table */}
      <div className="rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gold/20 flex items-center justify-between">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">
            Active Staff User Accounts & Passwords
          </h4>
          <span className="text-[10px] text-cream/50">
            Direct portal links: <a href="#/portal/waiter" className="text-gold underline">Waiter Portal</a> | <a href="#/portal/cook" className="text-gold underline">Cook KDS</a>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-950/80 text-cream/60 border-b border-gold/15 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Login Username / Email</th>
                <th className="py-3 px-4">Password</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {staff.map((user) => {
                const isRevealed = revealedPasswords[user.id];
                const isCopied = copiedId === user.id;

                return (
                  <tr key={user.id} className="hover:bg-forest-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            user.role === 'admin'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : user.role === 'cook'
                              ? 'bg-saffron/20 text-saffron border border-saffron/40'
                              : 'bg-gold/20 text-gold border border-gold/40'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : user.role === 'cook' ? (
                            <ChefHat className="w-4 h-4" />
                          ) : (
                            <Utensils className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-cream block">{user.full_name}</span>
                          <span className="text-[10px] text-cream/50">
                            Created {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : user.role === 'cook'
                            ? 'bg-saffron/20 text-saffron border border-saffron/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cream/90">
                      {user.email}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-forest-950 border border-gold/20 text-gold font-bold">
                          {isRevealed ? user.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordReveal(user.id)}
                          className="p-1 text-cream/50 hover:text-gold"
                          title={isRevealed ? 'Hide Password' : 'Show Password'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-cream/70">
                      {user.phone || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Copy credentials */}
                        <button
                          onClick={() => copyCredentials(user)}
                          className="p-1.5 rounded-lg bg-forest-950 border border-gold/25 text-cream/80 hover:text-gold hover:border-gold"
                          title="Copy Login Info to Clipboard"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete user */}
                        {user.email !== 'admin@nandanvan.com' && (
                          <button
                            onClick={() => handleDelete(user.id, user.full_name)}
                            className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/80"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-forest-900 border border-gold/40 rounded-2xl shadow-2xl p-6 text-xs">
            <h4 className="font-serif text-lg font-bold text-cream mb-1 flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-gold" />
              <span>Create New Staff Account</span>
            </h4>
            <p className="text-cream/60 mb-5">
              Add a Waiter or Cook user. You can set their password and share it with them.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-cream/80 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Bhai (Captain) or Ketan Bhai (Chef)"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                >
                  <option value="waiter">Floor Waiter / Captain (Takes customer orders on phone)</option>
                  <option value="cook">Kitchen Cook / Chef (Receives KOT orders & ticks items)</option>
                </select>
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Login Username / Email *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. waiter2@nandanvan.com or cook2@nandanvan.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Password *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. waiter123 or cook123"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-gold font-mono font-bold focus:outline-none focus:border-gold"
                />
                <span className="text-[10px] text-cream/40">Keep it memorable so staff can easily log in on their phones.</span>
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Mobile Phone (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 98250 XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gold/25 text-cream/70 hover:bg-forest-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold uppercase tracking-wider shadow-lg hover:shadow-gold/30 transition-all"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
