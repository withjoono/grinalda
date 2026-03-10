import { EarlyComprehensiveSteps } from "@/components/services/explore/early-comprehensive/components/early-comprehensive-steps";
import { ExploreEarlyComprehensiveStepperProvider } from "@/components/services/explore/early-comprehensive/context/explore-early-comprehensive-provider";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/susi/comprehensive")({
  component: SusiComprehensive,
});

function SusiComprehensive() {
  return (
    <div className="mx-auto w-full max-w-screen-xl py-20 pb-8">
      {/* <SusiComprehensiveStepperProvider>
        <SusiComprehensiveSteps />
      </SusiComprehensiveStepperProvider> */}

      <ExploreEarlyComprehensiveStepperProvider>
        <EarlyComprehensiveSteps />
      </ExploreEarlyComprehensiveStepperProvider>
    </div>
  );
}
