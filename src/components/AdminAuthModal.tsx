import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, X, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { HARDCODED_ADMIN, loginAdmin } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginAdmin(adminId, passcode);
      setIsLoading(false);
      if (ok) {
        onSuccess();
      } else {
        setError('Invalid Admin ID or Passcode. Please use verified official credentials.');
      }
    }, 250);
  };

  const handleFillDemo = () => {
    setAdminId(HARDCODED_ADMIN.adminId);
    setPasscode(HARDCODED_ADMIN.passcode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
        {/* Top Google/Microsoft Colorful Ribbon Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

        {/* Modal Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-mono font-semibold border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RESTRICTED ACCESS
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Admin Authentication</h3>
                <p className="text-xs text-slate-500">Official Championship Command Center</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="px-6 py-3 bg-slate-50 border-y border-slate-100 text-xs text-slate-600 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            Locked on home landing page. Enter administrator credentials to edit standings, titles &amp; rewards.
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono tracking-wider">
              Admin ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. kapiladmin"
                autoFocus
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono tracking-wider">
              Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm font-medium"
              />
            </div>
          </div>

          {/* Quick Credential Helper Pill */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div>
              <span className="font-semibold block text-[11px] text-blue-700 uppercase font-mono">
                Hard-coded Credentials:
              </span>
              <p className="font-mono text-xs mt-0.5">
                ID: <span className="font-bold text-blue-800">kapiladmin</span> &bull; Pass: <span className="font-bold text-blue-800">admin123</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100/50 rounded-lg text-[11px] font-bold transition shadow-2xs cursor-pointer"
            >
              Auto-fill
            </button>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 py-2.5 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-md hover:shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 font-mono text-center">
          Sapthgiri NPS University &bull; Mentorship By Kapil
        </div>
      </div>
    </div>
  );
};
