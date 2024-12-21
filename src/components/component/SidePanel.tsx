"use client";
import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Settings, MessageSquare, Home } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  MyContext,
  MyContextData,
} from "@/components/component/ContextProvider";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import getSession from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";

const items = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export const AppSidebar = (session: {
  user: { image: string | null; name: any };
  latestChat: any;
}) => {
  console.log(session);
  const { data, setData } = useContext(MyContext) as MyContextData;
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarHeader>YACA</SidebarHeader>
        <ScrollArea className="h-[70vh] w-[100%]">
          <SidebarMenuButton asChild>
            <span>Previous Chats</span>
          </SidebarMenuButton>
          <SidebarMenuSub>
            {session.latestChat?.map((chat: any) => (
              <>
                <SidebarMenuSubItem key={chat.id}>
                  <SidebarMenuSubButton
                    onClick={() => setData({ ...data, chatId: chat.id })}
                  >
                    <div className="flex items-center gap-2 py-2">
                      <span>{chat.title}</span>
                    </div>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <Separator />
              </>
            ))}
          </SidebarMenuSub>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Sheet>
                    <SheetTrigger>
                      <div className="flex items-center gap-2 py-2">
                        <span>
                          <Settings />
                        </span>
                        <span>Settings</span>
                      </div>
                    </SheetTrigger>
                    <SheetContent side="bottom">
                      <SheetHeader>
                        <SheetTitle>Settings</SheetTitle>
                      </SheetHeader>
                      <Tabs defaultValue="groq" className="w-[400px]">
                        <TabsList>
                          <TabsTrigger value="groq">Groq</TabsTrigger>
                          <TabsTrigger value="password">
                            comming soon ..{" "}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="groq">
                          <div className="h-[75vh] w-full  p-4 ">
                            <GroqSettings />
                          </div>
                        </TabsContent>
                        <TabsContent value="password">
                          <div className="h-[75vh] w-full p-4 ">
                            <GroqSettings />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </SheetContent>
                  </Sheet>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2 py-2">
                    {session?.user?.image && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image}
                          alt="User avatar"
                        />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-sm font-medium">
                      {session?.user?.name || "Guest"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left"
                  >
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

// Move these settings components to /app/settings/page.tsx
const GroqSettings = () => {
  const { data, setData } = useContext(MyContext) as MyContextData;
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="accessToken">Access Token </Label>
        <Input
          className="w-[150px] bg-secondary"
          id="accessToken"
          type="password"
          placeholder="sk-xxxxxxxxxxxxxxxxxx"
          value={data.groq_access_token}
          onChange={(e) =>
            setData((previous: any) => ({
              ...previous,
              groq_access_token: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <Label className="">Model</Label>
        <Select
          value={data.groq_model}
          onValueChange={(value) =>
            setData((previous: any) => ({ ...previous, groq_model: value }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemma2-9b-it">gemma2-9b-it</SelectItem>
            <SelectItem value="mixtral-8x7b-32768">
              mixtral-8x7b-32768
            </SelectItem>
            <SelectItem value="llama3-70b-8192">llama3-70b-8192</SelectItem>
            <SelectItem value="llama-3.1-8b-instant">
              llama-3.1-8b-instant
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const LocalModelSettings = () => {
  const { data, setData } = useContext(MyContext) as MyContextData;
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="">Model</Label>
        <Select
          value={data.model_id}
          onValueChange={(value) =>
            setData((previous: any) => ({ ...previous, model_id: value }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="phi_1_5_q4k">
              Phi-1.5-4bit-qunatized (800 MB)
            </SelectItem>
            <SelectItem value="phi_1_5_q80">
              Phi-1.5-8bit-quantized (1.51 GB)
            </SelectItem>
            <SelectItem value="puffin_phi_v2_q4k">
              Puffin-Phi-V2-4bit-quanitized (798 MB)
            </SelectItem>
            <SelectItem value="puffin_phi_v2_q80">
              Puffin-Phi-V2-8bit-quanitized (1.50 GB)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Label className="">Temperature : {data.Temperature}</Label>
      <Slider
        defaultValue={[data.Temperature]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={(value) => {
          setData((previous: any) => ({
            ...previous,
            Temperature: value[0],
          }));
        }}
      />
      <Label className="">top_p : {data.top_p}</Label>
      <Slider
        defaultValue={[data.top_p]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={(value) =>
          setData((previous: any) => ({ ...previous, top_p: value[0] }))
        }
      />
      <Label className="">Repeat Penalty : {data.repeat_penalty}</Label>
      <Slider
        defaultValue={[data.repeat_penalty]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={(value) =>
          setData((previous: any) => ({
            ...previous,
            repeat_penalty: value[0],
          }))
        }
      />
      <Label className="">Max Sequence Length : {data.max_seq_len}</Label>
      <Slider
        defaultValue={[data.max_seq_len]}
        max={2048}
        min={1}
        step={1}
        onValueChange={(value) =>
          setData((previous: any) => ({
            ...previous,
            max_seq_len: value[0],
          }))
        }
      />
      <Label className="">Seed : {data.seed}</Label>
      <Slider
        defaultValue={[data.seed]}
        max={4000000000}
        min={1}
        step={100}
        onValueChange={(value) =>
          setData((previous: any) => ({ ...previous, seed: value[0] }))
        }
      />
    </>
  );
};
