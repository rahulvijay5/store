import { prun } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query: string | null = searchParams.get("query");

  if (!query || typeof query !== "string") {
    return NextResponse.json({
      message: "Invalid query parameter",
      status: 400,
    });
  }

  try {
    const users = await prun.user.findMany({
      where: {
        OR: [
            { username: { contains: query, mode: "insensitive" } },
            { businessName: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ]
      },
      select: {
        id: true,
        username: true,
        businessName: true,
        name: true,
      },
    });

    return NextResponse.json({ message: users, status: 400 });
  } catch (error) {
    console.error("Error searching for users: ", error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
