export type ThreatPlatform = 'twitter' | 'instagram' | 'linkedin' | 'telegram' | 'google_play' | 'apple_app_store';

export type ThreatType = 'social_profile' | 'social_page' | 'mobile_app' | 'scam_account';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TakedownStatus = 'active' | 'in_progress' | 'taken_down' | 'monitoring';

export interface ThreatItem {
  id: string;
  name: string;
  targetHandleOrId: string;
  platform: ThreatPlatform;
  type: ThreatType;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  publisherOrOwner: string;
  logoSimilarity: number; // percentage
  lookAlikeDetected: boolean;
  lookAlikeType?: string; // Homoglyph, Affix, Typosquatting
  reasons: string[];
  screenshotUrl: string;
  detectedAt: string;
  status: TakedownStatus;
  externalUrl: string;
}

export interface BrandProfile {
  name: string;
  officialHandles: {
    twitter: string;
    instagram: string;
    linkedin: string;
    telegram: string;
  };
  officialApps: {
    googlePlayPackage: string;
    appleAppId: string;
  };
  officialPublisher: string;
  officialDomain: string;
  logoUrl: string;
}
export type PlatformType = 'Instagram' | 'Twitter' | 'LinkedIn' | 'Telegram' | 'Google Play' | 'Apple App Store';
export type SeverityType = 'Critical' | 'High' | 'Medium' | 'Low';
export type ThreatStatus = 'New' | 'Investigating' | 'Takedown_Requested' | 'Taken_Down' | 'Re_Monitoring';

// 🏢 Company Model (Table: companies)
export interface Company {
  id: number;
  name: string;
  website: string;
  logo_url?: string;
  description?: string;
}

// 📱 Official Social Account (Table: official_social_accounts)
export interface OfficialSocialAccount {
  id?: number;
  company_id: number;
  platform: string;
  username: string;
  profile_url: string;
  verified: boolean;
}

// 📱 Official App (Table: official_apps)
export interface OfficialApp {
  id?: number;
  company_id: number;
  app_name: string;
  developer: string;
  package_id: string;
  store: string;
  verified: boolean;
}

// ⚠️ Threat Model (Table: threats)
export interface Threat {
  id: number;
  company_id: number;
  source_type: 'social' | 'app';
  platform: string;
  name: string;
  url: string;
  risk_score: number; // 0 - 100
  severity: SeverityType;
  status: ThreatStatus;
  analysis_reasons: string[];
  created_at?: string;
}

// 📸 Evidence Model (Table: threat_evidence)
export interface ThreatEvidence {
  id?: number;
  threat_id: number;
  screenshot_url?: string;
  url: string;
  description: string;
  created_at?: string;
}

// 🔄 Re-monitoring Response
export interface ReappearanceResponse {
  reappearance_detected: boolean;
  old_name: string;
  new_name: string;
  similarity_score: number;
  message: string;
}

export const DRP_VERSION = '2.0.0';