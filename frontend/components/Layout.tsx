import Link from "next/link";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <Topbar />
        <section>{children}</section>
      </main>
    </div>
  );
}

export function HomeShortcut() {
  return (
    <Link href="/dashboard" className="btn-link">
      Go to Dashboard
    </Link>
  );
}
