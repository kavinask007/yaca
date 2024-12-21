import { Sidebar } from "@/components/ui/sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  )
}

