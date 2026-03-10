import { EarlySubjectSteps } from "@/components/services/explore/early-subject/components/early-subject-steps";
import { ExploreEarlySubjectStepperProvider } from "@/components/services/explore/early-subject/context/explore-early-subject-provider";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/susi/subject")({
  component: SusiSubject,
});

function SusiSubject() {
  return (
    <div className="mx-auto w-full max-w-screen-xl py-20 pb-8">
      {/* <SusiSubjectStepperProvider>
        <SusiSubjectSteps />
      </SusiSubjectStepperProvider> */}

      <ExploreEarlySubjectStepperProvider>
        <EarlySubjectSteps />
      </ExploreEarlySubjectStepperProvider>
    </div>
  );
}
