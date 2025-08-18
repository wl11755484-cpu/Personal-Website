import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createTimelineSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional(),
  date: z.string().transform((v) => new Date(v)),
  visibility: z.enum(["public", "private"]).default("public"),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const data = createTimelineSchema.parse(body);

    const item = await prisma.timelineItem.create({
      data: {
        ...data,
        authorId: user.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "数据验证失败", details: error.issues }, { status: 400 });
    }
    console.error("创建时间轴失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const items = await prisma.timelineItem.findMany({
      where: { authorId: user.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("获取时间轴失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}