import React from 'react';
import {
  ShieldCheck,
  Award,
  Trophy,
  LayoutDashboard,
  QrCode,
  Sparkles,
  Lock,
  Unlock,
  LogOut,
  ChevronRight,
  Sparkle,
} from 'lucide-react';

export type NavTab = 'LEARNER' | 'ADMIN' | 'LEADERBOARD' | 'HALL_OF_FAME' | 'VERIFY';

interface Props {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  certificatesCount: number;
  isAdmin: boolean;
  onOpenAdminAuth: () => void;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  certificatesCount,
  isAdmin,
  onOpenAdminAuth,
  onLogoutAdmin,
}) => {
  const handleAdminClick = () => {
    if (isAdmin) {
      setActiveTab('ADMIN');
    } else {
      onOpenAdminAuth();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      {/* Top Google & Microsoft Signature Spectrum Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand / Logo */}
          <div
            onClick={() => setActiveTab('LEARNER')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#1a73e8] to-[#1557b0] rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm border border-blue-200">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base">
                  JAVA DSA CHAMPIONSHIP <span className="text-[#1a73e8]">2026</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Sapthgiri NPS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans tracking-tight">
                Mentorship By Kapil &bull; Official Credential Registry
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Google/Microsoft Clean Style) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('LEARNER')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'LEARNER'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#1a73e8]" />
              Learners
            </button>

            {/* Admin Portal Tab - Shows Lock icon if not authenticated */}
            <button
              onClick={handleAdminClick}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'ADMIN'
                  ? 'bg-white text-[#1a73e8] shadow-xs font-bold'
                  : isAdmin
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {isAdmin ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>Admin Portal</span>
              {!isAdmin && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Locked
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#fbbc04]" />
              Leaderboard
            </button>

            <button
              onClick={() => setActiveTab('HALL_OF_FAME')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'HALL_OF_FAME'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ea4335]" />
              Hall of Fame
            </button>

            <button
              onClick={() => setActiveTab('VERIFY')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'VERIFY'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#34a853]" />
              Verify QR
            </button>
          </nav>

          {/* Right Action: Admin Status / Quick Actions */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Admin: kapiladmin</span>
                </div>
                <button
                  onClick={onLogoutAdmin}
                  title="Lock Admin and log out"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Admin is locked on home landing page - click to unlock"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Admin Access</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('VERIFY')}
              className="px-3 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="font-sans">Verify</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 text-xs font-medium overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('LEARNER')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'LEARNER' ? 'bg-[#1a73e8] text-white font-bold' : 'text-slate-600'
            }`}
          >
            Learners
          </button>
          <button
            onClick={handleAdminClick}
            className={`px-3 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
              activeTab === 'ADMIN' ? 'bg-[#1a73e8] text-white font-bold' : 'text-slate-600'
            }`}
          >
            {!isAdmin && <Lock className="w-3 h-3 text-amber-500" />}
            Admin
          </button>
          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'LEADERBOARD' ? 'bg-[#1a73e8] text-white font-bold' : 'text-slate-600'
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setActiveTab('HALL_OF_FAME')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'HALL_OF_FAME' ? 'bg-[#1a73e8] text-white font-bold' : 'text-slate-600'
            }`}
          >
            Hall of Fame
          </button>
          <button
            onClick={() => setActiveTab('VERIFY')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'VERIFY' ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' : 'text-slate-600'
            }`}
          >
            Verify
          </button>
        </div>
      </div>
    </header>
  );
};
