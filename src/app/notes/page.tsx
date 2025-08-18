import Link from "next/link";
import { queries } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await queries.getPublicNotes(20);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">笔记</h1>
        <div className="text-sm opacity-70">{notes.length} 篇</div>
      </div>
      {notes.length === 0 ? (
        <p className="text-sm opacity-70">暂无公开笔记。</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((n) => (
            <li key={n.id} className="rounded-[6px] border p-4">
              <Link href={`/notes/${n.id}`} className="text-base font-medium hover:opacity-80">
                {n.title}
              </Link>
              <div className="text-xs opacity-70 mt-1">
                {n.author?.name ?? n.author?.email ?? "匿名"} · {new Date(n.createdAt).toLocaleDateString()}
              </div>
              {/* 内容摘要 */}
              {n.content && (
                <div className="text-sm opacity-90 mt-2 line-clamp-2 whitespace-pre-wrap">{n.content}</div>
              )}
              {/* 标签展示（安全解析） */}
              {(() => {
                try {
                  const tags = n.tags ? JSON.parse(n.tags) : [];
                  return Array.isArray(tags) && tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.slice(0, 5).map((tag: string, idx: number) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-[color-mix(in_oklab,var(--fg),transparent_94%)] rounded">#{tag}</span>
                      ))}
                    </div>
                  ) : null;
                } catch {
                  return null;
                }
              })()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}