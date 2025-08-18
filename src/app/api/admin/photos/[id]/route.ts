import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updatePhotoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url("请输入有效的图片链接").optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

// 更新指定照片（仅限本人）
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const data = updatePhotoSchema.parse(body);

    // 校验归属
    const exists = await prisma.photo.findFirst({ where: { id, authorId: user.id } });
    if (!exists) return NextResponse.json({ error: "无权操作或资源不存在" }, { status: 404 });

    const updated = await prisma.photo.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : data.tags === undefined ? undefined : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "数据验证失败", details: error.issues }, { status: 400 });
    }
    console.error("更新照片失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 删除指定照片（仅限本人）
export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = params.id;

    // 校验归属
    const exists = await prisma.photo.findFirst({ where: { id, authorId: user.id } });
    if (!exists) return NextResponse.json({ error: "无权操作或资源不存在" }, { status: 404 });

    await prisma.photo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("删除照片失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}