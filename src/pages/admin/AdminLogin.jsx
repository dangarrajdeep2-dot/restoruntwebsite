import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldAlert, ArrowLeft, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin({ onLoginSuccess }) {
  const { signIn, isAdmin, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('owner@nandanvan.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        throw error;
      }
      onLoginSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-forest-900/90 border border-gold/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Back Link */}
        <a
          href="#/"
          className="inline-flex items-center space-x-1.5 text-xs text-cream/60 hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Dining Site</span>
        </a>

        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-forest-950 mx-auto mb-3 shadow-[0_0_20px_rgba(212,162,76,0.25)]">
            <Lock className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
            Nandanvan Admin Portal
          </h1>
          <p className="text-xs text-cream/60 mt-1">
            Authorized Owner & Management Personnel Only
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@nandanvan.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'Verifying Access...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        {/* Demo Helper Note */}
        <div className="mt-6 pt-5 border-t border-gold/15 text-center">
          <p className="text-[11px] text-cream/50 leading-relaxed">
            {isSupabaseConfigured
              ? 'Connected to live Supabase Backend. Login with your registered staff profile.'
              : 'Demo mode active. Login with default credentials (owner@nandanvan.com / admin123).'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
