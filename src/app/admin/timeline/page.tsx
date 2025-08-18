import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function createItem(formData: FormData) {
  "use server";
  const { user, error } = await requireAdmin();
  if (error || !user) return;

  const type = String(formData.get("type") || "event");
  const title = String(formData.get("title") || "");
  const content = String(formData.get("content") || "");
  const date = String(formData.get("date") || new Date().toISOString());
  const visibility = String(formData.get("visibility") || "public");

  await fetch(`/api/admin/timeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookies().toString() },
    body: JSON.stringify({ type, title, content, date, visibility }),
    cache: "no-store",
  });

  revalidatePath("/admin/timeline");
}

async function updateItem(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;
  const type = String(formData.get("type") || "event");
  const title = String(formData.get("title") || "");
  const content = String(formData.get("content") || "");
  const date = String(formData.get("date") || new Date().toISOString());
  const visibility = String(formData.get("visibility") || "public");

  await fetch(`/api/admin/timeline/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookies().toString() },
    body: JSON.stringify({ type, title, content, date, visibility }),
    cache: "no-store",
  });

  revalidatePath("/admin/timeline");
}

async function deleteItem(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;

  await fetch(`/api/admin/timeline/${id}`, {
    method: "DELETE",
    headers: { Cookie: cookies().toString() },
    cache: "no-store",
  });

  revalidatePath("/admin/timeline");
}

export default async function AdminTimelinePage() {
  const { user, error } = await requireAdmin();
  if (error) {
    redirect("/login");
  }

  const items = await prisma.timelineItem.findMany({
    where: { authorId: user!.id },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">时间轴管理</h1>

      <form action={createItem} className="rounded-[6px] border p-4 grid gap-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="title" required placeholder="标题" className="rounded border px-3 py-2 bg-transparent" />
          <input name="date" type="datetime-local" className="rounded border px-3 py-2 bg-transparent" />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <input name="type" placeholder="类型（event/milestone/post）" className="rounded border px-3 py-2 bg-transparent" />
          <select name="visibility" defaultValue="public" className="rounded border px-3 py-2 bg-transparent">
            <option value="public">公开</option>
            <option value="private">私密</option>
          </select>
        </div>
        <textarea name="content" placeholder="内容（可选）" className="rounded border px-3 py-2 bg-transparent min-h-[100px]" />
        <div>
          <button type="submit" className="rounded border px-3 py-2">新增时间轴</button>
        </div>
      </form>

      <div className="rounded-[6px] border divide-y">
        {items.length === 0 ? (
          <div className="p-4 text-sm opacity-70">暂无时间轴，请通过上方表单添加。</div>
        ) : (
          items.map((it) => (
            <div key={it.id} className="p-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs opacity-70">{new Date(it.date).toLocaleString()} · {it.type} · {it.visibility}</div>
                </div>
                <div className="flex gap-2">
                  <form action={deleteItem}>
                    <input type="hidden" name="id" value={it.id} />
                    <button type="submit" className="text-sm rounded border px-3 py-1">删除</button>
                  </form>
                </div>
              </div>

              <details className="mt-3">
                <summary className="text-sm rounded border px-3 py-1 inline-block cursor-pointer select-none">编辑</summary>
                <form action={updateItem} className="mt-3 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={it.id} />
                  <input name="title" defaultValue={it.title} required placeholder="标题" className="rounded border px-3 py-2 bg-transparent" />
                  <input name="date" type="datetime-local" defaultValue={new Date(it.date).toISOString().slice(0,16)} className="rounded border px-3 py-2 bg-transparent" />
                  <input name="type" defaultValue={it.type} placeholder="类型（event/milestone/post）" className="rounded border px-3 py-2 bg-transparent" />
                  <select name="visibility" defaultValue={it.visibility} className="rounded border px-3 py-2 bg-transparent">
                    <option value="public">公开</option>
                    <option value="private">私密</option>
                  </select>
                  <textarea name="content" defaultValue={it.content ?? ""} placeholder="内容（可选）" className="rounded border px-3 py-2 bg-transparent md:col-span-2 min-h-[100px]" />
                  <div className="md:col-span-2">
                    <button type="submit" className="rounded border px-3 py-2">保存</button>
                  </div>
                </form>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}