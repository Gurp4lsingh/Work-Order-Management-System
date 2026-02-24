import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workorders", label: "Work Orders" },
  { href: "/workorders/create", label: "Create" },
  { href: "/data-transfer", label: "Data Transfer" },
  { href: "/help", label: "Help" },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <aside className="sidebar">
      <h1>WorkOrderHub</h1>
      <nav>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={router.pathname === l.href ? "nav-link active" : "nav-link"}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
