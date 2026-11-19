/**
 * Fictional teaching scenario: recurrent headache with a migraine-like pattern.
 * Content and checklist are unreviewed and must not be used as clinical guidance.
 */
export const headacheCase = {
  id: "recurrent-headache-01",
  title: "Recurrent headache: history and red flags",
  specialty: "Neurology",
  level: "Undergraduate clinical skills",
  estimatedMinutes: 7,
  summary: "Explore headache pattern, associated symptoms, and warning features.",
  objectives: ["Take a structured headache history", "Identify warning features", "Explain a safe next step"],
  tags: ["headache", "history", "neurology"],
  patient: {
    name: "Maya Shah",
    age: 26,
    pronouns: "she/her",
    opening: "I keep getting headaches, and this one is making it hard to concentrate.",
    appearance: "Sitting quietly in a dim room and appears uncomfortable.",
    vitals: [
      { label: "Temperature", value: "36.8", unit: "°C" },
      { label: "Heart rate", value: "82", unit: "bpm" },
      { label: "Blood pressure", value: "122/76", unit: "mmHg" },
      { label: "Respiratory rate", value: "16", unit: "/min" },
      { label: "Oxygen saturation", value: "99", unit: "%" },
    ],
  },
  history: [
    { id: "pattern", label: "Onset and pattern", prompt: "When did this headache start, and have you had similar headaches?", answer: "This one began gradually yesterday. I have had similar episodes a few times over the past year.", keywords: ["when", "start", "began", "onset", "pattern", "similar", "previous", "how long"], points: 2 },
    { id: "features", label: "Site, character, and severity", prompt: "Where is the pain, and what does it feel like?", answer: "It is mostly on one side, throbbing, and gets worse when I move around.", keywords: ["where", "site", "location", "character", "feel", "throb", "severity", "severe", "worse"], points: 2 },
    { id: "associated", label: "Associated symptoms", prompt: "Have you noticed nausea or sensitivity to light or sound?", answer: "I feel nauseated and bright light and loud sounds bother me.", keywords: ["nausea", "sick", "light", "sound", "noise", "vomit", "sensitivity"], points: 2 },
    { id: "red-flags", label: "Warning features", prompt: "Did it reach maximum intensity suddenly? Any weakness, confusion, fainting, fever, or recent head injury?", answer: "It came on gradually. I have not had weakness, confusion, fainting, fever, or a head injury.", keywords: ["sudden", "maximum", "weakness", "numb", "confusion", "faint", "fever", "injury", "red flag", "worst"], points: 3 },
    { id: "aura", label: "Neurological symptoms", prompt: "Before or during the headache, have you noticed visual or other neurological changes?", answer: "I have not noticed any visual changes, numbness, or difficulty speaking.", keywords: ["visual", "vision", "aura", "numb", "speak", "speech", "neurological", "weakness"], points: 2 },
    { id: "medicines", label: "Medicines and relevant history", prompt: "What have you taken for it, and do you have any relevant medical history or allergies?", answer: "I took an over-the-counter pain reliever once. I have no known allergies and no major medical problems.", keywords: ["medicine", "medication", "drug", "tablet", "painkiller", "allerg", "medical history", "condition"], points: 2 },
  ],
  fallbackResponse: "I am not sure. Could you ask me about the headache or any other symptoms?",
  examination: [
    { id: "vitals", label: "Review observations", finding: "The observations are within the values supplied for this fictional scenario.", points: 1 },
    { id: "general", label: "General appearance and comfort", finding: "Maya prefers a dim, quiet room. Explain any examination and ask permission first.", points: 1 },
    { id: "neuro", label: "Focused neurological screen", finding: "The simulated screen shows no focal deficit. A normal screen does not by itself exclude serious causes of headache.", points: 3 },
    { id: "eye", label: "Consider eye and fundus assessment", finding: "No abnormality is supplied in this fictional finding. The limits of a simulated examination should be discussed.", points: 1 },
  ],
  investigations: [
    { id: "none-routine", label: "No routine investigation indicated by this stable teaching vignette alone", result: "No investigation report is provided for this option.", interpretation: "A vignette cannot determine real-world testing. Reassess if the history, examination, or context changes.", points: 2 },
    { id: "ct-head", label: "Head CT", result: "No report supplied.", interpretation: "This is not a scenario-targeted test for the presented stable pattern; real decisions require clinical assessment.", points: 0 },
    { id: "blood-panel", label: "Broad blood-test panel", result: "No report supplied.", interpretation: "No result is supplied. Avoid ordering tests without a question they are intended to answer.", points: 0 },
  ],
  investigationFocusIds: ["none-routine"],
  diagnoses: [
    { id: "migraine-pattern", label: "Recurrent headache with a migraine-like pattern" },
    { id: "tension-pattern", label: "Tension-type headache pattern" },
    { id: "cluster-pattern", label: "Cluster headache pattern" },
    { id: "secondary-headache", label: "Secondary headache requiring further assessment" },
  ],
  correctDiagnosisId: "migraine-pattern",
  diagnosisPoints: 4,
  management: [
    { id: "shared-review", label: "Discuss the pattern and options with the patient, consider appropriate clinician review, and give clear safety-net advice under local guidance.", feedback: "The scenario rewards a shared, safety-netted plan. Real assessment and treatment must be guided by a qualified clinician and local guidance.", points: 4, recommended: true },
    { id: "dismiss", label: "Dismiss the concern without discussing warning features or follow-up.", feedback: "This does not address the patient's concerns or explain when to seek further assessment.", points: 0, recommended: false },
    { id: "self-prescribe", label: "Start a new prescription without further assessment or checking suitability.", feedback: "A simulated case cannot establish whether a medicine is suitable. Review the context and follow local guidance.", points: 0, recommended: false },
  ],
  rubric: { historyMax: 13, examinationMax: 6, investigationsMax: 2, diagnosisMax: 4, managementMax: 4, maxScore: 29 },
  assessment: {
    feedback: {
      historyIncomplete: "Ask about the headache pattern, associated symptoms, neurological changes, and warning features.",
      examinationIncomplete: "Review observations and consider a focused neurological screen, explaining the limits of a simulated examination.",
      investigationsIncomplete: "Choose the scenario-targeted option only when appropriate; real testing depends on a clinician's assessment.",
      diagnosisIncorrect: "Reconsider the recurrent pattern, associated symptoms, and warning-feature answers.",
    },
  },
  educationalNotice: "Fictional educational case. Content and scoring are unreviewed, not medical advice, and not a validated OSCE. Qualified faculty review is required before teaching use.",
};
