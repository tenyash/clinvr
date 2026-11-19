/**
 * Fictional teaching scenario: cough and fever with a possible lower respiratory infection.
 * Content and checklist are unreviewed and must not be used as clinical guidance.
 */
export const coughFeverCase = {
  id: "cough-fever-01",
  title: "Cough and fever: focused assessment",
  specialty: "Acute medicine",
  level: "Undergraduate clinical skills",
  estimatedMinutes: 8,
  summary: "Assess a cough and fever scenario, review focused findings, and explain next steps.",
  objectives: ["Take a focused respiratory history", "Review observations and examination", "Explain a safe next step"],
  tags: ["respiratory", "history", "examination"],
  patient: {
    name: "Rohan Verma",
    age: 34,
    pronouns: "he/him",
    opening: "I have been coughing for a few days and now I feel feverish and short of breath.",
    appearance: "Looks tired and pauses briefly after walking into the room.",
    vitals: [
      { label: "Temperature", value: "38.2", unit: "°C" },
      { label: "Heart rate", value: "104", unit: "bpm" },
      { label: "Blood pressure", value: "116/74", unit: "mmHg" },
      { label: "Respiratory rate", value: "22", unit: "/min" },
      { label: "Oxygen saturation", value: "94", unit: "%" },
    ],
  },
  history: [
    { id: "duration", label: "Onset and duration", prompt: "When did the cough and fever begin?", answer: "The cough started three days ago. I began feeling feverish yesterday.", keywords: ["when", "start", "began", "onset", "duration", "how long", "days"], points: 2 },
    { id: "cough", label: "Cough and sputum", prompt: "Is the cough dry, or are you bringing anything up?", answer: "I am bringing up some yellowish sputum, but I have not seen blood.", keywords: ["cough", "phlegm", "sputum", "blood", "haemoptysis", "hemoptysis"], points: 2 },
    { id: "breath", label: "Breathing and chest symptoms", prompt: "How is your breathing? Any chest pain?", answer: "I get more breathless than usual walking. I have a mild ache when I cough, but no crushing chest pain.", keywords: ["breath", "short", "dyspnea", "dyspnoea", "chest", "pain", "walk", "exertion"], points: 3 },
    { id: "systemic", label: "Associated symptoms", prompt: "Any chills, reduced appetite, or difficulty keeping fluids down?", answer: "I have had chills and I am eating less. I can still drink fluids.", keywords: ["chill", "appetite", "eat", "fluid", "drink", "vomit", "nausea"], points: 2 },
    { id: "risk", label: "Relevant history and risks", prompt: "Do you have long-term health conditions, take medicines, or have allergies?", answer: "I have no major long-term conditions, take no regular medicines, and have no known allergies.", keywords: ["medical history", "condition", "medicine", "medication", "drug", "allerg", "past illness"], points: 2 },
    { id: "exposure", label: "Exposure and smoking", prompt: "Have you been around anyone unwell, or do you smoke?", answer: "A colleague had a cold last week. I do not smoke.", keywords: ["contact", "exposure", "around", "sick", "ill", "smoke", "smoking", "tobacco"], points: 1 },
  ],
  fallbackResponse: "I am not sure. Could you ask me about the cough, breathing, or other symptoms?",
  examination: [
    { id: "vitals", label: "Review observations", finding: "Fever, elevated heart rate, and mildly reduced oxygen saturation are recorded in this fictional scenario. Interpret observations in context.", points: 2 },
    { id: "general", label: "General appearance and comfort", finding: "Rohan looks tired. Explain any examination and ask permission before proceeding.", points: 1 },
    { id: "respiratory", label: "Focused respiratory examination", finding: "Simulated findings include crackles over the right lower chest and no wheeze.", points: 3 },
    { id: "circulation", label: "Review hydration and circulation", finding: "No additional abnormality is supplied in this fictional finding; assess in context in real practice.", points: 1 },
  ],
  investigations: [
    { id: "chest-xray", label: "Chest radiograph report", result: "The fictional report describes a focal right lower-zone air-space opacity.", interpretation: "This report supports the intended scenario discussion when considered with the history and examination; it does not establish a real diagnosis.", points: 3 },
    { id: "cbc", label: "Full blood count", result: "White cell count 13.2 × 10⁹/L with neutrophil predominance in the scenario.", interpretation: "An inflammatory pattern in this vignette; it is not diagnostic by itself.", points: 1 },
    { id: "ct-chest", label: "CT chest", result: "No report supplied.", interpretation: "This is not a scenario-targeted option. Real investigation choices depend on clinical assessment.", points: 0 },
    { id: "broad-panel", label: "Broad screening panel", result: "No report supplied.", interpretation: "No result is supplied. Choose tests to answer a defined clinical question and follow local protocols.", points: 0 },
  ],
  investigationFocusIds: ["chest-xray", "cbc"],
  diagnoses: [
    { id: "pneumonia-pattern", label: "Community-acquired pneumonia pattern in this scenario" },
    { id: "viral-illness", label: "Viral respiratory illness" },
    { id: "asthma", label: "Asthma exacerbation" },
    { id: "other", label: "Another cause requiring assessment" },
  ],
  correctDiagnosisId: "pneumonia-pattern",
  diagnosisPoints: 4,
  management: [
    { id: "prompt-review", label: "Arrange prompt clinical and senior review, reassess observations, and follow local assessment and escalation protocols.", feedback: "The scenario rewards timely clinical review and reassessment. Actual care decisions must be made by a qualified clinician using local protocols.", points: 4, recommended: true },
    { id: "ignore-observations", label: "Ignore the observations and send the patient away without reassessment or safety-netting.", feedback: "This plan does not address the symptoms and observations supplied in the scenario.", points: 0, recommended: false },
    { id: "self-prescribe", label: "Choose a prescription without checking the full context or local guidance.", feedback: "The vignette does not establish a safe prescription. Review the patient context and follow local guidance.", points: 0, recommended: false },
  ],
  rubric: { historyMax: 12, examinationMax: 7, investigationsMax: 4, diagnosisMax: 4, managementMax: 4, maxScore: 31 },
  assessment: {
    feedback: {
      historyIncomplete: "Ask about cough, breathing, chest symptoms, associated symptoms, and relevant risks.",
      examinationIncomplete: "Review observations and perform a focused respiratory assessment, explaining each step and seeking permission.",
      investigationsIncomplete: "Review only the scenario-focused reports and interpret them in context.",
      diagnosisIncorrect: "Reconsider the respiratory symptoms, focal examination findings, and supplied report.",
    },
  },
  educationalNotice: "Fictional educational case. Content and scoring are unreviewed, not medical advice, and not a validated OSCE. Qualified faculty review is required before teaching use.",
};
