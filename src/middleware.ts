import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse, userAgent } from "next/server";

import { isNumber } from "~/lib/common";

//Limit the middleware to the following paths
export const config = {
  matcher: ["/admin/:path*", "/org/:path*"],
};

export async function middleware(req: NextRequest) {
  const { isBot } = userAgent(req);
  if (isBot) {
    return NextResponse.next({ status: 400 });
  }

  const token = await getToken({ req });

  if (!token) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  if (token.role === "ADMIN") return NextResponse.next();

  const { pathname } = req.nextUrl;
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] == "org") {
    if (parts.length > 1 && isNumber(parts[1])) {
      const orgId = parseInt(parts[1] as string, 10);

      if (token.orgId === orgId) {
        return NextResponse.next();
      }
    }
  }
  return new NextResponse("UNAUTHORIZED", {
    status: 403,
    statusText: "Unauthorized!",
  });
}
