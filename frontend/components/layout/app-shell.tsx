import { SideNav } from './side-nav'
import { TopNav } from './top-nav'

interface AppShellProps {
  children: React.ReactNode
  title?: string
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg-page">
      <SideNav />
      <TopNav title={title} />
      <main
        className="ml-[260px] pt-16 min-h-screen"
        id="main-content"
      >
        <div className="px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
