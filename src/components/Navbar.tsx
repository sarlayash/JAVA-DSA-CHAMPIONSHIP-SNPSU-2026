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
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Brand per Sophisticated Dark specification */}
          <div
            onClick={() => setActiveTab('LEARNER')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded flex items-center justify-center font-bold text-white text-sm shadow-sm">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-white text-sm sm:text-base">
                  CHAMPIONSHIP PORTAL <span className="text-blue-500">2026</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Sapthgiri NPS
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono tracking-tight">
                Mentorship By Kapil &bull; Official Credential Registry
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#050505] p-1 rounded-lg border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab('LEARNER')}
              className={`px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'LEARNER'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Learners
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'ADMIN'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Portal
            </button>

            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Leaderboard
            </button>

            <button
              onClick={() => setActiveTab('HALL_OF_FAME')}
              className={`px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'HALL_OF_FAME'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Hall of Fame
            </button>

            <button
              onClick={() => setActiveTab('VERIFY')}
              className={`px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'VERIFY'
                  ? 'bg-white/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-gray-400 hover:text-emerald-400 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify QR
            </button>
          </nav>

          {/* Right Action: QR Scan & Issue Certificate Quick Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('VERIFY')}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-mono">Verify QR</span>
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="hidden sm:inline">Issue Certificate</span>
              <span className="sm:hidden">Issue</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-white/5 text-xs font-mono overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('LEARNER')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'LEARNER' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400'
            }`}
          >
            Learners
          </button>
          <button
            onClick={() => setActiveTab('ADMIN')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'ADMIN' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'LEADERBOARD' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400'
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setActiveTab('HALL_OF_FAME')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'HALL_OF_FAME' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400'
            }`}
          >
            Hall of Fame
          </button>
          <button
            onClick={() => setActiveTab('VERIFY')}
            className={`px-2.5 py-1 rounded ${
              activeTab === 'VERIFY' ? 'bg-white/10 text-emerald-400' : 'text-gray-400'
            }`}
          >
            Verify
          </button>
        </div>
      </div>
    </header>
  );
};
