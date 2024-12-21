// Move these settings components to /app/settings/page.tsx
"use client"
import { useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MyContext,
    MyContextData,
  } from "@/components/component/ContextProvider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
export default function GroqSettings() {
    const { data, setData } = useContext(MyContext) as MyContextData;
  
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="accessToken">Access Token</Label>
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