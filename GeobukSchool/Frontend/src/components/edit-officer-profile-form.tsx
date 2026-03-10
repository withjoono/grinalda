import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./custom/button";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { editOfficerProfileFormSchema } from "@/lib/validations/edit-officer-profile";
import { useOfficerProfile } from "@/stores/server/features/susi/evaluation/queries";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SPRING_API } from "@/stores/server/features/spring/apis";

interface Props {
  className?: string;
}

export function EditOfficerProfileForm({ className }: Props) {
  const { data: officerProfile, refetch: refetchOfficerProfile } =
    useOfficerProfile();
  const navigate = useNavigate();
  const { image, setImage, imageInput, handleImageClick, handleImageChange } =
    useImageUpload();

  const form = useForm<z.infer<typeof editOfficerProfileFormSchema>>({
    resolver: zodResolver(editOfficerProfileFormSchema),
    defaultValues: {
      name: "",
      university: "",
      education: "",
    },
  });

  useEffect(() => {
    if (officerProfile) {
      setImage(officerProfile.officer_profile_image);
      form.reset({
        name: officerProfile.officer_name || "",
        university: officerProfile.university || "",
        education: officerProfile.education || "",
      });
    }
  }, [officerProfile, form, setImage]);

  const onSubmit = async (
    values: z.infer<typeof editOfficerProfileFormSchema>,
  ) => {
    try {
      const file = imageInput.current?.files?.[0] || null;
      const result = await SPRING_API.updateOfficerProfileAPI(
        values.name,
        values.university,
        values.education,
        file,
      );
      if (result.status) {
        toast.success("성공적으로 프로필을 업데이트했습니다.");
        await refetchOfficerProfile();
        navigate({ to: "/officer/profile" });
      } else {
        toast.error("저장에 실패했습니다");
      }
    } catch (e) {
      console.error(e);
      toast.error("저장에 실패했습니다");
    }
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-2", className)}>
        <img
          src={image}
          className="size-40 cursor-pointer rounded-full"
          onClick={handleImageClick}
          alt="Profile"
        />
        <input
          type="file"
          onChange={handleImageChange}
          ref={imageInput}
          className="hidden"
          accept="image/*"
        />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="이름" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>출신대학</FormLabel>
                <FormControl>
                  <Input placeholder="출신대학" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>학과/학력</FormLabel>
                <FormControl>
                  <Input placeholder="학과/학력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            저장
          </Button>
        </form>
      </div>
    </Form>
  );
}

const useImageUpload = () => {
  const [image, setImage] = useState<string>("");
  const imageInput = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    imageInput.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertBase64(file);
      setImage(base64 as string);
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  return { image, setImage, imageInput, handleImageClick, handleImageChange };
};
