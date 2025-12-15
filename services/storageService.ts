import { AnalysisResult, SiteRecord, ApprovalStatus } from '../types';

const STORAGE_KEY = 'safesurfer_db_v1';

const getDb = (): SiteRecord[] => {
  try {
    const str = localStorage.getItem(STORAGE_KEY);
    return str ? JSON.parse(str) : [];
  } catch (e) {
    return [];
  }
};

const saveDb = (db: SiteRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const saveAnalysis = (result: AnalysisResult) => {
  const db = getDb();
  const cleanDomain = result.domain.toLowerCase();
  const existingIndex = db.findIndex(r => r.domain.toLowerCase() === cleanDomain);
  
  const record: SiteRecord = {
    ...result,
    status: existingIndex >= 0 ? db[existingIndex].status : 'PENDING', // Preserve status if exists, else Pending
    timestamp: Date.now(),
    id: cleanDomain
  };

  if (existingIndex >= 0) {
    db[existingIndex] = record;
  } else {
    db.push(record);
  }
  saveDb(db);
};

export const getRecord = (domain: string): SiteRecord | undefined => {
  return getDb().find(r => r.domain.toLowerCase() === domain.toLowerCase());
};

export const updateStatus = (domain: string, status: ApprovalStatus) => {
  const db = getDb();
  const idx = db.findIndex(r => r.domain.toLowerCase() === domain.toLowerCase());
  if (idx >= 0) {
    db[idx].status = status;
    saveDb(db);
  }
};

export const getApprovedSites = () => {
  return getDb()
    .filter(r => r.status === 'APPROVED')
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const getPendingSites = () => {
  return getDb()
    .filter(r => r.status === 'PENDING')
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const getAllSites = () => {
  return getDb().sort((a, b) => b.timestamp - a.timestamp);
};

export const deleteRecord = (domain: string) => {
  const db = getDb();
  const newDb = db.filter(r => r.domain.toLowerCase() !== domain.toLowerCase());
  saveDb(newDb);
};