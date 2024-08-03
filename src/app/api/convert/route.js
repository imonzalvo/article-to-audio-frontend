import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { link } = await req.json();

  // Here you would typically call your article-to-audio conversion service
  // For now, we'll just simulate a successful conversion
  console.log(`Converting article: ${link}`);

  return NextResponse.json({ success: true, message: "Conversion started" });
}
