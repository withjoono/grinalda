import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <div className="h-full min-h-screen py-4">
        <Outlet />
      </div>
      <Toaster richColors position={"top-right"} duration={1200} />
      <Footer />
      <ScrollToTop />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
