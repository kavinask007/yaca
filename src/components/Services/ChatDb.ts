import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.url?.includes('/api/chat/latest')) {
    try {
      const latestChat = await prisma.chat.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          messages: {
            include: {
              model: true
            }
          }
        }
      });
      return res.status(200).json(latestChat);
    } catch (error) {
      console.error("Error fetching latest chat:", error);
      return res.status(500).json({ error: "Failed to fetch latest chat" });
    }
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.url?.includes('/api/message')) {
    try {
      const data = req.body;
      const message = await prisma.message.create({
        data,
        include: {
          model: true,
        },
      });
      return res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      return res.status(500).json({ error: "Failed to create message" });
    }
  }

  if (req.url?.includes('/api/chat')) {
    try {
      const { title, userId } = req.body;
      const chat = await prisma.chat.create({
        data: {
          title,
          user: {
            connect: {
              id: userId
            }
          }
        },
        include: {
          messages: {
            include: {
              model: true
            }
          }
        }
      });
      return res.status(201).json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      return res.status(500).json({ error: "Failed to create chat" });
    }
  }
}

export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  if (req.url?.includes('/api/message/')) {
    try {
      const id = req.url.split('/').pop();
      const { content } = req.body;
      const message = await prisma.message.update({
        where: { id },
        data: { content },
      });
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error updating message:", error);
      return res.status(500).json({ error: "Failed to update message" });
    }
  }
}
