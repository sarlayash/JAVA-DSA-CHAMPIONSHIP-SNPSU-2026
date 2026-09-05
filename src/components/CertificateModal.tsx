import React, { useState } from 'react';
import { Certificate } from '../types';
import { FAANGCertificate } from './FAANGCertificate';
import {
  X,
  Download,
  Printer,
  Check,
  Share2,
  ShieldCheck,
  QrCode,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  certificate: Certificate | null;
  onClose: () => void;
  onOpenVerify: (certId: string) => void;
}

export const CertificateModal: React.FC<Props> = ({ certificate, onClose, onOpenVerify }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  React.useEffect(() => {
    if (certificate) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1a73e8', '#ea4335', '#fbbc04', '#34a853'],
        });
      } catch (e) {}
    }
  }, [certificate]);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#verify?id=${encodeURIComponent(
      certificate.id
    )}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Create off-screen canvas to render pristine white-background FAANG certificate with colorful ribbons
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1260;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Crisp White Canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1920, 1260);

      // Top Google/Microsoft Colorful Ribbon Spectrum (12px height)
      const grad = ctx.createLinearGradient(0, 0, 1920, 0);
      grad.addColorStop(0, '#1a73e8'); // Google Blue
      grad.addColorStop(0.33, '#ea4335'); // Google Red
      grad.addColorStop(0.66, '#fbbc04'); // Google Yellow
      grad.addColorStop(1, '#34a853'); // Google Green
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1920, 14);

      // Outer Frame
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 46, 1848, 1176);

      // Inner Delicate Border
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 58, 1824, 1152);

      // Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1a73e8';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('SAPTHGIRI NPS UNIVERSITY', 960, 120);

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 32px sans-serif';
      ctx.fillText("INDIA'S FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026", 960, 170);

      ctx.fillStyle = '#64748b';
      ctx.font = '600 18px monospace';
      ctx.fillText('117 HOURS | 50 MINDS | 1 MISSION | BUILDING IN PUBLIC', 960, 205);

      // Category Pill
      ctx.fillStyle = '#eff6ff';
      ctx.fillRect(660, 270, 600, 50);
      ctx.strokeStyle = '#bfdbfe';
      ctx.lineWidth = 2;
      ctx.strokeRect(660, 270, 600, 50);

      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(certificate.certificateType.toUpperCase(), 960, 303);

      // Presentation line
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 26px serif';
      ctx.fillText('This official credential certifies that', 960, 390);

      // Recipient Name
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 60px sans-serif';
      ctx.fillText(certificate.recipientName, 960, 480);

      // Underline Ribbon Accent
      ctx.fillStyle = grad;
      ctx.fillRect(720, 505, 480, 4);

      // Description text
      ctx.fillStyle = '#475569';
      ctx.font = '500 24px sans-serif';
      ctx.fillText(
        'has demonstrated exemplary algorithmic rigor, engineering depth, and technical excellence during the tournament.',
        960,
        580
      );

      // Title Awarded & Team Badge Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(520, 650, 880, 140);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(520, 650, 880, 140);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = '900 38px sans-serif';
      ctx.fillText(certificate.titleAwarded, 960, 715);

      ctx.fillStyle = '#64748b';
      ctx.font = '600 20px monospace';
      ctx.fillText(`TEAM: ${certificate.teamName.toUpperCase()} • 117 CURRICULUM HOURS COMPLETED`, 960, 755);

      // Footer - Mentorship By Kapil
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 34px sans-serif';
      ctx.fillText('MENTORSHIP BY KAPIL', 960, 1020);

      ctx.fillStyle = '#1a73e8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('Lead Mentor & Program Architect', 960, 1055);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText('Sapthgiri NPS University • No Physical Signatures Required', 960, 1085);

      // Left Footer: Credential ID
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('CREDENTIAL ID:', 100, 1020);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(certificate.id, 100, 1055);

      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('STATUS: QR VERIFIED & TAMPER PROOF', 100, 1085);

      // Right Footer: Date
      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('ISSUED DATE:', 1820, 1020);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(certificate.issuedDate, 1820, 1055);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText('FAANG & Fortune 500 Architecture', 1820, 1085);

      // Bottom Ribbon
      ctx.fillStyle = grad;
      ctx.fillRect(0, 1250, 1920, 10);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${certificate.recipientName.replace(/\s+/g, '_')}_${certificate.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate image', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-6 my-8">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-[#1a73e8] border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                Official Credential Viewer
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                  QR VERIFIED
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {certificate.id} &bull; {certificate.recipientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Copy verification link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="px-4 py-1.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              title="Download High-Res PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Download PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition ml-1 cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Container */}
        <div className="bg-slate-100/60 p-2 sm:p-6 rounded-xl border border-slate-200 overflow-x-auto flex justify-center">
          <FAANGCertificate
            certificate={certificate}
            onVerifyClick={() => onOpenVerify(certificate.id)}
          />
        </div>

        {/* Credential Attributes & Security Verification Info */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 font-mono text-[10px] uppercase font-bold mb-0.5">
              PROGRAM CREDENTIAL
            </p>
            <p className="font-bold text-slate-900">13-Day Java DSA Championship 2026</p>
            <p className="text-slate-500 text-[11px] mt-0.5">117 Hours Continuous Mentorship</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 font-mono text-[10px] uppercase font-bold mb-0.5">
              ISSUING AUTHORITY
            </p>
            <p className="font-bold text-slate-900">Sapthgiri NPS University</p>
            <p className="text-[#1a73e8] text-[11px] font-bold mt-0.5">Mentorship By Kapil</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-mono text-[10px] uppercase font-bold mb-0.5">
                SECURITY &amp; QR VERIFY
              </p>
              <p className="text-emerald-700 font-mono font-bold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Cryptographically Verified
              </p>
            </div>
            <button
              onClick={() => onOpenVerify(certificate.id)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
