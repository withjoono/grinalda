import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import debounce from "lodash/debounce";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/utils/firebase/firebase";
import googleIcon from "@/assets/icon/login-google.png";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./custom/button";
import { registerWithEmailFormSchema } from "@/lib/validations/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { HIGH_SCHOOL_LIST } from "@/constants/high-school";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  GraduationCapIcon,
  ShieldCheck,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { meQueryKeys } from "@/stores/server/features/me/queries";
import { hubApiClient } from "@/stores/server/hub-api-client";
import { useAuthStore } from "@/stores/client/use-auth-store";
import { setTokens as setTokensInStorage } from "@/lib/api/token-manager";

interface Props {
  className?: string;
}

interface GoogleVerification {
  verified: boolean;
  email: string;
  name: string;
  photoURL: string;
}

// 학교/대상 유형별 학년 옵션 매핑
const SCHOOL_LEVEL_OPTIONS = [
  { value: "초등", label: "초등" },
  { value: "중등", label: "중등" },
  { value: "고등", label: "고등" },
  { value: "검정", label: "검정" },
  { value: "N수", label: "N수" },
] as const;

const GRADE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  "초등": [
    { value: "E1", label: "1학년" },
    { value: "E2", label: "2학년" },
    { value: "E3", label: "3학년" },
    { value: "E4", label: "4학년" },
    { value: "E5", label: "5학년" },
    { value: "E6", label: "6학년" },
  ],
  "중등": [
    { value: "M1", label: "1학년" },
    { value: "M2", label: "2학년" },
    { value: "M3", label: "3학년" },
  ],
  "고등": [
    { value: "H1", label: "1학년" },
    { value: "H2", label: "2학년" },
    { value: "H3", label: "3학년" },
  ],
  "검정": [
    { value: "M0", label: "중등과정" },
    { value: "H0", label: "고등과정" },
  ],
  "N수": [
    { value: "HN", label: "해당" },
  ],
};

