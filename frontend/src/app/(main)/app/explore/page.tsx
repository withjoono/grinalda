'use client';

import { useAllRegions } from '@/apis/hooks/use-regions';
import {
  RegionSelector,
  RegionSelectorError,
  RegionSelectorSkeleton,
} from './_components/region-selector';
import { useMemo, useState } from 'react';
import { useAllAdmissionTypes } from '@/apis/hooks/use-admission-types';
import {
  AdmissionTypeSelector,
  AdmissionTypeSelectorError,
  AdmissionTypeSelectorSkeleton,
} from './_components/admission-type-selector';
import { useAllSearchTags } from '@/apis/hooks/use-search-tags';
import {
  SearchTagSelector,
  SearchTagSelectorError,
  SearchTagSelectorSkeleton,
} from './_components/search-tag-selector';
import { useAllEarlyAdmissions } from '@/apis/hooks/use-early-admissions';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RegionBadge } from '@/components/badges/region-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { AdmissionTypeBadge } from '@/components/badges/admission-type-badge';
import { useAddBookmark, useMyBookmarks } from '@/apis/hooks/use-bookmarks';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageRoutes } from '@/constants/routes';
import { toast } from 'sonner';

export default function AppExplore() {
  const {
    data: regions,
    isPending: isRegionsPending,
    isError: isRegionsError,
    refetch: refetchRegions,
  } = useAllRegions();
  const {
    data: admissionTypes,
    isPending: isAdmissionTypesPending,
    isError: isAdmissionTypesError,
    refetch: refetchAdmissionTypes,
  } = useAllAdmissionTypes();
  const {
    data: searchTags,
    isPending: isSearchTagsPending,
    isError: isSearchTagsError,
    refetch: refetchSearchTags,
  } = useAllSearchTags();
  const {
    data: earlyAdmissions,
    isPending: isEarlyAdmissionsPending,
    isError: isEarlyAdmissionsError,
    refetch: refetchEarlyAdmissions,
  } = useAllEarlyAdmissions();

  const { mutateAsync: addBookmark } = useAddBookmark();

  const { data: bookmarks } = useMyBookmarks();
  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>([]);
  const [selectedAdmissionTypePrefixes, setSelectedAdmissionTypePrefixes] =
    useState<string[]>([]);
  const [selectedSearchTagIds, setSelectedSearchTagIds] = useState<number[]>(
    []
  );

  const bookmarkIdMap = useMemo(() => {
    return bookmarks?.reduce(
      (acc, bookmark) => {
        acc[bookmark.earlyAdmission.id] = bookmark.earlyAdmission.id;
        return acc;
      },
      {} as Record<number, number>
    );
  }, [bookmarks]);

  const admissionTypePrefixes = useMemo(() => {
    const arr = new Set(
      admissionTypes?.map((admissionType) => admissionType.name.split('_')[0])
    );
    return Array.from(arr);
  }, [admissionTypes]);

  // 지역 선택
  const handleRegionClick = (id: number) => {
    if (selectedRegionIds.includes(id)) {
      setSelectedRegionIds(
        selectedRegionIds.filter((regionId) => regionId !== id)
      );
    } else {
      setSelectedRegionIds([...selectedRegionIds, id]);
    }
  };

  // 입학 유형 선택
  const handleAdmissionTypeClick = (name: string) => {
    if (selectedAdmissionTypePrefixes.includes(name)) {
      setSelectedAdmissionTypePrefixes(
        selectedAdmissionTypePrefixes.filter((typeName) => typeName !== name)
      );
    } else {
      setSelectedAdmissionTypePrefixes([
        ...selectedAdmissionTypePrefixes,
        name,
      ]);
    }
  };

  // 검색 태그 선택
  const handleSearchTagClick = (id: number) => {
    if (selectedSearchTagIds.includes(id)) {
      setSelectedSearchTagIds(
        selectedSearchTagIds.filter((tagId) => tagId !== id)
      );
    } else {
      setSelectedSearchTagIds([...selectedSearchTagIds, id]);
    }
  };

  const filteredEarlyAdmissions = useMemo(() => {
    if (!earlyAdmissions) return [];
    return earlyAdmissions.filter((admission) => {
      // 지역 필터
      const regionMatch =
        selectedRegionIds.length === 0 ||
        selectedRegionIds.includes(admission.university.region.id);
      // 입학유형 필터
      const admissionTypeMatch =
        selectedAdmissionTypePrefixes.length === 0 ||
        selectedAdmissionTypePrefixes.includes(
          admission.admissionType.name.split('_')[0]
        );
      // 검색 태그 필터
      const searchTagMatch =
        selectedSearchTagIds.length === 0 ||
        admission.searchTags?.some((tag) =>
          selectedSearchTagIds.includes(tag.id)
        );
      return regionMatch && admissionTypeMatch && searchTagMatch;
    });
  }, [
    earlyAdmissions,
    selectedRegionIds,
    selectedAdmissionTypePrefixes,
    selectedSearchTagIds,
  ]);

  const hasRequiredSelections = useMemo(() => {
    return (
      selectedRegionIds.length > 0 || selectedAdmissionTypePrefixes.length > 0
    );
  }, [selectedRegionIds, selectedAdmissionTypePrefixes]);

  const handleBookmarkClick = async (earlyAdmissionId: number) => {
    await addBookmark(earlyAdmissionId);
    toast.success('모의지원 목록에 추가되었습니다.');
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-center pb-8'>
        <h3 className='text-2xl font-bold'>2025학년도 수시 전형</h3>
      </div>
      <div className='space-y-8'>
        {isRegionsPending ? (
          <RegionSelectorSkeleton />
        ) : isRegionsError ? (
          <RegionSelectorError refetch={refetchRegions} />
        ) : (
          <RegionSelector
            regions={regions}
            selectedRegionIds={selectedRegionIds}
            handleRegionClick={handleRegionClick}
          />
        )}

        {isAdmissionTypesPending ? (
          <AdmissionTypeSelectorSkeleton />
        ) : isAdmissionTypesError ? (
          <AdmissionTypeSelectorError refetch={refetchAdmissionTypes} />
        ) : (
          <AdmissionTypeSelector
            admissionTypePrefixes={admissionTypePrefixes}
            selectedAdmissionTypePrefixes={selectedAdmissionTypePrefixes}
            handleAdmissionTypeClick={handleAdmissionTypeClick}
          />
        )}
        {isSearchTagsPending ? (
          <SearchTagSelectorSkeleton />
        ) : isSearchTagsError ? (
          <SearchTagSelectorError refetch={refetchSearchTags} />
        ) : (
          <SearchTagSelector
            searchTags={searchTags}
            selectedSearchTagIds={selectedSearchTagIds}
            handleSearchTagClick={handleSearchTagClick}
          />
        )}
      </div>

      <div className='pt-12'>
        {isEarlyAdmissionsPending ? (
          <LoadingSection />
        ) : isEarlyAdmissionsError ? (
          <ErrorSection onRetry={refetchEarlyAdmissions} />
        ) : !hasRequiredSelections ? (
          <div className='py-8 text-center text-muted-foreground'>
            지역이나 전형유형을 하나 이상 선택해주세요.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[70px]'>지역</TableHead>
                <TableHead className='w-[120px]'>대학</TableHead>
                <TableHead className='w-[100px]'>전형유형</TableHead>
                <TableHead>전형명</TableHead>
                <TableHead>학과명</TableHead>
                <TableHead>전형방법</TableHead>
                <TableHead className='w-[100px]'>모집인원</TableHead>
                <TableHead className='w-[100px]'>모의지원</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEarlyAdmissions?.map((earlyAdmission) => {
                const admissionType =
                  earlyAdmission.admissionType.name.split('_')[0];
                return (
                  <TableRow key={earlyAdmission.id}>
                    <TableCell className='font-medium'>
                      <RegionBadge
                        name={earlyAdmission.university.region.name}
                      />
                    </TableCell>
                    <TableCell>{earlyAdmission.university.name}</TableCell>
                    <TableCell>
                      <AdmissionTypeBadge name={admissionType} />
                    </TableCell>
                    <TableCell>{earlyAdmission.admissionName}</TableCell>
                    <TableCell>{earlyAdmission.departmentName}</TableCell>
                    <TableCell>
                      {earlyAdmission.elementReflectionRatioInfo}
                    </TableCell>
                    <TableCell>{earlyAdmission.quota}</TableCell>
                    <TableCell>
                      {bookmarkIdMap?.[earlyAdmission.id] ? (
                        <Link
                          href={PageRoutes.APP_BOOKMARK}
                          className={cn(buttonVariants({ variant: 'outline' }))}
                        >
                          ✅ 완료
                        </Link>
                      ) : (
                        <Button
                          variant='outline'
                          onClick={() => handleBookmarkClick(earlyAdmission.id)}
                        >
                          지원하기
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
