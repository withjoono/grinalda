import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/ms/")({
  component: SusiHome,
});

function SusiHome() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">My 생기부</h1>
    </div>
  );
}
