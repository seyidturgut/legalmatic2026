import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = "Legal**2026";

export function middleware(req: NextRequest) {
    const auth = req.headers.get("authorization");

    if (auth?.startsWith("Basic ")) {
        const decoded = atob(auth.slice(6));
        const [, password] = decoded.split(":");
        if (password === SITE_PASSWORD) {
            return NextResponse.next();
        }
    }

    return new NextResponse("Authentication required", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Restricted", charset="UTF-8"',
        },
    });
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
