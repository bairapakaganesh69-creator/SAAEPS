# PDF-backed randomized mock tests

## Scope

Use only the supplied previous-year question-paper PDFs and answer keys in the three existing environments.

- ECET CSE: 200 questions — Mathematics 1–50, Physics 51–75, Chemistry 76–100, CSE Engineering 101–200.
- ECET ECE: 200 questions — Mathematics 1–50, Physics 51–75, Chemistry 76–100, ECE Engineering 101–200.
- POLYCET: 150 questions — Mathematics 1–60, Physics 61–90, Chemistry 91–120, Biology 121–150.

The corresponding uploaded syllabi are reference material for classification, not a source for inventing questions.

## Source handling

- ECET CSE question/answer PDF: 81 pages, 200 marks, 180 minutes. Question text/options require page-image extraction; text-only extraction omits the question content. Correct options are visually marked in the PDF.
- ECET ECE question/answer PDF: 75 pages, 200 marks, 180 minutes. Question text/options likewise require page-image OCR/visual verification.
- POLYCET 2025 question paper: separate 150-question PDF.
- POLYCET 2025 answer key: separate provisional key. Use CODE-A only.
- Preserve original question number, exam/branch/year, source PDF/page and answer-key status for every record.

No question or answer may be fabricated to fill an OCR gap. Synthetic fixtures are test-only and must never be imported as production questions.

## Runtime behaviour

1. Extract and verify PDF questions before a student starts an exam.
2. Store question text, four options, correct answer, exam identity, subject/section and source provenance.
3. Build a fresh question order for each new attempt.
4. Shuffle within subject sections so section counts and frontend boundaries remain intact.
5. Persist attempt-specific order. Resuming an active attempt reuses its saved order; a new attempt receives a new randomized order.
6. Keep correct answers out of student-facing question responses before evaluation.
7. Target less than five seconds from start request to complete question payload, measured locally.

## Current integration note

The existing backend has Test, Question, TestQuestion, TestAttempt and TestAttemptAnswer. TestQuestion.questionOrder is a fixed test order. Attempt-specific order must be persisted separately; mutating TestQuestion would let students' attempts overwrite one another.

## Verification gates

- Exact total and section counts for each exam.
- Unique question IDs per attempt.
- No cross-exam/branch leakage.
- Options and correct answer remain attached to their question after shuffling.
- Provenance exists for every production question.
- Active attempt resume preserves order.
- New attempt receives a new randomized order.
- Existing answer saving, submission, evaluation and history still work.
- Start-to-payload latency is under five seconds.
