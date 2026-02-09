import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./custom/button";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { editProfileFormSchema } from "@/lib/validations/edit-profile";
import { debounce } from "lodash";
import { HIGH_SCHOOL_LIST } from "@/constants/high-school";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEditProfile } from "@/stores/server/features/me/mutations";
import { Checkbox } from "./ui/checkbox";
import { UserIcon, GraduationCapIcon, UsersIcon, BadgeIcon } from "lucide-react";

const SCHOOL_LEVEL_OPTIONS = [
  { value: "초등", label: "초등" },
  { value: "중등", label: "중등" },
  { value: "고등", label: "고등" },
  { value: "검정", label: "검정" },
  { value: "N수", label: "N수" },
] as const;

const GRADE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  "초등": [
    { value: "1", label: "1학년" },
    { value: "2", label: "2학년" },
    { value: "3", label: "3학년" },
    { value: "4", label: "4학년" },
    { value: "5", label: "5학년" },
    { value: "6", label: "6학년" },
  ],
  "중등": [
    { value: "1", label: "1학년" },
    { value: "2", label: "2학년" },
    { value: "3", label: "3학년" },
  ],
  "고등": [
    { value: "1", label: "1학년" },
    { value: "2", label: "2학년" },
    { value: "3", label: "3학년" },
  ],
  "검정": [
    { value: "0", label: "해당" },
  ],
  "N수": [
    { value: "0", label: "해당" },
  ],
};

type ProfileFormValues = z.infer<typeof editProfileFormSchema>;

const MEMBER_TYPE_LABELS: Record<string, { label: string; icon: typeof UserIcon; color: string }> = {
  student: { label: "학생", icon: UserIcon, color: "text-blue-500" },
  teacher: { label: "선생님", icon: GraduationCapIcon, color: "text-emerald-500" },
  parent: { label: "학부모", icon: UsersIcon, color: "text-orange-500" },
};

