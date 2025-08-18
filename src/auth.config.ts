import type { NextAuthConfig } from "next-auth";

// 仅用于中间件的最小配置，不包含 providers 和 adapter
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
  },
  providers: [], // 空数组，中间件不需要实际的 providers
  callbacks: {
    async authorized({ auth, request }) {
      const { nextUrl } = request as unknown as { nextUrl: URL };
      const isLoggedIn = !!auth?.user;
      const publicPrefixes = ["/", "/login", "/verify", "/albums", "/notes", "/timeline"]; // /notes/[id] 也会被匹配
      const isPublic = publicPrefixes.some((p) => nextUrl.pathname === p || nextUrl.pathname.startsWith(p + "/"));
      // 开发环境允许访问 /admin 以便测试
      if (process.env.NODE_ENV !== "production" && nextUrl.pathname.startsWith("/admin")) return true;
      if (isPublic) return true;
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;