import { buttonVariants } from "@/components/custom/button";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import {
  useGetCompleteEvaluationList,
  useGetOfficerApplyList,
} from "@/stores/server/features/spring/queries";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/officer/_layout/apply/")({
  component: ApplyList,
});

function ApplyList() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: applyList } = useGetOfficerApplyList();
  const { data: completeEvaluationList } = useGetCompleteEvaluationList();

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div>
          <h3 className="text-2xl font-semibold">평가신청자</h3>
          {!applyList ? (
            <div className="flex items-center justify-center py-20 text-lg">
              평가 신청자가 없습니다.
            </div>
          ) : (
            <div className="py-8">
              <div className="flex flex-col items-center justify-between gap-4 py-4">
                <p className="px-4">이름: {applyList.studentName}</p>
                <p className="px-4">계열: {applyList.series}</p>
                <p className="px-4">상태: {applyList.progressStatus}</p>
                <p className="px-4">이메일: {applyList.email}</p>
                <p className="px-4">연락처: {applyList.phone}</p>

                <Link
                  to="/officer/apply/$studentId"
                  params={{ studentId: applyList.studentId }}
                  className={buttonVariants()}
                >
                  평가하기
                </Link>
                <p className="">남은 평가자 수: {applyList.readyCount}</p>
              </div>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-semibold">평가 내역</h3>
          {!completeEvaluationList ? (
            <div className="flex items-center justify-center py-20 text-lg">
              평가 내역이 없습니다.
            </div>
          ) : (
            <div className="py-8">
              {completeEvaluationList
                .filter((n) => n.studentId !== currentUser?.id)
                .sort(
                  (a, b) =>
                    new Date(b.completeDt).getTime() -
                    new Date(a.completeDt).getTime(),
                )
                .map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-0 py-4 text-sm"
                    >
                      <p className="w-[90px] min-w-[90px] px-2">
                        {item.studentName}
                      </p>
                      <p className="w-[120px] min-w-[120px] px-2">
                        {item.completeDt}
                      </p>
                      <p className="line-clamp-1 w-[240px] min-w-[240px] px-2 hover:line-clamp-none">
                        {item.series}
                      </p>
                      <p className="w-[110px]">{item.phone}</p>
                      <p className="line-clamp-1 w-[160px] min-w-[160px] px-2 hover:line-clamp-none">
                        {item.email}
                      </p>

                      <Link
                        to={`/officer/apply/$studentId`}
                        params={{ studentId: item.studentId }}
                        className={buttonVariants()}
                      >
                        내역확인
                      </Link>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
