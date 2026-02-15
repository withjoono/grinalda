import { Link } from "@tanstack/react-router";
import naverCafeIcon from "@/assets/icon/naver-cafe.png";
import youtubeIcon from "@/assets/icon/yotube.png";

export const Footer = () => {
  return (
    <div className="border-t bg-gray-50 dark:bg-gray-900/50 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-screen-lg px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr_auto] sm:gap-10">
          {/* Column 1: Logo + Company Name */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img
              className="h-auto w-28 sm:w-36 rounded-xl"
              src="/logo.png"
              alt="거북스쿨 로고"
            />
            <span className="text-base sm:text-lg font-semibold text-foreground">
              {"(주)거북스쿨"}
            </span>
          </div>

          {/* Column 2: Business Details + Policy Links */}
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div className="flex flex-col gap-1 text-xs text-foreground/70 sm:text-sm">
              <span>사업체명 (주)거북스쿨</span>
              <span>대표 강준호</span>
              <span>사업자등록번호 772-87-02782</span>
              <span>연락처 042-484-3356</span>
              <span>서울시 성북구 화랑로 211 성북구 기술창업센터 105호</span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-sm font-medium pt-1">
              <Link
                to="/explain/service"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                이용약관
              </Link>
              <Link
                to="/explain/refund"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                환불규정
              </Link>
              <Link
                to="/explain/privacy"
                target="_blank"
                className="text-primary font-bold hover:underline"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>

          {/* Column 3: Social Media */}
          <div className="flex flex-col items-center sm:items-end gap-3">

            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com/@turtleschool_official"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <img
                  className="h-10 w-10 rounded-lg"
                  src={youtubeIcon}
                  alt="YouTube"
                />
              </a>
              <a
                href="https://cafe.naver.com/turtlecorp"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <img
                  className="h-10 w-10 rounded-lg"
                  src={naverCafeIcon}
                  alt="네이버 카페"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-foreground/10 pt-4 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} (주)거북스쿨. All rights reserved.
        </div>
      </div>
    </div>
  );
};
