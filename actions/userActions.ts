import { prun } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function User() {
  const user = await currentUser();
  return await {
    user,
  };
}

export async function createUser(userData: any) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found.");
  }
  return await prun.user.create({
    data: userData,
  });
}

export async function checkUserInDb(clerkId: string) {
  const checkUserAlreadyExists = await prun.user.findFirst({
    where: {
      clerkId: clerkId,
    },
  });
  if (checkUserAlreadyExists) {
    return new NextResponse(
      JSON.stringify({
        message: "User already exists!",
      })
    );
  }
}
