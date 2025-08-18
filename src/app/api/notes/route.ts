import { NextRequest, NextResponse } from "next/server";
import { queries } from "@/lib/db";
import { z } from "zod";

const querySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
});

// 获取公开笔记列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
    });

    const notes = await queries.getPublicNotes(
      query.limit || 20,
      query.offset || 0
    );

    return NextResponse.json({
      success: true,
      data: notes,
      pagination: {
        limit: query.limit || 20,
        offset: query.offset || 0,
        total: notes.length,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "参数验证失败", details: error.issues },
        { status: 400 }
      );
    }
    console.error("获取笔记列表失败:", error);
    return NextResponse.json(
      { success: false, error: "服务器错误" },
      { status: 500 }
    );
  }
}