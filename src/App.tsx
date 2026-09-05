import React, { useState, useEffect } from 'react';
import {
  getStoredCertificates,
  getStoredLearners,
  getStoredRewards,
  getStoredTeams,
  getStoredMeta,
  isAdminAuthenticated,
  logoutAdmin,
} from './utils/storage';
import { Certificate, Learner, IssuedReward, Team, ChampionshipMeta } from './types';
import { Navbar, NavTab } from './components/Navbar';
import { LearnerPortal } from './components/LearnerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { HallOfFame } from './components/HallOfFame';
import { VerifyView } from './components/VerifyView';
import { CertificateModal } from './components/CertificateModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Code2,
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  Users,
  Lock,
  ShieldAlert,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('LEARNER');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [meta, setMeta] = useState<ChampionshipMeta>(getStoredMeta());
  const [rewardsLog, setRewardsLog] = useState<IssuedReward[]>([]);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [verifyPreloadId, setVerifyPreloadId] = useState<string>('');

  // Initial load and reload function
  const reloadData = () => {
    setCertificates(getStoredCertificates());
    setLearners(getStoredLearners());
    setTeams(getStoredTeams());
    setMeta(getStoredMeta());
    setRewardsLog(getStoredRewards());
    setIsAdmin(isAdminAuthenticated());
  };

  useEffect(() => {
    reloadData();

    // Check hash for direct QR code scanning or secure admin portal launch
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAuthModalOpen(true);
      } else if (hash.startsWith('#verify')) {
        const urlParams = new URLSearchParams(hash.replace('#verify?', ''));
        const id = urlParams.get('id');
        if (id) {
          setVerifyPreloadId(id);
          setActiveTab('VERIFY');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Global administrator hotkey (Ctrl + Shift + A or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Real-time synchronization event listener across all tabs & views!
    const handleDataUpdated = () => {
      reloadData();
    };
    window.addEventListener('jdsa_data_updated', handleDataUpdated);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('jdsa_data_updated', handleDataUpdated);
    };
  }, []);

  // Admin Login success handler
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setIsAuthModalOpen(false);
    setActiveTab('ADMIN');
  };

  // Admin Logout handler
  const handleAdminLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    if (activeTab === 'ADMIN') {
      setActiveTab('LEARNER');
    }
  };

  // Jump to verify screen with specific ID
  const handleOpenVerify = (certId: string) => {
    setSelectedCertificate(null);
    setVerifyPreloadId(certId);
    setActiveTab('VERIFY');
  };

  // Jump to learner from leaderboard or hall of fame
  const handleSelectLearnerByName = (name: string) => {
    setActiveTab('LEARNER');
    const cert = certificates.find(
      (c) => c.recipientName.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (cert) {
      setSelectedCertificate(cert);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      {/* Top Navigation Bar with locked/unlocked Admin status & Spectrum Ribbon */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        certificatesCount={certificates.length}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setIsAuthModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Enterprise Marquee / Announcement Ribbon (Microsoft & Google Clean Corporate Style) */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 text-xs font-mono shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
            <span className="font-extrabold tracking-tight text-xs uppercase text-slate-900">
              {meta.title}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-[#1a73e8]" />
              {meta.totalHours} Hours
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Users className="w-3.5 h-3.5 text-[#ea4335]" />
              {meta.totalMinds || 50} Minds
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Code2 className="w-3.5 h-3.5 text-[#34a853]" />
              1 Mission &bull; Building In Public
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Building2 className="w-3.5 h-3.5 text-[#1a73e8]" />
              Sapthgiri NPS University
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-[#1a73e8] font-bold tracking-wide">
              {meta.mentorship}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'LEARNER' && (
          <LearnerPortal
            learners={learners}
            certificates={certificates}
            teams={teams}
            onSelectCertificate={(cert) => setSelectedCertificate(cert)}
            onSelectVerify={handleOpenVerify}
            isAdmin={isAdmin}
            onOpenAdminAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'ADMIN' && (
          isAdmin ? (
            <AdminDashboard
              learners={learners}
              certificates={certificates}
              teams={teams}
              rewardsLog={rewardsLog}
              onRefreshData={reloadData}
              onViewCertificate={(cert) => setSelectedCertificate(cert)}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
              <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">Restricted Administrator Console</h3>
              <p className="text-xs text-slate-500 mt-1">
                Access to this section is restricted to authorized championship mentors and administrators.
              </p>
              <button
                onClick={() => setActiveTab('LEARNER')}
                className="mt-5 px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Return to Public Portal
              </button>
            </div>
          )
        )}

        {activeTab === 'LEADERBOARD' && (
          <LeaderboardView
            teams={teams}
            learners={learners}
            onSelectLearner={handleSelectLearnerByName}
          />
        )}

        {activeTab === 'HALL_OF_FAME' && (
          <HallOfFame
            teams={teams}
            meta={meta}
            onSelectLearner={handleSelectLearnerByName}
          />
        )}

        {activeTab === 'VERIFY' && (
          <VerifyView
            certificates={certificates}
            initialId={verifyPreloadId}
            onViewCertificate={(cert) => setSelectedCertificate(cert)}
          />
        )}
      </main>

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Certificate Inspection & Download Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        onOpenVerify={handleOpenVerify}
      />

      {/* Global Enterprise Footer (Strictly Mentorship By Kapil & No Signs Needed) */}
      <footer className="w-full bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">
                Sapthgiri NPS University
              </h4>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {meta.totalHours} hours | {meta.totalMinds || 50} Minds | 1 Mission | Building In Public
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm font-extrabold text-slate-900 tracking-normal uppercase">
                Mentorship By Kapil
              </p>
              <p className="text-xs text-[#1a73e8] font-mono mt-0.5 font-bold">
                Lead Mentor &amp; Program Architect
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                No signatures needed &bull; Cryptographically QR Verified
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest gap-2">
            <div className="flex items-center gap-2">
              <p>
                &copy; {new Date().getFullYear()} Java DSA Championship &bull; Sapthgiri NPS University
              </p>
              {!isAdmin && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  title="Administrator Access (Ctrl+Shift+A or #admin)"
                  className="opacity-25 hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Admin Portal Access"
                >
                  <Lock className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 normal-case tracking-normal text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-emerald-700 font-mono text-[11px] font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                QR Code Certified Ledger
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-500 text-[11px] font-mono">FAANG &amp; Industry Verification Standard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
