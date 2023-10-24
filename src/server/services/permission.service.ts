import { UserRole } from "@prisma/client";

import { type Context } from "~/server/api/context";

export const isAdmin = (ctx: Context): boolean => {
  return ctx.session?.user?.role === UserRole.Admin;
};

export function canUpdate(ctx: Context, permittedUserId: number): boolean {
  if (!ctx.session) return false;

  if (!permittedUserId) throw new Error("PermittedUserId has not been provided.");
  if (ctx.session.user?.id === permittedUserId) return true;

  return isAdmin(ctx);
}
