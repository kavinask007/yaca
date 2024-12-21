import Image from "next/image";
import getSession from "@/auth";
import { redirect } from "next/navigation";
import { Chat2 } from "@/components/component/chat2";
import { MyContextProvider } from "@/components/component/ContextProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/component/SidePanel";
import prisma from "@/lib/prisma"; // You'll need to create this prisma client instance

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch last 10 chats and their messages for the current user
  let latestChat = null;
  if (session.user?.id) {
    console.log("adfsd")
    latestChat = await prisma.chat.findMany({
      where: { userId: session.user?.id as string },
      orderBy: { createdAt: "desc" },
      take: 15,
      skip: 0,
    });
    console.log(latestChat);
  }
  return (
    <>
      <MyContextProvider>
        <SidebarProvider>
          <AppSidebar
            user={{ image: session.user?.image, name: session.user?.name }}
            latestChat={latestChat}
          />
          <main className="w-screen h-dvh">
            <Chat2 userId={session.user?.id} />
          </main>
        </SidebarProvider>
      </MyContextProvider>
    </>
  );
}
