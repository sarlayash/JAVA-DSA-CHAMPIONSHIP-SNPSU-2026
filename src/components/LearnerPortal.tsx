import React, { useState, useMemo } from 'react';
import { Learner, Certificate, Team } from '../types';
import {
  Search,
  Award,
  Download,
  ShieldCheck,
  Medal,
  Sparkles,
  Flame,
  CheckCircle,
  FileText,
  Video,
  Layers,
  Filter,
} from 'lucide-react';

interface Props {
  learners: Learner[];
  certificates: Certificate[];
  teams: Team[];
  onSelectCertificate: (cert: Certificate) => void;
  onSelectVerify: (certId: string) => void;
}

export const LearnerPortal: React.FC<Props> = ({
  learners,
  certificates,
  teams,
  onSelectCertificate,
  onSelectVerify,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'CERTIFICATES' | 'STARS' | 'TONGUE_TWISTER'>('ALL');

  const filteredLearners = useMemo(() => {
    return learners.filter((learner) => {
      const matchesSearch =
        learner.name.toLowerCase().includes(search.toLowerCase()) ||
        learner.team.toLowerCase().includes(search.toLowerCase()) ||
        (learner.titles && learner.titles.some((t) => t.toLowerCase().includes(search.toLowerCase())));

      const matchesTeam = selectedTeam === 'ALL' || learner.team === selectedTeam;

      const matchesFilter =
        filterType === 'ALL' ||
        (filterType === 'STARS' && Boolean(learner.starOfDay)) ||
        (filterType === 'TONGUE_TWISTER' && Boolean(learner.isTongueTwisterChampion)) ||
        (filterType === 'CERTIFICATES' &&
          certificates.some((c) => c.recipientName.toLowerCase() === learner.name.toLowerCase()));

      return matchesSearch && matchesTeam && matchesFilter;
    });
  }, [learners, search, selectedTeam, filterType, certificates]);

  // Find corresponding certificate for a learner
  const getLearnerCertificate = (learnerName: string): Certificate | undefined => {
    return certificates.find(
      (c) => c.recipientName.trim().toLowerCase() === learnerName.trim().toLowerCase()
    );
  };

  const getTeamRankBadge = (teamName: string) => {
    const t = teams.find((item) => item.name === teamName);
    if (!t) return null;
    if (t.rank === 1) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (t.rank === 2) return 'bg-slate-300/20 text-slate-200 border-slate-300/40';
    if (t.rank === 3) return 'bg-amber-700/20 text-amber-500 border-amber-700/40';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              PORTAL FOR LEARNERS &bull; 56 PARTICIPANTS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Learner Credentials &amp; Certifications
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl font-sans">
              Locate your official Java DSA Championship credential, inspect authentic performance metrics, view FAANG-style certificate, and download high-resolution PNG / PDF.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-center px-3 border-r border-slate-800">
              <p className="text-slate-400">Teams</p>
              <p className="text-lg font-bold text-white">10</p>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <p className="text-slate-400">Total Hours</p>
              <p className="text-lg font-bold text-amber-400">117</p>
            </div>
            <div className="text-center px-3">
              <p className="text-slate-400">Certificates</p>
              <p className="text-lg font-bold text-emerald-400">{certificates.length}</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by learner name, honor, or skill..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
            >
              <option value="ALL">All Teams (10 Teams)</option>
              {teams.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} (Rank #{t.rank} &bull; {t.totalPoints.toLocaleString()} pts)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
            >
              <option value="ALL">All Learners</option>
              <option value="STARS">Stars of the Day Only</option>
              <option value="TONGUE_TWISTER">Tongue Twister Champions</option>
              <option value="CERTIFICATES">With Issued Certificate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Learners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLearners.map((learner) => {
          const cert = getLearnerCertificate(learner.name);

          return (
            <div
              key={learner.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border ${getTeamRankBadge(
                      learner.team
                    )}`}
                  >
                    {learner.team}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {learner.starOfDay && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30"
                        title={`Star of the Day on ${learner.starOfDay}`}
                      >
                        <Flame className="w-3 h-3 text-amber-400" />
                        Star {learner.starOfDay}
                      </span>
                    )}

                    {learner.isTongueTwisterChampion && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30"
                        title="Tongue Twister Champion"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        Twister Win
                      </span>
                    )}
                  </div>
                </div>

                {/* Learner Name */}
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                  {learner.name}
                </h3>

                {/* Titles / Awards */}
                <div className="mt-2 min-h-[44px]">
                  {learner.titles && learner.titles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {learner.titles.map((title, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300"
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Participant &bull; 13-Day Championship
                    </span>
                  )}
                </div>

                {/* Activity & Performance Chips from the official sheets */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                    <p className="text-slate-500 text-[9px] uppercase">Posts</p>
                    <p className="font-bold text-slate-200">{learner.posts ?? 0}</p>
                  </div>
                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                    <p className="text-slate-500 text-[9px] uppercase">Posters</p>
                    <p className="font-bold text-slate-200">{learner.posters ?? 0}</p>
                  </div>
                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                    <p className="text-slate-500 text-[9px] uppercase">Videos</p>
                    <p className="font-bold text-slate-200">{learner.videos ?? 0}</p>
                  </div>
                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                    <p className="text-slate-500 text-[9px] uppercase">Points</p>
                    <p className="font-bold text-emerald-400">
                      {learner.points ? learner.points.toLocaleString() : 'Active'}
                    </p>
                  </div>
                </div>

                {/* Badges and Medals Showcase */}
                <div className="mt-3 flex flex-wrap gap-1 items-center">
                  {learner.badges?.map((b) => (
                    <span
                      key={b}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {b}
                    </span>
                  ))}
                  {learner.medals?.map((m) => (
                    <span
                      key={m}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 text-amber-400 border border-amber-700/40 flex items-center gap-0.5"
                    >
                      <Medal className="w-2.5 h-2.5" />
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
                {cert ? (
                  <>
                    <button
                      onClick={() => onSelectCertificate(cert)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <Award className="w-3.5 h-3.5" />
                      View Certificate
                    </button>
                    <button
                      onClick={() => onSelectVerify(cert.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      title="Verify QR Integrity"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-500 font-mono italic">
                    Certificate in generation queue...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLearners.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">No learners found matching the selected filter criteria.</p>
        </div>
      )}
    </div>
  );
};
