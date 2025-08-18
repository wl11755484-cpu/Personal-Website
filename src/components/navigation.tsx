import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Navigation() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="flex items-center gap-4 text-sm">
      <Link href="/" className="hover:opacity-80">首页</Link>
      <Link href="/albums" className="hover:opacity-80">相册</Link>
      <Link href="/notes" className="hover:opacity-80">笔记</Link>
      <Link href="/timeline" className="hover:opacity-80">时间轴</Link>
      <Link href="/about" className="hover:opacity-80">关于我</Link>
      
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70">{user.email}</span>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button 
              type="submit"
              className="text-xs rounded border px-3 py-1 hover:bg-[color-mix(in_oklab,var(--fg),transparent_95%)]"
            >
              登出
            </button>
          </form>
        </div>
      ) : (
        <Link href="/login" prefetch={false} className="rounded border px-3 py-1 hover:bg-[color-mix(in_oklab,var(--fg),transparent_95%)]">登录</Link>
      )}
    </nav>
  );
}