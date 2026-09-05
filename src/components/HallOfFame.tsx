import React from 'react';
import { RECOGNITION_FRAMEWORK, CHAMPIONSHIP_META } from '../data/championshipData';
import { Team, ChampionshipMeta } from '../types';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  Medal,
  Calendar,
  Presentation,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface Props {
  teams: Team[];
  meta?: ChampionshipMeta;
  onSelectLearner: (learnerName: string) => void;
}

export const HallOfFame: React.FC<Props> = ({ teams, meta, onSelectLearner }) => {
  // Group teams by final rank
  const rank1Teams = teams.filter((t) => t.rank === 1);
  const rank2Teams = teams.filter((t) => t.rank === 2);
  const rank3Teams = teams.filter((t) => t.rank === 3);
  const rank4Teams = teams.filter((t) => t.rank === 4);
  const rank5Teams = teams.filter((t) => t.rank === 5);

  return (
    <div className="space-y-8 font-sans">
      {/* Hero Banner (Microsoft & Google Clean Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden text-center">
        {/* Colorful micro ribbon border */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] font-mono text-xs font-bold mb-3">
          <Trophy className="w-4 h-4 text-[#1a73e8]" />
          OFFICIAL TOURNAMENT FINAL RESULTS &bull; HALL OF FAME
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Championship Legends &amp; Final Standings
        </h1>

        <p className="text-slate-700 font-sans italic text-base sm:text-lg mt-2 max-w-xl mx-auto">
          "{meta?.motto || CHAMPIONSHIP_META.motto}"
        </p>

        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mt-2 font-sans leading-relaxed">
          {meta?.tagline || CHAMPIONSHIP_META.vision}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 inline-flex items-center gap-2 text-xs text-slate-600 font-mono">
          <Award className="w-4 h-4 text-[#1a73e8]" />
          <span>Sapthgiri NPS University &bull; Mentorship By Kapil &bull; 117 Hours Intensive</span>
        </div>
      </div>

      {/* Dual Grand Champions Spotlight (Rank 1) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-center">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-wide">
            Rank 1 &bull; Grand Champion Teams
          </h2>
          <Trophy className="w-6 h-6 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rank1Teams.map((team) => (
            <div
              key={team.name}
              className="bg-white border-2 border-amber-400 rounded-2xl p-6 sm:p-7 shadow-md relative flex flex-col justify-between"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-0.5 rounded-full font-mono text-xs font-black tracking-wider shadow-xs whitespace-nowrap">
                CHAMPION TEAM 2026 &bull; RANK #1
              </div>

              <div className="text-center pt-2">
                <span className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 inline-flex items-center justify-center font-mono font-extrabold text-xl mb-2 shadow-xs">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </span>
                <p className="text-xs font-mono text-amber-800 uppercase tracking-widest font-bold">
                  {team.award}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {team.name}
                </h3>
                <div className="mt-2 inline-block px-4 py-1 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-mono text-amber-700 block uppercase font-bold">
                    FINAL POINTS
                  </span>
                  <span className="text-2xl font-black text-amber-600 font-mono">
                    {team.totalPoints.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-100 text-center">
                <p className="text-[10px] font-mono text-amber-800 uppercase mb-1 font-bold">
                  Champion Roster ({team.members.length} Members)
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {team.members.map((m) => (
                    <button
                      key={m}
                      onClick={() => onSelectLearner(m)}
                      className="text-xs font-mono bg-slate-50 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-800 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Tournament Standings Table (Direct replica of the Championship Scoreboard) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1a73e8]" />
            <h3 className="text-base font-bold text-slate-900">
              Official Championship Final Results Board
            </h3>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-[#1a73e8] px-3 py-1 rounded-full font-bold border border-blue-200">
            Validated Final Standings &bull; 10 Teams
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-4 text-right">FINAL POINTS</th>
                <th className="py-3 px-4 text-center">RANK</th>
                <th className="py-3 px-4">TEAM TITLES</th>
                <th className="py-3 px-4">Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teams.map((t) => (
                <tr
                  key={t.name}
                  className={`hover:bg-blue-50/40 transition ${
                    t.rank === 1 ? 'bg-amber-50/30 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    {t.rank === 1 && <Trophy className="w-4 h-4 text-amber-500" />}
                    <span>{t.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-[#1a73e8]">
                    {t.totalPoints.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-bold text-xs ${
                        t.rank === 1
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : t.rank === 2
                          ? 'bg-slate-100 text-slate-800 border border-slate-300'
                          : t.rank === 3
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}
                    >
                      #{t.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                      {t.award}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                    {t.members.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranks 2 & 3 Honors Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rank 2 Teams */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-900">Rank #2 Honorees (3,686,631 Points)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">Silver Honors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rank2Teams.map((team) => (
              <div key={team.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-mono text-[#1a73e8] uppercase font-bold">
                  {team.award}
                </p>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">{team.name}</h4>
                <p className="text-xs font-mono font-extrabold text-slate-700 mt-1">
                  {team.totalPoints.toLocaleString()} Points
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-2">
                  {team.members.join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rank 3 Teams */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-slate-900">Rank #3 Honorees (3,676,988 Points)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700">Bronze Honors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rank3Teams.map((team) => (
              <div key={team.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-mono text-amber-700 uppercase font-bold">
                  {team.award}
                </p>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">{team.name}</h4>
                <p className="text-xs font-mono font-extrabold text-slate-700 mt-1">
                  {team.totalPoints.toLocaleString()} Points
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-2">
                  {team.members.join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Stars of the Day & Tongue Twisters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stars of the Day */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Championship Stars of the Day</h3>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">Recorded Sessions</span>
          </div>
          <p className="text-xs text-slate-600">
            Individual standouts recognized for extraordinary dedication during the daily 13-day live sessions:
          </p>
          <div className="space-y-2.5">
            {RECOGNITION_FRAMEWORK.starsOfDay.map((star) => (
              <div
                key={star.date}
                onClick={() => onSelectLearner(star.name)}
                className="cursor-pointer p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-bold">
                    {star.date}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1a73e8] transition">
                      {star.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">Team: {star.team}</p>
                  </div>
                </div>
                <span className="text-xs text-[#1a73e8] font-semibold group-hover:underline">
                  View Profile &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tongue Twisters Champions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Tongue Twisters Champions</h3>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">Special Challenge</span>
          </div>
          <p className="text-xs text-slate-600">
            Championship communication &amp; agility finalists from each competitive squad:
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
            {RECOGNITION_FRAMEWORK.tongueTwistersWinners.map((w, idx) => (
              <div
                key={idx}
                onClick={() => onSelectLearner(w.name)}
                className="cursor-pointer p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 transition group"
              >
                <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate transition">
                  {w.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">{w.team}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grand Demos of 2nd September */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Grand Demos Showcase (2nd September)</h3>
          </div>
          <span className="text-xs font-mono text-slate-500 font-bold">Official Demo Count</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {RECOGNITION_FRAMEWORK.grandDemos.map((d) => (
            <div
              key={d.team}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
            >
              <p className="text-xs font-mono text-slate-600 font-bold">{d.team}</p>
              <p className="text-2xl font-extrabold text-emerald-600 font-mono">{d.count}</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Demos Delivered</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
