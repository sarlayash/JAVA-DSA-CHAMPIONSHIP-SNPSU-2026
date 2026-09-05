import React, { useState } from 'react';
import {
  Learner,
  Certificate,
  CertificateType,
  BadgeType,
  MedalLevel,
  IssuedReward,
  Team,
  ChampionshipMeta,
} from '../types';
import { RECOGNITION_FRAMEWORK } from '../data/championshipData';
import {
  issueNewCertificate,
  awardBadgeToLearner,
  awardMedalToLearner,
  updateTeam,
  updateLearner,
  updateCertificate,
  deleteCertificate,
  saveMeta,
  getStoredMeta,
  notifyDataUpdated,
  updateAdminCredentials,
  resetAdminCredentialsToDefault,
  hasCustomAdminCredentials,
} from '../utils/storage';
import {
  Award,
  ShieldCheck,
  PlusCircle,
  Users,
  Medal,
  CheckCircle,
  FileCheck,
  Zap,
  Sparkles,
  History,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  Trophy,
  Sliders,
  CheckCircle2,
  Search,
  ChevronRight,
  TrendingUp,
  Layers,
  FileText,
  Star,
  Activity,
  Lock,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  learners: Learner[];
  certificates: Certificate[];
  teams: Team[];
  rewardsLog: IssuedReward[];
  onRefreshData: () => void;
  onViewCertificate: (cert: Certificate) => void;
}

type AdminViewTab = 'TEAMS' | 'LEARNERS' | 'META' | 'ISSUE' | 'LEDGER' | 'SECURITY';