export function RegisterWithEmailForm({ className }: Props) {
  const [searchHighSchool, setSearchHighSchool] = useState(""); // 학교 검색어 (필터링때문에 form 외에 추가로 만듬)
  const [isFocused, setIsFocused] = useState(false); // 학교검색 포커스
  const [memberType, setMemberType] = useState<"student" | "teacher" | "parent">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setTokens } = useAuthStore();

  // 구글 본인인증 상태
  const [googleVerification, setGoogleVerification] = useState<GoogleVerification>({
    verified: false,
    email: "",
    name: "",
    photoURL: "",
  });

  const form = useForm<z.infer<typeof registerWithEmailFormSchema>>({
    resolver: zodResolver(registerWithEmailFormSchema),
    mode: "onBlur", // 필드에서 포커스가 벗어날 때 검증
    reValidateMode: "onChange", // 첫 검증 후에는 입력할 때마다 재검증
    defaultValues: {
      name: "",
      email: "",
      password: "",
      checkPassword: "",
      school: "",
      schoolLevel: "",
      grade: "",
      phone: "",
      phoneToken: "",
    },
  });

  // 구글 본인인증 핸들러
  const handleGoogleVerification = async () => {
    setIsVerifying(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const googleEmail = result.user.email || "";
      const googleName = result.user.displayName || "";
      const googlePhoto = result.user.photoURL || "";

      // 인증 상태 저장
      setGoogleVerification({
        verified: true,
        email: googleEmail,
        name: googleName,
        photoURL: googlePhoto,
      });

      // 폼에 이메일, 이름 자동 입력
      form.setValue("email", googleEmail);
      if (googleName && !form.getValues("name")) {
        form.setValue("name", googleName);
      }

      // Firebase에서 로그아웃 (본인인증 목적이므로 로그인 상태 유지하지 않음)
      await auth.signOut();

      toast.success("✅ 본인인증이 완료되었습니다!");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        return; // 사용자가 팝업을 닫은 경우
      }
      console.error("구글 본인인증 에러:", err);
      toast.error("구글 본인인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 검색어 변경 시 필터링된 학교 목록 업데이트
  const debouncedSetSearchHighSchool = useMemo(
    () => debounce((term: string) => setSearchHighSchool(term), 200),
    [],
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    form.setValue("school", term);
    debouncedSetSearchHighSchool(term);
  };

  // 검색어로 필터링된 학교 목록
  const filteredHighSchools = useMemo(() => {
    return HIGH_SCHOOL_LIST.filter((school) => {
      if (searchHighSchool === "") return true;
      return school.highschoolName.includes(searchHighSchool);
    });
  }, [searchHighSchool]);

  // 고등학교 리스트가 2000개가 넘어서 렌더링 최적화를 위해 virtual 처리 (tanstack/virtual 사용)
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredHighSchools.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // 약관동의 상태
  const [agreeToTerms, setAgreeToTerms] = useState([
    false,
    false,
    false,
    false,
  ]);

  // 약관 동의 버튼 클릭
  const handleAgreeClick = (idx: number) => {
    if (4 <= idx) {
      throw Error("잘못된 접근입니다.");
    }
    const copy = [...agreeToTerms];
    copy[idx] = !copy[idx];
    setAgreeToTerms(copy);
  };

  // 약관 전체 동의 버튼 클릭
  const handleAllAgreeClick = () => {
    if (agreeToTerms.some((n) => n === false)) {
      setAgreeToTerms([true, true, true, true]);
    } else {
      setAgreeToTerms([false, false, false, false]);
    }
  };

  // 회원가입 버튼 클릭
  async function onSubmit(values: z.infer<typeof registerWithEmailFormSchema>) {
    if (isLoading) return;

    // 구글 본인인증 확인
    if (!googleVerification.verified) {
      toast.error("구글 본인인증을 먼저 완료해주세요.");
      return;
    }

    const school = HIGH_SCHOOL_LIST.find(
      (n) => n.highschoolName === values.school,
    );
    // 만약 학교 값이 존재하는데 학교 목록에 없으면 잘못된 학교임으로 에러처리
    if (values.school !== "" && !school) {
      form.setError("school", {
        type: "manual",
        message: "잘못된 학교입니다. 리스트에 학교가 없다면 필드를 비워주세요.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Firebase Auth로 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // 2. ID 토큰 가져오기
      const idToken = await userCredential.user.getIdToken();

      // 3. 백엔드에 회원가입 정보 전송
      const formattedPhone = values.phone?.replace(/-/g, "") || "";
      const res = await hubApiClient.post('/auth/firebase/register', {
        idToken,
        nickname: values.name,
        hstTypeId: school?.id,
        schoolLevel: values.schoolLevel,
        userTypeCode: values.grade,
        phone: formattedPhone,
        ckSmsAgree: agreeToTerms[3],
        memberType: memberType,
      });

      if (res.data.success) {
        const { accessToken, refreshToken, tokenExpiry } = res.data.data;

        // 토큰 저장 (Zustand store + localStorage)
        setTokens(accessToken, refreshToken, tokenExpiry);
        setTokensInStorage(accessToken, refreshToken);

        // 회원가입 성공 후 me 쿼리 캐시 무효화
        await queryClient.invalidateQueries({ queryKey: meQueryKeys.all });
        toast.success("거북스쿨에 가입해주셔서 감사합니다! 😄");
        navigate({ to: "/" });
      } else {
        toast.error(res.data.error || "회원가입에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("회원가입 에러:", error);

      // Firebase 에러 처리 (error.code가 'auth/'로 시작)
      if (error.code && error.code.startsWith('auth/')) {
        if (error.code === "auth/email-already-in-use") {
          form.setError("email", {
            type: "manual",
            message: "이미 사용 중인 이메일입니다.",
          });
        } else if (error.code === "auth/weak-password") {
          form.setError("password", {
            type: "manual",
            message: "비밀번호는 최소 6자 이상이어야 합니다.",
          });
        } else if (error.code === "auth/invalid-email") {
          form.setError("email", {
            type: "manual",
            message: "유효하지 않은 이메일 형식입니다.",
          });
        } else {
          toast.error("회원가입 중 오류가 발생했습니다.");
        }
      }
      // 백엔드 에러 처리 (axios 에러)
      else {
        const errorMessage = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";

        // 이메일 관련 에러
        if (errorMessage.includes("이메일") || errorMessage.includes("email")) {
          form.setError("email", {
            type: "manual",
            message: errorMessage,
          });
        }
        // 전화번호 관련 에러
        else if (errorMessage.includes("전화") || errorMessage.includes("phone") || errorMessage.includes("휴대폰")) {
          form.setError("phone", {
            type: "manual",
            message: errorMessage,
          });
        }
        // 기타 에러는 toast로 표시
        else {
          toast.error(errorMessage, { duration: 5000 });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className={cn("space-y-2", className)}>
        {/* 구글 본인인증 섹션 */}
        <div className={cn(
          "rounded-lg border-2 p-4 transition-colors",
          googleVerification.verified
            ? "border-green-500 bg-green-50"
            : "border-amber-400 bg-amber-50"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className={cn(
              "w-5 h-5",
              googleVerification.verified ? "text-green-600" : "text-amber-600"
            )} />
            <span className={cn(
              "text-sm font-semibold",
              googleVerification.verified ? "text-green-700" : "text-amber-700"
            )}>
              {googleVerification.verified ? "본인인증 완료" : "본인인증 필수"}
            </span>
          </div>

          {googleVerification.verified ? (
            <div className="flex items-center gap-3">
              {googleVerification.photoURL && (
                <img
                  src={googleVerification.photoURL}
                  alt="프로필"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-sm">
                <p className="font-medium text-green-800">{googleVerification.name}</p>
                <p className="text-green-600">{googleVerification.email}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-amber-700 mb-3">
                허수 가입 방지를 위해 구글 계정으로 본인인증이 필요합니다.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full h-auto space-x-2 py-2.5 bg-white hover:bg-gray-50"
                onClick={handleGoogleVerification}
                loading={isVerifying}
                disabled={isVerifying}
              >
                <img src={googleIcon} className="size-4" />
                <span>구글로 본인인증하기</span>
              </Button>
            </>
          )}
        </div>

        {/* 회원유형 탭 */}
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setMemberType("student")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
              memberType === "student"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UserIcon className="w-4 h-4" />
            학생
          </button>
          <button
            type="button"
            onClick={() => setMemberType("teacher")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
              memberType === "teacher"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GraduationCapIcon className="w-4 h-4" />
            선생님
          </button>
          <button
            type="button"
            onClick={() => setMemberType("parent")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
              memberType === "parent"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UsersIcon className="w-4 h-4" />
            학부모
          </button>
        </div>

        {/* 구글 본인인증 섹션 */}

        {/* 회원가입 폼 */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!googleVerification.verified && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              위에서 구글 본인인증을 완료하면 회원가입 폼이 활성화됩니다.
            </div>
          )}

          <fieldset disabled={!googleVerification.verified} className={cn(
            "space-y-2 transition-opacity",
            !googleVerification.verified && "opacity-50"
          )}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름*</FormLabel>
                  <FormControl>
                    <Input placeholder="이름" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="이메일 주소"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>패스워드*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="패스워드"
                      autoComplete="off"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>패스워드 확인*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="패스워드 확인"
                      type="password"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {memberType === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>학교</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="학교 검색(목록에 없으면 비워주세요)"
                            {...field}
                            onFocus={() => setIsFocused(true)}
                            onChange={handleSearchInputChange}
                            autoComplete="off"
                            onBlur={() =>
                              setTimeout(() => setIsFocused(false), 100)
                            }
                          />
                        </FormControl>
                        {isFocused && (
                          <div
                            ref={parentRef}
                            className={cn(
                              "absolute left-0 top-10 z-40 max-h-[400px] w-full overflow-y-auto rounded-b-md border bg-gray-100",
                              "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-track-slate-300 scrollbar-thumb-primary",
                            )}
                          >
                            <div
                              className="relative w-full"
                              style={{ height: `${totalSize}px` }}
                            >
                              {virtualItems.map((virtualItem) => {
                                const school =
                                  filteredHighSchools[virtualItem.index];
                                return (
                                  <div
                                    key={virtualItem.key}
                                    className="absolute left-0 top-0 flex w-full cursor-pointer items-center px-2 text-sm hover:bg-gray-200"
                                    style={{
                                      height: `${virtualItem.size}px`,
                                      transform: `translateY(${virtualItem.start}px)`,
                                    }}
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // blur 이벤트 방지
                                      setSearchHighSchool(school.highschoolName);
                                      form.setValue(
                                        "school",
                                        school.highschoolName,
                                      );
                                      setIsFocused(false); // 선택 후 드롭다운 닫기
                                    }}
                                  >
                                    {school.highschoolName} (
                                    {school.highschoolRegion})
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="schoolLevel"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>초/중/고*</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            // 학교/대상 변경 시 학년 초기화
                            const grades = GRADE_OPTIONS[value];
                            if (grades && grades.length === 1) {
                              // 선택지가 하나면 자동 선택
                              form.setValue("grade", grades[0].value);
                            } else {
                              form.setValue("grade", "");
                            }
                          }}
                          disabled={!googleVerification.verified}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SCHOOL_LEVEL_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => {
                      const selectedLevel = form.watch("schoolLevel");
                      const gradeOptions = selectedLevel ? GRADE_OPTIONS[selectedLevel] || [] : [];
                      return (
                        <FormItem className="w-full">
                          <FormLabel>학년*</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedLevel || !googleVerification.verified}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={selectedLevel ? "선택" : "학교/대상 먼저 선택"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {gradeOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </>
            )}

            {/* 학생 전용 필드 */}
            {memberType === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>휴대폰 번호</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="01012345678"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* 선생님 전용 필드 */}
            {memberType === "teacher" && (
              <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
                <GraduationCapIcon className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">선생님 전용 가입 필드는 준비 중입니다.</p>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>휴대폰 번호</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="01012345678"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* 학부모 전용 필드 */}
            {memberType === "parent" && (
              <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
                <UsersIcon className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">학부모 전용 가입 필드는 준비 중입니다.</p>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>휴대폰 번호</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="01012345678"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </fieldset>
          <div className={cn(
            "space-y-2 transition-opacity",
            !googleVerification.verified && "opacity-50 pointer-events-none"
          )}>
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={
                    agreeToTerms[0] &&
                    agreeToTerms[1] &&
                    agreeToTerms[2] &&
                    agreeToTerms[3]
                  }
                  onCheckedChange={handleAllAgreeClick}
                  disabled={!googleVerification.verified}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>전체 동의</FormLabel>
              </div>
            </FormItem>
            {[
              { text: "이용약관 동의 (필수)", link: "/" },
              { text: "개인정보 수집 및 이용 동의 (필수)", link: "/" },
              { text: "만 14세 이상 사용자 (필수)", link: "" },
              { text: "SMS 광고성 수신동의 (선택)", link: "" },
            ].map((item, idx) => (
              <FormItem
                key={item.text}
                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
              >
                <FormControl>
                  <Checkbox
                    checked={agreeToTerms[idx]}
                    onCheckedChange={() => handleAgreeClick(idx)}
                    disabled={!googleVerification.verified}
                  />
                </FormControl>
                <div className="flex w-full justify-between space-y-1 leading-none">
                  <FormLabel>{item.text}</FormLabel>
                  {item.link && (
                    <FormDescription>
                      <a href={item.link} target="_blank">
                        더보기
                      </a>
                    </FormDescription>
                  )}
                </div>
              </FormItem>
            ))}
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={
              isLoading ||
              !googleVerification.verified ||
              !agreeToTerms[0] ||
              !agreeToTerms[1] ||
              !agreeToTerms[2]
            }
          >
            회원가입
          </Button>
        </form>

        <div className="flex justify-center pt-4">
          <Link
            to="/auth/login"
            className="text-sm text-blue-500 hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </Form>
  );
}

