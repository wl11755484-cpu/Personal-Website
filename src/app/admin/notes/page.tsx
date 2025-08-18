import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function createNote(formData: FormData) {
  "use server";
  const { user, error } = await requireAdmin();
  if (error || !user) return;

  const title = String(formData.get("title") || "");
  const content = String(formData.get("content") || "");
  const tags = String(formData.get("tags") || "").split(",").map(t => t.trim()).filter(Boolean);
  const isPublic = formData.get("isPublic") === "on";
  const status = String(formData.get("status") || "draft");

  await fetch('/api/admin/notes', {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookies().toString() },
    body: JSON.stringify({ title, content, tags, isPublic, status }),
    cache: "no-store",
  });

  revalidatePath("/admin/notes");
}

async function updateNote(formData: FormData) {
  "use server";
  const { user, error } = await requireAdmin();
  if (error || !user) return;

  const id = String(formData.get("id") || "");
  if (!id) return;
  const title = String(formData.get("title") || "");
  const content = String(formData.get("content") || "");
  const tags = String(formData.get("tags") || "").split(",").map(t => t.trim()).filter(Boolean);
  const isPublic = formData.get("isPublic") === "on";
  const status = String(formData.get("status") || "draft");

  await fetch(`/api/admin/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookies().toString() },
    body: JSON.stringify({ title, content, tags, isPublic, status }),
    cache: "no-store",
  });

  revalidatePath("/admin/notes");
}

async function deleteNote(formData: FormData) {
  "use server";
  const { user, error } = await requireAdmin();
  if (error || !user) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  await fetch(`/api/admin/notes/${id}`, {
    method: "DELETE",
    headers: { Cookie: cookies().toString() },
    cache: "no-store",
  });

  revalidatePath("/admin/notes");
}

export default async function AdminNotesPage() {
  const { user, error } = await requireAdmin();
  if (error) {
    redirect("/login");
  }

  const notes = await prisma.note.findMany({
    where: { authorId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">笔记管理</h1>

      <form action={createNote} className="rounded-[6px] border p-4 grid gap-3">
        <input name="title" required placeholder="标题" className="rounded border px-3 py-2 bg-transparent" />
        <textarea name="content" required placeholder="内容" className="rounded border px-3 py-2 bg-transparent min-h-[120px]" />
        <input name="tags" placeholder="标签，逗号分隔（可选）" className="rounded border px-3 py-2 bg-transparent" />
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="isPublic" />公开</label>
          <label className="flex items-center gap-2">状态
            <select name="status" defaultValue="draft" className="rounded border px-2 py-1 bg-transparent">
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </label>
        </div>
        <div>
          <button type="submit" className="rounded border px-3 py-2">新增笔记</button>
        </div>
      </form>

      <div className="rounded-[6px] border divide-y">
        {notes.length === 0 ? (
          <div className="p-4 text-sm opacity-70">暂无笔记，请通过上方表单添加。</div>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="p-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs opacity-70">{new Date(n.createdAt).toLocaleString()} · {n.status} · {n.isPublic ? "公开" : "私密"}</div>
                </div>
                <div className="flex gap-2">
                  <form action={deleteNote}>
                    <input type="hidden" name="id" value={n.id} />
                    <button type="submit" className="text-sm rounded border px-3 py-1">删除</button>
                  </form>
                </div>
              </div>

              <details className="mt-3">
                <summary className="text-sm rounded border px-3 py-1 inline-block cursor-pointer select-none">编辑</summary>
                <form action={updateNote} className="mt-3 grid gap-3">
                  <input type="hidden" name="id" value={n.id} />
                  <input name="title" defaultValue={n.title} required placeholder="标题" className="rounded border px-3 py-2 bg-transparent" />
                  <textarea name="content" defaultValue={n.content} required placeholder="内容" className="rounded border px-3 py-2 bg-transparent min-h-[120px]" />
                  <input name="tags" defaultValue={n.tags ? (JSON.parse(n.tags) as string[]).join(",") : ""} placeholder="标签，逗号分隔（可选）" className="rounded border px-3 py-2 bg-transparent" />
                  <div className="flex items-center gap-3 text-sm">
                    <label className="flex items-center gap-2"><input type="checkbox" name="isPublic" defaultChecked={n.isPublic} />公开</label>
                    <label className="flex items-center gap-2">状态
                      <select name="status" defaultValue={n.status} className="rounded border px-2 py-1 bg-transparent">
                        <option value="draft">草稿</option>
                        <option value="published">已发布</option>
                      </select>
                    </label>
                  </div>
                  <div>
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