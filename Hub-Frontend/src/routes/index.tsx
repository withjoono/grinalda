import { createFileRoute } from "@tanstack/react-router";
import { ServiceCardsPage } from "@/components/service-cards-page";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Hub 메인 페이지: 전체 서비스 목록 표시
  return <ServiceCardsPage />;
}


