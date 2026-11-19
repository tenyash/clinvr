# ClinVR

ClinVR is a browser-based clinical simulation application for practising structured patient encounters. It provides a case library, a 3D consultation room, scripted patient dialogue, simulated examinations and investigation reports, diagnosis and management choices, and illustrative checklist feedback.

## Run locally

Install Node.js 20.19+ or 22.12+, then run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Run `npm test` for the case-engine and storage checks, `npm run build` to create the production site in `dist`, and `npm run preview` to preview that build.

## Deploy to GitHub Pages

1. Push this repository to `main` in a GitHub repository you own. GitHub Free requires a public repository for Pages. GitHub Pro, Team, and Enterprise also support deploying from private repositories.
2. In your repository, go to **Settings → Pages** and set the build source to **GitHub Actions**.
3. Open **Actions → Deploy ClinVR to GitHub Pages**, select **Run workflow**, and run it from `main`.

The workflow runs the tests, builds the app for the configured Pages URL, and publishes `dist`. Open **Settings → Pages** for the deployed URL. Run the workflow again to publish updates. The deployed site is public with standard GitHub Pages settings, even when your source repository is private.

## Using the app

Select a case, ask a suggested question or enter your own, and work through the examination, investigations and decision tabs. The patient's responses use a limited keyword matcher and authored answers; they are not generative AI. Patient voice is on by default and uses the browser's speech synthesis; use the voice control to turn it off or the play button to replay an answer. If you cannot hear it, check device volume, browser site audio settings and speech-voice support. Optional speech input may send audio to the browser provider's speech service.

The current encounter choices and a limited history of completed checklist scores are saved in this browser on this device. Conversation text is not restored after a reload. Data can be cleared from the case library or browser settings. Do not enter real patient information. This is not a multi-user account, cloud backup, or faculty analytics system.

## Clinical and assessment limitations

All patients and results are fictional. Cases, findings, management options and scoring are **draft educational material awaiting qualified medical faculty review**; they are not medical advice, validated OSCEs, or measures of competence. Investigation checklists reflect scenario-specific author choices; they do not replace clinical judgment or local protocols. The application must not replace supervised patient care or clinical teaching.

## Project structure

- `src/case/`: case registry, authored content and assessment functions.
- `src/scene/`: 3D room and patient, with a fallback for unavailable WebGL.
- `src/components/`: browser speech input.
- `src/storage.js`: local browser progress and draft storage.
- `src/App.jsx`: case library and encounter workflow.
- `tests/`: case and storage checks.

This release does not include generative AI dialogue, student accounts, shared progress, a faculty dashboard, clinical records, multiplayer or VR headset support. These require additional infrastructure, product design and review.