export const AdminDashboard: React.FC<Props> = ({
  learners,
  certificates,
  teams,
  rewardsLog,
  onRefreshData,
  onViewCertificate,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminViewTab>('TEAMS');

  // Notification / Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ----------------------------------------------------
  // Team Editor State
  // ----------------------------------------------------
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamForm, setTeamForm] = useState<{
    name: string;
    totalPoints: number;
    rank: number;
    award: string;
    demos: number;
    topTeam: boolean;
  }>({
    name: '',
    totalPoints: 0,
    rank: 1,
    award: '',
    demos: 0,
    topTeam: false,
  });

  const handleStartEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      totalPoints: team.totalPoints,
      rank: team.rank,
      award: team.award,
      demos: team.demos || 0,
      topTeam: Boolean(team.topTeam),
    });
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    const updated: Team = {
      ...editingTeam,
      totalPoints: Number(teamForm.totalPoints),
      rank: Number(teamForm.rank),
      award: teamForm.award.trim(),
      demos: Number(teamForm.demos),
      topTeam: teamForm.topTeam,
    };

    updateTeam(updated);
    onRefreshData();
    setEditingTeam(null);
    showToast(`Updated ${updated.name} numbers & awards live on Home page!`);
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}
  };

  // ----------------------------------------------------
  // Learner Editor State
  // ----------------------------------------------------
  const [learnerSearch, setLearnerSearch] = useState('');
  const [editingLearner, setEditingLearner] = useState<Learner | null>(null);
  const [learnerForm, setLearnerForm] = useState<{
    points: number;
    posts: number;
    posters: number;
    videos: number;
    projects: number;
    pdfs: number;
    titleInput: string;
    starOfDay: string;
    isTongueTwisterChampion: boolean;
    badges: BadgeType[];
    medals: MedalLevel[];
  }>({
    points: 0,
    posts: 0,
    posters: 0,
    videos: 0,
    projects: 0,
    pdfs: 0,
    titleInput: '',
    starOfDay: '',
    isTongueTwisterChampion: false,
    badges: [],
    medals: [],
  });

  const handleStartEditLearner = (learner: Learner) => {
    setEditingLearner(learner);
    setLearnerForm({
      points: learner.points || 0,
      posts: learner.posts || 0,
      posters: learner.posters || 0,
      videos: learner.videos || 0,
      projects: learner.projects || 0,
      pdfs: learner.pdfs || 0,
      titleInput: learner.titles ? learner.titles.join(', ') : '',
      starOfDay: learner.starOfDay || '',
      isTongueTwisterChampion: Boolean(learner.isTongueTwisterChampion),
      badges: learner.badges ? [...learner.badges] : [],
      medals: learner.medals ? [...learner.medals] : [],
    });
  };

  const handleSaveLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLearner) return;

    const parsedTitles = learnerForm.titleInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: Learner = {
      ...editingLearner,
      points: Number(learnerForm.points),
      posts: Number(learnerForm.posts),
      posters: Number(learnerForm.posters),
      videos: Number(learnerForm.videos),
      projects: Number(learnerForm.projects),
      pdfs: Number(learnerForm.pdfs),
      titles: parsedTitles,
      starOfDay: learnerForm.starOfDay.trim() || undefined,
      isTongueTwisterChampion: learnerForm.isTongueTwisterChampion,
      badges: learnerForm.badges,
      medals: learnerForm.medals,
    };

    updateLearner(updated);
    onRefreshData();
    setEditingLearner(null);
    showToast(`Pushed changes for ${updated.name} live in real time!`);
    try {
      confetti({ particleCount: 45, spread: 65 });
    } catch {}
  };

  // ----------------------------------------------------
  // Championship Meta Numbers State
  // ----------------------------------------------------
  const [metaForm, setMetaForm] = useState<ChampionshipMeta>(getStoredMeta());

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    saveMeta(metaForm);
    onRefreshData();
    showToast('Championship stats pushed live to all portal headers & footers!');
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
  };

  // ----------------------------------------------------
  // Issuance State
  // ----------------------------------------------------
  const [selectedLearnerId, setSelectedLearnerId] = useState(learners[0]?.id || '');
  const [certType, setCertType] = useState<CertificateType>('Certificate of Merit');
  const [titleAwarded, setTitleAwarded] = useState('Logic Master');

  // Badge State
  const [badgeLearnerId, setBadgeLearnerId] = useState(learners[0]?.id || '');
  const [selectedBadge, setSelectedBadge] = useState<BadgeType>('Top Performer');

  // Medal State
  const [medalLearnerId, setMedalLearnerId] = useState(learners[0]?.id || '');
  const [selectedMedal, setSelectedMedal] = useState<MedalLevel>('Gold Medal');

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const learner = learners.find((l) => l.id === selectedLearnerId);
    if (!learner) return;

    const cert = issueNewCertificate(learner.name, learner.team, certType, titleAwarded);

    onRefreshData();
    showToast(`Successfully issued ${certType} for ${learner.name}`);
    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch (err) {}
    onViewCertificate(cert);
  };

  const handleAwardBadge = (e: React.FormEvent) => {
    e.preventDefault();
    const learner = learners.find((l) => l.id === badgeLearnerId);
    if (!learner) return;

    awardBadgeToLearner(learner.id, selectedBadge);
    onRefreshData();
    showToast(`Awarded ${selectedBadge} to ${learner.name}`);
    try {
      confetti({ particleCount: 35, spread: 50 });
    } catch (err) {}
  };

  const handleAwardMedal = (e: React.FormEvent) => {
    e.preventDefault();
    const learner = learners.find((l) => l.id === medalLearnerId);
    if (!learner) return;

    awardMedalToLearner(learner.id, selectedMedal);
    onRefreshData();
    showToast(`Awarded ${selectedMedal} to ${learner.name}`);
    try {
      confetti({ particleCount: 40, spread: 55 });
    } catch (err) {}
  };

  const handleBulkIssueAllParticipation = () => {
    if (
      !window.confirm(
        'Are you sure you want to issue official Participation Certificates to all learners without one?'
      )
    ) {
      return;
    }

    let count = 0;
    learners.forEach((l) => {
      const alreadyHas = certificates.some(
        (c) =>
          c.recipientName.toLowerCase() === l.name.toLowerCase() &&
          c.certificateType === 'Certificate of Participation'
      );
      if (!alreadyHas) {
        issueNewCertificate(
          l.name,
          l.team,
          'Certificate of Participation',
          'Official Certificate of Participation'
        );
        count++;
      }
    });

    onRefreshData();
    showToast(`Bulk Issued ${count} participation certificates! Visible live on home page.`);
    try {
      confetti({ particleCount: 80, spread: 80 });
    } catch (err) {}
  };

  // Certificate edit in ledger
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [editCertTitle, setEditCertTitle] = useState('');

  const handleSaveCertEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    const updated = { ...editingCert, titleAwarded: editCertTitle.trim() };
    updateCertificate(updated);
    onRefreshData();
    setEditingCert(null);
    showToast(`Updated Certificate ${updated.id} title live!`);
  };

  const handleDeleteCert = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete certificate ${id} for ${name}?`)) {
      deleteCertificate(id);
      onRefreshData();
      showToast(`Deleted certificate ${id}`);
    }
  };

  // Filtered learners in Learner Manager
  const filteredLearners = learners.filter(
    (l) =>
      l.name.toLowerCase().includes(learnerSearch.toLowerCase()) ||
      l.team.toLowerCase().includes(learnerSearch.toLowerCase())
  );

  // Security / Admin Passcode Settings
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [securityStatus, setSecurityStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isCustomCreds, setIsCustomCreds] = useState<boolean>(hasCustomAdminCredentials());

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId.trim() || !newAdminPass.trim()) {
      setSecurityStatus({ type: 'error', message: 'Please provide both Admin ID and Passcode.' });
      return;
    }
    if (newAdminPass.length < 6) {
      setSecurityStatus({ type: 'error', message: 'Passcode must be at least 6 characters long.' });
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      setSecurityStatus({ type: 'error', message: 'Passcodes do not match.' });
      return;
    }

    const ok = await updateAdminCredentials(newAdminId.trim(), newAdminPass.trim());
    if (ok) {
      setIsCustomCreds(true);
      setNewAdminId('');
      setNewAdminPass('');
      setConfirmAdminPass('');
      setSecurityStatus({
        type: 'success',
        message: 'Admin credentials updated and saved as cryptographic SHA-256 hashes in your browser!',
      });
      showToast('Admin credentials securely updated!');
    } else {
      setSecurityStatus({ type: 'error', message: 'Failed to update credentials. Please try again.' });
    }
  };

  const handleResetSecurity = () => {
    if (window.confirm('Reset admin credentials back to default verified hashes?')) {
      resetAdminCredentialsToDefault();
      setIsCustomCreds(false);
      setSecurityStatus({ type: 'success', message: 'Admin credentials reset to verified defaults.' });
      showToast('Admin credentials reset to default.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Executive Header (Microsoft/Google Clean Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Top Google/Microsoft Ribbon Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMINISTRATOR CONSOLE &bull; RESTRICTED ACCESS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                REAL-TIME SYNC ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Championship Command &amp; Live Rewards Engine
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl leading-relaxed">
              Modify team standings, learner numbers, awards, and digital badges with instant synchronization to the Home landing page, Leaderboard, and Certificate Portal.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleBulkIssueAllParticipation}
              className="px-4 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Bulk Issue Participation (All 56)</span>
            </button>
          </div>
        </div>

        {/* Enterprise Metrics Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[10px] uppercase font-bold">Enrolled Minds</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{learners.length}</p>
            <p className="text-slate-500 text-[10px]">10 Active Teams</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[10px] uppercase font-bold">Certificates Issued</p>
            <p className="text-xl font-bold text-[#1a73e8] mt-0.5">{certificates.length}</p>
            <p className="text-slate-500 text-[10px]">100% Cryptographic QR</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[10px] uppercase font-bold">Grand Champions</p>
            <p className="text-base font-bold text-[#34a853] mt-0.5">
              {teams.find((t) => t.rank === 1)?.name || 'Mad Apex'}
            </p>
            <p className="text-slate-500 text-[10px]">
              {teams.find((t) => t.rank === 1)?.totalPoints.toLocaleString()} Points
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[10px] uppercase font-bold">Program Mentor</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">Mentorship By Kapil</p>
            <p className="text-slate-500 text-[10px]">Sapthgiri NPS University</p>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold font-sans">
        <button
          onClick={() => setActiveAdminTab('TEAMS')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeAdminTab === 'TEAMS'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Live Team Standings &amp; Points ({teams.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('LEARNERS')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeAdminTab === 'LEARNERS'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Learner Numbers &amp; Rewards ({learners.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('META')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeAdminTab === 'META'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Championship Meta (117 Hrs / 50 Minds)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('ISSUE')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeAdminTab === 'ISSUE'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Issue New Credentials</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('LEDGER')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeAdminTab === 'LEDGER'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Credential Ledger ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('SECURITY')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeAdminTab === 'SECURITY'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security &amp; Passcode</span>
          {isCustomCreds && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Custom credentials active" />
          )}
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: LIVE TEAM NUMBERS & STANDINGS                 */}
      {/* ---------------------------------------------------- */}
      {activeAdminTab === 'TEAMS' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manage 10 Championship Teams</h3>
                <p className="text-xs text-slate-500">
                  Edit points, ranks, and official awards. Any change pushed here updates the Home page, Leaderboard, and Hall of Fame immediately.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200">
                Changes Sync Live
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Rank</th>
                    <th className="py-3 px-3.5">Team Name</th>
                    <th className="py-3 px-3.5">Total Points</th>
                    <th className="py-3 px-3.5">Grand Finale Award / Title</th>
                    <th className="py-3 px-3.5">Demo Count</th>
                    <th className="py-3 px-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teams.map((team) => (
                    <tr key={team.name} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3.5 font-bold font-mono">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            team.rank === 1
                              ? 'bg-amber-100 text-amber-800 font-extrabold'
                              : team.rank === 2
                              ? 'bg-slate-200 text-slate-800 font-bold'
                              : team.rank === 3
                              ? 'bg-amber-50 text-amber-700 font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{team.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-900 text-sm">
                        {team.name}
                        {team.topTeam && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800">
                            Grand Champion
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-[#1a73e8] text-sm">
                        {team.totalPoints.toLocaleString()} pts
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium font-sans">
                          {team.award}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-600">
                        {team.demos || 0} Demos
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => handleStartEditTeam(team)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1a73e8] hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 ml-auto transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Numbers</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Team Modal */}
          {editingTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#1a73e8]" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Edit Numbers: {editingTeam.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingTeam(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveTeam} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Points</label>
                    <input
                      type="number"
                      value={teamForm.totalPoints}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, totalPoints: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Official Rank (1-10)</label>
                      <input
                        type="number"
                        value={teamForm.rank}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, rank: Number(e.target.value) })
                        }
                        min={1}
                        max={10}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Demos Presented</label>
                      <input
                        type="number"
                        value={teamForm.demos}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, demos: Number(e.target.value) })
                        }
                        min={0}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Award / Championship Title
                    </label>
                    <input
                      type="text"
                      value={teamForm.award}
                      onChange={(e) => setTeamForm({ ...teamForm, award: e.target.value })}
                      placeholder="e.g. Champion Team, First Runner-Up Team..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="topTeamCheck"
                      checked={teamForm.topTeam}
                      onChange={(e) => setTeamForm({ ...teamForm, topTeam: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="topTeamCheck" className="text-xs font-semibold text-slate-800">
                      Designate as Grand Champion Top Team (Highlight on Hall of Fame)
                    </label>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingTeam(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Push Live to Home Page</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: LEARNERS & WINNERS REWARDS / NUMBERS          */}
      {/* ---------------------------------------------------- */}
      {activeAdminTab === 'LEARNERS' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manage 56 Championship Learners</h3>
                <p className="text-xs text-slate-500">
                  Update participant points, content counters, custom title rewards, Stars of the Day, and badges. Changes reflect live on the Home page immediately.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search learner or team..."
                  value={learnerSearch}
                  onChange={(e) => setLearnerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Learner</th>
                    <th className="py-3 px-3.5">Team</th>
                    <th className="py-3 px-3.5">Points</th>
                    <th className="py-3 px-3.5">Posts / Posters</th>
                    <th className="py-3 px-3.5">Rewards &amp; Titles</th>
                    <th className="py-3 px-3.5">Special Honors</th>
                    <th className="py-3 px-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLearners.map((learner) => (
                    <tr key={learner.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3.5 font-bold text-slate-900 text-sm">
                        {learner.name}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-600">
                        {learner.team}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-[#1a73e8]">
                        {(learner.points || 0).toLocaleString()} pts
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-600">
                        {learner.posts || 0} posts &bull; {learner.posters || 0} posters
                      </td>
                      <td className="py-3 px-3.5">
                        {learner.titles && learner.titles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {learner.titles.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Participant</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5">
                          {learner.starOfDay && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                              ★ Star {learner.starOfDay}
                            </span>
                          )}
                          {learner.isTongueTwisterChampion && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                              Tongue Twister Champ
                            </span>
                          )}
                          {!learner.starOfDay && !learner.isTongueTwisterChampion && (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => handleStartEditLearner(learner)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1a73e8] hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 ml-auto transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Rewards</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Learner Modal */}
          {editingLearner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Edit Learner: {editingLearner.name}
                    </h3>
                    <p className="text-xs text-slate-500">Team: {editingLearner.team}</p>
                  </div>
                  <button
                    onClick={() => setEditingLearner(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveLearner} className="space-y-4 text-xs">
                  {/* Points & Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Total Points</label>
                      <input
                        type="number"
                        value={learnerForm.points}
                        onChange={(e) =>
                          setLearnerForm({ ...learnerForm, points: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">LinkedIn Posts</label>
                      <input
                        type="number"
                        value={learnerForm.posts}
                        onChange={(e) =>
                          setLearnerForm({ ...learnerForm, posts: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Infographic Posters</label>
                      <input
                        type="number"
                        value={learnerForm.posters}
                        onChange={(e) =>
                          setLearnerForm({ ...learnerForm, posters: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Videos</label>
                      <input
                        type="number"
                        value={learnerForm.videos}
                        onChange={(e) =>
                          setLearnerForm({ ...learnerForm, videos: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Projects</label>
                      <input
                        type="number"
                        value={learnerForm.projects}
                        onChange={(e) =>
                          setLearnerForm({ ...learnerForm, projects: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PDFs &amp; Notes</label>
                      <input
                        type="number"
                        value={learnerForm.pdfs}
                        onChange={(e) =>
                          setLearnerForm({ ...learnerForm, pdfs: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Title Rewards Input */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Awarded Titles / Rewards (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={learnerForm.titleInput}
                      onChange={(e) => setLearnerForm({ ...learnerForm, titleInput: e.target.value })}
                      placeholder="e.g. Logic Master, Speed Demon, Clean Code Virtuoso"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Separate multiple titles with commas. E.g. "Logic Master, Java DSA Champion 2026".
                    </p>
                  </div>

                  {/* Special Honors */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Star of the Day Date
                      </label>
                      <input
                        type="text"
                        value={learnerForm.starOfDay}
                        onChange={(e) => setLearnerForm({ ...learnerForm, starOfDay: e.target.value })}
                        placeholder="e.g. 8/28/2026 or leave empty"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="ttCheck"
                        checked={learnerForm.isTongueTwisterChampion}
                        onChange={(e) =>
                          setLearnerForm({
                            ...learnerForm,
                            isTongueTwisterChampion: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <label htmlFor="ttCheck" className="text-xs font-semibold text-slate-800">
                        Tongue Twister Winner
                      </label>
                    </div>
                  </div>

                  {/* Badges Selector */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Digital Achievement Badges
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {RECOGNITION_FRAMEWORK.badgeTypes.map((b) => {
                        const isSelected = learnerForm.badges.includes(b);
                        return (
                          <button
                            type="button"
                            key={b}
                            onClick={() => {
                              if (isSelected) {
                                setLearnerForm({
                                  ...learnerForm,
                                  badges: learnerForm.badges.filter((item) => item !== b),
                                });
                              } else {
                                setLearnerForm({
                                  ...learnerForm,
                                  badges: [...learnerForm.badges, b],
                                });
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingLearner(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Push Live to Home Page</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: CHAMPIONSHIP META (117 HOURS / 50 MINDS)     */}
      {/* ---------------------------------------------------- */}
      {activeAdminTab === 'META' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Championship Core Metrics &amp; Branding
            </h3>
            <p className="text-xs text-slate-500">
              Update program hours, batch size, institution, or tagline. These will dynamically update across all header ribbons, footers, and certificates.
            </p>
          </div>

          <form onSubmit={handleSaveMeta} className="mt-4 space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Curriculum Hours</label>
                <input
                  type="number"
                  value={metaForm.totalHours}
                  onChange={(e) => setMetaForm({ ...metaForm, totalHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Minds / Batch</label>
                <input
                  type="number"
                  value={metaForm.totalMinds || 50}
                  onChange={(e) => setMetaForm({ ...metaForm, totalMinds: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Program Days</label>
                <input
                  type="number"
                  value={metaForm.totalDays}
                  onChange={(e) => setMetaForm({ ...metaForm, totalDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program Title</label>
              <input
                type="text"
                value={metaForm.title}
                onChange={(e) => setMetaForm({ ...metaForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={metaForm.tagline}
                onChange={(e) => setMetaForm({ ...metaForm, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institution</label>
              <input
                type="text"
                value={metaForm.institution}
                onChange={(e) => setMetaForm({ ...metaForm, institution: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Mentorship Attribution</label>
              <input
                type="text"
                value={metaForm.mentorship}
                onChange={(e) => setMetaForm({ ...metaForm, mentorship: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Permanent attribution: "Mentorship By Kapil" per system rules.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Push Meta Live to All Pages</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: ISSUE NEW CREDENTIALS                         */}
      {/* ---------------------------------------------------- */}
      {activeAdminTab === 'ISSUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module 1: Issue Certificate */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="p-2 rounded-xl bg-blue-50 text-[#1a73e8] border border-blue-100">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Issue Certificate</h2>
                  <p className="text-xs text-slate-500">FAANG-standard tamper-proof credential</p>
                </div>
              </div>

              <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Select Learner (56 Enrolled)
                  </label>
                  <select
                    value={selectedLearnerId}
                    onChange={(e) => setSelectedLearnerId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {learners.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.team})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Certificate Category
                  </label>
                  <select
                    value={certType}
                    onChange={(e) => setCertType(e.target.value as CertificateType)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {RECOGNITION_FRAMEWORK.certificateCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Title / Honor Awarded
                  </label>
                  <select
                    value={titleAwarded}
                    onChange={(e) => setTitleAwarded(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <optgroup label="Championship Titles">
                      {RECOGNITION_FRAMEWORK.championshipTitles.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Technical Excellence Awards">
                      {RECOGNITION_FRAMEWORK.technicalExcellence.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Leadership & Professional Awards">
                      {RECOGNITION_FRAMEWORK.leadershipAndProfessional.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Performance Excellence Awards">
                      {RECOGNITION_FRAMEWORK.performanceExcellence.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Competition Awards">
                      {RECOGNITION_FRAMEWORK.competitionAwards.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1 font-sans">
                  <p>&bull; Colorful Ribbons theme with pristine white background.</p>
                  <p>&bull; Mentorship By Kapil in footer &bull; Cryptographic QR code.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Issue Certificate Now
                </button>
              </form>
            </div>
          </div>

          {/* Module 2: Award Badges */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Award Digital Badge</h2>
                  <p className="text-xs text-slate-500">10 Official Framework Badge Types</p>
                </div>
              </div>

              <form onSubmit={handleAwardBadge} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Learner</label>
                  <select
                    value={badgeLearnerId}
                    onChange={(e) => setBadgeLearnerId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {learners.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.team})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Badge Type</label>
                  <select
                    value={selectedBadge}
                    onChange={(e) => setSelectedBadge(e.target.value as BadgeType)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {RECOGNITION_FRAMEWORK.badgeTypes.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-purple-900">
                  <p className="font-semibold mb-0.5">Recognition Guarantee:</p>
                  <p>Every participant receives at least one digital badge to celebrate continuous improvement.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Award Digital Badge
                </button>
              </form>
            </div>
          </div>

          {/* Module 3: Award Championship Medals */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                  <Medal className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Award Championship Medal</h2>
                  <p className="text-xs text-slate-500">5 Official Medal Tiers</p>
                </div>
              </div>

              <form onSubmit={handleAwardMedal} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Learner</label>
                  <select
                    value={medalLearnerId}
                    onChange={(e) => setMedalLearnerId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {learners.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.team})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Championship Medal Tier
                  </label>
                  <select
                    value={selectedMedal}
                    onChange={(e) => setSelectedMedal(e.target.value as MedalLevel)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {RECOGNITION_FRAMEWORK.medalLevels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-[11px] text-amber-900">
                  <p className="font-semibold mb-0.5">Championship Motto:</p>
                  <p className="italic">"Code Every Day. Compete Every Day. Improve Every Day."</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Medal className="w-4 h-4" />
                  Award Championship Medal
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: CREDENTIAL AUDIT LEDGER                       */}
      {/* ---------------------------------------------------- */}
      {activeAdminTab === 'LEDGER' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-900">Live Credential Issuance Ledger</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                {certificates.length} Records
              </span>
            </div>
            <span className="text-xs text-emerald-700 font-mono flex items-center gap-1.5 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Persistent Real-Time Sync
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Credential ID</th>
                  <th className="py-3 px-3.5">Recipient</th>
                  <th className="py-3 px-3.5">Team</th>
                  <th className="py-3 px-3.5">Category</th>
                  <th className="py-3 px-3.5">Honor Awarded</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3.5 font-mono text-[#1a73e8] font-bold">{cert.id}</td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">{cert.recipientName}</td>
                    <td className="py-3 px-3.5 font-mono text-slate-600">{cert.teamName}</td>
                    <td className="py-3 px-3.5 text-slate-700">{cert.certificateType}</td>
                    <td className="py-3 px-3.5 text-blue-700 font-semibold">{cert.titleAwarded}</td>
                    <td className="py-3 px-3.5 font-mono text-slate-500">{cert.issuedDate}</td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewCertificate(cert)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1a73e8] font-bold text-xs transition cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setEditingCert(cert);
                            setEditCertTitle(cert.titleAwarded);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          Edit Title
                        </button>
                        <button
                          onClick={() => handleDeleteCert(cert.id, cert.recipientName)}
                          className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Certificate Title Modal */}
          {editingCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Title Awarded: {editingCert.id}
                  </h3>
                  <button
                    onClick={() => setEditingCert(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveCertEdit} className="space-y-4 text-xs">
                  <p className="text-slate-600">
                    Recipient: <strong className="text-slate-900">{editingCert.recipientName}</strong>
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Title Awarded
                    </label>
                    <input
                      type="text"
                      value={editCertTitle}
                      onChange={(e) => setEditCertTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingCert(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 6: SECURITY & PASSCODE MANAGEMENT                */}
      {/* ---------------------------------------------------- */}
      {activeAdminTab === 'SECURITY' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ACCESS CONTROL &amp; CREDENTIAL HARDENING
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Administrator Security &amp; Custom Credentials
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Protect your championship administration. Update your private Admin ID and Passcode anytime. New credentials are saved as cryptographic SHA-256 hashes locally in your browser so they are never exposed in public repositories.
                </p>
              </div>

              <div className="shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                    isCustomCreds
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCustomCreds ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                  {isCustomCreds ? 'Custom Credentials Active' : 'Default Verified Hashes Active'}
                </span>
              </div>
            </div>

            {securityStatus && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xs flex items-center gap-3 ${
                  securityStatus.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {securityStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-medium">{securityStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSecurity} className="mt-6 max-w-xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mb-1.5">
                  New Admin ID
                </label>
                <input
                  type="text"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  placeholder="Enter your new secret Admin ID"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mb-1.5">
                    New Passcode (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mb-1.5">
                    Confirm Passcode
                  </label>
                  <input
                    type="password"
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Admin Credentials</span>
                </button>

                {isCustomCreds && (
                  <button
                    type="button"
                    onClick={handleResetSecurity}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
                  >
                    Reset to Verified Defaults
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Security Features & Audit Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">SHA-256 Hashing</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Credentials are cryptographically hashed using Web Crypto SHA-256. Plaintext credentials are never saved in the source code or git commits.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Brute-Force Rate Limiter</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Automated rate limiting locks out login attempts for 3 minutes after 5 consecutive failed entries, preventing unauthorized brute-force attempts on public sites.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">No Auto-fill or Visible Secrets</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Auto-fill helper buttons and plain text credential pills have been completely removed from the login interface for public security compliance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
