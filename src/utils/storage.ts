import { Certificate, Learner, IssuedReward, BadgeType, MedalLevel, CertificateType, Team, ChampionshipMeta } from '../types';
import { INITIAL_CERTIFICATES, LEARNERS_DATA, TEAMS_DATA, CHAMPIONSHIP_META } from '../data/championshipData';
import QRCode from 'qrcode';

const STORAGE_CERTS_KEY = 'snpsu_jdsa_certificates_2026';
const STORAGE_LEARNERS_KEY = 'snpsu_jdsa_learners_2026';
const STORAGE_REWARDS_KEY = 'snpsu_jdsa_rewards_log_2026';
const STORAGE_TEAMS_KEY = 'snpsu_jdsa_teams_2026';
const STORAGE_META_KEY = 'snpsu_jdsa_meta_2026';
const STORAGE_ADMIN_AUTH_KEY = 'snpsu_jdsa_admin_auth_2026';

// Hard-coded admin credentials per user mandate:
export const HARDCODED_ADMIN = {
  adminId: 'kapiladmin',
  passcode: 'admin123',
};

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

export function loginAdmin(id: string, pass: string): boolean {
  if (id.trim() === HARDCODED_ADMIN.adminId && pass.trim() === HARDCODED_ADMIN.passcode) {
    try {
      sessionStorage.setItem(STORAGE_ADMIN_AUTH_KEY, 'true');
      notifyDataUpdated();
      return true;
    } catch {
      return true;
    }
  }
  return false;
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
    notifyDataUpdated();
  } catch {}
}

export function getStoredCertificates(): Certificate[] {
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
