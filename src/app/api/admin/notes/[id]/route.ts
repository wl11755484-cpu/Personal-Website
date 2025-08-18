import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
  isPublic: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const data = updateNoteSchema.parse(body);

    // 校验归属
    const exists = await prisma.note.findFirst({ where: { id, authorId: user.id } });
    if (!exists) return NextResponse.json({ error: "无权操作或资源不存在" }, { status: 404 });

    const updated = await prisma.note.update({
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
    console.error("更新笔记失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = params.id;

    // 校验归属
    const exists = await prisma.note.findFirst({ where: { id, authorId: user.id } });
    if (!exists) return NextResponse.json({ error: "无权操作或资源不存在" }, { status: 404 });

    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("删除笔记失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}