export function EditProfileForm() {
  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUser();
  const editProfile = useEditProfile();

  const [searchHighSchool, setSearchHighSchool] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSmsAgree, setIsSmsAgree] = useState(false);

  const memberType = currentUser?.member_type || "student";
  const typeInfo = MEMBER_TYPE_LABELS[memberType] || MEMBER_TYPE_LABELS.student;
  const TypeIcon = typeInfo.icon;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      nickname: "",
      phone: "",
      school: "",
      schoolLevel: "",
      grade: "",
      subject: "",
      parentType: "",
    },
    mode: "onChange",
  });

  const selectedSchoolLevel = form.watch("schoolLevel");
  const availableGrades = selectedSchoolLevel ? GRADE_OPTIONS[selectedSchoolLevel] || [] : [];

  // 검색어 변경
  const debouncedSetSearchHighSchool = useMemo(
    () => debounce((term: string) => setSearchHighSchool(term), 200),
    [],
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    form.setValue("school", term);
    debouncedSetSearchHighSchool(term);
  };

  const filteredHighSchools = useMemo(() => {
    return HIGH_SCHOOL_LIST.filter((school) => {
      if (searchHighSchool === "") return true;
      return school.highschoolName.includes(searchHighSchool);
    });
  }, [searchHighSchool]);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredHighSchools.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // 초기 데이터 설정
  useEffect(() => {
    if (currentUser) {
      form.setValue("nickname", currentUser.nickname || "");
      form.setValue("phone", currentUser.phone || "");
      setIsSmsAgree(currentUser.ck_sms_agree);

      if (currentUser.member_type === "student" && currentUser.studentProfile) {
        const sp = currentUser.studentProfile;
        if (sp.school_name) {
          form.setValue("school", sp.school_name);
          setSearchHighSchool(sp.school_name);
        }
        if (sp.school_level) form.setValue("schoolLevel", sp.school_level);
        if (sp.grade !== null && sp.grade !== undefined) form.setValue("grade", String(sp.grade));
      }

      if (currentUser.member_type === "teacher" && currentUser.teacherProfile) {
        form.setValue("subject", currentUser.teacherProfile.subject || "");
      }

      if (currentUser.member_type === "parent" && currentUser.parentProfile) {
        form.setValue("parentType", currentUser.parentProfile.parent_type || "");
      }
    }
  }, [currentUser, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    const school = HIGH_SCHOOL_LIST.find(
      (n) => n.highschoolName === data.school,
    );
    if (data.school && data.school !== "" && !school) {
      toast.error(
        "잘못된 학교입니다. 리스트에 학교가 없다면 필드를 비워주세요.",
      );
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateBody: any = {
      nickname: data.nickname,
      phone: data.phone,
      ck_sms_agree: isSmsAgree,
    };

    if (memberType === "student") {
      updateBody.school_level = data.schoolLevel || undefined;
      updateBody.grade = data.grade ? Number(data.grade) : undefined;
      if (school) {
        updateBody.school_code = (school as any).highschoolCode || "";
        updateBody.school_name = school.highschoolName;
      } else {
        updateBody.school_name = "";
        updateBody.school_code = "";
      }
    }

    if (memberType === "teacher") {
      updateBody.subject = data.subject || undefined;
    }

    if (memberType === "parent") {
      updateBody.parent_type = data.parentType || undefined;
    }

    const result = await editProfile.mutateAsync(updateBody);
    if (result.success) {
      toast.success("프로필이 성공적으로 저장되었습니다.");
      await refetchCurrentUser();
    } else {
      toast.error((result as any).error || "프로필 저장에 실패했습니다.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 회원 유형 표시 */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5")}>
            <TypeIcon className={cn("w-5 h-5", typeInfo.color)} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{typeInfo.label} 계정</p>
            <p className="text-xs text-slate-500">{currentUser?.email || "간편 로그인 계정"}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-slate-200/60 px-3 py-1">
            <BadgeIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">{currentUser?.id}</span>
          </div>
        </div>

        {/* 공통 필드: 이름 */}
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 font-medium">이름</FormLabel>
              <FormControl>
                <Input className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all" placeholder="이름" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 공통 필드: 휴대폰 */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 font-medium">휴대폰 번호</FormLabel>
              <FormControl>
                <Input className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all" placeholder="01012345678" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                번호를 변경하시려면 직접 수정 후 저장해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== 학생 전용 필드 ===== */}
        {memberType === "student" && (
          <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/20 p-5">
            <p className="text-sm font-semibold text-blue-800">🎒 학생 정보</p>

            {/* 학교 검색 */}
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-medium">학교</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="h-11 bg-white border-slate-200 focus:bg-white transition-all"
                        placeholder="학교 검색(목록에 없으면 비워주세요)"
                        {...field}
                        onFocus={() => setIsFocused(true)}
                        onChange={handleSearchInputChange}
                        autoComplete="off"
                        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
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
                            const school = filteredHighSchools[virtualItem.index];
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
                                  form.setValue("school", school.highschoolName);
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

            {/* 학교/대상 + 학년 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schoolLevel"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-600 font-medium">초/중/고</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        const grades = GRADE_OPTIONS[value];
                        if (grades && grades.length === 1) {
                          form.setValue("grade", grades[0].value);
                        } else {
                          form.setValue("grade", "");
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white border-slate-200">
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
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-600 font-medium">학년</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white border-slate-200">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableGrades.map((opt) => (
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
            </div>
          </div>
        )}

        {/* ===== 선생님: 전용 앱으로 안내 ===== */}
        {memberType === "teacher" && (
          <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
            <p className="text-sm font-semibold text-emerald-800">📚 선생님 정보</p>
            {currentUser?.teacherProfile?.subject && (
              <p className="text-sm text-slate-600">담당 과목: <span className="font-medium text-slate-900">{currentUser.teacherProfile.subject}</span></p>
            )}
            <a
              href="http://localhost:3020"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
            >
              선생님 전용 앱에서 프로필 수정 →
            </a>
          </div>
        )}

        {/* ===== 학부모: 전용 앱으로 안내 ===== */}
        {memberType === "parent" && (
          <div className="space-y-4 rounded-xl border border-orange-200 bg-orange-50/30 p-5">
            <p className="text-sm font-semibold text-orange-800">👨‍👩‍👧 학부모 정보</p>
            {currentUser?.parentProfile?.parent_type && (
              <p className="text-sm text-slate-600">구분: <span className="font-medium text-slate-900">{currentUser.parentProfile.parent_type}</span></p>
            )}
            <a
              href="http://localhost:3019"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
            >
              학부모 전용 앱에서 프로필 수정 →
            </a>
          </div>
        )}

        {/* SMS 수신동의 */}
        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-slate-200 p-4 bg-slate-50/30">
          <FormControl>
            <Checkbox
              checked={isSmsAgree}
              onCheckedChange={() => setIsSmsAgree((prev) => !prev)}
              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 w-5 h-5 rounded"
            />
          </FormControl>
          <div className="flex w-full justify-between space-y-1 leading-none">
            <FormLabel className="font-medium text-slate-700 cursor-pointer">SMS 광고성 수신동의</FormLabel>
          </div>
        </FormItem>

        <Button
          type="submit"
          className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 rounded-xl transition-all active:scale-[0.98]"
          loading={editProfile.isPending}
        >
          프로필 저장
        </Button>
      </form>
    </Form>
  );
}
