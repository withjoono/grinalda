import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { cn } from '@/lib/utils';

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean; // 최소한의 표시 여부 (작은 컴포넌트에 사용할 경우)
}

export default function GeneralError({ className, minimal = false }: GeneralErrorProps) {
  const navigate = useNavigate();

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {/* minimal이 false일 경우 에러 코드 표시 */}
        {!minimal && <h1 className="text-[7rem] font-bold leading-tight">500</h1>}
        <span className="font-medium">이런! 문제가 발생했습니다 {`:')`}</span>
        <p className="text-center text-muted-foreground">
          불편을 드려 죄송합니다. <br /> 나중에 다시 시도해 주세요.
        </p>
        {/* minimal이 false일 경우 버튼 표시 */}
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              돌아가기
            </Button>
            <Button onClick={() => navigate('/')}>홈으로 가기</Button>
          </div>
        )}
      </div>
    </div>
  );
}
