import { parsingApiClient } from "../../api-client";

interface 일반과목 {
  과목명: string;
  과목평균?: string;
  교과명: string;
  단위수?: string;
  석차등급?: string;
  성취도?: string;
  수강자수?: string;
  원점수?: string;
  표준편차?: string;
}

interface 진로선택과목 {
  교과명: string;
  과목명: string;
  단위수?: string;
  원점수?: string;
  과목평균?: string;
  성취도?: string;
  수강자수?: string;
  석차등급?: string;
  성취도분포비율A?: string;
  성취도분포비율B?: string;
  성취도분포비율C?: string;
}

interface 체육예술과목 {
  교과명: string;
  과목명: string;
  단위수?: string;
  성취도?: string;
}

interface ParsedSchoolRecordData {
  academic_records: {
    "1학년"?: {
      "1학기": {
        일반: 일반과목[];
        진로선택: 진로선택과목[];
        체육예술: 체육예술과목[];
      };
      "2학기": {
        일반: 일반과목[];
        진로선택: 진로선택과목[];
        체육예술: 체육예술과목[];
      };
    };
    "2학년"?: {
      "1학기": {
        일반: 일반과목[];
        진로선택: 진로선택과목[];
        체육예술: 체육예술과목[];
      };
      "2학기": {
        일반: 일반과목[];
        진로선택: 진로선택과목[];
        체육예술: 체육예술과목[];
      };
    };
    "3학년"?: {
      "1학기": {
        일반: 일반과목[];
        진로선택: 진로선택과목[];
        체육예술: 체육예술과목[];
      };
      "2학기": {
        일반: 일반과목[];
        진로선택: 진로선택과목[];
        체육예술: 체육예술과목[];
      };
    };
  };
}

export const parsingSchoolRecord = async (
  file: File,
): Promise<{
  status: "success" | "error";
  message: string;
  data: ParsedSchoolRecordData | null;
}> => {
  const form = new FormData();
  form.append("file", file);
  const res = await parsingApiClient.post("/api/parse-grades", form);

  return res.data;
};

export const PARSING_API = {
  parsingSchoolRecord,
};
