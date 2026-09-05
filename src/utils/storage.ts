import { Certificate, Learner, IssuedReward, BadgeType, MedalLevel, CertificateType, Team, ChampionshipMeta } from '../types';
import { INITIAL_CERTIFICATES, LEARNERS_DATA, TEAMS_DATA, CHAMPIONSHIP_META } from '../data/championshipData';
import QRCode from 'qrcode';

const STORAGE_CERTS_KEY = 'snpsu_jdsa_certificates_2026';
const STORAGE_LEARNERS_KEY = 'snpsu_jdsa_learners_2026';
const STORAGE_REWARDS_KEY = 'snpsu_jdsa_rewards_log_2026';
const STORAGE_TEAMS_KEY = 'snpsu_jdsa_teams_2026';
const STORAGE_META_KEY = 'snpsu_jdsa_meta_2026';
const STORAGE_ADMIN_AUTH_KEY = 'snpsu_jdsa_admin_auth_2026';
const STORAGE_ADMIN_CONFIG_KEY = 'snpsu_jdsa_admin_security_config';
const STORAGE_ADMIN_ATTEMPTS_KEY = 'snpsu_jdsa_admin_attempts';
const STORAGE_ADMIN_LOCKOUT_KEY = 'snpsu_jdsa_admin_lockout';

// Cryptographic SHA-256 hashes of credentials (Plaintext is NEVER stored in repository)
// Defaults: SHA-256 hashes for standard verified administration
const DEFAULT_ADMIN_ID_HASH = '6a963e23e92228e4792cac765e088ce58e600e68233b8316a1159dc41d5077d2';
const DEFAULT_PASSCODE_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

// Cryptographic SHA-256 hash calculation using Web Crypto API
export async function computeHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash calculation if crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

export interface LockoutStatus {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
}

export function getAdminLockoutStatus(): LockoutStatus {
  try {
    const lockoutUntilStr = localStorage.getItem(STORAGE_ADMIN_LOCKOUT_KEY);
    const attempts = parseInt(localStorage.getItem(STORAGE_ADMIN_ATTEMPTS_KEY) || '0', 10);
    const maxAttempts = 5;

    if (lockoutUntilStr) {
      const lockoutUntil = parseInt(lockoutUntilStr, 10);
      const now = Date.now();
      if (now < lockoutUntil) {
        return {
          isLocked: true,
          remainingSeconds: Math.ceil((lockoutUntil - now) / 1000),
          attemptsLeft: 0,
        };
      } else {
        localStorage.removeItem(STORAGE_ADMIN_LOCKOUT_KEY);
        localStorage.removeItem(STORAGE_ADMIN_ATTEMPTS_KEY);
      }
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: Math.max(0, maxAttempts - attempts),
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: 5 };
  }
}

export function recordFailedAdminAttempt(): LockoutStatus {
  try {
    const current = parseInt(localStorage.getItem(STORAGE_ADMIN_ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(STORAGE_ADMIN_ATTEMPTS_KEY, current.toString());
    const maxAttempts = 5;

    if (current >= maxAttempts) {
      // Lock for 3 minutes (180 seconds)
      const lockoutTime = Date.now() + 180 * 1000;
      localStorage.setItem(STORAGE_ADMIN_LOCKOUT_KEY, lockoutTime.toString());
      return {
        isLocked: true,
        remainingSeconds: 180,
        attemptsLeft: 0,
      };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: maxAttempts - current,
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: 4 };
  }
}

export function resetAdminAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_ADMIN_ATTEMPTS_KEY);
    localStorage.removeItem(STORAGE_ADMIN_LOCKOUT_KEY);
  } catch {}
}

// Real-time synchronization event
export function notifyDataUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jdsa_data_updated'));
  }
}

// Admin Authentication State
export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export async function loginAdmin(
  id: string,
  pass: string
): Promise<{ success: boolean; error?: string }> {
  const lockout = getAdminLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `Security Lockout Active: Too many failed attempts. Please wait ${lockout.remainingSeconds} seconds before retrying.`,
    };
  }

  const cleanId = id.trim();
  const cleanPass = pass.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Please enter both Admin ID and Passcode.' };
  }

  // Compute SHA-256 hashes securely
  const idHash = await computeHash(cleanId);
  const passHash = await computeHash(cleanPass);

  // Check stored custom admin config if user changed it in dashboard
  let validIdHash = DEFAULT_ADMIN_ID_HASH;
  let validPassHash = DEFAULT_PASSCODE_HASH;

  try {
    const customConfigRaw = localStorage.getItem(STORAGE_ADMIN_CONFIG_KEY);
    if (customConfigRaw) {
      const customConfig = JSON.parse(customConfigRaw);
      if (customConfig.idHash && customConfig.passHash) {
        validIdHash = customConfig.idHash;
        validPassHash = customConfig.passHash;
      }
    }
  } catch {}

  if (idHash === validIdHash && passHash === validPassHash) {
    try {
      sessionStorage.setItem(STORAGE_ADMIN_AUTH_KEY, 'true');
      resetAdminAttempts();
      notifyDataUpdated();
      return { success: true };
    } catch {
      return { success: true };
    }
  }

  // Failed attempt - increment lockout counter
  const updatedStatus = recordFailedAdminAttempt();
  if (updatedStatus.isLocked) {
    return {
      success: false,
      error: `Security Lockout Activated: Too many consecutive failed attempts. Admin portal is locked for 180 seconds.`,
    };
  }

  return {
    success: false,
    error: `Invalid Administrator Credentials. ${updatedStatus.attemptsLeft} attempt${
      updatedStatus.attemptsLeft === 1 ? '' : 's'
    } remaining before security lockout.`,
  };
}

