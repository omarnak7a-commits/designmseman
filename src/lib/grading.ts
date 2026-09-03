import type { Question, StudentAnswer, ExamAttempt } from "./types";
import { normalizeAnswer } from "./utils";

export function gradeQuestion(
  question: Question,
  answer: StudentAnswer | undefined
): { isCorrect: boolean; marks: number } {
  if (!answer) return { isCorrect: false, marks: 0 };

  if (question.type === "mcq") {
    const isCorrect = answer.value === question.correctOptionId;
    return { isCorrect, marks: isCorrect ? question.marks : 0 };
  }

  if (question.type === "ordering") {
    const studentOrder = answer.value as string[];
    const correctOrder = question.correctOrder ?? [];
    if (!studentOrder || studentOrder.length !== correctOrder.length)
      return { isCorrect: false, marks: 0 };
    const isCorrect = correctOrder.every((v, i) => v === studentOrder[i]);
    return { isCorrect, marks: isCorrect ? question.marks : 0 };
  }

  if (question.type === "brackets") {
    const studentVal = answer.value as string;
    const correct = question.correctAnswer ?? "";
    const isCorrect = question.caseSensitive
      ? studentVal.trim() === correct.trim()
      : normalizeAnswer(studentVal) === normalizeAnswer(correct);
    return { isCorrect, marks: isCorrect ? question.marks : 0 };
  }

  return { isCorrect: false, marks: 0 };
}

export function gradeAttempt(
  attempt: ExamAttempt,
  questions: Question[]
): Partial<ExamAttempt> {
  let score = 0;
  const maxScore = questions.reduce((sum, q) => sum + q.marks, 0);
  let correctCount = 0;
  const updatedAnswers = { ...attempt.answers };

  for (const q of questions) {
    const answer = attempt.answers[q.id];
    const { isCorrect, marks } = gradeQuestion(q, answer);
    score += marks;
    if (isCorrect) correctCount++;
    if (answer) {
      updatedAnswers[q.id] = { ...answer, isCorrect };
    }
  }

  const incorrectCount = questions.length - correctCount;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const startMs = new Date(attempt.startTime).getTime();
  const endMs = attempt.submittedAt
    ? new Date(attempt.submittedAt).getTime()
    : Date.now();
  const timeUsed = Math.round((endMs - startMs) / 1000);

  return {
    score,
    maxScore,
    percentage,
    correctCount,
    incorrectCount,
    timeUsed,
    answers: updatedAnswers,
    submitted: true,
    submittedAt: attempt.submittedAt ?? new Date().toISOString(),
  };
}
