// This file should be located at: src/app/api/[...chat]/route.ts
// Using catch-all route [...chat] is better as it can handle all chat-related endpoints:
// - /api/chat/latest
// - /api/chat
// - /api/message
// - /api/message/:id
// This way we can handle all chat functionality under one dynamic route handler
// rather than having separate route files

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req: Request, res: NextApiResponse) {
  if (req.url?.includes("/api/chat/latest")) {
    try {
      console.log("dafsfdajlfdkjasldkfj");
      console.log(req);
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");
      const chatId = url.searchParams.get("chatId");

      console.log("dafsfdajlfdkjasldkfj");
      console.log(userId, chatId);
      const latestChat = await prisma.chat.findFirst({
        where: { userId: userId as string, id: chatId as string },
        orderBy: { updatedAt: "desc" },
        include: {
          messages: {
            include: {
              model: true,
            },
          },
        },
      });
      return NextResponse.json(latestChat);
    } catch (error) {
      console.error("Error fetching latest chat:", error);
      return NextResponse.json({ error: "Failed to fetch latest chat" });
    }
  }
}

export async function POST(req: Request, res: NextApiResponse) {
  if (req.url?.includes("/api/chat/message")) {
    try {
      const data = await req.json();
      // Ensure modelId and chatId are valid before creating the message
      const modelExists = await prisma.model.findUnique({
        where: { id: data.modelId },
      });
      const chatExists = await prisma.chat.findUnique({
        where: { id: data.chatId },
      });
      if (!modelExists) {
        // Create a new model if it doesn't exist
        await prisma.model.create({
          data: {
            id: data.modelId,
            name: "Default Model",
            provider: "Default Provider",
          },
        });
      }
      if (!chatExists) {
        throw new Error("Chat does not exist");
      }
      const message = await prisma.message.create({
        data,
        include: {
          model: true,
        },
      });
      return NextResponse.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      return NextResponse.json({ error: "Failed to create message" });
    }
  }

  if (req.url?.includes("/api/chat")) {
    try {
      const body = await req.json();
      console.log(body);
      const { title, userId } = body;
      console.log("sdafsdfjalkdfalsfdkalfjal===============");
      console.log(title);
      const chat = await prisma.chat.create({
        data: {
          title,
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          messages: {
            include: {
              model: true,
            },
          },
        },
      });
      return NextResponse.json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      return NextResponse.json({ error: "Failed to create chat" });
    }
  }
}

export async function PATCH(req: Request, res: NextApiResponse) {
  if (req.url?.includes("/api/chat/message/")) {
    try {
      const id = req.url.split("/").pop();
      const body = await req.json();
      const { content } = body;
      console.log(content);
      const message = await prisma.message.update({
        where: { id },
        data: { content },
      });
      return NextResponse.json(message);
    } catch (error) {
      console.error("Error updating message:", error);
      return NextResponse.json({ error: "Failed to update message" });
    }
  }
}