export async function updateAdminCredentials(newId: string, newPass: string): Promise<boolean> {
  if (!newId.trim() || !newPass.trim()) return false;
  try {
    const idHash = await computeHash(newId.trim());
    const passHash = await computeHash(newPass.trim());
    localStorage.setItem(
      STORAGE_ADMIN_CONFIG_KEY,
      JSON.stringify({ idHash, passHash, updatedAt: new Date().toISOString() })
    );
    notifyDataUpdated();
    return true;
  } catch {
    return false;
  }
}

export function resetAdminCredentialsToDefault(): void {
  try {
    localStorage.removeItem(STORAGE_ADMIN_CONFIG_KEY);
    notifyDataUpdated();
  } catch {}
}

export function hasCustomAdminCredentials(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_ADMIN_CONFIG_KEY);
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
    notifyDataUpdated();
  } catch {}
}

const STORAGE_DATA_VERSION_KEY = 'snpsu_jdsa_data_version_2026';
const CURRENT_DATA_VERSION = 'v3_official_final_standings_2026';

function ensureLatestDataLoaded(): void {
  try {
    const storedVer = localStorage.getItem(STORAGE_DATA_VERSION_KEY);
    if (storedVer !== CURRENT_DATA_VERSION) {
      localStorage.setItem(STORAGE_TEAMS_KEY, JSON.stringify(TEAMS_DATA));
      localStorage.setItem(STORAGE_LEARNERS_KEY, JSON.stringify(LEARNERS_DATA));
      localStorage.setItem(STORAGE_CERTS_KEY, JSON.stringify(INITIAL_CERTIFICATES));
      localStorage.setItem(STORAGE_DATA_VERSION_KEY, CURRENT_DATA_VERSION);
    }
  } catch (e) {
    console.error('Failed to sync storage version', e);
  }
}

export function getStoredCertificates(): Certificate[] {
  ensureLatestDataLoaded();
  try {
    const raw = localStorage.getItem(STORAGE_CERTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CERTS_KEY, JSON.stringify(INITIAL_CERTIFICATES));
      return INITIAL_CERTIFICATES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load certificates from storage', e);
    return INITIAL_CERTIFICATES;
  }
}

export function saveCertificates(certs: Certificate[]): void {
  try {
    localStorage.setItem(STORAGE_CERTS_KEY, JSON.stringify(certs));
    notifyDataUpdated();
  } catch (e) {
    console.error('Failed to save certificates', e);
  }
}

export function updateCertificate(updatedCert: Certificate): void {
  const current = getStoredCertificates();
  const index = current.findIndex((c) => c.id === updatedCert.id);
  if (index !== -1) {
    current[index] = updatedCert;
  } else {
    current.unshift(updatedCert);
  }
  saveCertificates(current);
}

export function deleteCertificate(certId: string): void {
  const current = getStoredCertificates();
  const filtered = current.filter((c) => c.id !== certId);
  saveCertificates(filtered);
}

export function getStoredLearners(): Learner[] {
  ensureLatestDataLoaded();
  try {
    const raw = localStorage.getItem(STORAGE_LEARNERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LEARNERS_KEY, JSON.stringify(LEARNERS_DATA));
      return LEARNERS_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load learners from storage', e);
    return LEARNERS_DATA;
  }
}

export function saveLearners(learners: Learner[]): void {
  try {
    localStorage.setItem(STORAGE_LEARNERS_KEY, JSON.stringify(learners));
    notifyDataUpdated();
  } catch (e) {
    console.error('Failed to save learners', e);
  }
}

export function updateLearner(updatedLearner: Learner): void {
  const learners = getStoredLearners();
  const idx = learners.findIndex((l) => l.id === updatedLearner.id);
  if (idx !== -1) {
    learners[idx] = updatedLearner;
    saveLearners(learners);
  }
}

export function getStoredTeams(): Team[] {
  ensureLatestDataLoaded();
  try {
    const raw = localStorage.getItem(STORAGE_TEAMS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_TEAMS_KEY, JSON.stringify(TEAMS_DATA));
      return TEAMS_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load teams from storage', e);
    return TEAMS_DATA;
  }
}

