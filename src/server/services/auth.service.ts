import bcrypt from "bcryptjs";

import { ErrorCode } from "~/lib/errorCodes";
import * as userService from "~/server/services/user.service";

export async function authorize(credentials: { email: string; password: string }) {
  const user = await userService.findUniqueSensitive({
    email: credentials.email.toLowerCase(),
  });

  if (!user || !user.password || !(await bcrypt.compare(credentials.password, user.password)))
    throw new Error(ErrorCode.InvalidEmailOrPassword);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    orgId: user.orgId,
  };
}

/*
  Helper functions
*/
//CLEANUP
// import { HttpError } from "@calcom/lib/http-error";
// export async function hashPassword(password: string) {
//   const hashedPassword = await hash(password, 12);
//   return hashedPassword;
// }
// export function validPassword(password: string) {
//   if (password.length < 7) return false;
//   if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) return false;
//   if (!/\d+/.test(password)) return false;
//   return true;
// }
// export async function getSession(options: GetSessionParams): Promise<Session | null> {
//   const session = await getSessionInner(options);
//   // that these are equal are ensured in `[...nextauth]`'s callback
//   return session as Session | null;
// }
// export function isPasswordValid(password: string): boolean;
// export function isPasswordValid(
//   password: string,
//   breakdown: boolean,
//   strict?: boolean
// ): { caplow: boolean; num: boolean; min: boolean; admin_min: boolean };
// export function isPasswordValid(password: string, breakdown?: boolean, strict?: boolean) {
//   let cap = false, // Has uppercase characters
//     low = false, // Has lowercase characters
//     num = false, // At least one number
//     min = false, // Eight characters, or fifteen in strict mode.
//     admin_min = false;
//   if (password.length > 7 && (!strict || password.length > 14)) min = true;
//   if (strict && password.length > 14) admin_min = true;
//   for (let i = 0; i < password.length; i++) {
//     if (!isNaN(parseInt(password[i]))) num = true;
//     else {
//       if (password[i] === password[i].toUpperCase()) cap = true;
//       if (password[i] === password[i].toLowerCase()) low = true;
//     }
//   }
//   return !!breakdown ? { caplow: cap && low, num, min, admin_min } : cap && low && num && min;
// }
// type CtxOrReq = { req: NextApiRequest; ctx?: never } | { ctx: { req: NextApiRequest }; req?: never };
// export const ensureSession = async (ctxOrReq: CtxOrReq) => {
//   const session = await getSession(ctxOrReq);
//   if (!session?.user.id) throw new HttpError({ statusCode: 401, message: "Unauthorized" });
//   return session;
// };
