import { appendicitisCase } from "./appendicitis.js";
import { getCase } from "./registry.js";

const unique = (values) => [...new Set(values)];
const sumPoints = (items, selectedIds) => {
  const selected = new Set(selectedIds);
  return items.reduce((sum, item) => sum + (selected.has(item.id) ? Math.max(0, Number(item.points) || 0) : 0), 0);
};
const maxFor = (caseData, key, items, fallbackIds) => {
  const configured = caseData.rubric?.[key];
  if (Number.isFinite(configured) && configured >= 0) return configured;
  const focus = fallbackIds ? new Set(fallbackIds) : null;
  return sumPoints(items.filter((item) => !focus || focus.has(item.id)), items.map((item) => item.id));
};

function resolveCase(session, caseData) {
  if (caseData && typeof caseData === "object" && Array.isArray(caseData.history)) return caseData;
  if (typeof caseData === "string") return getCase(caseData) ?? (session?.caseId ? getCase(session.caseId) : null) ?? appendicitisCase;
  return (session?.caseId ? getCase(session.caseId) : null) ?? appendicitisCase;
}

function appendOnce(values, id) {
  return values.includes(id) ? values : [...values, id];
}

/** Create fresh serializable encounter state for the selected case. */
export function createSession(caseIdOrData = appendicitisCase) {
  const caseData = typeof caseIdOrData === "string" ? getCase(caseIdOrData) : caseIdOrData;
  if (!caseData || typeof caseData !== "object" || !caseData.id) {
    throw new RangeError(`Unknown ClinVR case: ${String(caseIdOrData)}`);
  }
  return {
    caseId: caseData.id,
    askedHistory: [],
    completedExams: [],
    orderedInvestigations: [],
    diagnosisId: null,
    managementId: null,
  };
}

/** Return a new session with a history topic recorded. Unknown IDs are ignored. */
export function recordHistory(session, questionId, caseData) {
  const resolved = resolveCase(session, caseData);
  if (!resolved.history.some((item) => item.id === questionId)) return session;
  return { ...session, caseId: resolved.id, askedHistory: appendOnce(session.askedHistory ?? [], questionId) };
}

/** Select a scripted reply directly from the topic buttons shown in the UI. */
export function askAboutHistory(session, questionId, caseData) {
  const resolved = resolveCase(session, caseData);
  const question = resolved.history.find((item) => item.id === questionId);
  if (!question) return { session, response: resolved.fallbackResponse, question: null };
  return {
    session: recordHistory(session, questionId, resolved),
    response: question.answer,
    question,
  };
}

/** Match free text against authored keywords and return the strongest topic. */
export function matchHistoryQuestion(input, caseData) {
  const resolved = resolveCase(null, caseData);
  const text = String(input ?? "").normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/gu, " ").trim();
  if (!text) return null;
  const ranked = resolved.history.map((question, index) => {
    const hits = (question.keywords ?? []).reduce((count, keyword) => {
      const normalized = String(keyword).normalize("NFKC").toLocaleLowerCase().trim();
      return count + (normalized && text.includes(normalized) ? Math.max(1, normalized.split(/\s+/u).length) : 0);
    }, 0);
    return { question, hits, index };
  }).filter((item) => item.hits > 0).sort((a, b) => b.hits - a.hits || a.index - b.index);
  return ranked[0]?.question ?? null;
}

/** Record an examination action once. */
export function performExam(session, examId, caseData) {
  const resolved = resolveCase(session, caseData);
  if (!resolved.examination.some((item) => item.id === examId)) return session;
  return { ...session, caseId: resolved.id, completedExams: appendOnce(session.completedExams ?? [], examId) };
}

/** Record a viewed investigation once. Only scenario-focused items score. */
export function orderInvestigation(session, investigationId, caseData) {
  const resolved = resolveCase(session, caseData);
  if (!resolved.investigations.some((item) => item.id === investigationId)) return session;
  return { ...session, caseId: resolved.id, orderedInvestigations: appendOnce(session.orderedInvestigations ?? [], investigationId) };
}

/** Save a selected diagnosis if it belongs to this case. */
export function setDiagnosis(session, diagnosisId, caseData) {
  const resolved = resolveCase(session, caseData);
  if (!resolved.diagnoses.some((item) => item.id === diagnosisId)) return session;
  return { ...session, caseId: resolved.id, diagnosisId };
}

/** Save a selected next-step response if it belongs to this case. */
export function setManagement(session, managementId, caseData) {
  const resolved = resolveCase(session, caseData);
  if (!resolved.management.some((item) => item.id === managementId)) return session;
  return { ...session, caseId: resolved.id, managementId };
}

