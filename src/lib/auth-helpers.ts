import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * 获取当前用户信息，包含角色校验
 */
export async function getCurrentUser() {
  const session = await auth();
  const email = session?.user?.email;
  
  if (!email) {
    return { error: NextResponse.json({ error: "未授权" }, { status: 401 }), user: null };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, name: true }
  });

  if (!user) {
    return { error: NextResponse.json({ error: "用户不存在" }, { status: 403 }), user: null };
  }

  return { user, error: null };
}

/**
 * 校验当前用户是否为管理员
 */
export async function requireAdmin() {
  const result = await getCurrentUser();
  
  if (result.error) {
    return result;
  }

  if (result.user?.role !== "admin") {
    return { error: NextResponse.json({ error: "需要管理员权限" }, { status: 403 }), user: null };
  }

  return { user: result.user, error: null };
}