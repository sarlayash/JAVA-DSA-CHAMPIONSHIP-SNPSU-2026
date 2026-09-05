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
          accent: 'from-blue-500 via-indigo-500 to-blue-600',
          badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          sealColor: '#3b82f6',
          subBorder: 'border-blue-500/30',
          cornerColor: 'border-blue-500/80',
        };
      case 'Certificate of Excellence':
        return {
          accent: 'from-blue-400 via-indigo-500 to-sky-500',
          badgeBg: 'bg-blue-500/10 border-blue-400/40 text-blue-300',
          sealColor: '#3b82f6',
          subBorder: 'border-blue-500/30',
          cornerColor: 'border-blue-500/80',
        };
      case 'Certificate of Merit':
        return {
          accent: 'from-indigo-400 via-blue-500 to-teal-500',
          badgeBg: 'bg-indigo-500/10 border-indigo-400/40 text-indigo-300',
          sealColor: '#6366f1',
          subBorder: 'border-indigo-500/30',
          cornerColor: 'border-indigo-500/80',
        };
      case 'Team Excellence Certificate':
        return {
          accent: 'from-blue-400 via-purple-500 to-indigo-600',
          badgeBg: 'bg-purple-500/10 border-purple-400/40 text-purple-300',
          sealColor: '#8b5cf6',
          subBorder: 'border-purple-500/30',
          cornerColor: 'border-purple-500/80',
        };
      default:
        return {
          accent: 'from-zinc-400 via-slate-400 to-zinc-500',
          badgeBg: 'bg-white/5 border-white/20 text-zinc-300',
          sealColor: '#71717a',
          subBorder: 'border-white/10',
          cornerColor: 'border-white/40',
        };
    }
  };

  const tier = getTierColor(certificate.certificateType);

  return (
    <div
      id={id}
      className={`relative w-full max-w-[960px] mx-auto bg-gradient-to-b from-[#0c0c0c] via-[#070707] to-[#0a0a0a] text-[#e0e0e0] rounded-xl shadow-2xl overflow-hidden border border-white/10 font-sans ${
        isPrintMode ? 'p-0 shadow-none border-0' : 'my-4'
      }`}
      style={{
        aspectRatio: '16 / 10.5',
      }}
    >
      {/* Precision Micro Guilloche / Geometric Security Border */}
      <div className="absolute inset-2 sm:inset-3 rounded-lg border border-white/5 pointer-events-none z-10">
        <div className="absolute inset-1 sm:inset-2 rounded border border-white/[0.03]" />
        {/* Subtle Corner Accents */}
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${tier.cornerColor} rounded-tl-sm`} />
        <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${tier.cornerColor} rounded-tr-sm`} />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${tier.cornerColor} rounded-bl-sm`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${tier.cornerColor} rounded-br-sm`} />
      </div>

      {/* Subtle Background Watermark Logo & Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-[500px] h-[500px] text-white fill-current">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" />
        </svg>
      </div>

      {/* Main Certificate Body */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
        {/* Top Header: Institution & Program Branding */}
        <div>
          <div className="flex items-start justify-between border-b border-white/5 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
                SN
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white font-mono">
                  Sapthgiri NPS University
                </h3>
                <p className="text-[11px] text-gray-400 tracking-wide font-sans">
                  Official Recognition Framework &bull; Credentialing Registry
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${tier.badgeBg}`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                QR VERIFIED
              </span>
              <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {certificate.id}</p>
            </div>
          </div>

          {/* Program Subheading */}
          <div className="mt-4 text-center">
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-gray-400 font-mono font-medium">
              India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026
            </p>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">
              117 Hours &bull; 50 Minds &bull; 1 Mission &bull; Building In Public
            </p>
          </div>
        </div>

        {/* Center: Recipient & Recognition */}
        <div className="text-center my-auto py-3">
          <div className="mb-2">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-gray-400 font-mono">
              {certificate.certificateType}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-gray-400 mb-2">
            This is to certify that
          </p>

          <div className="my-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase font-sans">
              {certificate.recipientName}
            </h2>
            <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2" />
          </div>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed mt-2 font-sans font-light">
            has successfully completed the intensive curriculum, demonstrating superior algorithmic rigor, daily competitive coding, and distinguished software craftsmanship:
          </p>

          <div className="mt-3 inline-block">
            <div className={`px-4 py-1.5 rounded-lg border bg-[#050505] ${tier.subBorder} shadow-sm`}>
              <span className="text-sm sm:text-base font-bold tracking-wide text-blue-400 font-sans">
                {certificate.titleAwarded}
              </span>
              <span className="text-xs text-gray-400 block font-mono">
                Team: {certificate.teamName} &bull; 117 Hours Immersive
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: FAANG Standard Clean Footer & Mentorship */}
        <div className="pt-4 border-t border-white/5">
          <div className="grid grid-cols-3 items-end">
            {/* Left: Issuance & Integrity */}
            <div className="text-left space-y-1">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold">
                Batch Size &amp; Date
              </p>
              <p className="text-xs font-semibold text-white font-mono">
                50 MINDS &bull; {certificate.issuedDate}
              </p>
              <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED AUTHENTIC
              </p>
            </div>

            {/* Middle: Mentorship By Kapil (strictly per instructions: "Mentorship By Kapil in footer , no signs needed") */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                  Building In Public
                </div>
                <h4 className="text-xs sm:text-sm font-bold tracking-wide text-white uppercase font-sans">
                  Mentorship By Kapil
                </h4>
                <p className="text-[10px] text-blue-400 font-mono tracking-tight font-medium">
                  Lead Mentor &amp; Program Architect
                </p>
                <p className="text-[9px] text-gray-500 font-mono">
                  Sapthgiri NPS University
                </p>
              </div>
            </div>

            {/* Right: Genuine QR Scan QR Verified */}
            <div className="text-right flex flex-col items-end">
              <button
                type="button"
                onClick={onVerifyClick}
                className="group relative cursor-pointer block p-1.5 bg-white rounded shadow-md hover:ring-2 hover:ring-blue-500 transition-all"
                title="Click to verify credential"
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Verification"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded"
                  />
                ) : (
                  <div className="w-14 h-14 bg-zinc-100 rounded flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-zinc-700 animate-pulse" />
                  </div>
                )}
              </button>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-gray-400 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="tracking-tight font-bold">SCAN TO VERIFY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
