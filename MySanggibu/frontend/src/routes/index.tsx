import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // My 생기부 앱의 루트는 메인 페이지로 리다이렉트
  return <Navigate to="/ms" />;
}