export function saveTeams(teams: Team[]): void {
  try {
    localStorage.setItem(STORAGE_TEAMS_KEY, JSON.stringify(teams));
    notifyDataUpdated();
  } catch (e) {
    console.error('Failed to save teams', e);
  }
}

export function updateTeam(updatedTeam: Team): void {
  const teams = getStoredTeams();
  const idx = teams.findIndex((t) => t.name.toLowerCase() === updatedTeam.name.toLowerCase());
  if (idx !== -1) {
    teams[idx] = updatedTeam;
    // Keep ranks sorted if needed
    saveTeams(teams);
  }
}

export function getStoredMeta(): ChampionshipMeta {
  try {
    const raw = localStorage.getItem(STORAGE_META_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_META_KEY, JSON.stringify(CHAMPIONSHIP_META));
      return CHAMPIONSHIP_META;
    }
    return { ...CHAMPIONSHIP_META, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load meta from storage', e);
    return CHAMPIONSHIP_META;
  }
}

export function saveMeta(meta: ChampionshipMeta): void {
  try {
    localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta));
    notifyDataUpdated();
  } catch (e) {
    console.error('Failed to save meta', e);
  }
}

export function getStoredRewards(): IssuedReward[] {
  try {
    const raw = localStorage.getItem(STORAGE_REWARDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function logIssuedReward(reward: IssuedReward): void {
  try {
    const current = getStoredRewards();
    const updated = [reward, ...current];
    localStorage.setItem(STORAGE_REWARDS_KEY, JSON.stringify(updated));
    notifyDataUpdated();
  } catch (e) {
    console.error('Failed to log reward', e);
  }
}

export function issueNewCertificate(
  learnerName: string,
  teamName: string,
  certificateType: CertificateType,
  titleAwarded: string
): Certificate {
  const current = getStoredCertificates();
  const hex = Math.floor(Math.random() * 0xfffff)
    .toString(16)
    .toUpperCase()
    .padStart(5, '0');
  const certId = `SNPSU-JDSA-2026-${hex}`;

  const newCert: Certificate = {
    id: certId,
    recipientName: learnerName,
    teamName,
    certificateType,
    titleAwarded,
    issuedDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    verificationCode: `VERIFIED-SHA256-${hex}-KAPIL`,
    hoursCompleted: 117,
    status: 'VERIFIED',
    metadata: {
      program: "India's FIRST 13-DAY INDUSTRY ORIENTED JAVA DSA CHAMPIONSHIP 2026",
      edition: 'Inaugural 2026 Edition | 117 Hours | 50 Minds',
      institution: 'Sapthgiri NPS University',
      mentor: 'Mentorship By Kapil',
      motto: 'Code Every Day. Compete Every Day. Improve Every Day.',
    },
  };

  const updated = [newCert, ...current];
  saveCertificates(updated);

  logIssuedReward({
    id: `rew-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    learnerId: learnerName,
    learnerName,
    teamName,
    rewardType: 'TITLE',
    title: `${certificateType}: ${titleAwarded}`,
    issuedAt: new Date().toISOString(),
    issuedBy: 'Official Portal (Kapil)',
  });

  return newCert;
}

export function awardBadgeToLearner(learnerId: string, badge: BadgeType): void {
  const learners = getStoredLearners();
  const learner = learners.find((l) => l.id === learnerId);
  if (learner) {
    if (!learner.badges) learner.badges = [];
    if (!learner.badges.includes(badge)) {
      learner.badges.push(badge);
      saveLearners(learners);

      logIssuedReward({
        id: `rew-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        learnerId: learner.id,
        learnerName: learner.name,
        teamName: learner.team,
        rewardType: 'BADGE',
        title: badge,
        issuedAt: new Date().toISOString(),
        issuedBy: 'Program Lead - Kapil',
      });
    }
  }
}

export function awardMedalToLearner(learnerId: string, medal: MedalLevel): void {
  const learners = getStoredLearners();
  const learner = learners.find((l) => l.id === learnerId);
  if (learner) {
    if (!learner.medals) learner.medals = [];
    if (!learner.medals.includes(medal)) {
      learner.medals.push(medal);
      saveLearners(learners);

      logIssuedReward({
        id: `rew-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        learnerId: learner.id,
        learnerName: learner.name,
        teamName: learner.team,
        rewardType: 'MEDAL',
        title: medal,
        issuedAt: new Date().toISOString(),
        issuedBy: 'Program Lead - Kapil',
      });
    }
  }
}

// Generate genuine QR Code data URL
export async function generateCertificateQRCode(certId: string, recipient: string): Promise<string> {
  const verificationUrl = `${window.location.origin}${window.location.pathname}#verify?id=${encodeURIComponent(
    certId
  )}&recipient=${encodeURIComponent(recipient)}`;

  try {
    return await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code', err);
    return '';
  }
}
