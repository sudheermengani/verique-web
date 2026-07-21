import { NextRequest, NextResponse } from "next/server";

import { createClientSession, verifyMagicToken } from "@/lib/ops/auth";
import { touchClientUserLogin, findClientByEmail } from "@/lib/ops/queries";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const verified = verifyMagicToken(token);
  const loginUrl = new URL("/client/login", request.url);

  if (!verified) {
    loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  // Re-check the email is still authorised for this client (in case access
  // was revoked after the link was sent).
  const slug = await findClientByEmail(verified.email);
  if (slug !== verified.slug) {
    return NextResponse.redirect(loginUrl);
  }

  await createClientSession(verified.email, verified.slug);
  await touchClientUserLogin(verified.email);
  return NextResponse.redirect(new URL(`/client/${verified.slug}`, request.url));
}
