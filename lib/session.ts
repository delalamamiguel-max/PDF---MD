import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/repositories/users";

export async function requireUser() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  return { session, userId };
}

export async function requireAdmin() {
  const { session, userId } = await requireUser();
  const admin = await isUserAdmin({
    userId,
    email: session?.user?.email
  });

  if (!admin) {
    redirect("/dashboard");
  }

  return { session, userId };
}
