import React from 'react';
import {
  ShieldCheck,
  Award,
  Trophy,
  LayoutDashboard,
  QrCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export type NavTab = 'LEARNER' | 'ADMIN' | 'LEADERBOARD' | 'HALL_OF_FAME' | 'VERIFY';

interface Props {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  certificatesCount: number;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, certificatesCount }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Brand */}
          <div
            onClick={() => setActiveTab('LEARNER')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 p-[1px] shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-amber-400 font-bold font-serif text-sm">
                JDSA
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide group-hover:text-amber-400 transition">
                  Java DSA Championship
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                Sapthgiri NPS University &bull; Mentorship By Kapil
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('LEARNER')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'LEARNER'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Learners
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'ADMIN'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Portal
            </button>

            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Leaderboard
            </button>

            <button
              onClick={() => setActiveTab('HALL_OF_FAME')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'HALL_OF_FAME'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Hall of Fame
            </button>

            <button
              onClick={() => setActiveTab('VERIFY')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'VERIFY'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify QR
            </button>
          </nav>

          {/* Right Action: QR Scan Quick Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('VERIFY')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-mono">Scan QR</span>
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <span className="hidden sm:inline">Issue Reward</span>
              <span className="sm:hidden">Issue</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800 text-xs font-mono overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('LEARNER')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'LEARNER' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Learners
          </button>
          <button
            onClick={() => setActiveTab('ADMIN')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'ADMIN' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'LEADERBOARD' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setActiveTab('HALL_OF_FAME')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'HALL_OF_FAME' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Hall of Fame
          </button>
          <button
            onClick={() => setActiveTab('VERIFY')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'VERIFY' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400'
            }`}
          >
            Verify
          </button>
        </div>
      </div>
    </header>
  );
};
