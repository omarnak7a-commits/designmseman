# Plan: Test Yourself — English Examination Platform

## Context
Build a complete production-quality examination platform for English teacher Ms Eman Zahy ("Test Yourself"). The app has two experiences: a teacher/admin side (behind login) and a student side (public, accessed via unique exam links). The brief provides an uploaded logo (TY shield monogram + "TEST YOURSELF" wordmark + "Ms Eman Zahy" tagline) in deep navy/bright blue that must drive the visual identity throughout.

The project is a blank React + Vite + Tailwind CSS v4 app. All data persistence is via localStorage (simulating server-side authority for timer deadlines, grading, and answer storage). React Router handles client-side navigation.

## Aesthetic Decision
- **Stance**: Clean educational / institutional — white-dominant, deep navy + bright blue accents, zero decorative gradients or glassmorphism.
- **Fonts**: DM Sans (headings, bold hierarchy) + Inter (body, UI text) — both from Google Fonts. Added via `@import` in `src/index.css`.
- **Palette** (from spec): Primary `#2563EB`, Deep `#1D4ED8`, Baby Blue `#BFE3FF`, White `#FFFFFF`, Background `#F8FAFC`, Text `#0F172A`, Secondary text `#64748B`.

## File Structure

```
src/
  App.tsx                        ← Router setup + auth guards
  index.css                      ← Google Font imports + Tailwind + CSS tokens
  imports/
    Max_a_____________________.png  ← Logo asset (already present)
  lib/
    types.ts                     ← All TypeScript interfaces
    store.ts                     ← localStorage CRUD layer (exams, attempts, results)
    auth.ts                      ← Teacher auth (simple credential check + session)
    grading.ts                   ← Server-side grading logic
    utils.ts                     ← generateId, formatTime, normalizeAnswer, etc.
  components/
    Logo.tsx                     ← Logo component (full / compact / icon variants)
    ui/
      Button.tsx
      Input.tsx
      Badge.tsx
      Modal.tsx
      Toast.tsx / useToast.tsx
      Card.tsx
      Spinner.tsx
      EmptyState.tsx
    teacher/
      Layout.tsx                 ← Sidebar + header shell for all teacher pages
  pages/
    Landing.tsx
    Login.tsx
    teacher/
      Dashboard.tsx
      Exams.tsx
      CreateExam.tsx             ← 3-step wizard (Info → Settings → Questions)
      ExamDetail.tsx
      EditExam.tsx               ← Reuses CreateExam wizard in edit mode
      Results.tsx                ← Per-exam results table
      StudentResultDetail.tsx
      Students.tsx
      Settings.tsx
    student/
      ExamEntry.tsx              ← Intro + student name form
      ActiveExam.tsx             ← Timer + question display + navigator
      ResultPage.tsx
      Leaderboard.tsx
      AnswerReview.tsx
```

## Key Data Types (`lib/types.ts`)

```ts
Exam { id, code, title, description, instructions, duration, status, settings, questions[], createdAt }
Question { id, type: 'mcq'|'ordering'|'brackets', text, options[], correctAnswer, marks }
ExamAttempt { id, examId, studentName, startTime, deadline, answers, submitted, score, rank }
ExamResult { attemptId, totalScore, maxScore, percentage, correctCount, incorrectCount, timeUsed }
```

Exam `code` is a short random slug like `english-grammar-82K4`. Status: `draft | published | active | closed`.

## Routing (`App.tsx`)

```
/                          Landing
/login                     Teacher login
/teacher/dashboard         (auth-guarded)
/teacher/exams             (auth-guarded)
/teacher/exams/create      (auth-guarded)
/teacher/exams/:id         (auth-guarded)
/teacher/exams/:id/edit    (auth-guarded)
/teacher/exams/:id/results (auth-guarded)
/teacher/results/:id       (auth-guarded) — student result detail
/teacher/students          (auth-guarded)
/teacher/settings          (auth-guarded)
/exam/:code                Student exam entry
/exam/:code/take/:attemptId Active exam
/exam/:code/result/:attemptId Result page
/exam/:code/leaderboard/:attemptId Leaderboard
/exam/:code/review/:attemptId Answer review
```

