import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';

export default function NotFoundError() {
  const navigate = useNavigate();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">이런! 페이지를 찾을 수 없습니다!</span>
        <p className="text-center text-muted-foreground">
          찾고 있는 페이지가 존재하지 않거나 <br />
          삭제되었을 수 있습니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
          <Button onClick={() => navigate('/')}>홈으로 가기</Button>
        </div>
      </div>
    </div>
  );
}
