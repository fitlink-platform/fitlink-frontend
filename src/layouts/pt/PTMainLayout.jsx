// src/layouts/pt/PTMainLayout.jsx
import { useState } from 'react'
import PTTopbar from '~/components/pt/PTTopbar'       // component header của bạn (h-16 = 64px)
import PTSidebar from '~/components/pt/PTSidebar'     // sidebar của bạn

export default function PTMainLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Topbar cố định */}
      <PTTopbar onToggleSidebar={() => setOpenSidebar(s => !s)} />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:py-8">
        {/* Sidebar có scroll riêng nếu menu dài */}
        <div className="shrink-0">
          <PTSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />
        </div>

        {/* 🎯 Content: có scroll riêng, không ảnh hưởng layout */}
        <main
          className="
            w-full
            h-[calc(100vh-64px)]             /* 64px = h-16 của Topbar */
            overflow-y-auto
            pr-2                              /* tránh che bởi scrollbar */
          "
        >
          {children}
          {/* Footer nằm trong vùng scroll của content */}
          <div className="py-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} FitLink Coach — PT Dashboard
          </div>
        </main>
      </div>
    </div>
  )
}
