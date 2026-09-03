export type QuestionType = "mcq" | "ordering" | "brackets";
export type ExamStatus = "draft" | "published" | "active" | "closed";

export interface McqOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  // MCQ
  options?: McqOption[];
  correctOptionId?: string;
  // Ordering
  items?: string[];
  correctOrder?: string[]; // array of item indices in correct order
  // Brackets
  correctAnswer?: string;
  caseSensitive?: boolean;
  marks: number;
}

export interface ExamSettings {
  allowRanking: boolean;
  showRankingToStudents: boolean;
  showResults: boolean;
  showAnswerReview: boolean;
  startAt?: string; // ISO date
  closeAt?: string; // ISO date
}

export interface Exam {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions: string;
  duration: number; // minutes
  status: ExamStatus;
  settings: ExamSettings;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export type AnswerValue = string | string[]; // string for MCQ/brackets, string[] for ordering

export interface StudentAnswer {
  questionId: string;
  value: AnswerValue;
  isCorrect?: boolean; // set after grading
  answeredAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentName: string;
  startTime: string; // ISO
  deadline: string; // ISO — server-authoritative
  answers: Record<string, StudentAnswer>;
  submitted: boolean;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  correctCount?: number;
  incorrectCount?: number;
  timeUsed?: number; // seconds
  rank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeUsed: number;
  attemptId: string;
}

export interface Teacher {
  email: string;
  name: string;
  passwordHash: string; // just plain for demo
  settings: {
    defaultDuration: number;
    defaultRankingVisible: boolean;
    defaultResultVisible: boolean;
    defaultReviewVisible: boolean;
  };
}
