export type CertificateType =
  | 'Certificate of Participation'
  | 'Certificate of Merit'
  | 'Certificate of Excellence'
  | 'Championship Winner Certificate'
  | 'Team Excellence Certificate'
  | 'Special Recognition Certificate';

export type BadgeType =
  | 'Gold Badge'
  | 'Silver Badge'
  | 'Bronze Badge'
  | 'Top Performer'
  | 'Rising Star'
  | 'Fast Finisher'
  | 'Smart Solver'
  | 'Excellence Badge'
  | 'Precision Coder'
  | 'Growth Badge';

export type MedalLevel =
  | 'Gold Medal'
  | 'Silver Medal'
  | 'Bronze Medal'
  | 'Merit Medal'
  | 'Excellence Medal';

export type AwardCategory =
  | 'Championship Titles'
  | 'Technical Excellence'
  | 'Performance Excellence'
  | 'Leadership & Professional'
  | 'Championship Competition'
  | 'Team Championship';

export interface Learner {
  id: string;
  name: string;
  team: string;
  points?: number;
  posts?: number;
  posters?: number;
  videos?: number;
  projects?: number;
  pdfs?: number;
  starOfDay?: string; // Date if won Star of the Day e.g., '8/28/2026'
  isTongueTwisterChampion?: boolean;
  titles?: string[];
  badges?: BadgeType[];
  medals?: MedalLevel[];
}

export interface Team {
  name: string;
  totalPoints: number;
  rank: number;
  award: string;
  members: string[];
  demos?: number;
  topTeam?: boolean;
  bottomTeam?: boolean;
}

export interface Certificate {
  id: string; // e.g. SNPSU-JDSA-2026-XXXX
  recipientName: string;
  teamName: string;
  certificateType: CertificateType;
  titleAwarded: string; // e.g., "Java DSA Champion 2026" or "Certificate of Participation"
  issuedDate: string;
  verificationCode: string;
  hoursCompleted: number; // 117 hours
  status: 'VERIFIED' | 'REVOKED';
  metadata: {
    program: string;
    edition: string;
    institution: string;
    mentor: string;
    motto: string;
  };
}

export interface IssuedReward {
  id: string;
  learnerId: string;
  learnerName: string;
  teamName: string;
  rewardType: 'BADGE' | 'MEDAL' | 'TITLE';
  title: string;
  issuedAt: string;
  issuedBy: string;
}
