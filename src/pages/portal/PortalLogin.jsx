import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ChefHat, 
  Utensils, 
  Key, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PortalLogin({ onLoginSuccess }) {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await signIn(username, password);
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Invalid credentials. Please check your username and password.');
      return;
    }

    if (data?.user) {
      const role = data.user.role;
      if (onLoginSuccess) {
        onLoginSuccess(role);
      } else {
        if (role === 'cook') {
          window.location.hash = '#/portal/cook';
        } else if (role === 'waiter') {
          window.location.hash = '#/portal/waiter';
        } else {
          window.location.hash = '#/admin';
        }
      }
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setUsername('admin@nandanvan.com');
      setPassword('admin123');
    } else if (role === 'waiter') {
      setUsername('waiter@nandanvan.com');
      setPassword('waiter123');
    } else if (role === 'cook') {
      setUsername('cook@nandanvan.com');
      setPassword('cook123');
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial ambiance */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-gradient-to-tr from-gold/15 to-saffron/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-3 bg-forest-900 shadow-[0_0_25px_rgba(212,162,76,0.25)]">
            <span className="font-serif text-gold text-2xl font-bold">N</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient tracking-wide">
            NANDANVAN RESTAURANT
          </h1>
          <p className="text-xs text-cream/70 uppercase tracking-[0.2em] font-sans mt-1">
            Staff & Operations Portal
          </p>
        </div>

        {/* Quick Role Helper Chips */}
        <div className="mb-4 p-2.5 rounded-2xl bg-forest-900/60 border border-gold/25 text-xs text-center backdrop-blur-md">
          <span className="text-[10px] text-cream/50 uppercase tracking-wider block mb-2 font-semibold">
            One-Tap Quick Login Fill:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 rounded-xl bg-forest-950 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 text-[11px] font-bold flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('waiter')}
              className="py-1.5 px-2 rounded-xl bg-forest-950 border border-gold/30 text-gold hover:border-gold text-[11px] font-bold flex items-center justify-center space-x-1"
            >
              <Utensils className="w-3 h-3 text-gold" />
              <span>Waiter</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('cook')}
              className="py-1.5 px-2 rounded-xl bg-forest-950 border border-saffron/30 text-saffron hover:border-saffron text-[11px] font-bold flex items-center justify-center space-x-1"
            >
              <ChefHat className="w-3 h-3 text-saffron" />
              <span>Cooker</span>
            </button>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="rounded-3xl bg-forest-900/90 border border-gold/30 p-6 sm:p-8 shadow-2xl backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-cream/80 mb-1.5">
                Staff Email / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                <input
                  type="text"
                  required
                  placeholder="admin@nandanvan.com or waiter@nandanvan.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream/80 mb-1.5">
                Staff Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/50 hover:text-gold"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-forest-950 border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gold/15 text-center">
            <a
              href="#/"
              className="text-xs text-cream/60 hover:text-gold transition-colors inline-flex items-center space-x-1"
            >
              <span>← Back to Public Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
