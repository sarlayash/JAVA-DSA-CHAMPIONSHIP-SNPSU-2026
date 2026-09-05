import { Certificate, Learner, IssuedReward, BadgeType, MedalLevel, CertificateType } from '../types';
import { INITIAL_CERTIFICATES, LEARNERS_DATA } from '../data/championshipData';
import QRCode from 'qrcode';

const STORAGE_CERTS_KEY = 'snpsu_jdsa_certificates_2026';
const STORAGE_LEARNERS_KEY = 'snpsu_jdsa_learners_2026';
const STORAGE_REWARDS_KEY = 'snpsu_jdsa_rewards_log_2026';

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
  } catch (e) {
    console.error('Failed to save certificates', e);
  }
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
  } catch (e) {
    console.error('Failed to save learners', e);
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
