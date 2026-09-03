import { useState } from "react";
import TeacherLayout from "@/components/teacher/Layout";
import { getTeacher, saveTeacher } from "@/lib/store";
import { changePassword } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";

export default function Settings() {
  const { toast } = useToast();
  const teacher = getTeacher();

  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");

  const [defaults, setDefaults] = useState({ ...teacher.settings });

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const t = getTeacher();
    saveTeacher({ ...t, name, email });
    toast("Profile updated.");
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassError("");
    if (newPass !== confirmPass) {
      setPassError("New passwords do not match.");
      return;
    }
    if (newPass.length < 6) {
      setPassError("Password must be at least 6 characters.");
      return;
    }
    const ok = changePassword(currentPass, newPass);
    if (!ok) {
      setPassError("Current password is incorrect.");
      return;
    }
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    toast("Password changed successfully.");
  }

  function handleSaveDefaults(e: React.FormEvent) {
    e.preventDefault();
    const t = getTeacher();
    saveTeacher({ ...t, settings: defaults });
    toast("Default settings saved.");
  }

  const inputCls =
    "w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-colors";

  return (
    <TeacherLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1
          className="text-2xl font-bold text-[#0f172a] mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h1>

        {/* Profile */}
        <section className="bg-white border border-[#e2e8f0] rounded-2xl p-6 mb-5">
          <h2
            className="font-semibold text-[#0f172a] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Profile
          </h2>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f172a]">
                Teacher Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f172a]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              className="w-fit px-4 py-2 text-sm font-medium bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
            >
              Save Profile
            </button>
          </form>
        </section>

        {/* Password */}
        <section className="bg-white border border-[#e2e8f0] rounded-2xl p-6 mb-5">
          <h2
            className="font-semibold text-[#0f172a] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f172a]">
                Current Password
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f172a]">
                New Password
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f172a]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className={inputCls}
              />
            </div>
            {passError && (
              <p className="text-sm text-[#dc2626] bg-[#fef2f2] rounded-lg px-3 py-2">
                {passError}
              </p>
            )}
            <button
              type="submit"
              className="w-fit px-4 py-2 text-sm font-medium bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
            >
              Change Password
            </button>
          </form>
        </section>

        {/* Exam Defaults */}
        <section className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
          <h2
            className="font-semibold text-[#0f172a] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Exam Defaults
          </h2>
          <form onSubmit={handleSaveDefaults} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f172a]">
                Default Duration (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={240}
                value={defaults.defaultDuration}
                onChange={(e) =>
                  setDefaults({
                    ...defaults,
                    defaultDuration: Number(e.target.value),
                  })
                }
                className="w-32 px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
              />
            </div>
            {[
              {
                key: "defaultRankingVisible",
                label: "Show ranking to students by default",
              },
              {
                key: "defaultResultVisible",
                label: "Show results to students by default",
              },
              {
                key: "defaultReviewVisible",
                label: "Show answer review by default",
              },
            ].map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    defaults[opt.key as keyof typeof defaults] as boolean
                  }
                  onChange={(e) =>
                    setDefaults({ ...defaults, [opt.key]: e.target.checked })
                  }
                  className="accent-[#2563eb]"
                />
                <span className="text-sm text-[#0f172a]">{opt.label}</span>
              </label>
            ))}
            <button
              type="submit"
              className="w-fit px-4 py-2 text-sm font-medium bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
            >
              Save Defaults
            </button>
          </form>
        </section>
      </div>
    </TeacherLayout>
  );
}
