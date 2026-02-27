import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';

interface MarketingConsentDialogProps {
  children: React.ReactNode;
}

export const MarketingConsentDialog = ({
  children,
}: MarketingConsentDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>개인정보의 마케팅 및 광고 활용</DialogTitle>
        </DialogHeader>
        <ScrollArea className='h-full max-h-[500px] py-4 pr-4'>
          <div className='space-y-6 text-sm leading-normal'>
            <div className='space-y-4'>
              <div>
                <p>
                  이용자는 개인(신용)정보의 선택적인 수집 및 이용, 제공에 대한
                  동의를 거부할 수 있습니다. 다만, 동의하지 않을 경우 관련
                  이벤트 당첨 안내, 각종 행사 안내, 이벤트 안내 등 이용 목적에
                  따른 혜택에 제한이 있을 수 있습니다. 그 밖에 계약과 관련된
                  불이익은 없습니다.
                </p>
                <p className='mt-2'>
                  동의한 경우에도 홈페이지 로그인 후 마이페이지에서 동의를
                  철회할 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className='font-bold'>[제공 목적]</h3>
                <ul className='ml-4 mt-2 list-disc space-y-1'>
                  <li>고객에게 최적화된 서비스 제공</li>
                  <li>신규 서비스(제품) 개발 및 특화</li>
                  <li>인구통계학적 특성에 따른 서비스 제공 및 광고 게재</li>
                  <li>웹페이지 접속 빈도 파악</li>
                  <li>서비스 이용에 대한 통계</li>
                  <li>정기 간행물 발송, 신규 상품 또는 서비스 안내</li>
                  <li>고객 관심사에 부합하는 웹서비스 및 이벤트 기획</li>
                  <li>
                    경품행사, 이벤트 등 광고성 정보 전달 또는 회원 참여공간 운영
                  </li>
                  <li>고객설문조사</li>
                  <li>상장정보, 시황정보, 이벤트 등의 관련 정보 제공</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
