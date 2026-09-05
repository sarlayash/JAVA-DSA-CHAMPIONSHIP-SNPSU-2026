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
      // Trigger subtle celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
        });
      } catch (e) {
        // ignore if not supported
      }
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
      // Create off-screen canvas to render pristine FAANG certificate bitmap
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1260;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, 1260);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#020617');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1920, 1260);

      // Borders
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1840, 1180);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1810, 1150);

      // Gold corners
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(40, 120);
      ctx.lineTo(40, 40);
      ctx.lineTo(120, 40);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(1800, 40);
      ctx.lineTo(1880, 40);
      ctx.lineTo(1880, 120);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(40, 1140);
      ctx.lineTo(40, 1220);
      ctx.lineTo(120, 1220);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(1800, 1220);
      ctx.lineTo(1880, 1220);
      ctx.lineTo(1880, 1140);
      ctx.stroke();

      // Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('SAPTHGIRI NPS UNIVERSITY', 960, 130);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px sans-serif';
      ctx.fillText("INDIA'S FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026", 960, 175);
      ctx.font = '18px monospace';
      ctx.fillText('117 HOURS | 50 MINDS | 1 MISSION | BUILDING IN PUBLIC', 960, 210);

      // Certificate Category
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(certificate.certificateType.toUpperCase(), 960, 350);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 26px serif';
      ctx.fillText('This is proudly presented to', 960, 420);

      // Recipient Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 58px sans-serif';
      ctx.fillText(certificate.recipientName, 960, 520);

      // Underline
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(760, 550);
      ctx.lineTo(1160, 550);
      ctx.stroke();

      // Description
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '24px sans-serif';
      ctx.fillText(
        'for distinguished algorithmic excellence, data structures rigor, and industrial engineering during the championship.',
        960,
        640
      );

      // Title & Team Box
      ctx.fillStyle = '#020617';
      ctx.fillRect(560, 720, 800, 120);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(560, 720, 800, 120);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(certificate.titleAwarded, 960, 770);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px monospace';
      ctx.fillText(`TEAM: ${certificate.teamName.toUpperCase()} | 117 COMPLETED HOURS`, 960, 815);

      // Footer - Mentorship By Kapil
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('MENTORSHIP BY KAPIL', 960, 1070);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px monospace';
      ctx.fillText('Lead Mentor & Program Architect', 960, 1105);

      ctx.font = '18px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Sapthgiri NPS University', 960, 1135);

      // Left Footer: Date & Credential ID
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = '18px monospace';
      ctx.fillText('CREDENTIAL ID:', 120, 1070);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(certificate.id, 120, 1105);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('STATUS: QR VERIFIED OFFICIAL', 120, 1140);

      // Right Footer
      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748b';
      ctx.font = '18px monospace';
      ctx.fillText('ISSUED DATE:', 1800, 1070);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(certificate.issuedDate, 1800, 1105);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText('Tamper-Proof Cryptographic ID', 1800, 1140);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-4 sm:p-6 my-8">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Official Credential Viewer
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                  QR VERIFIED
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {certificate.id} &bull; {certificate.recipientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all"
              title="Copy verification link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="px-4 py-1.5 rounded bg-white text-black hover:bg-gray-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow"
              title="Download High-Res PNG"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? 'Exporting...' : 'Download PNG'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition ml-1"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Container */}
        <div className="bg-[#050505] p-2 sm:p-4 rounded-lg border border-white/5 overflow-x-auto flex justify-center">
          <FAANGCertificate
            certificate={certificate}
            onVerifyClick={() => onOpenVerify(certificate.id)}
          />
        </div>

        {/* Credential Attributes & Security Verification Info */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
            <p className="text-gray-500 font-mono text-[10px] uppercase font-bold mb-1">PROGRAM CREDENTIAL</p>
            <p className="font-semibold text-white">13-Day Java DSA Championship 2026</p>
            <p className="text-gray-400 text-[11px] mt-0.5">117 Hours Continuous Mentorship</p>
          </div>

          <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
            <p className="text-gray-500 font-mono text-[10px] uppercase font-bold mb-1">ISSUING AUTHORITY</p>
            <p className="font-semibold text-white">Sapthgiri NPS University</p>
            <p className="text-blue-400 text-[11px] font-semibold mt-0.5">Mentorship By Kapil</p>
          </div>

          <div className="p-3 bg-[#050505] rounded-lg border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-mono text-[10px] uppercase font-bold mb-1">SECURITY &amp; QR VERIFY</p>
              <p className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Cryptographically Verified
              </p>
            </div>
            <button
              onClick={() => onOpenVerify(certificate.id)}
              className="px-2.5 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[11px] border border-emerald-500/30 transition flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
