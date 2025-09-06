import { ConsentEventData } from '@/types/cookie-consent';

const AUDIT_STORAGE_KEY = 'cyoda-cookie-consent-audit';
const MAX_ENTRIES = 500; // cap to avoid unbounded growth
const DEFAULT_RETENTION_DAYS = 730; // 24 months typical retention for audit logs

export interface ConsentAuditEntry {
  timestamp: string; // ISO
  type: string;
  category?: string;
  previousState?: boolean;
  newState?: boolean;
  metadata?: Record<string, unknown>;
}

function loadAudit(): ConsentAuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAudit(entries: ConsentAuditEntry[]) {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // best-effort only
  }
}

function pruneOld(entries: ConsentAuditEntry[], retentionDays = DEFAULT_RETENTION_DAYS): ConsentAuditEntry[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  return entries.filter(e => new Date(e.timestamp) >= cutoff);
}

export function logConsentEvent(event: ConsentEventData, retentionDays?: number) {
  const eventWithCategory = event as ConsentEventData & {
    category?: string;
    previousState?: boolean;
    newState?: boolean;
  };

  const entry: ConsentAuditEntry = {
    timestamp: new Date().toISOString(),
    type: event.type,
    category: eventWithCategory.category,
    previousState: eventWithCategory.previousState,
    newState: eventWithCategory.newState,
    metadata: event.metadata || undefined,
  };
  let entries = loadAudit();
  entries.push(entry);
  entries = pruneOld(entries, retentionDays);
  if (entries.length > MAX_ENTRIES) {
    entries = entries.slice(entries.length - MAX_ENTRIES);
  }
  saveAudit(entries);
}

export function getConsentAuditLog(): ConsentAuditEntry[] {
  return loadAudit();
}

export function clearConsentAuditLog() {
  try {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

