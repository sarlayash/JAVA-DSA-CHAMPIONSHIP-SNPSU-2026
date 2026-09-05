import React, { useState, useEffect } from 'react';
import {
  getStoredCertificates,
  getStoredLearners,
  getStoredRewards,
} from './utils/storage';
import { TEAMS_DATA, CHAMPIONSHIP_META } from './data/championshipData';
import { Certificate, Learner, IssuedReward } from './types';
import { Navbar, NavTab } from './components/Navbar';
import { LearnerPortal } from './components/LearnerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { HallOfFame } from './components/HallOfFame';
import { VerifyView } from './components/VerifyView';
import { CertificateModal } from './components/CertificateModal';
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
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('LEARNER');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [rewardsLog, setRewardsLog] = useState<IssuedReward[]>([]);

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [verifyPreloadId, setVerifyPreloadId] = useState<string>('');

  // Initial load
  const reloadData = () => {
    setCertificates(getStoredCertificates());
    setLearners(getStoredLearners());
    setRewardsLog(getStoredRewards());
  };

  useEffect(() => {
    reloadData();

    // Check hash for direct QR code scanning
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify')) {
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
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        certificatesCount={certificates.length}
      />

      {/* Enterprise Marquee / Announcement Ribbon */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-4 py-2.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-bold tracking-tight text-xs uppercase text-white">
              {CHAMPIONSHIP_META.title}
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              117 Hours
            </span>
            <span className="text-zinc-700">&bull;</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              50 Minds
            </span>
            <span className="text-zinc-700">&bull;</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Sapthgiri NPS University
            </span>
            <span className="text-zinc-700">&bull;</span>
            <span className="text-white font-semibold tracking-wide">
              Mentorship By Kapil
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
            teams={TEAMS_DATA}
            onSelectCertificate={(cert) => setSelectedCertificate(cert)}
            onSelectVerify={handleOpenVerify}
          />
        )}

        {activeTab === 'ADMIN' && (
          <AdminDashboard
            learners={learners}
            certificates={certificates}
            teams={TEAMS_DATA}
            rewardsLog={rewardsLog}
            onRefreshData={reloadData}
            onViewCertificate={(cert) => setSelectedCertificate(cert)}
          />
        )}

        {activeTab === 'LEADERBOARD' && (
          <LeaderboardView
            teams={TEAMS_DATA}
            learners={learners}
            onSelectLearner={handleSelectLearnerByName}
          />
        )}

        {activeTab === 'HALL_OF_FAME' && (
          <HallOfFame onSelectLearner={handleSelectLearnerByName} />
        )}

        {activeTab === 'VERIFY' && (
          <VerifyView
            certificates={certificates}
            initialId={verifyPreloadId}
            onViewCertificate={(cert) => setSelectedCertificate(cert)}
          />
        )}
      </main>

      {/* Certificate Inspection & Download Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        onOpenVerify={handleOpenVerify}
      />

      {/* Global Enterprise Footer (Sophisticated Dark theme with strict Mentorship By Kapil requirement) */}
      <footer className="w-full bg-[#0a0a0a] border-t border-white/5 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight uppercase">
                Sapthgiri NPS University
              </h4>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026
              </p>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                117 hours | 50 Minds | 1 Mission | Building In Public
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm font-bold text-white tracking-normal uppercase">
                Mentorship By Kapil
              </p>
              <p className="text-xs text-blue-400 font-mono mt-0.5 font-medium">
                Lead Mentor &amp; Program Architect
              </p>
              <p className="text-[11px] text-zinc-500 font-mono">
                No signatures needed &bull; Cryptographically QR Verified
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-500 font-mono uppercase tracking-widest gap-2">
            <p>
              &copy; {new Date().getFullYear()} Java DSA Championship &bull; Sapthgiri NPS University
            </p>
            <div className="flex items-center gap-3 normal-case tracking-normal text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" />
                QR Code Certified Ledger
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="text-zinc-500 text-[11px] font-mono">FAANG &amp; Industry Verification Standard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
