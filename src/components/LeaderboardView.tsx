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
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams[0]);
  const [activeTab, setActiveTab] = useState<'LEADERBOARD' | 'FRAMEWORK'>('LEADERBOARD');

  const maxPoints = Math.max(...teams.map((t) => t.totalPoints));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              OFFICIAL CHAMPIONSHIP LEADERBOARD &bull; 10 TEAMS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Points Standings &amp; Recognition Framework
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl font-sans">
              Strictly synchronized with the official tournament ledger: 117 Hours &bull; 50 Minds &bull; 1 Mission &bull; Building in Public. Mentorship By Kapil at Sapthgiri NPS University.
            </p>
          </div>

          <div className="flex bg-[#050505] p-1 rounded-lg border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Team Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('FRAMEWORK')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'FRAMEWORK'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
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
          <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-400" />
                Tournament Final Rankings
              </h2>
              <span className="text-xs font-mono text-gray-400">Total Teams: 10</span>
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
                        ? 'bg-white/10 border-blue-500/50 shadow-sm'
                        : 'bg-[#050505] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm border ${
                            team.rank === 1
                              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                              : team.rank === 2
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : team.rank === 3
                              ? 'bg-purple-600 text-white border-purple-500'
                              : 'bg-white/5 text-gray-400 border-white/10'
                          }`}
                        >
                          #{team.rank}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm sm:text-base">
                              {team.name}
                            </h3>
                            {team.topTeam && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                                TOP TEAM
                              </span>
                            )}
                            {team.bottomTeam && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-400 border border-white/10">
                                PERSISTENCE HONOREE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-blue-400/90 font-medium font-sans mt-0.5">
                            {team.award}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-base sm:text-lg font-extrabold text-white font-mono">
                          {team.totalPoints.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {team.members.length} Members &bull; {team.demos ?? 0} Demos
                        </p>
                      </div>
                    </div>

                    {/* Progress Fill Bar */}
                    <div className="mt-3 w-full bg-[#050505] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          team.rank === 1
                            ? 'bg-blue-500'
                            : team.rank === 2
                            ? 'bg-indigo-400'
                            : team.rank === 3
                            ? 'bg-purple-400'
                            : 'bg-gray-600'
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
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm sticky top-6">
                <div className="flex items-start justify-between pb-3 border-b border-white/5">
                  <div>
                    <span className="text-[11px] font-mono text-blue-400 uppercase font-semibold">
                      Team Roster &bull; Rank #{selectedTeam.rank}
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-0.5">
                      {selectedTeam.name}
                    </h2>
                  </div>
                  <div className="p-2 bg-[#050505] rounded-lg border border-white/5 text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-mono font-bold">Total</p>
                    <p className="font-mono font-bold text-blue-400 text-sm">
                      {selectedTeam.totalPoints.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="my-3 p-3 rounded-lg bg-[#050505] border border-white/5">
                  <p className="text-[11px] text-gray-400 font-mono uppercase mb-0.5 font-bold">
                    Official Award
                  </p>
                  <p className="text-sm font-bold text-white">{selectedTeam.award}</p>
                  {selectedTeam.demos ? (
                    <p className="text-xs text-emerald-400 mt-1 font-mono flex items-center gap-1 font-semibold">
                      <Presentation className="w-3.5 h-3.5" />
                      Grand Finale Demos: {selectedTeam.demos}
                    </p>
                  ) : null}
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-gray-400 mb-2 font-bold">
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
                          className="cursor-pointer p-2.5 rounded-lg bg-[#050505] hover:bg-white/5 border border-white/5 transition flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                              {memberName}
                            </p>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                              Posts: {memberData?.posts ?? 0} &bull; Posters:{' '}
                              {memberData?.posters ?? 0}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
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
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Trophy className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Championship Titles</h3>
              <span className="text-xs font-mono text-gray-400 ml-auto">8 Titles</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.championshipTitles.map((t, idx) => (
                <li key={t} className="p-2 rounded-lg bg-[#050505] border border-white/5 flex items-center gap-2 text-gray-200 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Excellence */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Award className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Technical Excellence</h3>
              <span className="text-xs font-mono text-gray-400 ml-auto">10 Awards</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.technicalExcellence.map((t, idx) => (
                <li key={t} className="p-2 rounded-lg bg-[#050505] border border-white/5 flex items-center gap-2 text-gray-200 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Leadership & Professional */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Leadership &amp; Professional</h3>
              <span className="text-xs font-mono text-gray-400 ml-auto">10 Awards</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.leadershipAndProfessional.map((t, idx) => (
                <li key={t} className="p-2 rounded-lg bg-[#050505] border border-white/5 flex items-center gap-2 text-gray-200 font-medium">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Excellence */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Flame className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Performance Excellence</h3>
              <span className="text-xs font-mono text-gray-400 ml-auto">7 Awards</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.performanceExcellence.map((t, idx) => (
                <li key={t} className="p-2 rounded-lg bg-[#050505] border border-white/5 flex items-center gap-2 text-gray-200 font-medium">
                  <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Digital Achievement Badges */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Medal className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">10 Digital Badges</h3>
              <span className="text-xs font-mono text-gray-400 ml-auto">Framework</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.badgeTypes.map((b) => (
                <li key={b} className="p-2 rounded-lg bg-[#050505] border border-white/5 flex items-center justify-between text-gray-200">
                  <span className="font-medium">{b}</span>
                  <span className="text-[10px] font-mono text-emerald-400">Digital Asset</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificate Categories */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-white text-base">Certificate Categories</h3>
              <span className="text-xs font-mono text-gray-400 ml-auto">6 Types</span>
            </div>
            <ul className="space-y-2 text-xs">
              {RECOGNITION_FRAMEWORK.certificateCategories.map((c, idx) => (
                <li key={c} className="p-2 rounded-lg bg-[#050505] border border-white/5 flex items-center gap-2 text-gray-200 font-medium">
                  <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-400 font-mono text-[10px] flex items-center justify-center font-bold">
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
