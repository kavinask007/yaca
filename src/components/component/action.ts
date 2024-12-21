"use server";
import getSession from "@/auth";
import prisma from "@/lib/prisma";
export async function createChat() {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
        throw Error("Unauthorized");
      }
    
    return await prisma.chat.create({
    data: {
      title: "New Chat",
      userId: userId, // Assuming you have the user ID in your context
    },
  })
}