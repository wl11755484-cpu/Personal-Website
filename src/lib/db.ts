import { PrismaClient } from "@/generated/prisma";

// 全局 Prisma 实例，避免开发环境重复创建
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 通用查询帮助函数
export const queries = {
  // 获取用户信息
  getUserByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),

  // 相册相关
  getPublicPhotos: (limit = 10, offset = 0) =>
    prisma.photo.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    }),

  getPhotoById: (id: string, userId?: string) =>
    prisma.photo.findFirst({
      where: {
        id,
        OR: [
          { isPublic: true },
          { authorId: userId },
        ],
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    }),

  // 笔记相关
  getPublicNotes: (limit = 10, offset = 0) =>
    prisma.note.findMany({
      where: { isPublic: true, status: "published" },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        author: {
          select: { name: true, email: true },
        },
      },
    }),

  getNoteById: (id: string, userId?: string) =>
    prisma.note.findFirst({
      where: {
        id,
        OR: [
          { isPublic: true, status: "published" },
          { authorId: userId },
        ],
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    }),

  // 时间轴相关
  getPublicTimelineItems: (limit = 20, offset = 0) =>
    prisma.timelineItem.findMany({
      where: { visibility: "public" },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    }),
};

export type PhotoWithAuthor = NonNullable<Awaited<ReturnType<typeof queries.getPhotoById>>>;
export type NoteWithAuthor = NonNullable<Awaited<ReturnType<typeof queries.getNoteById>>>;
export type TimelineItemWithAuthor = Awaited<ReturnType<typeof queries.getPublicTimelineItems>>[0];