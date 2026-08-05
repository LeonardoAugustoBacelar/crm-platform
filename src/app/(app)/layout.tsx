import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/companies", label: "Empresas" },
  { href: "/contacts", label: "Contatos" },
  { href: "/opportunities", label: "Oportunidades" },
  { href: "/pipelines", label: "Pipeline" },
  { href: "/settings", label: "Configurações" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-neutral-200 p-4 dark:border-neutral-800">
        <div>
          <div className="mb-6 px-2 text-sm font-semibold">CRM Platform</div>
          <nav className="flex flex-col gap-1 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-2">
          <p className="truncate text-xs text-neutral-500">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="mt-1 text-xs text-neutral-500 hover:underline">
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
