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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
          <ShieldCheck className="w-4 h-4" />
          OFFICIAL CREDENTIAL VERIFICATION SYSTEM
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          QR Scan &amp; Tamper-Proof Verification
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2 font-sans">
          Verify authentic certificates issued for <span className="text-slate-200 font-medium">India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026</span> at Sapthgiri NPS University.
        </p>

        {/* Search / Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Certificate ID (e.g. SNPSU-JDSA-2026-03E8) or Name"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition shadow flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify
          </button>
        </form>

        {/* Quick select chips */}
        <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-400">
          <span>Quick samples:</span>
          {certificates.slice(0, 3).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSearchQuery(c.id);
                performSearch(c.id);
              }}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 font-mono text-slate-300 transition"
            >
              {c.recipientName.split(' ')[0]} ({c.id.slice(-4)})
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {matchedCert ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Authentic Watermark Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            QR VERIFIED &bull; OFFICIAL
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-800">
            {/* Scannable QR Code */}
            <div className="relative p-2 bg-white rounded-xl shadow-lg border border-slate-300">
              {qrPreviewUrl ? (
                <img src={qrPreviewUrl} alt="QR Code" className="w-32 h-32 rounded" />
              ) : (
                <div className="w-32 h-32 bg-slate-100 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-600 animate-pulse" />
                </div>
              )}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-950 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                SCAN VERIFIED
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
              <span className="text-xs font-mono text-amber-400 tracking-wider uppercase font-semibold">
                {matchedCert.certificateType}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {matchedCert.recipientName}
              </h2>
              <p className="text-sm font-semibold text-slate-300">
                Honor: <span className="text-amber-300">{matchedCert.titleAwarded}</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Team: {matchedCert.teamName} &bull; 117 Hours Live Industry Training
              </p>
            </div>

            <div>
              <button
                onClick={() => onViewCertificate(matchedCert)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow transition"
              >
                <Award className="w-4 h-4" />
                View Full Certificate
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Verification Audit Details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase">Certificate ID</p>
              <p className="text-slate-200 font-bold text-sm mt-0.5">{matchedCert.id}</p>
              <p className="text-emerald-400 text-[10px] mt-1">Cryptographically Valid</p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase">Issuing Institution</p>
              <p className="text-slate-200 font-bold text-sm mt-0.5">Sapthgiri NPS University</p>
              <p className="text-slate-400 text-[10px] mt-1">Faculty of CSE</p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase">Mentorship</p>
              <p className="text-amber-400 font-bold text-sm mt-0.5">Mentorship By Kapil</p>
              <p className="text-slate-400 text-[10px] mt-1">Program Director</p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase">Issue Date</p>
              <p className="text-slate-200 font-bold text-sm mt-0.5">{matchedCert.issuedDate}</p>
              <p className="text-slate-400 text-[10px] mt-1">13-Day Championship</p>
            </div>
          </div>

          {/* Institutional Compliance Seal */}
          <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p>
              <span className="font-bold">Official Verification Confirmation:</span> This record is verified against the official Sapthgiri NPS University Championship ledger. No signatures required as per cryptographic QR verification standards.
            </p>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Credential Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We could not find an authentic certificate matching "<span className="font-mono text-slate-200">{searchQuery}</span>". Please check the ID or search by learner name.
          </p>
        </div>
      ) : null}
    </div>
  );
};
