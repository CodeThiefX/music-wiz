import { NextRequest, NextResponse } from "next/server";
import { head, put } from "@vercel/blob";

type LeaderboardEntry = {
  name: string;
  score: number;
  instruments: string[];
  difficulty: string;
};

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN environment variable is not set." },
      { status: 500 }
    );
  }
  const { name, score, instruments, difficulty } = await req.json();

  if (
    !name ||
    typeof score !== "number" ||
    !Array.isArray(instruments) ||
    !difficulty
  ) {
    return NextResponse.json(
      { error: "Name, score, instruments, and difficulty are required" },
      { status: 400 }
    );
  }

  try {
    let blob;
    try {
      blob = await head("leaderboard.json");
    } catch (error) {
      // File doesn't exist. blob is undefined.
      // The next block will handle creation.
    }

    if (!blob) {
      // This block now runs if head() fails (file not found)
      await put(
        "leaderboard.json",
        JSON.stringify([{ name, score, instruments, difficulty }]),
        {
          access: "public",
          allowOverwrite: true,
        }
      );
    } else {
      // This block runs if head() succeeds
      const { url } = blob;
      const response = await fetch(url);
      const leaderboard: LeaderboardEntry[] = await response.json();

      leaderboard.push({ name, score, instruments, difficulty });
      leaderboard.sort((a, b) => b.score - a.score);

      const top100 = leaderboard.slice(0, 100);

      await put("leaderboard.json", JSON.stringify(top100), {
        access: "public",
        allowOverwrite: true,
      });
    }

    return NextResponse.json({ message: "Score saved successfully" });
  } catch {
    console.error("An unknown error occurred.");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN environment variable is not set." },
      { status: 500 }
    );
  }
  try {
    const blob = await head("leaderboard.json");

    if (!blob) {
      return NextResponse.json([]);
    }

    const { url } = blob;
    const response = await fetch(url);
    const leaderboard = await response.json();

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
