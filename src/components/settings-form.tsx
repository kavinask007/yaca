"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  llmProvider: z.string(),
  temperature: z.number().min(0).max(1),
  systemMessage: z.string().max(1000),
  apiKey: z.string().min(1),
});

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      llmProvider: "",
      temperature: 0.7,
      systemMessage: "",
      apiKey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your API
      // For example: await fetch('/api/settings', { method: 'POST', body: JSON.stringify(values) })
      console.log(values);
      toast({
        title: "Settings updated",
        description: "Your chat settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="llmProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLM Provider</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an LLM provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="cohere">Cohere</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose your preferred Language Model provider.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Adjust the randomness of the model output. Lower values make
                the output more deterministic.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="systemMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a system message to guide the behavior"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a system message to set the context for the
                responses.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the API key for your chosen LLM provider.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
