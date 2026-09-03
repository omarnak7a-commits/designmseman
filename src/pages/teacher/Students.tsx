import { useMemo, useState } from "react";
import TeacherLayout from "@/components/teacher/Layout";
import { getAttempts, getExams } from "@/lib/store";

export default function Students() {
  const [search, setSearch] = useState("");
  const attempts = getAttempts();
  const exams = getExams();

  const students = useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        examCount: number;
        scores: number[];
        lastExam: string;
      }
    > = {};

    for (const a of attempts) {
      if (!a.submitted) continue;
      if (!map[a.studentName]) {
        map[a.studentName] = {
          name: a.studentName,
          examCount: 0,
          scores: [],
          lastExam: a.submittedAt ?? a.startTime,
        };
      }
      const s = map[a.studentName];
      s.examCount++;
      if (a.percentage !== undefined) s.scores.push(a.percentage);
      if ((a.submittedAt ?? a.startTime) > s.lastExam) {
        s.lastExam = a.submittedAt ?? a.startTime;
      }
    }

    return Object.values(map).filter(
      (s) =>
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [attempts, search]);

  return (
    <TeacherLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1
            className="text-2xl font-bold text-[#0f172a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Students
          </h1>
        </div>

        <input
          type="search"
          placeholder="Search students (English or Arabic)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] mb-4"
        />

        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          {students.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#64748b]">
                {search
                  ? "No students found matching your search."
                  : "No students have completed any exams yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                      Student Name
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden sm:table-cell">
                      Exams Taken
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden sm:table-cell">
                      Average Score
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden md:table-cell">
                      Highest Score
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden md:table-cell">
                      Last Exam
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const avg =
                      s.scores.length > 0
                        ? Math.round(
                            s.scores.reduce((a, b) => a + b, 0) /
                              s.scores.length
                          )
                        : 0;
                    const highest = Math.max(...s.scores, 0);
                    return (
                      <tr
                        key={s.name}
                        className="border-b border-[#f8fafc] hover:bg-[#f8fafc] transition-colors"
                      >
                        <td
                          className="px-5 py-4 font-medium text-[#0f172a]"
                          dir="auto"
                        >
                          {s.name}
                        </td>
                        <td className="px-3 py-4 text-[#64748b] hidden sm:table-cell">
                          {s.examCount}
                        </td>
                        <td className="px-3 py-4 hidden sm:table-cell">
                          <span
                            className={
                              avg >= 70
                                ? "text-[#16a34a] font-medium"
                                : avg >= 50
                                ? "text-[#d97706] font-medium"
                                : "text-[#dc2626] font-medium"
                            }
                          >
                            {avg}%
                          </span>
                        </td>
                        <td className="px-3 py-4 text-[#64748b] hidden md:table-cell">
                          {highest}%
                        </td>
                        <td className="px-3 py-4 text-[#64748b] hidden md:table-cell">
                          {new Date(s.lastExam).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
