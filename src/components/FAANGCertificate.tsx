import React, { useEffect, useState } from 'react';
import { Certificate } from '../types';
import { generateCertificateQRCode } from '../utils/storage';
import { ShieldCheck, QrCode, Award, CheckCircle2 } from 'lucide-react';

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

  const getTierColor = (type: string) => {
    switch (type) {
      case 'Championship Winner Certificate':
        return {
          accent: 'from-amber-400 via-yellow-500 to-amber-600',
          badgeBg: 'bg-amber-500/10 border-amber-400/40 text-amber-300',
          sealColor: '#eab308',
          subBorder: 'border-amber-500/20',
        };
      case 'Certificate of Excellence':
        return {
          accent: 'from-blue-400 via-indigo-500 to-sky-500',
          badgeBg: 'bg-blue-500/10 border-blue-400/40 text-blue-300',
          sealColor: '#3b82f6',
          subBorder: 'border-blue-500/20',
        };
      case 'Certificate of Merit':
        return {
          accent: 'from-emerald-400 via-teal-500 to-emerald-600',
          badgeBg: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-300',
          sealColor: '#10b981',
          subBorder: 'border-emerald-500/20',
        };
      case 'Team Excellence Certificate':
        return {
          accent: 'from-purple-400 via-fuchsia-500 to-violet-600',
          badgeBg: 'bg-purple-500/10 border-purple-400/40 text-purple-300',
          sealColor: '#8b5cf6',
          subBorder: 'border-purple-500/20',
        };
      default:
        return {
          accent: 'from-slate-300 via-zinc-400 to-slate-500',
          badgeBg: 'bg-slate-500/10 border-slate-400/30 text-slate-200',
          sealColor: '#64748b',
          subBorder: 'border-slate-500/20',
        };
    }
  };

  const tier = getTierColor(certificate.certificateType);

  return (
    <div
      id={id}
      className={`relative w-full max-w-[960px] mx-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 font-sans ${
        isPrintMode ? 'p-0 shadow-none border-0' : 'my-4'
      }`}
      style={{
        aspectRatio: '16 / 10.5',
      }}
    >
      {/* Precision Micro Guilloche / Geometric Security Border */}
      <div className="absolute inset-2 sm:inset-3 rounded-xl border border-slate-800/80 pointer-events-none z-10">
        <div className="absolute inset-1 sm:inset-2 rounded-lg border border-slate-700/40" />
        {/* Subtle Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/60 rounded-tl-md" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/60 rounded-tr-md" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/60 rounded-bl-md" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/60 rounded-br-md" />
      </div>

      {/* Subtle Background Watermark Logo & Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-[500px] h-[500px] text-white fill-current">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" />
        </svg>
      </div>

      {/* Main Certificate Body */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
        {/* Top Header: Institution & Program Branding */}
        <div>
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-amber-500/20 via-slate-800 to-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-lg shadow-inner">
                SN
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400/90 font-mono">
                  Sapthgiri NPS University
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 tracking-wide font-sans">
                  Official Recognition Framework & Credentialing
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${tier.badgeBg}`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                QR VERIFIED
              </span>
              <p className="text-[10px] text-slate-500 font-mono mt-1">ID: {certificate.id}</p>
            </div>
          </div>

          {/* Program Subheading */}
          <div className="mt-4 text-center">
            <p className="text-[11px] sm:text-xs tracking-wider uppercase text-slate-400 font-mono">
              India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono mt-0.5">
              117 Hours &bull; 50 Minds &bull; 1 Mission &bull; Building In Public
            </p>
          </div>
        </div>

        {/* Center: Recipient & Recognition */}
        <div className="text-center my-auto py-3">
          <h1 className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-slate-300 font-mono">
            {certificate.certificateType}
          </h1>

          <p className="text-[11px] sm:text-xs text-slate-400 italic font-serif mt-2">
            This certifies that
          </p>

          <div className="my-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-white uppercase drop-shadow font-sans">
              {certificate.recipientName}
            </h2>
            <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mt-2" />
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mt-2 font-sans font-light">
            has successfully distinguished themselves in algorithmic thinking, data structures, and industry-grade Java software engineering, earning the prestigious distinction:
          </p>

          <div className="mt-3 inline-block">
            <div className={`px-4 py-1.5 rounded-lg border bg-slate-950/80 ${tier.subBorder} shadow-sm`}>
              <span className="text-sm sm:text-base font-bold tracking-wide text-amber-300 font-sans">
                {certificate.titleAwarded}
              </span>
              <span className="text-xs text-slate-400 block font-mono">
                Team: {certificate.teamName} &bull; 117 Hours Immersive
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: FAANG Standard Clean Footer & Mentorship */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-3 items-end">
            {/* Left: Issuance & Integrity */}
            <div className="text-left space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                Issue Date
              </p>
              <p className="text-xs font-medium text-slate-300 font-mono">
                {certificate.issuedDate}
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                Status: <span className="text-emerald-400 font-semibold">VERIFIED AUTHENTIC</span>
              </p>
            </div>

            {/* Middle: Mentorship By Kapil (strictly per instructions: "Mentorship By Kapil in footer , no signs needed") */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-1 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold tracking-wide text-slate-100 uppercase font-sans">
                  Mentorship By Kapil
                </h4>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                  Lead Mentor &amp; Program Architect
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                  Sapthgiri NPS University
                </p>
              </div>
            </div>

            {/* Right: Genuine QR Scan QR Verified */}
            <div className="text-right flex flex-col items-end">
              <button
                type="button"
                onClick={onVerifyClick}
                className="group relative cursor-pointer block p-1 bg-white rounded-lg shadow-md hover:ring-2 hover:ring-emerald-400 transition"
                title="Click to verify credential"
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Verification"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded"
                  />
                ) : (
                  <div className="w-14 h-14 bg-slate-100 rounded flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-700 animate-pulse" />
                  </div>
                )}
              </button>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>SCAN TO VERIFY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
