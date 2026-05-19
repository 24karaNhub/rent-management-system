import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <div className="hidden md:flex md:flex-shrink-0 z-20">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden z-10 relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
          <div className="max-w-7xl mx-auto h-full">
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
