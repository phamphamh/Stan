import type { ReactNode } from "react"

interface AppShellProps {
  topNav: ReactNode
  bottomNav: ReactNode
  children: ReactNode
}

export default function AppShell({ topNav, bottomNav, children }: AppShellProps) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col bg-gradient-to-b from-[#0a0f1b] to-[#02040a] overflow-hidden">
      {topNav}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      {bottomNav}
    </div>
  )
}