Auth guard: if no teacher session in localStorage, redirect to `/login`.

## Critical Behaviors

### Timer (simulated server-authority)
- On `StartExam`: store `deadline = Date.now() + duration * 60000` in the attempt record in localStorage.
- `ActiveExam.tsx` computes `remaining = deadline - Date.now()` every second.
- When remaining ≤ 0: auto-submit via the same grading function.
- Student cannot extend or pause — deadline is fixed in the store.

### Grading (`lib/grading.ts`)
- MCQ: exact match on selected option index.
- Ordering: compare student order array to correctOrder array element-by-element.
- Brackets: normalize both sides (trim, lowercase unless caseSensitive flag), compare.
- All grading happens inside `gradeAttempt()` which reads from the store, never from client state.

### Correct Answer Protection
- During active exam: questions fetched from store but `correctAnswer` field stripped before passing to `ActiveExam` component props.
- Immediate per-question feedback: "Correct" / "Incorrect" only — no correct answer shown.
- Full answers revealed only in `AnswerReview` after `submitted === true`.

### Auto-save
- Every answer change calls `store.saveAnswer(attemptId, questionId, answer)` immediately.

### Seed Data
- On first load, seed one sample teacher (`teacher@test.com` / `password`), one published exam "English Grammar Test" with 5 questions (all 3 types), and 3 completed student attempts so the dashboard and leaderboard aren't empty on first view.

## Component Notes

### `Logo.tsx`
- `variant="full"`: renders the PNG import at natural aspect ratio.
- `variant="compact"`: PNG at small size + "Test Yourself" + "Ms Eman Zahy" text beside it.
- `variant="icon"`: PNG only, no text.
- Import: `import logoSrc from '@/imports/Max_a_____________________.png'` + `<ImageWithFallback>`.

### `CreateExam.tsx` 3-step wizard
- Step 1: Title, Description, Instructions
- Step 2: Duration (preset or custom), toggle settings (ranking, show results, show review)
- Step 3: Question list + "Add Question" modal with type selector
  - MCQ: 4 option inputs + correct answer selector + marks
  - Ordering: items textarea + drag-to-reorder for correct order
  - Brackets: question text with `(word)` notation + correct answer + marks
- Drag-to-reorder question list via mouse drag (using `onDragStart`/`onDragOver`/`onDrop` HTML5 drag API — no extra library needed).

### Teacher Layout sidebar
- Logo (compact) at top
- Nav links: Dashboard, Exams, Students, Results, Settings
- Logout at bottom
- Collapses to bottom tab bar on mobile (≤768px)

### `ActiveExam.tsx`
- Header: compact logo + exam title + timer (turns red at ≤5 min)
- Left panel: question + answer controls
- Right panel (desktop) / bottom sheet toggle (mobile): question number navigator with answered/unanswered visual states
- Previous / Next buttons
- Submit Exam button → confirmation modal

## Dependencies to Install
- `react-router-dom` v6 (routing)

No other new dependencies needed. HTML5 drag API for reordering.

## Fonts
Add to top of `src/index.css` (before `@import 'tailwindcss'`):
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
```

## CSS Design Tokens (in `src/index.css`)
```css
:root {
  --brand-primary: #2563EB;
  --brand-deep: #1D4ED8;
  --brand-baby: #BFE3FF;
  --brand-bg: #F8FAFC;
  --brand-text: #0F172A;
  --brand-muted: #64748B;
  --brand-border: #E2E8F0;
  --radius-base: 10px;
}
```

## Verification
1. Open the app — landing page shows logo, hero text, and "Take an Exam" / "Teacher Login" CTAs.
2. Click "Teacher Login" → `/login` → sign in with `teacher@test.com` / `password` → redirects to dashboard with stat cards and recent exams.
3. Navigate Exams → Create Exam → complete all 3 steps → publish → copy link.
4. Open the generated exam link in a new tab (student flow) → enter a name → Start Exam → answer questions → see Correct/Incorrect per answer (no correct answer leak) → Submit → see result + leaderboard + answer review.
5. Back in teacher dashboard: Results show the new student attempt.
6. Mobile: sidebar collapsed, exam questions readable, timer visible, tap targets large.
