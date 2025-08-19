import { queries } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const [photos, notes, items] = await Promise.all([
    queries.getPublicPhotos(6),
    queries.getPublicNotes(5),
    queries.getPublicTimelineItems(5),
  ]);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">欢迎回来 👋</h1>
        <p className="text-sm opacity-70">这里是你的私密空间，只对登录且有权限的朋友开放。</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[6px] border p-5 bg-[color-mix(in_oklab,var(--bg),transparent_0%)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium">最近照片</h2>
            <Link href="/albums" className="text-xs opacity-70 hover:opacity-100">查看全部 →</Link>
          </div>
          {photos.length === 0 ? (
            <div className="text-sm opacity-70">暂无照片。</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <div key={p.id} className="aspect-square bg-[color-mix(in_oklab,var(--fg),transparent_94%)] rounded flex items-center justify-center text-xs opacity-80">
                  {p.title?.slice(0, 2) || "📷"}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-[6px] border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium">最新笔记</h2>
            <Link href="/notes" className="text-xs opacity-70 hover:opacity-100">查看全部 →</Link>
          </div>
          {notes.length === 0 ? (
            <div className="text-sm opacity-70">暂无笔记。</div>
          ) : (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id}>
                  <Link href={`/notes/${n.id}`} className="text-sm hover:opacity-80 flex items-start gap-2">
                    <span className="opacity-60 mt-1">·</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{n.title}</div>
                      <div className="text-xs opacity-70">{new Date(n.createdAt).toLocaleDateString()}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-[6px] border p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium">最新动态</h2>
          <Link href="/timeline" className="text-xs opacity-70 hover:opacity-100">查看全部 →</Link>
        </div>
        {items.length === 0 ? (
          <div className="text-sm opacity-70">暂无条目。</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-start gap-3 text-sm">
                <div className="text-xs opacity-60 whitespace-nowrap mt-0.5">
                  {new Date(it.date).toLocaleDateString()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{it.title}</div>
                  {it.content && (
                    <div className="text-xs opacity-70 mt-1 line-clamp-2">{it.content}</div>
                  )}
                </div>
                <span className="text-xs opacity-60 px-2 py-0.5 bg-[color-mix(in_oklab,var(--fg),transparent_94%)] rounded">
                  {it.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
