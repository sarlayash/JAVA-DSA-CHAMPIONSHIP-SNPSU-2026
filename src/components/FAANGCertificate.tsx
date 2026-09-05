import React, { useEffect, useState } from 'react';
import { Certificate } from '../types';
import { generateCertificateQRCode } from '../utils/storage';
import { ShieldCheck, QrCode, Award, CheckCircle2, Sparkles, Star } from 'lucide-react';

interface Props {
  certificate: Certificate;
  onVerifyClick?: () => void;
  id?: string;
  isPrintMode?: boolean;
}

export const FAANGCertificate: React.FC<Props> = ({
  certificate,
  onVerifyClick,
  id = 'faang-certificate-render',
  isPrintMode = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    generateCertificateQRCode(certificate.id, certificate.recipientName).then((url) => {
      if (isMounted) {
        setQrDataUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [certificate.id, certificate.recipientName]);

  // Distinct colorful ribbon palettes for each certificate tier
  const getTierRibbonStyle = (type: string) => {
    switch (type) {
      case 'Championship Winner Certificate':
        return {
          titleColor: 'text-[#1a73e8]',
          badgeGradient: 'from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]',
          accentBorder: 'border-blue-400',
          sealPrimary: '#1a73e8',
          sealSecondary: '#fbbc04',
          ribbonGlow: 'shadow-blue-500/20',
          ribbonLabel: 'GRAND CHAMPION TIER',
        };
      case 'Certificate of Excellence':
        return {
          titleColor: 'text-[#ea4335]',
          badgeGradient: 'from-[#ea4335] via-[#fbbc04] to-[#1a73e8]',
          accentBorder: 'border-red-400',
          sealPrimary: '#ea4335',
          sealSecondary: '#1a73e8',
          ribbonGlow: 'shadow-red-500/20',
          ribbonLabel: 'EXCELLENCE HONORS',
        };
      case 'Certificate of Merit':
        return {
          titleColor: 'text-[#1e8e3e]',
          badgeGradient: 'from-[#34a853] via-[#1a73e8] to-[#fbbc04]',
          accentBorder: 'border-emerald-400',
          sealPrimary: '#34a853',
          sealSecondary: '#1a73e8',
          ribbonGlow: 'shadow-emerald-500/20',
          ribbonLabel: 'MERIT DISTINCTION',
        };
      case 'Team Excellence Certificate':
        return {
          titleColor: 'text-[#7c3aed]',
          badgeGradient: 'from-[#7c3aed] via-[#1a73e8] to-[#34a853]',
          accentBorder: 'border-purple-400',
          sealPrimary: '#7c3aed',
          sealSecondary: '#fbbc04',
          ribbonGlow: 'shadow-purple-500/20',
          ribbonLabel: 'TEAM EXCELLENCE',
        };
      default:
        return {
          titleColor: 'text-[#0284c7]',
          badgeGradient: 'from-[#0284c7] via-[#10b981] via-[#f59e0b] to-[#6366f1]',
          accentBorder: 'border-sky-400',
          sealPrimary: '#0284c7',
          sealSecondary: '#f59e0b',
          ribbonGlow: 'shadow-sky-500/20',
          ribbonLabel: 'OFFICIAL PARTICIPATION',
        };
    }
  };

  const style = getTierRibbonStyle(certificate.certificateType);

  return (
    <div
      id={id}
      className={`relative w-full max-w-[960px] mx-auto bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden font-sans border-8 border-slate-100 ${
        isPrintMode ? 'p-0 shadow-none border-0' : 'my-4'
      }`}
      style={{
        aspectRatio: '16 / 10.8',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. Colorful Ribbons Banner Border (Google & Microsoft Spectrum) */}
      <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853] z-20" />
      <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-r from-[#34a853] via-[#fbbc04] via-[#ea4335] to-[#1a73e8] z-20" />

      {/* 2. Colorful Corner Ribbon Badges (Top Left & Top Right) */}
      <div className="absolute top-3 left-3 w-16 h-16 pointer-events-none z-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#1a73e8]" />
        <div className="absolute top-1 left-0 w-1 h-full bg-[#1a73e8]" />
        <div className="absolute top-1.5 left-1.5 w-8 h-8 border-t-2 border-l-2 border-[#ea4335]" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#fbbc04]" />
      </div>

      <div className="absolute top-3 right-3 w-16 h-16 pointer-events-none z-20">
        <div className="absolute top-0 right-0 w-full h-1 bg-[#34a853]" />
        <div className="absolute top-1 right-0 w-1 h-full bg-[#34a853]" />
        <div className="absolute top-1.5 right-1.5 w-8 h-8 border-t-2 border-r-2 border-[#ea4335]" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#fbbc04]" />
      </div>

      <div className="absolute bottom-3 left-3 w-16 h-16 pointer-events-none z-20">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#34a853]" />
        <div className="absolute bottom-1 left-0 w-1 h-full bg-[#34a853]" />
        <div className="absolute bottom-1.5 left-1.5 w-8 h-8 border-b-2 border-l-2 border-[#fbbc04]" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#ea4335]" />
      </div>

      <div className="absolute bottom-3 right-3 w-16 h-16 pointer-events-none z-20">
        <div className="absolute bottom-0 right-0 w-full h-1 bg-[#1a73e8]" />
        <div className="absolute bottom-1 right-0 w-1 h-full bg-[#1a73e8]" />
        <div className="absolute bottom-1.5 right-1.5 w-8 h-8 border-b-2 border-r-2 border-[#fbbc04]" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#ea4335]" />
      </div>

      {/* 3. Subtle Inner Parchment Guilloche Framing */}
      <div className="absolute inset-5 rounded-lg border-2 border-slate-200 pointer-events-none z-10">
        <div className="absolute inset-1 rounded border border-slate-100" />
      </div>

      {/* 4. Fine Background Watermark Seal */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-[480px] h-[480px] text-slate-800 fill-current">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="4" fill="none" />
          <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" />
        </svg>
      </div>

      {/* 5. Main Certificate Content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-7 sm:p-10 md:p-12">
        {/* Top Section: Institution & Credential Badging */}
        <div>
          <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
            {/* Institution Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1a73e8] to-[#1557b0] flex items-center justify-center text-white font-serif font-black text-xl shadow-md border border-blue-200">
                SN
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black tracking-wider uppercase text-slate-900 font-sans">
                  Sapthgiri NPS University
                </h3>
                <p className="text-[11px] font-medium text-slate-600 tracking-tight font-sans flex items-center gap-1.5">
                  <span>School of Computer Science &amp; Engineering</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-blue-700 font-semibold">Official Credential Registry</span>
                </p>
              </div>
            </div>

            {/* Credential ID & QR Badge */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                AUTHENTIC &bull; QR VERIFIED
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-1">ID: {certificate.id}</p>
            </div>
          </div>

          {/* Championship Program Title Ribbon */}
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-mono uppercase tracking-widest font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbc04]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]" />
              Official Championship Registry &bull; Inaugural Edition
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-slate-800 font-sans mt-1">
              India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              117 Hours &bull; 50 Minds &bull; 1 Mission &bull; Building In Public
            </p>
          </div>
        </div>

        {/* Center Section: Recipient & Honor Details */}
        <div className="text-center my-auto py-2">
          {/* Certificate Category Banner */}
          <div className="inline-block relative">
            <div className={`px-5 py-1 rounded-full bg-gradient-to-r ${style.badgeGradient} text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.25em] shadow-md`}>
              {certificate.certificateType}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-slate-600 mt-2 mb-1">
            This certifies that
          </p>

          {/* Recipient Name in Display Typography */}
          <div className="my-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 uppercase font-sans">
              {certificate.recipientName}
            </h2>
            {/* Multi-color Ribbon Underline */}
            <div className="h-1 w-44 mx-auto bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853] rounded-full mt-1.5" />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mt-2 font-sans">
            has rigorously completed the 117-hour industry Java DSA curriculum with distinction, demonstrating algorithmic mastery, competitive software problem-solving, and distinguished team leadership:
          </p>

          {/* Title Awarded Ribbon Box */}
          <div className="mt-2.5 inline-block">
            <div className="px-5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 shadow-sm flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#fbbc04]" />
              <div className="text-left">
                <span className="text-sm sm:text-base font-black tracking-wide text-[#1a73e8] font-sans block">
                  {certificate.titleAwarded}
                </span>
                <span className="text-[11px] text-slate-600 font-mono block">
                  Team: <strong className="text-slate-800">{certificate.teamName}</strong> &bull; 117 Hours Intensive Program
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Mentorship By Kapil, Verification, QR Code & Rosette Ribbon */}
        <div className="pt-3 border-t border-slate-100">
          <div className="grid grid-cols-3 items-end">
            {/* Left: Audit Ledger & Issue Date */}
            <div className="text-left space-y-1">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">
                Batch &bull; Verified Date
              </p>
              <p className="text-xs font-bold text-slate-900 font-mono">
                50 MINDS &bull; {certificate.issuedDate}
              </p>
              <p className="text-[10px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Ledger SHA-256 Validated
              </p>
            </div>

            {/* Middle: Mentorship By Kapil (Mandatory: Mentorship By Kapil in footer, no signs needed) */}
            <div className="text-center flex flex-col items-center">
              {/* Colorful Ribbon Rosette Seal */}
              <div className="relative mb-1 flex flex-col items-center">
                {/* Ribbon tails hanging down */}
                <div className="absolute -bottom-3 flex gap-1 z-0">
                  <div className="w-2.5 h-5 bg-[#1a73e8] transform -rotate-12 rounded-b-xs shadow-2xs" />
                  <div className="w-2.5 h-6 bg-[#ea4335] rounded-b-xs shadow-2xs" />
                  <div className="w-2.5 h-5 bg-[#34a853] transform rotate-12 rounded-b-xs shadow-2xs" />
                </div>
                {/* Round Rosette Medal */}
                <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-0.5 shadow-md flex items-center justify-center border border-amber-500">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </div>
                </div>
              </div>

              <div className="mt-1">
                <h4 className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-950 uppercase font-sans">
                  Mentorship By Kapil
                </h4>
                <p className="text-[10px] text-[#1a73e8] font-mono tracking-tight font-bold">
                  Lead Mentor &amp; Program Architect
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                  Sapthgiri NPS University &bull; Building In Public
                </p>
              </div>
            </div>

            {/* Right: Cryptographic QR Code Scanner */}
            <div className="text-right flex flex-col items-end">
              <button
                type="button"
                onClick={onVerifyClick}
                className="group relative cursor-pointer block p-1.5 bg-white border-2 border-slate-200 rounded-lg shadow hover:border-blue-500 transition-all"
                title="Click or Scan to Verify Credential"
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Verification"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded"
                  />
                ) : (
                  <div className="w-14 h-14 bg-slate-100 rounded flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-600 animate-pulse" />
                  </div>
                )}
              </button>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-600 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="tracking-tight font-bold uppercase">SCAN TO VERIFY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
