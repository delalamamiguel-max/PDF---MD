import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/repositories/users";

export async function requireAdminRequest() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email;

  if (!userId) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  const admin = await isUserAdmin({ userId, email });
  if (!admin) {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const, userId };
}
