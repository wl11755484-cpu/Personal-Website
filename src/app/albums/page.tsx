import { queries } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AlbumsPage() {
  const photos = await queries.getPublicPhotos(24);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">相册</h1>
        <div className="text-sm opacity-70">{photos.length} 张照片</div>
      </div>
      {photos.length === 0 ? (
        <div className="rounded-[6px] border p-8 text-center space-y-2">
          <div className="text-sm opacity-70">暂无公开照片</div>
          <div className="text-xs opacity-50">内容将在有新照片时显示</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <figure key={p.id} className="rounded-[6px] overflow-hidden border hover:border-[color-mix(in_oklab,var(--fg),transparent_70%)] transition-colors">
              <div className="aspect-square bg-[color-mix(in_oklab,var(--fg),transparent_94%)] flex items-center justify-center relative group">
                {/* 占位图标或标题 */}
                <div className="text-lg opacity-60">{p.title?.slice(0, 2) || "📷"}</div>
                {/* 当有 URL 时显示图片，目前为占位样式 */}
                {p.url && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <figcaption className="p-3 text-sm space-y-1">
                <div className="font-medium line-clamp-1">{p.title || "无标题"}</div>
                <div className="text-xs opacity-70 flex items-center justify-between">
                  <span>{p.author?.name || p.author?.email || "匿名"}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                {p.description && (
                  <div className="text-xs opacity-60 line-clamp-2">{p.description}</div>
                )}
                {(() => {
                  try {
                    const tags = p.tags ? JSON.parse(p.tags) : [];
                    return Array.isArray(tags) && tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-[color-mix(in_oklab,var(--fg),transparent_94%)] rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null;
                  } catch {
                    return null;
                  }
                })()}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}