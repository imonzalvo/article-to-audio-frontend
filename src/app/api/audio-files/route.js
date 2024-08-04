import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = session.accessToken;

  if (!token) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/articles/audio-keys`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle response errors
      const errorData = await response.json();

      console.error("Error fetching audio keys:", errorData);

      if (response.status === 401) {
        // Token is invalid or expired
        return NextResponse.json(
          { error: "Authentication failed", signOut: true },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch audio keys" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error during fetch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
