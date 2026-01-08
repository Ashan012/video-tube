import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export { default } from "next-auth/middleware";

const protectedRoutes = ["/feed", "/u", "/v", "/setting"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => {
    return pathname.startsWith(route);
  });
  const isAuthPage = authRoutes.some((route) => {
    return pathname.startsWith(route);
  });

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
