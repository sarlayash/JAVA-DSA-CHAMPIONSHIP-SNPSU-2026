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
  ArrowRight,
  ExternalLink,
  Lock,
  Edit3,
} from 'lucide-react';

interface Props {
  learners: Learner[];
  certificates: Certificate[];
  teams: Team[];
  onSelectCertificate: (cert: Certificate) => void;
  onSelectVerify: (certId: string) => void;
  isAdmin?: boolean;
  onOpenAdminAuth?: () => void;
}

export const LearnerPortal: React.FC<Props> = ({
  learners,
  certificates,
  teams,
  onSelectCertificate,
  onSelectVerify,
  isAdmin = false,
  onOpenAdminAuth,
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
    if (!t) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (t.rank === 1) return 'bg-amber-50 text-amber-900 border-amber-200 font-bold';
    if (t.rank === 2) return 'bg-slate-100 text-slate-800 border-slate-300 font-bold';
    if (t.rank === 3) return 'bg-amber-50/70 text-amber-800 border-amber-200/80 font-bold';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner (Microsoft & Google Enterprise Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Colorful micro ribbon border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-xs font-mono font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              PORTAL FOR LEARNERS &bull; 56 PARTICIPANTS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learner Credentials &amp; Certifications
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl font-sans leading-relaxed">
              Find your official Java DSA Championship credential, inspect authentic performance metrics, view the FAANG-style certificate with colorful ribbons, and verify QR authenticity in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono">
            <div className="text-center px-3 border-r border-slate-200">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Teams</p>
              <p className="text-lg font-bold text-slate-900">{teams.length}</p>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Total Hours</p>
              <p className="text-lg font-bold text-[#1a73e8]">117</p>
            </div>
            <div className="text-center px-3">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Certificates</p>
              <p className="text-lg font-bold text-emerald-600">{certificates.length}</p>
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
              placeholder="Search by learner name, team, or honor..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-medium"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-medium"
            >
              <option value="ALL">All Learners (56)</option>
              <option value="STARS">Stars of the Day Only</option>
              <option value="TONGUE_TWISTER">Tongue Twister Champions</option>
              <option value="CERTIFICATES">With Issued Certificate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Learners Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLearners.map((learner) => {
          const cert = getLearnerCertificate(learner.name);

          return (
            <div
              key={learner.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md flex flex-col justify-between transition-all group relative overflow-hidden"
            >
              {/* Subtle top edge accent for top team members */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-transparent group-hover:bg-[#1a73e8] transition" />

              <div>
                {/* Header tags */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${getTeamRankBadge(
                      learner.team
                    )}`}
                  >
                    {learner.team}
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {learner.starOfDay && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono font-bold border border-amber-200"
                        title={`Star of the Day on ${learner.starOfDay}`}
                      >
                        <Flame className="w-3 h-3 text-amber-500" />
                        Star {learner.starOfDay}
                      </span>
                    )}

                    {learner.isTongueTwisterChampion && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-mono font-bold border border-purple-200"
                        title="Tongue Twister Champion"
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        Twister Win
                      </span>
                    )}
                  </div>
                </div>

                {/* Learner Name */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1a73e8] transition">
                  {learner.name}
                </h3>

                {/* Titles / Awards */}
                <div className="mt-2 min-h-[44px]">
                  {learner.titles && learner.titles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {learner.titles.map((title, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50/80 border border-blue-200 text-blue-800"
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

                {/* Activity & Performance Chips (Real-time synced from Admin!) */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-slate-400 text-[9px] uppercase font-semibold">Posts</p>
                    <p className="font-bold text-slate-800">{learner.posts ?? 0}</p>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-slate-400 text-[9px] uppercase font-semibold">Posters</p>
                    <p className="font-bold text-slate-800">{learner.posters ?? 0}</p>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-slate-400 text-[9px] uppercase font-semibold">Videos</p>
                    <p className="font-bold text-slate-800">{learner.videos ?? 0}</p>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-slate-400 text-[9px] uppercase font-semibold">Points</p>
                    <p className="font-bold text-emerald-600">
                      {learner.points ? learner.points.toLocaleString() : 'Active'}
                    </p>
                  </div>
                </div>

                {/* Badges and Medals Showcase */}
                <div className="mt-3 flex flex-wrap gap-1 items-center">
                  {learner.badges?.map((b) => (
                    <span
                      key={b}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {b}
                    </span>
                  ))}
                  {learner.medals?.map((m) => (
                    <span
                      key={m}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5"
                    >
                      <Medal className="w-2.5 h-2.5 text-amber-600" />
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                {cert ? (
                  <>
                    <button
                      onClick={() => onSelectCertificate(cert)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>
                    <button
                      onClick={() => onSelectVerify(cert.id)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-emerald-600 border border-slate-200 transition cursor-pointer"
                      title="Verify QR Integrity"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full text-xs text-slate-500">
                    <span className="font-mono text-[11px] text-slate-400">
                      Pending Mentorship Release
                    </span>
                    {isAdmin && (
                      <button
                        onClick={onOpenAdminAuth}
                        className="text-[11px] font-bold text-[#1a73e8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3 h-3 text-[#1a73e8]" />
                        Issue (Admin)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
