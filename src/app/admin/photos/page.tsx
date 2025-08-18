import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function createPhoto(formData: FormData) {
  "use server";
  const { user, error } = await requireAdmin();
  if (error || !user) return;

  const title = String(formData.get("title") || "");
  const url = String(formData.get("url") || "");
  const description = String(formData.get("description") || "");
  const tags = String(formData.get("tags") || "").split(",").map(t => t.trim()).filter(Boolean);
  const isPublic = formData.get("isPublic") === "on";

  await fetch('/api/admin/photos', {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookies().toString() },
    body: JSON.stringify({ title, url, description, tags, isPublic }),
    cache: "no-store",
  });

  revalidatePath("/admin/photos");
}

async function updatePhoto(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;
  const title = String(formData.get("title") || "");
  const url = String(formData.get("url") || "");
  const description = String(formData.get("description") || "");
  const tags = String(formData.get("tags") || "").split(",").map(t => t.trim()).filter(Boolean);
  const isPublic = formData.get("isPublic") === "on";

  await fetch(`/api/admin/photos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookies().toString() },
    body: JSON.stringify({ title, url, description, tags, isPublic }),
    cache: "no-store",
  });

  revalidatePath("/admin/photos");
}

async function deletePhoto(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;

  await fetch(`/api/admin/photos/${id}`, {
    method: "DELETE",
    headers: { Cookie: cookies().toString() },
    cache: "no-store",
  });

  revalidatePath("/admin/photos");
}

export default async function AdminPhotosPage() {
  const { user, error } = await requireAdmin();
  if (error) {
    redirect("/login");
  }

  const photos = await prisma.photo.findMany({
    where: { authorId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">照片管理</h1>

      <form action={createPhoto} className="rounded-[6px] border p-4 grid gap-3 md:grid-cols-2">
        <input name="title" placeholder="标题（可选）" className="rounded border px-3 py-2 bg-transparent" />
        <input name="url" placeholder="图片链接（必填）" required className="rounded border px-3 py-2 bg-transparent" />
        <input name="description" placeholder="描述（可选）" className="rounded border px-3 py-2 bg-transparent md:col-span-2" />
        <input name="tags" placeholder="标签，逗号分隔（可选）" className="rounded border px-3 py-2 bg-transparent md:col-span-2" />
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="isPublic" defaultChecked />公开
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="rounded border px-3 py-2">新增照片</button>
        </div>
      </form>

      <div className="rounded-[6px] border divide-y">
        {photos.length === 0 ? (
          <div className="p-4 text-sm opacity-70">暂无照片，请通过上方表单添加。</div>
        ) : (
          photos.map((p) => (
            <div key={p.id} className="p-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="font-medium">{p.title ?? "无标题"}</div>
                  <div className="text-xs opacity-70">{new Date(p.createdAt).toLocaleString()} · {p.isPublic ? "公开" : "私密"}</div>
                </div>
                <div className="flex gap-2">
                  <form action={deletePhoto}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-sm rounded border px-3 py-1">删除</button>
                  </form>
                </div>
              </div>

              <details className="mt-3">
                <summary className="text-sm rounded border px-3 py-1 inline-block cursor-pointer select-none">编辑</summary>
                <form action={updatePhoto} className="mt-3 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input name="title" defaultValue={p.title ?? ""} placeholder="标题（可选）" className="rounded border px-3 py-2 bg-transparent" />
                  <input name="url" defaultValue={p.url} required placeholder="图片链接（必填）" className="rounded border px-3 py-2 bg-transparent" />
                  <textarea name="description" defaultValue={p.description ?? ""} placeholder="描述（可选）" className="rounded border px-3 py-2 bg-transparent md:col-span-2 min-h-[80px]" />
                  <input name="tags" defaultValue={p.tags ? (JSON.parse(p.tags) as string[]).join(",") : ""} placeholder="标签，逗号分隔（可选）" className="rounded border px-3 py-2 bg-transparent md:col-span-2" />
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" name="isPublic" defaultChecked={p.isPublic} />公开
                  </label>
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