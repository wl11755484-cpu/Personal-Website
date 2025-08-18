import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateTimelineSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  date: z.string().transform((v) => new Date(v)).optional(),
  visibility: z.enum(["public", "private"]).optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const data = updateTimelineSchema.parse(body);

    const exists = await prisma.timelineItem.findFirst({ where: { id, authorId: user.id } });
    if (!exists) return NextResponse.json({ error: "无权操作或资源不存在" }, { status: 404 });

    const updated = await prisma.timelineItem.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "数据验证失败", details: error.issues }, { status: 400 });
    }
    console.error("更新时间轴失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = params.id;

    const exists = await prisma.timelineItem.findFirst({ where: { id, authorId: user.id } });
    if (!exists) return NextResponse.json({ error: "无权操作或资源不存在" }, { status: 404 });

    await prisma.timelineItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("删除时间轴失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}