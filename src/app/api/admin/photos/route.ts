import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPhotoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url("请输入有效的图片链接"),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const data = createPhotoSchema.parse(body);

    const photo = await prisma.photo.create({
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        authorId: user.id,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "数据验证失败", details: error.issues }, { status: 400 });
    }
    console.error("创建照片失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 获取当前用户的照片列表
export async function GET() {
  try {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const photos = await prisma.photo.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("获取照片失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}