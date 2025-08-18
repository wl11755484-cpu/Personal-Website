import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-semibold mb-2">登录</h1>
      <p className="text-sm opacity-70 mb-6">请输入你的邮箱，我们会发送魔法链接到你的邮箱。仅白名单邮箱可登录。</p>
      <form
        className="space-y-4"
        action={async (formData: FormData) => {
          "use server";
          const email = String(formData.get("email") || "").trim();
          if (!email) return;
          await signIn("email", { email, redirect: false });
          redirect("/verify");
        }}
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded border px-3 py-2 bg-transparent"
        />
        <button type="submit" className="w-full rounded border px-3 py-2 hover:bg-[color-mix(in_oklab,var(--fg),transparent_95%)]">
          发送登录链接
        </button>
      </form>
      {/* 开发者登录（本地） */}
      <div className="mt-8 border-t pt-6">
        <form
          action={async () => {
            "use server";
            if (process.env.NODE_ENV === "production") return;
            const email = process.env.DEV_ADMIN_EMAIL || "";
            const password = process.env.DEV_ADMIN_PASSWORD || "";
            if (!email || !password) return;
            await signIn("credentials", { email, password, redirect: true, redirectTo: "/" });
          }}
        >
          <button type="submit" className="w-full rounded border px-3 py-2 hover:bg-[color-mix(in_oklab,var(--fg),transparent_95%)]">
            一键开发者登录（本地）
          </button>
        </form>
      </div>
    </div>
  );
}