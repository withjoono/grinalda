import { useQuery } from "@tanstack/react-query";
import { STATIC_DATA_APIS } from "./apis";
import {
  IStaticData,
  ISubjectCode,
  IGeneralFieldData,
  IMajorFieldData,
  IMidFieldData,
  IMinorFieldData,
  IAdmissionSubtype,
} from "./interfaces";
import { IMainSubject, ISubject } from "@/types/subject.type";

export const staticDataQueryKeys = {
  all: ["staticData"] as const,
  data: () => [...staticDataQueryKeys.all, "data"] as const,
};

export interface ITransformedSubjects {
  MAIN_SUBJECTS: { [key: string]: IMainSubject };
  SUBJECTS: { [key: string]: ISubject };
}

export interface ITransformedMajorField extends IMajorFieldData {
  midFieldIds: number[];
}

export interface ITransformedMidField extends IMidFieldData {
  minorFieldIds: number[];
}

export interface ITransformedFields {
  GENERAL_FIELDS: { [key: number]: IGeneralFieldData };
  MAJOR_FIELDS: { [key: number]: ITransformedMajorField };
  MID_FIELDS: { [key: number]: ITransformedMidField };
  MINOR_FIELDS: { [key: number]: IMinorFieldData };
  ADMISSION_SUBTYPES: { [key: number]: IAdmissionSubtype };
}

export interface ISearchSuggestions {
  universityNames: string[];
  admissionNames: string[];
  recruitmentUnitNames: string[];
}

export interface ITransformedStaticData {
  subjects: ITransformedSubjects;
  fields: ITransformedFields;
  searchSuggestions: ISearchSuggestions;
}

export const useGetStaticData = () => {
  return useQuery<IStaticData, Error, ITransformedStaticData>({
    queryKey: staticDataQueryKeys.data(),
    queryFn: STATIC_DATA_APIS.fetchStaticDataAPI,
    staleTime: 120 * 60 * 1000, // 120 minutes
    select: (data: IStaticData): ITransformedStaticData => {
      const subjects: ITransformedSubjects = {
        MAIN_SUBJECTS: {},
        SUBJECTS: {},
      };

      const fields: ITransformedFields = {
        GENERAL_FIELDS: {},
        MAJOR_FIELDS: {},
        MID_FIELDS: {},
        MINOR_FIELDS: {},
        ADMISSION_SUBTYPES: {},
      };

      // 교과 코드 분류 (교과, 과목)
      data.subjectCodes.forEach((subject: ISubjectCode) => {
        if (!subjects.MAIN_SUBJECTS[subject.main_subject_code]) {
          subjects.MAIN_SUBJECTS[subject.main_subject_code] = {
            code: subject.main_subject_code,
            name: subject.main_subject_name,
            subjectList: [],
          };
        }

        if (
          !subjects.MAIN_SUBJECTS[
            subject.main_subject_code
          ].subjectList.includes(subject.subject_code)
        ) {
          subjects.MAIN_SUBJECTS[subject.main_subject_code].subjectList.push(
            subject.subject_code,
          );
        }

        subjects.SUBJECTS[subject.subject_code] = {
          id: Number(subject.id),
          code: subject.subject_code,
          name: subject.subject_name,
          type: subject.type || 0,
          courseType: subject.course_type,
          isRequired: subject.is_required,
        };
      });

      // Transform fields
      data.generalFields.forEach((field: IGeneralFieldData) => {
        fields.GENERAL_FIELDS[field.id] = field;
      });

      // 대계열 변환
      data.majorFields.forEach((field: IMajorFieldData) => {
        fields.MAJOR_FIELDS[field.id] = {
          ...field,
          midFieldIds: [],
        };
      });

      // 중계열 변환
      data.midFields.forEach((field: IMidFieldData) => {
        fields.MID_FIELDS[field.id] = {
          ...field,
          minorFieldIds: [],
        };
        // 대계열에 중계열 ID 추가
        if (fields.MAJOR_FIELDS[field.major_field_id]) {
          fields.MAJOR_FIELDS[field.major_field_id].midFieldIds.push(field.id);
        }
      });

      // 소계열 변환 및 중계열에 소계열 ID 추가
      data.minorFields.forEach((field: IMinorFieldData) => {
        fields.MINOR_FIELDS[field.id] = field;
        if (fields.MID_FIELDS[field.mid_field_id]) {
          fields.MID_FIELDS[field.mid_field_id].minorFieldIds.push(field.id);
        }
      });

      data.admissionSubtypes.forEach((subtype: IAdmissionSubtype) => {
        fields.ADMISSION_SUBTYPES[subtype.id] = subtype;
      });

      const searchSuggestions: ISearchSuggestions = {
        universityNames: data.universityNames,
        admissionNames: data.admissionNames,
        recruitmentUnitNames: data.recruitmentUnitNames,
      };

      return { subjects, fields, searchSuggestions };
    },
  });
};
