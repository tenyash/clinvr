const KEY = 'clinvr.progress.v1';
const MAX_ATTEMPTS = 100;

/** Progress is stored only in this browser. Do not use for real patient information. */
export function loadProgress(storage = globalThis.localStorage) {
  try {
    const data = JSON.parse(storage?.getItem(KEY) || 'null');
    if (!data || data.version !== 1 || !Array.isArray(data.attempts)) return { version: 1, attempts: [] };
    return { version: 1, attempts: data.attempts.filter(x => x && typeof x.caseId === 'string' && typeof x.completedAt === 'string').slice(0, MAX_ATTEMPTS) };
  } catch { return { version: 1, attempts: [] }; }
}

export function saveAttempt(attempt, storage = globalThis.localStorage) {
  try {
    if (!storage || !attempt || typeof attempt.caseId !== 'string') return false;
    const safe = { caseId: attempt.caseId, caseTitle: String(attempt.caseTitle || ''), completedAt: new Date().toISOString(), earned: Number(attempt.earned) || 0, max: Number(attempt.max) || 0, percent: Number(attempt.percent) || 0 };
    const data = loadProgress(storage);
    storage.setItem(KEY, JSON.stringify({ version: 1, attempts: [safe, ...data.attempts].slice(0, MAX_ATTEMPTS) }));
    return true;
  } catch { return false; }
}

export function clearProgress(storage = globalThis.localStorage) {
  try { storage?.removeItem(KEY); return !!storage; } catch { return false; }
}

const DRAFT_KEY = 'clinvr.draft.v1';
export function loadDraft(storage = globalThis.localStorage) {
  try {
    const data = JSON.parse(storage?.getItem(DRAFT_KEY) || 'null');
    if (!data || data.version !== 1 || typeof data.caseId !== 'string' || !data.session || typeof data.session !== 'object') return null;
    if (data.session.caseId !== data.caseId || !['askedHistory', 'completedExams', 'orderedInvestigations'].every(key => Array.isArray(data.session[key]) && data.session[key].every(value => typeof value === 'string'))) return null;
    return data;
  } catch { return null; }
}
export function saveDraft(caseId, session, storage = globalThis.localStorage) {
  try { if (!storage) return false; storage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, caseId, session })); return true; } catch { return false; }
}
export function clearDraft(storage = globalThis.localStorage) {
  try { storage?.removeItem(DRAFT_KEY); return !!storage; } catch { return false; }
}
