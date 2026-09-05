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
  // Sort teams by rank or points
  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);
  const championTeam = sortedTeams[0] || teams[0];
  const firstRunnerUp = sortedTeams[1] || teams[1];
  const secondRunnerUp = sortedTeams[2] || teams[2];

  return (
    <div className="space-y-8 font-sans">
      {/* Hero Banner (Microsoft & Google Clean Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden text-center">
        {/* Colorful micro ribbon border */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] font-mono text-xs font-bold mb-3">
          <Trophy className="w-4 h-4 text-[#1a73e8]" />
          PERMANENT CHAMPIONSHIP HALL OF FAME
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Championship Legends &amp; Honors
        </h1>

        <p className="text-slate-700 font-sans italic text-base sm:text-lg mt-2 max-w-xl mx-auto">
          "{meta?.motto || CHAMPIONSHIP_META.motto}"
        </p>

        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mt-2 font-sans leading-relaxed">
          {meta?.tagline || CHAMPIONSHIP_META.vision}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 inline-flex items-center gap-2 text-xs text-slate-600 font-mono">
          <Award className="w-4 h-4 text-[#1a73e8]" />
          <span>Sapthgiri NPS University &bull; Mentorship By Kapil</span>
        </div>
      </div>

      {/* Podium Showcase: Champion Team & Top Honors (Real-time synced) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* First Runner-Up */}
        {firstRunnerUp && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative order-2 md:order-1 flex flex-col justify-between">
            <div className="text-center">
              <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center justify-center font-mono font-bold text-sm mb-3">
                #2
              </span>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">
                First Runner-Up Team
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{firstRunnerUp.name}</h3>
              <p className="text-sm font-mono font-bold text-[#1a73e8] mt-1">
                {firstRunnerUp.totalPoints.toLocaleString()} Points
              </p>
              <p className="text-xs text-slate-600 mt-2 font-sans">
                {firstRunnerUp.award}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] font-mono text-slate-500">
                {firstRunnerUp.members.join(' • ')}
              </span>
            </div>
          </div>
        )}

        {/* Grand Champion Team (Higher elevation & gold styling) */}
        {championTeam && (
          <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 sm:p-8 shadow-md relative order-1 md:order-2 flex flex-col justify-between -translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3.5 py-0.5 rounded-full font-mono text-xs font-extrabold tracking-wider shadow-xs">
              CHAMPION TEAM 2026
            </div>
            <div className="text-center pt-2">
              <span className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 inline-flex items-center justify-center font-mono font-extrabold text-2xl mb-3 shadow-xs">
                <Trophy className="w-8 h-8 text-amber-500" />
              </span>
              <p className="text-xs font-mono text-amber-800 uppercase tracking-widest font-bold">
                Grand Champion Team
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {championTeam.name}
              </h2>
              <p className="text-xl font-extrabold text-amber-600 font-mono mt-1">
                {championTeam.totalPoints.toLocaleString()} Points
              </p>
              <p className="text-xs text-slate-600 mt-2 font-sans leading-relaxed">
                {championTeam.award} &bull; Undisputed tournament victors with supreme algorithmic consistency.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-100 text-center">
              <p className="text-[10px] font-mono text-amber-800 uppercase mb-1 font-bold">
                Champion Roster ({championTeam.members.length})
              </p>
              <span className="text-xs font-mono text-slate-700 font-medium">
                {championTeam.members.join(' • ')}
              </span>
            </div>
          </div>
        )}

        {/* Second Runner-Up */}
        {secondRunnerUp && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative order-3 flex flex-col justify-between">
            <div className="text-center">
              <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center justify-center font-mono font-bold text-sm mb-3">
                #3
              </span>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">
                Second Runner-Up Team
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{secondRunnerUp.name}</h3>
              <p className="text-sm font-mono font-bold text-[#1a73e8] mt-1">
                {secondRunnerUp.totalPoints.toLocaleString()} Points
              </p>
              <p className="text-xs text-slate-600 mt-2 font-sans">
                {secondRunnerUp.award}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] font-mono text-slate-500">
                {secondRunnerUp.members.join(' • ')}
              </span>
            </div>
          </div>
        )}
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
