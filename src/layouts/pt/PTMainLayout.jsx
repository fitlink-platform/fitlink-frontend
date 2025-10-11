import { useState } from "react";
import PTTopbar from "~/components/pt/PTTopbar";
import PTSidebar from "~/components/pt/PTSidebar";
import PTFooter from "~/components/pt/PTFooter";

export default function PTMainLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <PTTopbar onToggleSidebar={() => setOpenSidebar((s) => !s)} />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:py-8">
        <PTSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />
        <main className="w-full">{children}</main>
      </div>
      <PTFooter />
    </div>
  );
}
