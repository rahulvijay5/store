import { prun } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  console.log("I got here!");
  const clerk: string | null = searchParams.get("clerk");
  if (clerk) {
    console.log(clerk);
    try {
      const user = await prun.user.findUnique({
        where: {
          clerkId: clerk,
        },
      });
      if (!user) {
        return NextResponse.json({
          message: "User not registered",
          status: 404,
        });
      }
      return NextResponse.json({ message: user.id, status: 200 });
    } catch (error) {
      console.error("Error finding the user: ", error);
      throw error;
    }
  }
}

// const response = await fetch("/api/s3Url", { method: "GET" });
// const res = await fetch(`/api/videos/search?query=${debouncedSearch}`)
// await fetch(videoUrl, {
//     method: "PUT",
//     body: video,
//     headers: {
//       "Content-Type": "multipart/form-data"
//     }
//   });
