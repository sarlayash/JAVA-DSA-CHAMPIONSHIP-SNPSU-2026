import React, { useState } from 'react';
import { Learner, Certificate, CertificateType, BadgeType, MedalLevel, IssuedReward, Team } from '../types';
import { RECOGNITION_FRAMEWORK } from '../data/championshipData';
import {
  issueNewCertificate,
  awardBadgeToLearner,
  awardMedalToLearner,
  saveCertificates,
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

export const AdminDashboard: React.FC<Props> = ({
  learners,
  certificates,
  teams,
  rewardsLog,
  onRefreshData,
  onViewCertificate,
}) => {
  // Issuance State
  const [selectedLearnerId, setSelectedLearnerId] = useState(learners[0]?.id || '');
  const [certType, setCertType] = useState<CertificateType>('Certificate of Merit');
  const [titleAwarded, setTitleAwarded] = useState('Logic Master');

  // Badge State
  const [badgeLearnerId, setBadgeLearnerId] = useState(learners[0]?.id || '');
  const [selectedBadge, setSelectedBadge] = useState<BadgeType>('Top Performer');

  // Medal State
  const [medalLearnerId, setMedalLearnerId] = useState(learners[0]?.id || '');
  const [selectedMedal, setSelectedMedal] = useState<MedalLevel>('Gold Medal');

  // Notification / Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const learner = learners.find((l) => l.id === selectedLearnerId);
    if (!learner) return;

    const cert = issueNewCertificate(learner.name, learner.team, certType, titleAwarded);

    onRefreshData();
    showToast(`Successfully issued ${certType} for ${learner.name}`);
    try {
      confetti({ particleCount: 50, spread: 60 });
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
      confetti({ particleCount: 30, spread: 50 });
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
    if (!window.confirm('Are you sure you want to issue official Participation Certificates to all learners without one?')) {
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
    showToast(`Bulk Issued ${count} certificates successfully!`);
    try {
      confetti({ particleCount: 80, spread: 80 });
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4" />
          {toastMsg}
        </div>
      )}

      {/* Admin Executive Header */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              FORTUNE 500 CREDENTIAL MANAGEMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrative Issuance &amp; Rewards Engine
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl font-sans">
              Issue official FAANG-standard tamper-proof certificates, digital achievement badges, and championship medals based on the official framework for India's 1st 13-Day Java DSA Championship 2026.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkIssueAllParticipation}
              className="px-4 py-2.5 bg-white text-black hover:bg-gray-200 text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              Bulk Issue Participation (All 56)
            </button>
          </div>
        </div>

        {/* Enterprise Metrics Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-[#050505] rounded-lg border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Total Learners</p>
            <p className="text-xl font-bold text-white mt-0.5">{learners.length}</p>
            <p className="text-gray-400 text-[10px]">10 Dedicated Teams</p>
          </div>

          <div className="p-3.5 bg-[#050505] rounded-lg border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Certificates Issued</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{certificates.length}</p>
            <p className="text-gray-400 text-[10px]">100% Cryptographic QR</p>
          </div>

          <div className="p-3.5 bg-[#050505] rounded-lg border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Top Scoring Team</p>
            <p className="text-base font-bold text-blue-400 mt-0.5">Mad Apex</p>
            <p className="text-gray-400 text-[10px]">1,917,722 Total Points</p>
          </div>

          <div className="p-3.5 bg-[#050505] rounded-lg border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Directorship</p>
            <p className="text-base font-bold text-white mt-0.5">Mentorship By Kapil</p>
            <p className="text-gray-400 text-[10px]">Sapthgiri NPS University</p>
          </div>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Issue Certificate */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <span className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Issue Official Certificate</h2>
                <p className="text-xs text-gray-400">FAANG-standard tamper-proof credential</p>
              </div>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-mono mb-1">Select Learner (56 Students)</label>
                <select
                  value={selectedLearnerId}
                  onChange={(e) => setSelectedLearnerId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-blue-500 font-medium"
                >
                  {learners.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.team})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono mb-1">Certificate Category</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as CertificateType)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-blue-500"
                >
                  {RECOGNITION_FRAMEWORK.certificateCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono mb-1">Title / Honor Awarded</label>
                <select
                  value={titleAwarded}
                  onChange={(e) => setTitleAwarded(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-blue-500"
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

              <div className="p-3 bg-[#050505] rounded-lg border border-white/5 text-[11px] text-gray-400 space-y-1 font-mono">
                <p>&bull; Signatures omitted per instructions (Mentorship By Kapil in footer).</p>
                <p>&bull; Dynamic QR Code generated with cryptographically verified ID.</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Issue Certificate Now
              </button>
            </form>
          </div>
        </div>

        {/* Module 2: Award Badges */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <span className="p-1.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Award Digital Badge</h2>
                <p className="text-xs text-gray-400">10 Official Framework Badge Types</p>
              </div>
            </div>

            <form onSubmit={handleAwardBadge} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-mono mb-1">Select Learner</label>
                <select
                  value={badgeLearnerId}
                  onChange={(e) => setBadgeLearnerId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-purple-500"
                >
                  {learners.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.team})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono mb-1">Badge Type</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value as BadgeType)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-purple-500"
                >
                  {RECOGNITION_FRAMEWORK.badgeTypes.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#050505] rounded-lg border border-white/5 text-[11px] text-gray-400 font-mono">
                <p className="font-semibold text-gray-300 mb-1">Recognition Guarantee:</p>
                <p>Every participant receives at least one digital badge to celebrate continuous improvement.</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Award Digital Badge
              </button>
            </form>
          </div>
        </div>

        {/* Module 3: Award Championship Medals */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <span className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Medal className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Award Championship Medal</h2>
                <p className="text-xs text-gray-400">5 Official Medal Tiers</p>
              </div>
            </div>

            <form onSubmit={handleAwardMedal} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-mono mb-1">Select Learner</label>
                <select
                  value={medalLearnerId}
                  onChange={(e) => setMedalLearnerId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-blue-500"
                >
                  {learners.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.team})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono mb-1">Championship Medal Tier</label>
                <select
                  value={selectedMedal}
                  onChange={(e) => setSelectedMedal(e.target.value as MedalLevel)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-blue-500"
                >
                  {RECOGNITION_FRAMEWORK.medalLevels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#050505] rounded-lg border border-white/5 text-[11px] text-gray-400 font-mono">
                <p className="font-semibold text-gray-300 mb-1">Championship Motto:</p>
                <p className="italic">"Code Every Day. Compete Every Day. Improve Every Day."</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Medal className="w-4 h-4" />
                Award Championship Medal
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Audit Registry & Issuance Ledger */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            <h3 className="text-base font-bold text-white">Live Credential Issuance Ledger</h3>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-mono text-xs">
              {certificates.length} Records
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Persistent Real-Time Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050505] text-gray-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Credential ID</th>
                <th className="py-2.5 px-3">Recipient</th>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Honor Awarded</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {certificates.slice(0, 12).map((cert) => (
                <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-blue-400">{cert.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{cert.recipientName}</td>
                  <td className="py-2.5 px-3 font-mono text-gray-400">{cert.teamName}</td>
                  <td className="py-2.5 px-3 text-gray-300">{cert.certificateType}</td>
                  <td className="py-2.5 px-3 text-blue-300 font-medium">{cert.titleAwarded}</td>
                  <td className="py-2.5 px-3 font-mono text-gray-500">{cert.issuedDate}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onViewCertificate(cert)}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
