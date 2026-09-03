import type { Exam, ExamAttempt, Teacher, LeaderboardEntry } from "./types";
import { gradeAttempt } from "./grading";
import { generateId, generateCode } from "./utils";

const KEYS = {
  EXAMS: "ty_exams",
  ATTEMPTS: "ty_attempts",
  TEACHER: "ty_teacher",
  SEEDED: "ty_seeded",
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Teacher ──────────────────────────────────────────────────────────────────

export function getTeacher(): Teacher {
  return load<Teacher>(KEYS.TEACHER, {
    email: "teacher@test.com",
    name: "Ms Eman Zahy",
    passwordHash: "password",
    settings: {
      defaultDuration: 30,
      defaultRankingVisible: true,
      defaultResultVisible: true,
      defaultReviewVisible: true,
    },
  });
}

export function saveTeacher(teacher: Teacher) {
  save(KEYS.TEACHER, teacher);
}

// ── Exams ────────────────────────────────────────────────────────────────────

export function getExams(): Exam[] {
  return load<Exam[]>(KEYS.EXAMS, []);
}

export function getExam(id: string): Exam | undefined {
  return getExams().find((e) => e.id === id);
}

export function getExamByCode(code: string): Exam | undefined {
  return getExams().find((e) => e.code === code);
}

export function saveExam(exam: Exam) {
  const exams = getExams();
  const idx = exams.findIndex((e) => e.id === exam.id);
  if (idx >= 0) exams[idx] = exam;
  else exams.push(exam);
  save(KEYS.EXAMS, exams);
}

export function deleteExam(id: string) {
  save(
    KEYS.EXAMS,
    getExams().filter((e) => e.id !== id)
  );
  // also remove attempts
  save(
    KEYS.ATTEMPTS,
    getAttempts().filter((a) => a.examId !== id)
  );
}

export function publishExam(id: string): string {
  const exam = getExam(id);
  if (!exam) throw new Error("Exam not found");
  const code = exam.code || generateCode(exam.title);
  saveExam({ ...exam, code, status: "published", updatedAt: new Date().toISOString() });
  return code;
}

export function closeExam(id: string) {
  const exam = getExam(id);
  if (!exam) return;
  saveExam({ ...exam, status: "closed", updatedAt: new Date().toISOString() });
}

// ── Attempts ─────────────────────────────────────────────────────────────────

export function getAttempts(): ExamAttempt[] {
  return load<ExamAttempt[]>(KEYS.ATTEMPTS, []);
}

export function getAttempt(id: string): ExamAttempt | undefined {
  return getAttempts().find((a) => a.id === id);
}

export function getAttemptsByExam(examId: string): ExamAttempt[] {
  return getAttempts().filter((a) => a.examId === examId);
}

export function createAttempt(examId: string, studentName: string): ExamAttempt {
  const exam = getExam(examId);
  if (!exam) throw new Error("Exam not found");

  const now = new Date();
  const deadline = new Date(now.getTime() + exam.duration * 60 * 1000);

  const attempt: ExamAttempt = {
    id: generateId(),
    examId,
    studentName: studentName.trim(),
    startTime: now.toISOString(),
    deadline: deadline.toISOString(),
    answers: {},
    submitted: false,
  };

  const attempts = getAttempts();
  attempts.push(attempt);
  save(KEYS.ATTEMPTS, attempts);
  return attempt;
}

export function saveAnswer(
  attemptId: string,
  questionId: string,
  value: string | string[]
) {
  const attempts = getAttempts();
  const idx = attempts.findIndex((a) => a.id === attemptId);
  if (idx < 0) return;
  const attempt = attempts[idx];
  if (attempt.submitted) return;

  attempt.answers[questionId] = {
    questionId,
    value,
    answeredAt: new Date().toISOString(),
  };
  attempts[idx] = attempt;
  save(KEYS.ATTEMPTS, attempts);
}

export function submitAttempt(attemptId: string): ExamAttempt {
  const attempts = getAttempts();
  const idx = attempts.findIndex((a) => a.id === attemptId);
  if (idx < 0) throw new Error("Attempt not found");

  const attempt = attempts[idx];
  if (attempt.submitted) return attempt;

  const exam = getExam(attempt.examId);
  if (!exam) throw new Error("Exam not found");

  const graded = gradeAttempt(
    { ...attempt, submittedAt: new Date().toISOString() },
    exam.questions
  );

  const updated = { ...attempt, ...graded };
  attempts[idx] = updated;
  save(KEYS.ATTEMPTS, attempts);

  // Recalculate ranks for this exam
  recalcRanks(attempt.examId);

  return getAttempt(attemptId)!;
}

function recalcRanks(examId: string) {
  const attempts = getAttempts();
  const examAttempts = attempts
    .filter((a) => a.examId === examId && a.submitted)
    .sort((a, b) => {
      const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (a.timeUsed ?? Infinity) - (b.timeUsed ?? Infinity);
    });

  examAttempts.forEach((a, i) => {
    const idx = attempts.findIndex((x) => x.id === a.id);
    if (idx >= 0) attempts[idx].rank = i + 1;
  });

  save(KEYS.ATTEMPTS, attempts);
}

export function getLeaderboard(examId: string): LeaderboardEntry[] {
  return getAttemptsByExam(examId)
    .filter((a) => a.submitted && a.score !== undefined)
    .sort((a, b) => {
      const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (a.timeUsed ?? Infinity) - (b.timeUsed ?? Infinity);
    })
    .map((a, i) => ({
      rank: i + 1,
      studentName: a.studentName,
      score: a.score ?? 0,
      maxScore: a.maxScore ?? 0,
      percentage: a.percentage ?? 0,
      timeUsed: a.timeUsed ?? 0,
      attemptId: a.id,
    }));
}

// ── Seeding ───────────────────────────────────────────────────────────────────

export function seedIfNeeded() {
  if (localStorage.getItem(KEYS.SEEDED)) return;

  const examId = generateId();
  const now = new Date();

  const exam: Exam = {
    id: examId,
    code: generateCode("English Grammar Test"),
    title: "English Grammar Test",
    description: "A comprehensive test covering English grammar fundamentals.",
    instructions:
      "Read each question carefully. Choose the best answer for MCQ questions. Arrange words in the correct order for ordering questions. Type the correct form of the word in brackets.",
    duration: 30,
    status: "published",
    settings: {
      allowRanking: true,
      showRankingToStudents: true,
      showResults: true,
      showAnswerReview: true,
    },
    questions: [
      {
        id: "q1",
        type: "mcq",
        text: 'She _____ to school every day.',
        options: [
          { id: "a", text: "go" },
          { id: "b", text: "goes" },
          { id: "c", text: "going" },
          { id: "d", text: "gone" },
        ],
        correctOptionId: "b",
        marks: 2,
      },
      {
        id: "q2",
        type: "mcq",
        text: 'They _____ watching TV when I called.',
        options: [
          { id: "a", text: "was" },
          { id: "b", text: "were" },
          { id: "c", text: "are" },
          { id: "d", text: "be" },
        ],
        correctOptionId: "b",
        marks: 2,
      },
      {
        id: "q3",
        type: "ordering",
        text: "Arrange the words to form a correct sentence:",
        items: ["Ahmed", "goes", "to", "school", "every", "day"],
        correctOrder: ["Ahmed", "goes", "to", "school", "every", "day"],
        marks: 3,
      },
      {
        id: "q4",
        type: "brackets",
        text: 'The children (play) in the garden right now.',
        correctAnswer: "are playing",
        caseSensitive: false,
        marks: 2,
      },
      {
        id: "q5",
        type: "mcq",
        text: "Which sentence is grammatically correct?",
        options: [
          { id: "a", text: "He don't like coffee." },
          { id: "b", text: "He doesn't likes coffee." },
          { id: "c", text: "He doesn't like coffee." },
          { id: "d", text: "He not like coffee." },
        ],
        correctOptionId: "c",
        marks: 2,
      },
    ],
    createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
  };

  save(KEYS.EXAMS, [exam]);

  // Seed 3 completed attempts
  const students = [
    { name: "Ahmed Mohamed", answers: { q1: "b", q2: "b", q3: ["Ahmed","goes","to","school","every","day"], q4: "are playing", q5: "c" }, offset: -3600 },
    { name: "Youssef Ali", answers: { q1: "b", q2: "b", q3: ["Ahmed","goes","to","school","every","day"], q4: "is playing", q5: "b" }, offset: -2800 },
    { name: "Sara Khaled", answers: { q1: "a", q2: "b", q3: ["Ahmed","goes","to","school","every","day"], q4: "are playing", q5: "c" }, offset: -5000 },
  ];

  const seedAttempts: ExamAttempt[] = students.map((s) => {
    const start = new Date(now.getTime() - 86400000);
    const deadline = new Date(start.getTime() + 30 * 60000);
    const submitted = new Date(start.getTime() + Math.abs(s.offset) * 1000);
    const answers: ExamAttempt["answers"] = {};

    for (const [qid, val] of Object.entries(s.answers)) {
      answers[qid] = {
        questionId: qid,
        value: val as string | string[],
        answeredAt: start.toISOString(),
      };
    }

    return {
      id: generateId(),
      examId,
      studentName: s.name,
      startTime: start.toISOString(),
      deadline: deadline.toISOString(),
      answers,
      submitted: false,
      submittedAt: submitted.toISOString(),
    };
  });

  // Grade each attempt
  const gradedAttempts = seedAttempts.map((a) => ({
    ...a,
    ...gradeAttempt({ ...a, submittedAt: a.submittedAt }, exam.questions),
  }));

  // Assign ranks
  const sorted = [...gradedAttempts].sort((a, b) => {
    const diff = (b.score ?? 0) - (a.score ?? 0);
    return diff !== 0 ? diff : (a.timeUsed ?? 0) - (b.timeUsed ?? 0);
  });
  sorted.forEach((a, i) => {
    const idx = gradedAttempts.findIndex((x) => x.id === a.id);
    gradedAttempts[idx].rank = i + 1;
  });

  save(KEYS.ATTEMPTS, gradedAttempts);
  localStorage.setItem(KEYS.SEEDED, "1");
}
