import test from "node:test";
import assert from "node:assert/strict";
import {
  askAboutHistory,
  cases,
  createSession,
  getCase,
  listCases,
  matchHistoryQuestion,
  orderInvestigation,
  performExam,
  recordHistory,
  scoreSession,
  setDiagnosis,
  setManagement,
} from "../src/case/index.js";

function completeSession(caseData) {
  let session = createSession(caseData.id);
  for (const question of caseData.history) session = recordHistory(session, question.id);
  for (const exam of caseData.examination) session = performExam(session, exam.id);
  for (const investigationId of caseData.investigationFocusIds ?? []) {
    session = orderInvestigation(session, investigationId);
  }
  session = setDiagnosis(session, caseData.correctDiagnosisId);
  const recommendedPlan = caseData.management.find((plan) => plan.recommended);
  return setManagement(session, recommendedPlan.id);
}

test("registry exposes four distinct scenarios with learner-facing metadata", () => {
  assert.equal(cases.length, 4);
  assert.equal(new Set(cases.map((item) => item.id)).size, cases.length);
  assert.equal(getCase("acute-chest-pain-01").specialty, "Cardiology");
  assert.equal(getCase("missing-case"), null);
  assert.equal(listCases().length, cases.length);
  assert.ok(listCases().every((item) => item.summary && item.objectives.length && item.educationalNotice.includes("unreviewed")));
});

test("every case reaches its explicit maximum from focused actions alone", () => {
  for (const caseData of cases) {
    const score = scoreSession(completeSession(caseData));
    assert.equal(score.caseId, caseData.id);
    assert.equal(score.earned, caseData.rubric.maxScore, caseData.id);
    assert.equal(score.max, caseData.rubric.maxScore, caseData.id);
    assert.equal(score.percent, 100, caseData.id);
    assert.equal(score.sections.reduce((sum, section) => sum + section.max, 0), score.max, caseData.id);
  }
});

test("session case selection carries through to scoring without passing case data repeatedly", () => {
  const headache = getCase("recurrent-headache-01");
  let session = createSession(headache.id);
  assert.equal(session.caseId, headache.id);
  session = recordHistory(session, "pattern");
  assert.equal(scoreSession(session).caseId, headache.id);
  assert.equal(scoreSession(session).sections[0].earned, 2);
  assert.throws(() => createSession("unknown-case"), RangeError);
});

test("free-text matching selects case-specific authored topics", () => {
  assert.equal(matchHistoryQuestion("did it reach maximum intensity suddenly or any weakness?", getCase("recurrent-headache-01")).id, "red-flags");
  assert.equal(matchHistoryQuestion("have you had chills and are you able to drink fluids?", getCase("cough-fever-01")).id, "systemic");
  assert.equal(matchHistoryQuestion("does it travel down my left arm and to my jaw?", getCase("acute-chest-pain-01")).id, "radiation");
  assert.equal(matchHistoryQuestion("   ", getCase("acute-chest-pain-01")), null);
  assert.equal(matchHistoryQuestion("unrelated words", getCase("acute-chest-pain-01")), null);
});

test("focused investigation scoring is capped and extra non-focused tests earn no points", () => {
  const caseData = getCase("acute-appendicitis-01");
  let focused = createSession(caseData.id);
  for (const id of caseData.investigationFocusIds) focused = orderInvestigation(focused, id);
  const focusedScore = scoreSession(focused).sections.find((section) => section.id === "investigations");
  assert.equal(focusedScore.earned, 5);
  assert.equal(focusedScore.max, 5);
  assert.equal(focusedScore.outOfFocusCount, 0);

  let everyReport = focused;
  for (const report of caseData.investigations) everyReport = orderInvestigation(everyReport, report.id);
  const allScore = scoreSession(everyReport).sections.find((section) => section.id === "investigations");
  assert.equal(allScore.earned, focusedScore.earned);
  assert.equal(allScore.outOfFocusCount, 2);
  assert.match(allScore.assessmentLimit, /does not assess whether other investigations are appropriate/);

  let offFocusOnly = createSession(caseData.id);
  offFocusOnly = orderInvestigation(offFocusOnly, "crp");
  assert.equal(scoreSession(offFocusOnly).sections.find((section) => section.id === "investigations").earned, 0);
});

test("duplicate actions do not inflate points and unknown or cross-case actions are ignored", () => {
  const caseData = getCase("acute-chest-pain-01");
  let session = createSession(caseData.id);
  session = recordHistory(session, "onset");
  session = recordHistory(session, "onset");
  session = performExam(session, "vitals");
  session = performExam(session, "vitals");
  session = orderInvestigation(session, "ecg");
  session = orderInvestigation(session, "ecg");
  assert.deepEqual(session.askedHistory, ["onset"]);
  assert.deepEqual(session.completedExams, ["vitals"]);
  assert.deepEqual(session.orderedInvestigations, ["ecg"]);
  assert.equal(recordHistory(session, "duration"), session);
  assert.equal(setDiagnosis(session, "pneumonia-pattern"), session);
  assert.equal(setManagement(session, "routine-followup").managementId, "routine-followup");
});

test("scripted history helper returns an authored response or safe fallback", () => {
  const caseData = getCase("acute-chest-pain-01");
  const session = createSession(caseData.id);
  const answer = askAboutHistory(session, "radiation");
  assert.equal(answer.question.id, "radiation");
  assert.equal(answer.session.askedHistory.includes("radiation"), true);
  assert.match(answer.response, /left arm/);
  const fallback = askAboutHistory(session, "unknown-topic");
  assert.equal(fallback.question, null);
  assert.equal(fallback.session, session);
  assert.equal(fallback.response, caseData.fallbackResponse);
});
