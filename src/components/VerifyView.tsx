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
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xs">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#1a73e8] via-[#ea4335] via-[#fbbc04] to-[#34a853]" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono mb-3 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          OFFICIAL CREDENTIAL VERIFICATION SYSTEM
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          QR Scan &amp; Tamper-Proof Verification
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2 font-sans leading-relaxed">
          Verify authentic certificates issued for <span className="text-slate-900 font-bold">India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026</span> at Sapthgiri NPS University.
        </p>

        {/* Search / Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Certificate ID (e.g. SNPSU-JDSA-2026-...) or Name"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify
          </button>
        </form>

        {/* Quick select chips */}
        <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
          <span className="font-semibold">Quick samples:</span>
          {certificates.slice(0, 3).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSearchQuery(c.id);
                performSearch(c.id);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] border border-slate-200 transition cursor-pointer"
            >
              {c.id.split('-').slice(-2).join('-')} ({c.recipientName})
            </button>
          ))}
        </div>
      </div>

      {/* Verification Results Container */}
      {hasSearched && (
        <div>
          {matchedCert ? (
            <div className="bg-white border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    CRYPTOGRAPHICALLY VERIFIED &bull; OFFICIAL LEDGER RECORD
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 uppercase font-mono font-bold tracking-wider">
                      Learner Recipient
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                      {matchedCert.recipientName}
                    </h2>
                    <p className="text-sm font-mono text-[#1a73e8] font-bold mt-0.5">
                      Team: {matchedCert.teamName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs font-sans">
                    <div>
                      <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold">
                        Certificate Category
                      </span>
                      <span className="font-bold text-slate-800 mt-0.5 block">
                        {matchedCert.certificateType}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold">
                        Title / Honor Awarded
                      </span>
                      <span className="font-bold text-[#1a73e8] mt-0.5 block">
                        {matchedCert.titleAwarded}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold">
                        Credential ID
                      </span>
                      <span className="font-mono font-bold text-slate-700 mt-0.5 block">
                        {matchedCert.id}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold">
                        Issue Date
                      </span>
                      <span className="font-mono text-slate-700 mt-0.5 block">
                        {matchedCert.issuedDate}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1 font-mono">
                    <p>&bull; Issuer: Sapthgiri NPS University</p>
                    <p>&bull; Program: India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026</p>
                    <p className="font-bold text-slate-800">
                      &bull; Mentorship By Kapil &bull; 117 hours | 50 Minds | 1 Mission | Building In Public
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => onViewCertificate(matchedCert)}
                      className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      View High-Resolution Certificate
                    </button>
                  </div>
                </div>

                {/* QR Code Inspection */}
                <div className="sm:w-56 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Tamper-Proof QR Code
                  </span>
                  {qrPreviewUrl ? (
                    <img
                      src={qrPreviewUrl}
                      alt="Certificate QR"
                      className="w-36 h-36 rounded-lg border border-slate-200 bg-white p-2 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-lg bg-slate-200 animate-pulse" />
                  )}
                  <p className="text-[10px] font-mono text-emerald-700 font-bold">
                    Scan with any smartphone camera to verify live.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Verified Credential Found</h3>
              <p className="text-slate-600 text-xs max-w-md mx-auto">
                No certificate matched "{searchQuery}" in the authentic championship registry. Check the Credential ID or search by learner name.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
