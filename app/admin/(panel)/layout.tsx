import Sidebar from "@/components/admin/Sidebar"
import MobileHeader from "@/components/admin/MobileHeader"
import BottomNav from "@/components/admin/BottomNav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
