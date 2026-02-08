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
  const [teacherSubject, setTeacherSubject] = useState("");
  const [parentType, setParentType] = useState("");
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
        // 선생님 전용
        ...(memberType === "teacher" && {
          subject: teacherSubject,
        }),
        // 학부모 전용
        ...(memberType === "parent" && {
          parentType: parentType,
        }),
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
          "rounded-xl border p-5 transition-all duration-300",
          googleVerification.verified
            ? "border-emerald-200 bg-emerald-50/30"
            : "border-slate-200 bg-slate-50/50"
        )}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              googleVerification.verified ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"
            )}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className={cn(
              "text-sm font-semibold tracking-tight",
              googleVerification.verified ? "text-emerald-900" : "text-slate-700"
            )}>
              {googleVerification.verified ? "본인인증 완료" : "본인인증 (필수)"}
            </span>
          </div>

          {googleVerification.verified ? (
            <div className="flex items-center gap-3 pl-1">
              {googleVerification.photoURL ? (
                <img
                  src={googleVerification.photoURL}
                  alt="프로필"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{googleVerification.name}</p>
                <p className="text-slate-500 text-xs">{googleVerification.email}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4 pl-1 leading-relaxed">
                안전한 서비스 이용을 위해 구글 계정으로 본인인증을 진행해주세요.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 space-x-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium shadow-sm transition-all hover:shadow hover:border-slate-300"
                onClick={handleGoogleVerification}
                loading={isVerifying}
                disabled={isVerifying}
              >
                <img src={googleIcon} className="w-5 h-5" />
                <span>구글로 간편 인증하기</span>
              </Button>
            </>
          )}
        </div>

        {/* 회원유형 탭 */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100/80 p-1.5 mb-6">
          <button
            type="button"
            onClick={() => setMemberType("student")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              memberType === "student"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
            )}
          >
            <UserIcon className={cn("w-4 h-4", memberType === "student" ? "text-blue-500" : "text-slate-400")} />
            학생
          </button>
          <button
            type="button"
            onClick={() => setMemberType("teacher")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              memberType === "teacher"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
            )}
          >
            <GraduationCapIcon className={cn("w-4 h-4", memberType === "teacher" ? "text-emerald-500" : "text-slate-400")} />
            선생님
          </button>
          <button
            type="button"
            onClick={() => setMemberType("parent")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              memberType === "parent"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
            )}
          >
            <UsersIcon className={cn("w-4 h-4", memberType === "parent" ? "text-orange-500" : "text-slate-400")} />
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
            "space-y-5 transition-all duration-300 ease-in-out",
            !googleVerification.verified && "opacity-40 grayscale-[0.5]"
          )}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-medium">이름*</FormLabel>
                  <FormControl>
                    <Input className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all" placeholder="이름" {...field} />
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
                  <FormLabel className="text-slate-600 font-medium">이메일*</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                      placeholder="이메일 주소"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-medium">패스워드*</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
                    <FormLabel className="text-slate-600 font-medium">패스워드 확인*</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
            </div>

            {memberType === "student" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-medium">학교</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
                              "absolute left-0 top-12 z-40 max-h-[300px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl",
                              "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300",
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
                                    className="absolute left-0 top-0 flex w-full cursor-pointer items-center px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
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
                                    <span className="font-medium text-slate-900">{school.highschoolName}</span>
                                    <span className="ml-2 text-slate-400 text-xs">({school.highschoolRegion})</span>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="schoolLevel"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-slate-600 font-medium">초/중/고*</FormLabel>
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
                            <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all">
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
                          <FormLabel className="text-slate-600 font-medium">학년*</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedLevel || !googleVerification.verified}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all">
                                <SelectValue placeholder={selectedLevel ? "선택" : "-"} />
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
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-medium">휴대폰 번호</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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

            {/* 선생님 전용 필드 */}
            {memberType === "teacher" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <FormField
                  control={form.control}
                  name="schoolLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-medium">담당 학교급</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!googleVerification.verified}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="초등">초등</SelectItem>
                          <SelectItem value="중등">중등</SelectItem>
                          <SelectItem value="고등">고등</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-medium">담당 과목</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          placeholder="예: 수학, 영어, 국어"
                          value={teacherSubject}
                          onChange={(e) => setTeacherSubject(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-medium">휴대폰 번호</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <FormField
                  control={form.control}
                  name="phone"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-medium">학부모 유형</FormLabel>
                      <Select
                        value={parentType}
                        onValueChange={setParentType}
                        disabled={!googleVerification.verified}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="아버지">아버지</SelectItem>
                          <SelectItem value="어머니">어머니</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-medium">휴대폰 번호</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
            "space-y-4 pt-2 transition-all duration-300",
            !googleVerification.verified && "opacity-50 pointer-events-none"
          )}>
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
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
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 w-5 h-5 rounded"
                />
              </FormControl>
              <div className="space-y-1 leading-none py-1">
                <FormLabel className="text-base font-semibold text-slate-800 cursor-pointer">전체 동의</FormLabel>
              </div>
            </FormItem>
            <div className="space-y-2 px-1">
              {[
                { text: "이용약관 동의 (필수)", link: "/" },
                { text: "개인정보 수집 및 이용 동의 (필수)", link: "/" },
                { text: "만 14세 이상 사용자 (필수)", link: "" },
                { text: "SMS 광고성 수신동의 (선택)", link: "" },
              ].map((item, idx) => (
                <FormItem
                  key={item.text}
                  className="flex flex-row items-center space-x-3 space-y-0 p-2"
                >
                  <FormControl>
                    <Checkbox
                      checked={agreeToTerms[idx]}
                      onCheckedChange={() => handleAgreeClick(idx)}
                      disabled={!googleVerification.verified}
                      className="w-4 h-4 rounded-sm"
                    />
                  </FormControl>
                  <div className="flex w-full justify-between items-center leading-none">
                    <FormLabel className="font-normal text-slate-600 text-sm cursor-pointer">{item.text}</FormLabel>
                    {item.link && (
                      <a href={item.link} target="_blank" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2">
                        보기
                      </a>
                    )}
                  </div>
                </FormItem>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 mt-6 text-base font-bold bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 rounded-xl transition-all active:scale-[0.98]"
            loading={isLoading}
            disabled={
              isLoading ||
              !googleVerification.verified ||
              !agreeToTerms[0] ||
              !agreeToTerms[1] ||
              !agreeToTerms[2]
            }
          >
            회원가입 완료
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 pt-6">
          <span className="text-sm text-slate-500">이미 계정이 있으신가요?</span>
          <Link
            to="/auth/login"
            className="text-sm font-semibold text-slate-900 hover:text-slate-700 underline underline-offset-4"
          >
            로그인
          </Link>
        </div>
      </div>
    </Form>
  );
}

