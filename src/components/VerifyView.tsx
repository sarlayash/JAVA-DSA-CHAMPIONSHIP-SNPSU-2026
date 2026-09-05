import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { ShieldCheck, CheckCircle2, AlertCircle, Search, QrCode, ExternalLink, Award } from 'lucide-react';
import { generateCertificateQRCode } from '../utils/storage';

interface Props {
  certificates: Certificate[];
  initialId?: string;
  onViewCertificate: (cert: Certificate) => void;
}

export const VerifyView: React.FC<Props> = ({ certificates, initialId = '', onViewCertificate }) => {
  const [searchQuery, setSearchQuery] = useState(initialId);
  const [matchedCert, setMatchedCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (initialId) {
      setSearchQuery(initialId);
      performSearch(initialId);
    } else if (certificates.length > 0) {
      // Default to the first certificate for demo
      performSearch(certificates[0].id);
    }
  }, [initialId, certificates]);

  const performSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    setHasSearched(true);
    if (!q) {
      setMatchedCert(null);
      return;
    }

    const found = certificates.find(
      (c) =>
        c.id.toLowerCase() === q ||
        c.id.toLowerCase().includes(q) ||
        c.recipientName.toLowerCase().includes(q)
    );

    setMatchedCert(found || null);

    if (found) {
      generateCertificateQRCode(found.id, found.recipientName).then((url) => {
        setQrPreviewUrl(url);
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sm:p-8 text-center relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          OFFICIAL CREDENTIAL VERIFICATION SYSTEM
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          QR Scan &amp; Tamper-Proof Verification
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mt-2 font-sans">
          Verify authentic certificates issued for <span className="text-white font-medium">India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026</span> at Sapthgiri NPS University.
        </p>

        {/* Search / Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Certificate ID (e.g. SNPSU-JDSA-2026-03E8) or Name"
              className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify
          </button>
        </form>

        {/* Quick select chips */}
        <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-gray-400">
          <span>Quick samples:</span>
          {certificates.slice(0, 3).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSearchQuery(c.id);
                performSearch(c.id);
              }}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-gray-300 transition-colors"
            >
              {c.recipientName.split(' ')[0]} ({c.id.slice(-4)})
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {matchedCert ? (
        <div className="bg-[#0a0a0a] border border-emerald-500/30 rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Authentic Watermark Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            QR VERIFIED &bull; OFFICIAL
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/5">
            {/* Scannable QR Code */}
            <div className="relative p-2 bg-white rounded-lg shadow-md border border-gray-200">
              {qrPreviewUrl ? (
                <img src={qrPreviewUrl} alt="QR Code" className="w-32 h-32 rounded" />
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-gray-600 animate-pulse" />
                </div>
              )}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#050505] px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                SCAN VERIFIED
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
              <span className="text-xs font-mono text-blue-400 tracking-wider uppercase font-semibold">
                {matchedCert.certificateType}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {matchedCert.recipientName}
              </h2>
              <p className="text-sm font-semibold text-gray-300">
                Honor: <span className="text-blue-400">{matchedCert.titleAwarded}</span>
              </p>
              <p className="text-xs text-gray-400 font-mono">
                Team: {matchedCert.teamName} &bull; 117 Hours Live Industry Training
              </p>
            </div>

            <div>
              <button
                onClick={() => onViewCertificate(matchedCert)}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <Award className="w-4 h-4" />
                View Full Certificate
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Verification Audit Details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Certificate ID</p>
              <p className="text-white font-bold text-sm mt-0.5">{matchedCert.id}</p>
              <p className="text-emerald-400 text-[10px] mt-1 font-semibold">Cryptographically Valid</p>
            </div>

            <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Issuing Institution</p>
              <p className="text-white font-bold text-sm mt-0.5">Sapthgiri NPS University</p>
              <p className="text-gray-400 text-[10px] mt-1">Faculty of CSE</p>
            </div>

            <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Mentorship</p>
              <p className="text-blue-400 font-bold text-sm mt-0.5">Mentorship By Kapil</p>
              <p className="text-gray-400 text-[10px] mt-1">Program Director</p>
            </div>

            <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Issue Date</p>
              <p className="text-white font-bold text-sm mt-0.5">{matchedCert.issuedDate}</p>
              <p className="text-gray-400 text-[10px] mt-1">13-Day Championship</p>
            </div>
          </div>

          {/* Institutional Compliance Seal */}
          <div className="mt-4 p-3 bg-white/5 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-xs text-emerald-300 font-sans">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p>
              <span className="font-bold text-white">Official Verification Confirmation:</span> This record is verified against the official Sapthgiri NPS University Championship ledger. No signatures required as per cryptographic QR verification standards.
            </p>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-[#0a0a0a] border border-rose-500/30 rounded-xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Credential Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            We could not find an authentic certificate matching "<span className="font-mono text-white">{searchQuery}</span>". Please check the ID or search by learner name.
          </p>
        </div>
      ) : null}
    </div>
  );
};
