import React, { useState } from 'react';
import { X, User, Mail, Phone, LogOut, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import type { User as UserType } from '../types/bakery';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  onLogout: () => void;
  onOpenOrders: () => void;
  onGoToAdminPortal: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onRegister,
  onLogout,
  onOpenOrders,
  onGoToAdminPortal,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email.trim(), password);
      } else {
        if (email.trim().toLowerCase() === 'thebakerscorner@admin.com') {
          setError('This email address is reserved. Please use the dedicated Admin Portal to log in.');
          setLoading(false);
          return;
        }
        await onRegister(email.trim(), password, fullName.trim(), phone.trim());
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomerLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await onLogin('niro@example.com', 'niro123');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] text-[#f0f0f0] max-w-md w-full overflow-hidden shadow-2xl border border-[rgba(240,240,240,0.15)] my-8 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[rgba(240,240,240,0.1)] bg-[#161618] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1a1a1c] border border-[rgba(240,240,240,0.15)] flex items-center justify-center text-[#d48b7a]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#d48b7a] block">
                The Baker's Corner
              </span>
              <h2 className="font-syne text-lg font-bold uppercase text-[#f0f0f0]">
                {user ? 'Customer Profile' : mode === 'login' ? 'Customer Sign In' : 'Create Account'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#f0f0f0]/70 hover:text-white hover:bg-[#1a1a1c] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Customer is Logged In */}
        {user ? (
          <div className="p-6 space-y-5">
            <div className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-syne text-base font-bold uppercase text-[#f0f0f0]">{user.fullName}</span>
                <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-[#111113] text-[#d48b7a] border border-[#d48b7a]/40">
                  {user.role === 'admin' ? 'Master Baker Admin' : 'Valued Patron'}
                </span>
              </div>
              <p className="font-mono text-xs text-[#f0f0f0]/70 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#d48b7a]" />
                <span>{user.email}</span>
              </p>
              {user.phone && (
                <p className="font-mono text-xs text-[#f0f0f0]/70 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#d48b7a]" />
                  <span>{user.phone}</span>
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5 font-mono text-xs uppercase">
              <button
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="w-full py-3 bg-[#f0f0f0] text-[#111113] hover:bg-[#d48b7a] font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>Track My Past Orders</span>
                <ArrowRight className="w-4 h-4 text-[#111113]" />
              </button>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 border border-[rgba(240,240,240,0.2)] text-red-400 font-bold hover:bg-red-950/30 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In & Create Account Form */
          <div className="p-6 space-y-5">
            {/* Mode Switcher */}
            <div className="flex bg-[#161618] p-1 border border-[rgba(240,240,240,0.1)]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 font-mono text-xs uppercase font-bold transition-all ${
                  mode === 'login' ? 'bg-[#d48b7a] text-[#111113]' : 'text-[#f0f0f0]/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-2 font-mono text-xs uppercase font-bold transition-all ${
                  mode === 'register' ? 'bg-[#d48b7a] text-[#111113]' : 'text-[#f0f0f0]/60 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="bg-red-950/60 text-red-300 p-3.5 text-xs border border-red-800 font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Niranjan Reddy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    />
                  </div>
                  <div>
                    <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Mobile Number (For Delivery Updates)</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              {mode === 'register' && (
                <div className="bg-[#1a1a1c] p-2.5 border border-[rgba(240,240,240,0.1)] font-mono text-[11px] text-[#d48b7a] flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Get 10% off your first cake with code <strong>SWEET10</strong>!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-1"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Sign In to Account'
                  : 'Create My Account'}
              </button>
            </form>

            {/* Quick Demo Customer Shortcut */}
            <div className="pt-3 border-t border-[rgba(240,240,240,0.1)] space-y-2">
              <button
                type="button"
                onClick={handleDemoCustomerLogin}
                className="w-full py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] font-mono text-xs uppercase text-[#f0f0f0] hover:border-[#d48b7a] transition-colors"
              >
                Sign In with Demo Patron (Niro)
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToAdminPortal();
                  }}
                  className="font-mono text-xs text-[#d48b7a] hover:underline uppercase font-bold"
                >
                  Bakery Staff? Open Admin Portal →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
