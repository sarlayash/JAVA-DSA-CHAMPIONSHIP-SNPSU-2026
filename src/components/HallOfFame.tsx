import React from 'react';
import { RECOGNITION_FRAMEWORK, CHAMPIONSHIP_META } from '../data/championshipData';
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
  onSelectLearner: (learnerName: string) => void;
}

export const HallOfFame: React.FC<Props> = ({ onSelectLearner }) => {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sm:p-10 shadow-sm relative overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold mb-3">
          <Trophy className="w-4 h-4 text-blue-400" />
          PERMANENT CHAMPIONSHIP HALL OF FAME
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Championship Legends &amp; Honors
        </h1>

        <p className="text-gray-300 font-sans italic text-base sm:text-lg mt-2 max-w-xl mx-auto">
          "{CHAMPIONSHIP_META.motto}"
        </p>

        <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mt-2 font-sans">
          {CHAMPIONSHIP_META.vision}
        </p>

        <div className="mt-4 pt-4 border-t border-white/5 inline-flex items-center gap-2 text-xs text-gray-300 font-mono">
          <Award className="w-4 h-4 text-blue-400" />
          <span>Sapthgiri NPS University &bull; Mentorship By Kapil</span>
        </div>
      </div>

      {/* Podium Showcase: Champion Team & Top Honors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Runner-Up */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm relative order-2 md:order-1 flex flex-col justify-between">
          <div className="text-center">
            <span className="w-10 h-10 rounded-lg bg-white/5 text-gray-200 border border-white/10 inline-flex items-center justify-center font-mono font-bold text-sm mb-3">
              #2
            </span>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              First Runner-Up Team
            </p>
            <h3 className="text-xl font-extrabold text-white mt-1">Byte Force</h3>
            <p className="text-sm font-mono font-bold text-gray-300 mt-1">1,798,093 Points</p>
            <p className="text-xs text-gray-400 mt-2 font-sans">
              Awarded for algorithmic mastery and high-density video demonstrations.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <span className="text-[11px] font-mono text-gray-400">
              Akash K J &bull; Akshay Guptha &bull; Akshay Ravi &bull; Ajay P K
            </span>
          </div>
        </div>

        {/* Grand Champion Team */}
        <div className="bg-[#0a0a0a] border border-blue-500/40 rounded-xl p-6 sm:p-8 shadow-sm relative order-1 md:order-2 flex flex-col justify-between -translate-y-1">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-0.5 rounded font-mono text-xs font-bold tracking-wider shadow-sm">
            CHAMPION TEAM 2026
          </div>
          <div className="text-center pt-2">
            <span className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center justify-center font-mono font-extrabold text-2xl mb-3 shadow-sm">
              <Trophy className="w-8 h-8 text-blue-400" />
            </span>
            <p className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
              Grand Champion Team
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Mad Apex</h2>
            <p className="text-xl font-extrabold text-blue-400 font-mono mt-1">
              1,917,722 Points
            </p>
            <p className="text-xs text-gray-300 mt-2 font-sans leading-relaxed">
              Undisputed tournament victors with supreme algorithmic consistency, daily coding battles, and speed mastery.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] font-mono text-blue-400 uppercase mb-1 font-semibold">Champion Roster</p>
            <span className="text-xs font-mono text-gray-200">
              Akshay Krishna H R &bull; Anand &bull; Akshaya Krishna S &bull; Ajeya L &bull; Akash T K &bull; Akash S Savalagi
            </span>
          </div>
        </div>

        {/* Second Runner-Up */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm relative order-3 flex flex-col justify-between">
          <div className="text-center">
            <span className="w-10 h-10 rounded-lg bg-white/5 text-gray-300 border border-white/10 inline-flex items-center justify-center font-mono font-bold text-sm mb-3">
              #3
            </span>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              Second Runner-Up Team
            </p>
            <h3 className="text-xl font-extrabold text-white mt-1">TechTok</h3>
            <p className="text-sm font-mono font-bold text-gray-300 mt-1">1,686,631 Points</p>
            <p className="text-xs text-gray-400 mt-2 font-sans">
              Awarded for creative technical documentation, posters, and PDF architectural guides.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <span className="text-[11px] font-mono text-gray-400">
              Ananya Anil &bull; Ananya D Shetty &bull; Anagha Nayak &bull; Akanksha &bull; Akarshi
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Stars of the Day & Tongue Twisters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stars of the Day (Page 329) */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">Championship Stars of the Day</h3>
            </div>
            <span className="text-xs font-mono text-gray-400">Recorded Dates</span>
          </div>
          <p className="text-xs text-gray-400">
            Individual standouts recognized for extraordinary dedication during the daily 13-day live sessions:
          </p>
          <div className="space-y-2.5">
            {RECOGNITION_FRAMEWORK.starsOfDay.map((star) => (
              <div
                key={star.date}
                onClick={() => onSelectLearner(star.name)}
                className="cursor-pointer p-3 rounded-lg bg-[#050505] hover:bg-white/5 border border-white/5 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                    {star.date}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {star.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono">Team: {star.team}</p>
                  </div>
                </div>
                <span className="text-xs text-blue-400 font-mono group-hover:underline">
                  View Profile &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tongue Twisters Champions (Page 328) */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Tongue Twisters Champions</h3>
            </div>
            <span className="text-xs font-mono text-gray-400">Special Challenge</span>
          </div>
          <p className="text-xs text-gray-400">
            Championship communication &amp; agility finalists from each competitive squad:
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
            {RECOGNITION_FRAMEWORK.tongueTwistersWinners.map((w, idx) => (
              <div
                key={idx}
                onClick={() => onSelectLearner(w.name)}
                className="cursor-pointer p-2.5 rounded-lg bg-[#050505] hover:bg-white/5 border border-white/5 transition group"
              >
                <p className="text-xs font-bold text-gray-200 group-hover:text-purple-400 truncate transition-colors">
                  {w.name}
                </p>
                <p className="text-[10px] text-gray-500 font-mono">{w.team}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grand Demos of 2nd September (Page 330) */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Grand Demos Showcase (2nd September)</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">Official Demo Count</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {RECOGNITION_FRAMEWORK.grandDemos.map((d) => (
            <div
              key={d.team}
              className="p-4 bg-[#050505] rounded-lg border border-white/5 space-y-1"
            >
              <p className="text-xs font-mono text-gray-400">{d.team}</p>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">{d.count}</p>
              <p className="text-[10px] text-gray-500 font-mono">Demos Delivered</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
