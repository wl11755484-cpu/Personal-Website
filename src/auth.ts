import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "./generated/prisma";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

const hasSmtp = Boolean(
  process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_SERVER_USER &&
    process.env.EMAIL_SERVER_PASSWORD &&
    (process.env.EMAIL_FROM || "")
);

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    // 开发者登录（仅在非生产环境启用）
    ...(process.env.NODE_ENV !== "production"
      ? [
          CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              try {
                const email = String(credentials?.email || "").trim().toLowerCase();
                const password = String(credentials?.password || "");
                const devEmail = process.env.DEV_ADMIN_EMAIL;
                const devPassword = process.env.DEV_ADMIN_PASSWORD;
                if (!devEmail || !devPassword) return null;
                if (email !== devEmail || password !== devPassword) return null;
                const user = await prisma.user.upsert({
                  where: { email },
                  update: {},
                  create: { email, name: "Developer" },
                });
                return { id: user.id, name: user.name ?? undefined, email: user.email };
              } catch (e) {
                console.error("Credentials authorize failed:", e);
                return null;
              }
            },
          }),
        ]
      : []),
    // 只有在有 SMTP 配置时才启用 EmailProvider
    ...(hasSmtp
      ? [
          EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST!,
              port: Number(process.env.EMAIL_SERVER_PORT || 587),
              auth: {
                user: process.env.EMAIL_SERVER_USER!,
                pass: process.env.EMAIL_SERVER_PASSWORD!,
              },
            },
            from: process.env.EMAIL_FROM!,
            maxAge: 10 * 60, // 10 minutes
            normalizeIdentifier(identifier) {
              return identifier.trim().toLowerCase();
            },
          }),
        ]
      : []),
  ],
});

export const { GET, POST } = handlers;