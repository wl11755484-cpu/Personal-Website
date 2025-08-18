import { queries } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const items = await queries.getPublicTimelineItems(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">时间轴</h1>
        <div className="text-sm opacity-70">{items.length} 条记录</div>
      </div>
      {items.length === 0 ? (
        <div className="rounded-[6px] border p-8 text-center text-sm opacity-70">暂无公开条目</div>
      ) : (
        <ul className="space-y-4">
          {items.map((it) => (
            <li key={it.id} className="rounded-[6px] border p-4">
              <div className="flex items-start gap-3">
                <div className="text-xs opacity-60 whitespace-nowrap mt-0.5">
                  {new Date(it.date).toLocaleDateString()} {new Date(it.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-base font-medium">{it.title}</div>
                    <span className="text-[10px] uppercase tracking-wide opacity-70 px-2 py-0.5 bg-[color-mix(in_oklab,var(--fg),transparent_94%)] rounded">{it.type}</span>
                  </div>
                  {it.content ? (
                    <div className="text-sm opacity-90 mt-1 whitespace-pre-wrap">{it.content}</div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}