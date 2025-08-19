import { requireAdmin } from "@/lib/auth-helpers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { error } = await requireAdmin();
  if (error) {
    redirect("/login");
  }

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <aside className="rounded-[6px] border p-4 h-fit">
        <div className="text-sm font-medium mb-3">后台管理</div>
        <nav className="text-sm space-y-2">
          <Link href="/admin" className="block hover:opacity-80">仪表盘</Link>
          <Link href="/admin/photos" className="block hover:opacity-80">照片</Link>
          <Link href="/admin/notes" className="block hover:opacity-80">笔记</Link>
          <Link href="/admin/timeline" className="block hover:opacity-80">时间轴</Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}