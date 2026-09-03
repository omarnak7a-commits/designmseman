import React, { useState } from "react";
import Logo from "../Logo";
import { useNavigate, usePath } from "@/lib/router";
import { logout } from "@/lib/auth";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/teacher/dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-4a.75.75 0 01.75.75v3.25h2.5a.75.75 0 010 1.5h-3.25A.75.75 0 019.25 10.5V6.75A.75.75 0 0110 6z" />
      </svg>
    ),
  },
  {
    label: "Exams",
    path: "/teacher/exams",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3.5 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5zm0 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5zm0 3a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
      </svg>
    ),
  },
  {
    label: "Students",
    path: "/teacher/students",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M7 8a3 3 0 100-6 3 3 0 000 6zm7-3a2 2 0 11-4 0 2 2 0 014 0zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zm14.386-5.131a2.5 2.5 0 00-2.19 1.294.75.75 0 101.308.73A1 1 0 0115.5 13a1 1 0 011 1v.25a.75.75 0 001.5 0V14a2.5 2.5 0 00-2-2.453V11a.75.75 0 00-1.5 0v.5A2.5 2.5 0 0016 14" />
      </svg>
    ),
  },
  {
    label: "Results",
    path: "/teacher/results",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2h11l-3.5 3.5a.75.75 0 101.06 1.06l5-5a.75.75 0 000-1.06l-5-5a.75.75 0 00-1.06 1.06L14 4H3zm0 9a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5A.75.75 0 013 12zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/teacher/settings",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
  },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const path = usePath();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(itemPath: string) {
    return path === itemPath || path.startsWith(itemPath + "/");
  }

  return (
    <div className="flex h-full bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[#e2e8f0] flex-shrink-0">
        <div className="px-5 py-5 border-b border-[#e2e8f0]">
          <Logo variant="compact" />
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors w-full text-left",
                isActive(item.path)
                  ? "bg-[#eff6ff] text-[#2563eb]"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
              ].join(" ")}
            >
              <span
                className={
                  isActive(item.path) ? "text-[#2563eb]" : "text-[#94a3b8]"
                }
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-[#64748b] hover:bg-[#fef2f2] hover:text-[#dc2626] transition-colors w-full text-left"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-[#94a3b8]"
            >
              <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25zm13.03 4.22a.75.75 0 010 1.06l-2 2a.75.75 0 01-1.06-1.06l.72-.72H8a.75.75 0 010-1.5h5.69l-.72-.72a.75.75 0 011.06-1.06l2 2z"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#e2e8f0]">
          <Logo variant="compact" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f8fafc]"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              />
            </svg>
          </button>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-50"
            style={{ background: "rgba(15,23,42,0.4)" }}
          >
            <div
              className="absolute inset-0"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-64 h-full bg-white shadow-xl flex flex-col">
              <div className="px-5 py-5 border-b border-[#e2e8f0]">
                <Logo variant="compact" />
              </div>
              <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors w-full text-left",
                      isActive(item.path)
                        ? "bg-[#eff6ff] text-[#2563eb]"
                        : "text-[#64748b] hover:bg-[#f8fafc]",
                    ].join(" ")}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="px-3 pb-5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-[#64748b] hover:bg-[#fef2f2] hover:text-[#dc2626] transition-colors w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
