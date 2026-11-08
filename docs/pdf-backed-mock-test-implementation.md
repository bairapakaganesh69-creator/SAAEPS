# PDF-backed randomized mock tests

## Scope

Use only the supplied previous-year question-paper PDFs and their answer keys.

- ECET CSE 2026: 200 questions — Mathematics 50, Physics 25, Chemistry 25, CSE Engineering 100; 180 minutes; source PDF 81 pages.
- ECET ECE 2026: 200 questions — Mathematics 50, Physics 25, Chemistry 25, ECE Engineering 100; 180 minutes; source PDF 75 pages.
- POLYCET 2025: the supplied question paper is a 32-page paper (33 PDF pages including its cover). The supplied provisional answer key contains 150 question rows for paper CODE-A. The subject boundaries must be confirmed from the original paper before section-specific shuffling is configured.

The uploaded 2026 syllabi are classification references, not a source for inventing questions.

## Source audit

| Source | Evidence confirmed | Extraction status |
|---|---|---|
| TG ECET 2026 CSE paper + key | Telangana State Council Higher Education header; 15 May 2026 Shift 1; 180 minutes; 200 marks; Actual Answer Key = Yes; green options denote correct answers; 81 PDF pages | OCR/visual extraction and verification pending |
| TG ECET 2026 ECE paper + key | Telangana State Council Higher Education header; 15 May 2026 Shift 1; 180 minutes; 200 marks; Actual Answer Key = Yes; green options denote correct answers; 75 PDF pages | OCR/visual extraction and verification pending |
| TS POLYCET 2025 question paper | AglaSem-hosted paper; 32 numbered content pages plus cover; paper footer identifies CODE-A | OCR extraction and visual verification pending |
| TS POLYCET 2025 answer key | SBTET provisional key; rows 1–150; four code columns A–D | CODE-A transcribed to backend/data/source-answer-keys/polycet-2025-code-a.provisional.json; cross-check pending |

The POLYCET key is explicitly provisional. Do not silently treat it as a final key. The source PDF must be visually reviewed against every imported question and the paper code.

## Provenance and verification rules

Every production question must retain:
- exam type, year and branch (CSE/ECE/GENERAL);
- original question number and paper code where applicable;
- source PDF filename and PDF page number;
- answer-key status (VISUAL_MARKED, PROVISIONAL, OFFICIAL, or VERIFIED);
- verification status (CANDIDATE, VERIFIED, or REJECTED).

A source question is not production-ready merely because OCR returned text. Verify question text, all four options, original numbering, source page, subject assignment and correct option against the source PDF. Never invent content to fill OCR gaps. Synthetic fixtures are test-only and must never be imported as production questions.

## Runtime behaviour

1. Extract and verify PDF questions before a student starts an exam.
2. Store question text, four options, correct answer, subject and source provenance.
3. Build a fresh question order for each new attempt.
4. Shuffle within subject sections so the configured section counts and frontend boundaries remain intact.
5. Persist attempt-specific order. Resuming an active attempt reuses its saved order; a new attempt creates its own order.
6. Keep correct answers and source metadata out of student-facing question responses.
7. Target less than five seconds from start request to complete question payload, measured locally.

## Current integration

The existing backend has Test, Question, TestQuestion, TestAttempt and TestAttemptAnswer. This branch adds:
- TestAttemptQuestion to persist a question sequence per attempt;
- QuestionSource to preserve source provenance and verification state;
- an authenticated endpoint to retrieve the saved attempt order;
- a frontend call that uses the attempt-specific endpoint.

TestQuestion.questionOrder remains the curated source-test order. Do not mutate it when students start tests.

## Verification gates

- Exact total and section counts for each exam.
- Unique question IDs per attempt.
- No cross-exam or cross-branch leakage.
- Options and correct answer remain attached to their question after shuffling.
- Provenance exists for every production question.
- Only approved verification states enter production.
- Active attempt resume preserves order.
- Existing answer saving, submission, evaluation and history still work.
- Start-to-payload latency is under five seconds.
