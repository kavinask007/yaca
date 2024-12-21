"use client";

import {
  useState,
  useEffect,
  SetStateAction,
  JSX,
  SVGProps,
  useRef,
  useContext,
} from "react";
import { Bell, MessageCircleX, Send, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as marked from "marked";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/component/theme";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getChatStream } from "@/components/Services/Groq";
import {
  MyContext,
  MyContextData,
} from "@/components/component/ContextProvider";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  role: string;
  createdAt: Date;
  modelId: string;
  inputType: string;
  inputImage?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export function Chat2(userId: any, userimg: any) {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const { data, setData } = useContext(MyContext) as MyContextData;
  console.log(userimg)
  const previousChatId = useRef(data.chatId);
  useEffect(() => {
    const fetchLatestChat = async () => {
      console.log("rednered");
      console.log(data.chatId);
      try {
        const response = await fetch(
          `/api/chat/latest?userId=${encodeURIComponent(
            userId?.userId
          )}&chatId=${encodeURIComponent(data.chatId)}`
        );
        if (!response.ok) throw new Error("Failed to fetch latest chat");
        const latestChat = await response.json();
        console.log(latestChat);
        if (latestChat) {
          setCurrentChat(latestChat as Chat);
        }
      } catch (error) {
        console.error("Error fetching latest chat:", error);
        toast("Error", {
          description: "Failed to fetch the latest chat. Please try again.",
        });
      }
    };
    if (previousChatId.current !== data.chatId) {
      fetchLatestChat();
    }
  }, [data.chatId]);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      if (inputValue.trim() !== "") {
        setIsInputDisabled(true);

        let chatToUse = currentChat;
        console.log(chatToUse);
        // Create a new chat if this is the first message
        if (!currentChat || currentChat.messages.length === 0) {
          const chatResponse = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: inputValue.slice(0, 30) + "...",
              userId: userId?.userId,
            }),
          });

          if (!chatResponse.ok) {
            throw new Error("Failed to create new chat");
          }

          chatToUse = await chatResponse.json();
          setCurrentChat(chatToUse);
        }

        // Send user message
        const userMessageResponse = await fetch("/api/chat/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: inputValue,
            role: "user",
            chatId: chatToUse?.id,
            modelId: data.model_id,
            inputType: "text",
          }),
        });

        if (!userMessageResponse.ok) {
          throw new Error("Failed to send user message");
        }

        const newMessage = await userMessageResponse.json();
        setCurrentChat((prevChat) => ({
          ...prevChat!,
          messages: [...(prevChat?.messages || []), newMessage],
        }));

        // Send AI message
        const aiMessageResponse = await fetch("/api/chat/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: "", // Placeholder for AI message content
            role: "assistant",
            chatId: chatToUse?.id,
            modelId: data.model_id,
            inputType: "text",
          }),
        });

        if (!aiMessageResponse.ok) {
          throw new Error("Failed to send AI message");
        }

        const aiMessage = await aiMessageResponse.json();
        setCurrentChat((prevChat) => ({
          ...prevChat!,
          messages: [...(prevChat?.messages || []), aiMessage],
        }));

        setInputValue("");
        const stream = await getChatStream(
          inputValue,
          chatToUse?.messages,
          data.groq_access_token,
          data.groq_model
        );

        let fullResponse = "";
        for await (const chunk of stream) {
          fullResponse = chunk;
          console.log(chunk);
          setCurrentChat((prevChat) => {
            const updatedMessages = [...prevChat!.messages];
            updatedMessages[updatedMessages.length - 1] = {
              ...updatedMessages[updatedMessages.length - 1],
              content: chunk,
            };
            return {
              ...prevChat!,
              messages: updatedMessages,
            };
          });
        }

        // Log AI message to API endpoint
        await fetch(`/api/chat/message/${aiMessage.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: fullResponse.trim(),
          }),
        });

        setIsInputDisabled(false);
      }
    } catch (e) {
      console.error("Error in handleSendMessage:", e);
      toast(`LLM Call`, {
        description:
          "Error: Make sure a Model is selected with all parameters" +
          (e instanceof Error ? e.message : String(e)),
      });
      setIsInputDisabled(false);
    }
  };

  const handleClearChat = () => {
    setCurrentChat(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleClearChat();
    }
  };

  return (
    <div className="flex flex-col h-dvh -top-4">
      <header className="text-muted-foreground ">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg  font-semibold text-primary">YACA</h1>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="rounded-full lg:hidden">
              {/* <AppSidebar /> */}
              <span className="sr-only">Toggle menu</span>
            </Avatar>
            <Button variant="outline" className="rounded-full w-12 h-12">
              <Bell />
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1 overflow-auto p-4">
        <div className="container mx-auto max-w-2xl space-y-4">
          {currentChat &&
            currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 max-w-300 whitespace-normal break-words ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "user" ? (
                  <Avatar>
                    <AvatarImage src={userimg} />
                    <AvatarFallback>
                      {" "}
                      <User className={`primary order-2`} />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[70%] overflow-x ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  {isInputDisabled && message.role === "assistant" ? (
                    <>{message.content}</>
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(message.content),
                      }}
                    />
                  )}
                  {isInputDisabled &&
                    message.role === "assistant" &&
                    message.content === "" && (
                      <div className="flex-col items-center justify-center text-primary-foreground">
                        <Skeleton className="h-4 w-[30vw]" />
                        <Skeleton className="h-4 w-[25vw] mt-1" />
                        <Skeleton className="h-4 w-[15vw] mt-1" />
                      </div>
                    )}
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>

      <footer className="bg-background p-4 shadow-md">
        <div className="container mx-auto flex items-center gap-2">
          <Button
            className="rounded-full  text-white"
            onClick={handleClearChat}
            variant="outline"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="sr-only">Clear Chat</span>
          </Button>
          <Textarea
            placeholder="Type your message..."
            className="flex-1 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none border-none"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isInputDisabled}
          />
          <Button
            className="rounded-full bg-primary text-primary-foreground"
            onClick={handleSendMessage}
            disabled={isInputDisabled}
          >
            <Send className="w-5 h-5 text-primary-foreground" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
