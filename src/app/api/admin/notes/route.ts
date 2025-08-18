import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  isPublic: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const data = createNoteSchema.parse(body);

    const note = await prisma.note.create({
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        authorId: user.id,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "数据验证失败", details: error.issues }, { status: 400 });
    }
    console.error("创建笔记失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("获取笔记失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}