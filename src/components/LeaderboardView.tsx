import React, { useState } from 'react';
import { Team, Learner } from '../types';
import { RECOGNITION_FRAMEWORK } from '../data/championshipData';
import {
  Trophy,
  Medal,
  Users,
  Award,
  Flame,
  ChevronRight,
  Sparkles,
  Presentation,
  CheckCircle,
} from 'lucide-react';

interface Props {
  teams: Team[];
  learners: Learner[];
  onSelectLearner: (learnerName: string) => void;
}

export const LeaderboardView: React.FC<Props> = ({ teams, learners, onSelectLearner }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams[0] || null);
  const [activeTab, setActiveTab] = useState<'LEADERBOARD' | 'FRAMEWORK'>('LEADERBOARD');

  const maxPoints = Math.max(...teams.map((t) => t.totalPoints), 1);

  return (
    <div className="space-y-6 font-sans">
      {/* Header (Google & Microsoft Spectrum Ribbon) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-xs font-mono font-bold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              OFFICIAL CHAMPIONSHIP LEADERBOARD &bull; 10 TEAMS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Points Standings &amp; Recognition Framework
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl font-sans leading-relaxed">
              Real-time synchronization with the official tournament ledger: 117 Hours &bull; 50 Minds &bull; 1 Mission &bull; Building in Public. Mentorship By Kapil at Sapthgiri NPS University.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Team Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('FRAMEWORK')}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'FRAMEWORK'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recognition Framework
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'LEADERBOARD' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Teams List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#1a73e8]" />
                Tournament Final Rankings
              </h2>
              <span className="text-xs font-mono text-slate-500 font-bold">Total Teams: {teams.length}</span>
            </div>

            <div className="space-y-3">
              {teams.map((team) => {
                const percentage = Math.round((team.totalPoints / maxPoints) * 100);
                const isSelected = selectedTeam?.name === team.name;

                return (
                  <div
                    key={team.name}
                    onClick={() => setSelectedTeam(team)}
                    className={`cursor-pointer p-4 rounded-xl border transition relative overflow-hidden ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                            team.rank === 1
                              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                              : team.rank === 2
                              ? 'bg-slate-200 text-slate-800 border-slate-300'
                              : team.rank === 3
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          #{team.rank}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              {team.name}
                            </h3>
                            {team.topTeam && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-200 font-bold">
                                GRAND CHAMPION
                              </span>
                            )}
                            {team.bottomTeam && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                                PERSISTENCE HONOREE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#1a73e8] font-semibold font-sans mt-0.5">
                            {team.award}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
                          {team.totalPoints.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {team.members.length} Members &bull; {team.demos ?? 0} Demos
                        </p>
                      </div>
                    </div>

                    {/* Progress Fill Bar */}
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          team.rank === 1
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                            : team.rank === 2
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : team.rank === 3
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Team Detail Drawer */}
          <div className="lg:col-span-4 space-y-4">
            {selectedTeam && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs sticky top-20">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-mono text-[#1a73e8] uppercase font-bold">
                      Team Roster &bull; Rank #{selectedTeam.rank}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {selectedTeam.name}
                    </h2>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Total</p>
                    <p className="font-mono font-bold text-[#1a73e8] text-sm">
                      {selectedTeam.totalPoints.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-mono uppercase mb-0.5 font-bold">
                    Official Award
                  </p>
                  <p className="text-sm font-bold text-slate-900">{selectedTeam.award}</p>
                  {selectedTeam.demos ? (
                    <p className="text-xs text-emerald-700 mt-1 font-mono flex items-center gap-1 font-semibold">
                      <Presentation className="w-3.5 h-3.5" />
                      Grand Finale Demos: {selectedTeam.demos}
                    </p>
                  ) : null}
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-600 mb-2 font-bold">
                    Team Members ({selectedTeam.members.length})
                  </h4>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {selectedTeam.members.map((memberName) => {
                      const memberData = learners.find(
                        (l) => l.name.toLowerCase() === memberName.toLowerCase()
                      );

                      return (
                        <div
                          key={memberName}
                          onClick={() => onSelectLearner(memberName)}
                          className="cursor-pointer p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-[#1a73e8] transition">
                              {memberName}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Posts: {memberData?.posts ?? 0} &bull; Posters:{' '}
                              {memberData?.posters ?? 0} &bull; Points:{' '}
                              {memberData?.points?.toLocaleString() ?? '0'}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1a73e8] transition" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Recognition Framework View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Championship Titles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base">Championship Titles</h3>
              <span className="text-xs font-mono text-slate-500 ml-auto font-bold">8 Titles</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.championshipTitles.map((t, idx) => (
                <li key={t} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-800 font-medium">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Excellence */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-[#1a73e8]" />
              <h3 className="font-bold text-slate-900 text-base">Technical Excellence</h3>
              <span className="text-xs font-mono text-slate-500 ml-auto font-bold">10 Awards</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.technicalExcellence.map((t, idx) => (
                <li key={t} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-800 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1a73e8] font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Leadership & Professional */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Leadership &amp; Professional</h3>
              <span className="text-xs font-mono text-slate-500 ml-auto font-bold">10 Awards</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.leadershipAndProfessional.map((t, idx) => (
                <li key={t} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-800 font-medium">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Excellence */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Flame className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-base">Performance Excellence</h3>
              <span className="text-xs font-mono text-slate-500 ml-auto font-bold">7 Awards</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.performanceExcellence.map((t, idx) => (
                <li key={t} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-800 font-medium">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Digital Achievement Badges */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Medal className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">10 Digital Badges</h3>
              <span className="text-xs font-mono text-slate-500 ml-auto font-bold">Framework</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.badgeTypes.map((b) => (
                <li key={b} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-800">
                  <span className="font-medium">{b}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600">Digital Badge</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificate Categories */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-base">Certificate Categories</h3>
              <span className="text-xs font-mono text-slate-500 ml-auto font-bold">6 Types</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.certificateCategories.map((c, idx) => (
                <li key={c} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-800 font-medium">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
