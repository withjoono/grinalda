import { TargetUniversityPage } from "@/components/services/ms/target-university/target-university-page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/ms/_layout/target-university")({
    component: TargetUniversity,
});

function TargetUniversity() {
    return (
        <div className="w-full pb-8">
            <TargetUniversityPage />
        </div>
    );
}
