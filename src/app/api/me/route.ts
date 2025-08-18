import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "姓名不能为空").optional(),
  // 可以根据需要添加更多字段
});

// 获取当前用户信息
export async function GET() {
  try {
    const { user, error } = await getCurrentUser();
    if (error) return error;

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json(
      { success: false, error: "服务器错误" },
      { status: 500 }
    );
  }
}

// 更新当前用户信息
export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await getCurrentUser();
    if (error) return error;

    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "数据验证失败", details: error.issues },
        { status: 400 }
      );
    }
    console.error("更新用户信息失败:", error);
    return NextResponse.json(
      { success: false, error: "服务器错误" },
      { status: 500 }
    );
  }
}