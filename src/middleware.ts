import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  // 允许无需登录访问的公开路径
  const publicPrefixes = ["/", "/login", "/verify", "/albums", "/notes", "/timeline"]; // /notes/[id] 也会被匹配
  const isPublicRoute = publicPrefixes.some((p) => nextUrl.pathname === p || nextUrl.pathname.startsWith(p + "/"));

  const isAuthRoute = nextUrl.pathname === "/login";

  // 允许 API 认证路由通过
  if (isApiAuthRoute) {
    return null;
  }

  // 如果已登录且访问登录页，重定向到首页
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // 如果未登录且访问受保护路由，重定向到登录页
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};