import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const token = session.accessToken;

  if (!token) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url } = body;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(
          `${process.env.API_BASE_URL}/articles/scrape`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ url }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log("error response stream", errorData)
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                error:
                  errorData.message || `HTTP error! status: ${response.status}`,
              }) + "\n"
            )
          );
          controller.close();
          return;
        }

        const reader = response.body.getReader();
        while (true) {
          console.log("while true")

          const { done, value } = await reader.read();
          console.log("reader", value)
          if (done) break;
          controller.enqueue(value);
        }
      } catch (error) {
        console.log("inside catch", error)
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              error: error.message || "Internal Server Error",
            }) + "\n"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
