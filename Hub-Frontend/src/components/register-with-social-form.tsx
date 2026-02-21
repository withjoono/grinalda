import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { env } from "@/lib/config/env";
import debounce from "lodash/debounce";

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
  useSendRegisterCode,
  useVerifyCode,
} from "@/stores/server/features/auth/mutations";
import { useSocialSignUp } from "@/stores/client/use-social-sign-up";
import { registerWithSocialFormSchema } from "@/lib/validations/auth";
import {
  UsersIcon,
  CheckIcon,
  GraduationCapIcon,
  UserIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { meQueryKeys } from "@/stores/server/features/me/queries";

interface Props {
  className?: string;
}

export function RegisterWithSocialForm({ className }: Props) {
  const [searchHighSchool, setSearchHighSchool] = useState(""); // 학교 검색어 (필터링때문에 form 외에 추가로 만듬)
  const [isFocused, setIsFocused] = useState(false); // 학교검색 포커스
  const [memberType, setMemberType] = useState<
    "student" | "teacher" | "parent"
  >("student"); // 회원 유형
  const socialType = useSocialSignUp((state) => state.socialType);
  const socialToken = useSocialSignUp((state) => state.token);
  const socialName = useSocialSignUp((state) => state.name);
  const socialEmail = useSocialSignUp((state) => state.email);
  const clearSocialData = useSocialSignUp((state) => state.clearData);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // 휴대폰 번호
  const [isAuthedPhone, setIsAuthedPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teacherSubject, setTeacherSubject] = useState("");
  const [parentType, setParentType] = useState("");
  const [teacherSchoolLevel, setTeacherSchoolLevel] = useState("");

  // Mutations
  const sendRegisterCode = useSendRegisterCode();
  const verifyCode = useVerifyCode();

  const form = useForm<z.infer<typeof registerWithSocialFormSchema>>({
    resolver: zodResolver(registerWithSocialFormSchema),
    defaultValues: {
      name: socialName || "",
      school: "",
      major: 0,
      graduateYear: 2025,
      phone: "",
      phoneToken: "",
    },
  });

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
  async function onSubmit(
    values: z.infer<typeof registerWithSocialFormSchema>,
  ) {
    if (!socialType || !socialToken) {
      toast.error("소셜 로그인 정보가 잘못되었습니다.");
      clearSocialData();
      return;
    }

    setIsLoading(true);

    const school = HIGH_SCHOOL_LIST.find(
      (n) => n.highschoolName === values.school,
    );
    // 만약 학교 값이 존재하는데 학교 목록에 없으면 잘못된 학교임으로 에러처리
    if (values.school !== "" && !school) {
      toast.error(
        "잘못된 학교입니다. 리스트에 학교가 없다면 필드를 비워주세요.",
      );
      return;
    }
    const formattedPhone = values.phone.replace(/-/g, "");

    // Firebase 회원가입 API 호출
    const hubApiUrl = import.meta.env.VITE_API_URL_HUB || 'http://localhost:4000';
    const response = await fetch(`${hubApiUrl}/auth/firebase/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: socialToken,
        nickname: values.name,
        hstTypeId: school?.id,
        isMajor: String(values.major),
        graduateYear: String(values.graduateYear),
        phone: formattedPhone,
        ckSmsAgree: agreeToTerms[3],
        memberType: memberType,
        schoolLevel: teacherSchoolLevel || undefined,
        // 선생님 전용
        ...(memberType === "teacher" && {
          subject: teacherSubject,
        }),
        // 학부모 전용
        ...(memberType === "parent" && {
          parentType: parentType,
        }),
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // 회원가입 성공 후 me 쿼리 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: meQueryKeys.all });
      clearSocialData(); // 소셜 로그인 임시 데이터 삭제
      toast.success("G Skool에 가입해주셔서 감사합니다! 😄");
      setIsLoading(false);
      // 회원 유형에 따라 해당 앱으로 리다이렉트
      if (memberType === "teacher") {
        window.location.href = env.serviceUrls.teacherAdmin;
      } else if (memberType === "parent") {
        window.location.href = env.serviceUrls.parentAdmin;
      } else {
        navigate({ to: "/" });
      }
    } else {
      toast.error(result.message || result.error || "회원가입에 실패했습니다.");
      setIsLoading(false);
    }
  }

  const handleSendCodeClick = async () => {
    const { phone } = form.getValues();

    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;

    if (!phone) return toast.error("휴대폰 번호를 입력해주세요.");
    if (!phoneRegex.test(phone)) {
      toast.error("올바른 휴대폰 번호 형식이 아닙니다.");
      return;
    }

    try {
      const formattedPhone = phone.replace(/-/g, "");
      const result = await sendRegisterCode.mutateAsync({
        phone: formattedPhone,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("인증번호가 발송되었습니다.");
      return;
    } catch (error: any) {
      // 백엔드 에러 메시지를 전화번호 필드에 표시
      const errorMessage = error.response?.data?.message || "인증코드 발송 중 오류가 발생했습니다.";

      form.setError("phone", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleVerifyCodeClick = async () => {
    const { phoneToken, phone } = form.getValues();

    if (!phone) return toast.error("휴대폰 번호를 입력해주세요.");
    if (!phoneToken) return toast.error("인증코드를 입력해주세요.");

    const formattedPhone = phone.replace(/-/g, "");
    const result = await verifyCode.mutateAsync({
      phone: formattedPhone,
      code: phoneToken,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("인증번호가 확인되었습니다.");
    setIsAuthedPhone(true);
    return;
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-6", className)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
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

          {/* 학생 전용 필드 */}
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
                                    e.preventDefault();
                                    setSearchHighSchool(school.highschoolName);
                                    form.setValue(
                                      "school",
                                      school.highschoolName,
                                    );
                                    setIsFocused(false);
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
                  name="major"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-slate-600 font-medium">전공*</FormLabel>
                      <Select defaultValue={"0"} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">문과</SelectItem>
                          <SelectItem value="1">이과</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="graduateYear"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-slate-600 font-medium">졸업예정연도*</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          placeholder="예) 2025"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* 선생님 전용 필드 */}
          {memberType === "teacher" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <FormField
                control={form.control}
                name="phone"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-medium">담당 학교급</FormLabel>
                    <Select
                      value={teacherSchoolLevel}
                      onValueChange={setTeacherSchoolLevel}
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
                render={() => (
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
            </div>
          )}

          <div className="space-y-5 pt-2 border-t border-slate-100 mt-6">
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-slate-600 font-medium">휴대폰 번호*</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                        disabled={isAuthedPhone}
                        placeholder="01012345678"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                className="h-11 px-5 whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                onClick={handleSendCodeClick}
                disabled={isAuthedPhone}
              >
                인증번호 발송
              </Button>
            </div>
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="phoneToken"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-slate-600 font-medium">인증번호*</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                        disabled={isAuthedPhone}
                        placeholder="인증번호"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                className="h-11 px-5 whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                onClick={handleVerifyCodeClick}
                disabled={isAuthedPhone}
              >
                인증번호 확인
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
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
            disabled={
              isLoading ||
              !agreeToTerms[0] ||
              !agreeToTerms[1] ||
              !agreeToTerms[2]
            }
          >
            회원가입 완료
          </Button>
        </form>
        <div className="flex items-center justify-center gap-2 pt-6">
          <Link
            to="/auth/login"
            className="text-sm font-semibold text-slate-900 hover:text-slate-700 underline underline-offset-4"
          >
            이미 계정이 있으신가요? (간편 로그인)
          </Link>
        </div>
      </div>
    </Form>
  );
}
