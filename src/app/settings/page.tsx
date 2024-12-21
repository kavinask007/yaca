import { Suspense } from "react";
import { SettingsForm } from "./settings-form";
import { SettingsSkeleton } from "./settings-skeleton";
import { MyContextProvider } from "@/components/component/ContextProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/component/SidePanel";
export default function SettingsPage() {
  return (
    <MyContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-screen h-dvh ">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center  gap-2">

              <SidebarTrigger />
              <h1 className="mb-8 text-3xl font-bold">Chat Settings</h1>
            </div>
            <Suspense fallback={<SettingsSkeleton />}>
              <SettingsForm />
            </Suspense>
          </div>
        </main>
      </SidebarProvider>
    </MyContextProvider>
  );
}
