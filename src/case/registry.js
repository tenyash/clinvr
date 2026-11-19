import { appendicitisCase } from "./appendicitis.js";
import { coughFeverCase } from "./cough-fever.js";
import { headacheCase } from "./headache.js";
import { chestPainCase } from "./chest-pain.js";

/**
 * Available fictional teaching scenarios. Every case needs qualified faculty
 * review before educational deployment.
 */
export const cases = [appendicitisCase, headacheCase, coughFeverCase, chestPainCase];

const caseById = new Map(cases.map((caseData) => [caseData.id, caseData]));

/** Find a case by stable ID, returning null for an unknown ID. */
export function getCase(caseId) {
  return caseById.get(caseId) ?? null;
}

/** Public, non-mutating metadata for a case library or selection screen. */
export function listCases() {
  return cases.map(({ id, title, specialty, level, estimatedMinutes, summary, objectives, tags, educationalNotice }) => ({
    id,
    title,
    specialty,
    level,
    estimatedMinutes,
    summary,
    objectives: [...(objectives ?? [])],
    tags: [...(tags ?? [])],
    educationalNotice,
  }));
}

export { appendicitisCase, chestPainCase, coughFeverCase, headacheCase };
