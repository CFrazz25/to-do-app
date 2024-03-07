import { Toaster } from "@/app/components/ui/sonner-toaster"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (

    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <Toaster richColors closeButton expand />
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}