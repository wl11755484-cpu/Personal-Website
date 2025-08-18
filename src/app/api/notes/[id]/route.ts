import { NextRequest, NextResponse } from "next/server";
import { queries } from "@/lib/db";
import { auth } from "@/auth";

// 获取单个笔记详情
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    // 获取当前用户信息（如果已登录）
    const session = await auth();
    const userId = session?.user?.id;

    const note = await queries.getNoteById(id, userId);

    if (!note) {
      return NextResponse.json(
        { success: false, error: "笔记不存在或无权访问" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error("获取笔记详情失败:", error);
    return NextResponse.json(
      { success: false, error: "服务器错误" },
      { status: 500 }
    );
  }
}