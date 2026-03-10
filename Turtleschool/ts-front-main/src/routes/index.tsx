import { FAQArticles } from "@/components/faq-articles";
import { Hero } from "@/components/test/hero";
import { RecentNoticeBoard } from "@/components/recent-notice-board";
import { Container } from "@/components/test/container";
import { createFileRoute } from "@tanstack/react-router";
import { Features } from "@/components/test/features";
import ReactPlayer from "react-player";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative">
      <Container className="flex min-h-screen flex-col items-center justify-between">
        <Hero />
        <div className="container relative flex flex-col items-start gap-x-20 lg:flex-row">
          <RecentNoticeBoard />
          <FAQArticles />
        </div>
        <div className="container flex flex-col gap-8 py-10 md:flex-row">
          <div className="flex-1">
            <div className="relative w-full pt-[56.25%]">
              <ReactPlayer
                url="https://www.youtube.com/watch?v=K7ZGIsuYISo"
                width="100%"
                control
                height="100%"
                className="absolute inset-0 left-0 top-0 h-full w-full"
              />
            </div>
            <p className="mt-4 text-center text-muted-foreground">
              정시 서비스 사용안내
            </p>
          </div>

          <div className="flex-1">
            <div className="relative w-full pt-[56.25%]">
              <ReactPlayer
                url="https://www.youtube.com/watch?v=PO_GI9diEvc"
                width="100%"
                control
                height="100%"
                className="absolute inset-0 left-0 top-0 h-full w-full"
              />
            </div>
            <p className="mt-4 text-center text-muted-foreground">
              정시 지원 시 나에게 유리한 대학 찾는 법
            </p>
          </div>
        </div>
        <Features />
      </Container>
    </div>
  );
}
