import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export async function User() {
  const user = await currentUser();
  return await(
    {
      user
    }
  )
}

export async function createUser(userData: any) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found.");
  }

  return await prisma.user.create({
    data: userData,
  });
}

export async function getUserById(userId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found.");
  }

  const getuser = await prisma.user.findUnique({
    where: { id: userId },
  });
  return getuser;
}
