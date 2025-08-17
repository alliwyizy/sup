
import * as React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-muted/40">
        {children}
    </main>
  )
}
