export enum RiskLevel {
  SAFE = 'Safe',
  CAUTION = 'Caution',
  HIGH_RISK = 'High Risk',
  UNKNOWN = 'Unknown'
}

export interface SecurityDetail {
  feature: string;
  status: 'Active' | 'Inactive' | 'Unknown';
  description: string;
}

export interface AnalysisResult {
  domain: string;
  safetyScore: number;
  riskLevel: RiskLevel;
  summary: string;
  category: string;
  popularity: string;
  serverLocation: string;
  pros: string[];
  cons: string[];
  securityChecklist: SecurityDetail[];
}

export interface HistoryItem {
  url: string;
  timestamp: number;
  score: number;
}