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
          <div className="max-w-7xl mx-auto h-full animate-fade-in relative">
            {/* Subtle light effects behind main content */}
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[100px] -z-10 rounded-full mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-0 -right-1/4 w-[60%] h-[60%] bg-purple-500/10 blur-[100px] -z-10 rounded-full mix-blend-multiply pointer-events-none"></div>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
