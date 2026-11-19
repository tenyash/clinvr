/**
 * Fictional teaching scenario: acute chest pain with findings concerning for
 * an acute coronary syndrome. All content and scoring are unreviewed.
 */
export const chestPainCase = {
  id: "acute-chest-pain-01",
  title: "Acute chest pain: focused cardiovascular assessment",
  specialty: "Cardiology",
  level: "Undergraduate clinical skills",
  estimatedMinutes: 8,
  summary: "Assess acute chest discomfort, perform a focused cardiovascular examination, and recognize the need for urgent review.",
  objectives: ["Take a structured chest-pain history", "Perform a focused cardiovascular screen", "Escalate concerning simulated findings"],
  tags: ["chest pain", "cardiovascular", "ECG"],
  patient: {
    name: "Kabir Singh",
    age: 58,
    pronouns: "he/him",
    opening: "I have a heavy pain in my chest that started while I was sitting down.",
    appearance: "Looks anxious and clammy in the simulated room.",
    vitals: [
      { label: "Temperature", value: "36.7", unit: "°C" },
      { label: "Heart rate", value: "98", unit: "bpm" },
      { label: "Blood pressure", value: "142/86", unit: "mmHg" },
      { label: "Respiratory rate", value: "20", unit: "/min" },
      { label: "Oxygen saturation", value: "97", unit: "%" },
    ],
  },
  history: [
    { id: "onset", label: "Onset and duration", prompt: "When did the pain start, and what were you doing?", answer: "It started about an hour ago while I was sitting and has not gone away.", keywords: ["when", "start", "began", "onset", "duration", "how long", "doing"], points: 2 },
    { id: "pain", label: "Character and site", prompt: "Where is the pain, and what does it feel like?", answer: "It feels like a heavy pressure in the middle of my chest.", keywords: ["where", "site", "location", "character", "feel", "heavy", "pressure", "tight", "severity"], points: 2 },
    { id: "radiation", label: "Radiation", prompt: "Does the discomfort travel anywhere?", answer: "It spreads toward my left arm and jaw.", keywords: ["travel", "radiat", "spread", "arm", "jaw", "back"], points: 2 },
    { id: "associated", label: "Associated symptoms", prompt: "Have you felt breathless, sweaty, faint, or sick?", answer: "I feel short of breath, sweaty, and a little nauseated. I have not fainted.", keywords: ["breath", "short", "sweat", "clammy", "nausea", "sick", "faint", "dizzy"], points: 2 },
    { id: "risk", label: "Relevant history and risks", prompt: "Do you have long-term conditions, take medicines, or have allergies?", answer: "I have high blood pressure. I take a regular tablet for it, and I have no known allergies.", keywords: ["medical history", "condition", "blood pressure", "medicine", "medication", "drug", "allerg", "past illness"], points: 2 },
    { id: "cardiac-history", label: "Previous episodes and risk context", prompt: "Have you had this before, or had heart problems? Do you smoke?", answer: "I have not had this pain before. I used to smoke but stopped several years ago.", keywords: ["previous", "before", "heart", "cardiac", "smoke", "smoking", "family", "risk"], points: 2 },
  ],
  fallbackResponse: "I am not sure. Could you ask me about the chest discomfort or other symptoms?",
  examination: [
    { id: "vitals", label: "Review observations", finding: "The recorded observations are shown for this scenario. Concerning symptoms still require prompt clinical assessment even when some values appear stable.", points: 2 },
    { id: "general", label: "General appearance and comfort", finding: "Kabir appears anxious and clammy. Explain any examination and ask permission first.", points: 1 },
    { id: "cardiovascular", label: "Focused cardiovascular examination", finding: "The simulated examination finds a regular pulse and no added heart sound. A normal finding does not rule out the cause of acute chest pain.", points: 3 },
    { id: "perfusion", label: "Check peripheral perfusion", finding: "No additional abnormality is supplied in this simulated finding.", points: 1 },
  ],
  investigations: [
    { id: "ecg", label: "12-lead ECG report", result: "The fictional report describes acute ischemic changes and requests urgent clinical review.", interpretation: "Treat this as a concerning simulated result requiring urgent escalation in the scenario; real interpretation belongs to a qualified clinician.", points: 3 },
    { id: "troponin", label: "Cardiac troponin report", result: "The fictional result is above the local reference range supplied by this scenario.", interpretation: "Interpret with timing, symptoms, ECG, and serial-testing protocols; this vignette does not replace clinical judgment.", points: 2 },
    { id: "ct-chest", label: "CT chest", result: "No report supplied.", interpretation: "This is not a scenario-targeted test. Real investigation choices depend on clinician assessment and local protocols.", points: 0 },
  ],
  investigationFocusIds: ["ecg", "troponin"],
  diagnoses: [
    { id: "acs-pattern", label: "Acute coronary syndrome pattern in this scenario" },
    { id: "reflux", label: "Gastro-oesophageal reflux pattern" },
    { id: "musculoskeletal", label: "Musculoskeletal chest pain pattern" },
    { id: "other", label: "Another cause requiring assessment" },
  ],
  correctDiagnosisId: "acs-pattern",
  diagnosisPoints: 4,
  management: [
    { id: "urgent-escalation", label: "Arrange immediate senior/emergency clinical assessment and follow the local acute chest-pain escalation pathway.", feedback: "The scenario rewards prompt escalation of concerning symptoms and simulated results. Treatment decisions belong to the responsible clinical team and local pathway.", points: 4, recommended: true },
    { id: "routine-followup", label: "Arrange routine follow-up without urgent reassessment.", feedback: "The symptoms and simulated ECG report warrant prompt review in this educational scenario.", points: 0, recommended: false },
    { id: "self-prescribe", label: "Choose a prescription without senior review or checking the clinical context.", feedback: "The vignette does not establish a safe prescription. Escalate and follow local protocols.", points: 0, recommended: false },
  ],
  rubric: { historyMax: 12, examinationMax: 7, investigationsMax: 5, diagnosisMax: 4, managementMax: 4, maxScore: 32 },
  assessment: {
    feedback: {
      historyIncomplete: "Clarify timing, character, radiation, associated symptoms, and relevant cardiac history.",
      examinationIncomplete: "Review observations and perform a focused cardiovascular assessment, explaining each step and seeking permission.",
      investigationsIncomplete: "Review the scenario-focused ECG and biomarker reports and interpret them in context.",
      diagnosisIncorrect: "Reconsider the acute symptom pattern and the supplied simulated ECG and troponin findings.",
    },
  },
  educationalNotice: "Fictional educational case. Content and scoring are unreviewed, not medical advice, and not a validated OSCE. Qualified faculty review is required before teaching use.",
};
