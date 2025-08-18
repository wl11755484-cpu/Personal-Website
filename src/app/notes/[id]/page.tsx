import Link from "next/link";
import { notFound } from "next/navigation";
import { queries } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  const resolvedParams = await params;
  const note = await queries.getNoteById(resolvedParams.id, userId);
  if (!note) return notFound();

  return (
    <div className="space-y-6">
      {/* 返回导航 */}
      <div className="text-sm">
        <Link href="/notes" className="opacity-70 hover:opacity-100">← 返回笔记列表</Link>
      </div>

      {/* 文章内容 */}
      <article className="prose prose-neutral max-w-none">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">{note.title}</h1>
        <div className="text-xs opacity-70 mb-6">
          {note.author?.name ?? note.author?.email ?? "匿名"} · {new Date(note.createdAt).toLocaleString()}
        </div>

        {/* 标签展示 */}
        {(() => {
          try {
            const tags = note.tags ? JSON.parse(note.tags) : [];
            return Array.isArray(tags) && tags.length > 0 ? (
              <div className="flex flex-wrap gap-1 mb-6">
                {tags.map((tag: string, idx: number) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-[color-mix(in_oklab,var(--fg),transparent_94%)] rounded">#{tag}</span>
                ))}
              </div>
            ) : null;
          } catch {
            return null;
          }
        })()}

        <div className="whitespace-pre-wrap text-[15px] leading-7">
          {note.content}
        </div>
      </article>
    </div>
  );
}