function feedbackFor(caseData, key, fallback) {
  return caseData.assessment?.feedback?.[key] ?? fallback;
}

/**
 * Score the visible case rubric. Scoring is an unvalidated teaching aid.
 * Investigations outside investigationFocusIds never add points, so choosing
 * every available test cannot improve this category's score.
 */
export function scoreSession(session, caseData) {
  const resolved = resolveCase(session, caseData);
  const historyMax = maxFor(resolved, "historyMax", resolved.history);
  const examMax = maxFor(resolved, "examinationMax", resolved.examination);
  const investigationFocus = resolved.investigationFocusIds ?? resolved.investigations.filter((item) => item.points > 0).map((item) => item.id);
  const investigationMax = maxFor(resolved, "investigationsMax", resolved.investigations, investigationFocus);
  const diagnosisMax = maxFor(resolved, "diagnosisMax", []);
  const managementMax = maxFor(resolved, "managementMax", []);

  const history = Math.min(historyMax, sumPoints(resolved.history, session.askedHistory ?? []));
  const examination = Math.min(examMax, sumPoints(resolved.examination, session.completedExams ?? []));
  const investigation = Math.min(investigationMax, sumPoints(
    resolved.investigations.filter((item) => investigationFocus.includes(item.id)),
    session.orderedInvestigations ?? [],
  ));
  const selectedInvestigations = session.orderedInvestigations ?? [];
  const outOfFocusCount = selectedInvestigations.filter((id) => !investigationFocus.includes(id)).length;
  const diagnosis = session.diagnosisId === resolved.correctDiagnosisId ? Math.min(diagnosisMax, Number(resolved.diagnosisPoints) || 0) : 0;
  const chosenPlan = resolved.management.find((item) => item.id === session.managementId);
  const management = Math.min(managementMax, Math.max(0, Number(chosenPlan?.points) || 0));

  const investigationFeedback = investigation >= investigationMax
    ? "You reviewed the investigation option(s) targeted by this scenario."
    : feedbackFor(resolved, "investigationsIncomplete", "Review the scenario-focused reports and interpret them in context.");
  const investigationLimit = "The illustrative checklist awards points only for scenario-focused items; it does not assess whether other investigations are appropriate. This is not a validated test-appropriateness evaluation.";
  const sections = [
    {
      id: "history", label: "History taking", earned: history, max: historyMax,
      feedback: history >= historyMax ? "You covered the scripted history topics for this case." : feedbackFor(resolved, "historyIncomplete", "Ask about the main symptoms, associated features, and relevant background."),
    },
    {
      id: "examination", label: "Examination", earned: examination, max: examMax,
      feedback: examination >= examMax ? "You reviewed the scenario's focused examination findings." : feedbackFor(resolved, "examinationIncomplete", "Review observations and relevant focused findings, explaining each step and seeking permission."),
    },
    {
      id: "investigations", label: "Investigations", earned: investigation, max: investigationMax,
      feedback: outOfFocusCount > 0 ? `${investigationFeedback} ${investigationLimit}` : investigationFeedback,
      selectedCount: selectedInvestigations.length,
      focusedCount: selectedInvestigations.length - outOfFocusCount,
      outOfFocusCount,
      assessmentLimit: investigationLimit,
    },
    {
      id: "diagnosis", label: "Diagnosis", earned: diagnosis, max: diagnosisMax,
      feedback: diagnosis >= diagnosisMax ? "Your selected answer matches this case's intended teaching answer." : feedbackFor(resolved, "diagnosisIncorrect", "Reconsider the history, examination, and supplied reports."),
    },
    {
      id: "management", label: "Next steps", earned: management, max: managementMax,
      feedback: chosenPlan?.feedback ?? "Choose a next-step response to receive feedback.",
    },
  ];
  const earned = sections.reduce((sum, section) => sum + section.earned, 0);
  const max = Number.isFinite(resolved.rubric?.maxScore)
    ? resolved.rubric.maxScore
    : sections.reduce((sum, section) => sum + section.max, 0);

  return {
    caseId: resolved.id,
    earned,
    max,
    percent: max > 0 ? Math.round((earned / max) * 100) : 0,
    sections,
    strengths: sections.filter((section) => section.max > 0 && section.earned >= section.max).map((section) => section.label),
    nextSteps: sections.filter((section) => section.earned < section.max).map((section) => section.feedback),
    notice: resolved.educationalNotice,
  };
}
