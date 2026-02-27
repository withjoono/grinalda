'use client';

import React, { memo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { SchoolRecordSelectSubjectInput } from '@/apis/hooks/use-school-record';
import { SchoolSubjectGroup } from '@/apis/hooks/use-subjects';

export const SelectSubjectInputItem = memo(
  ({
    index,
    onChangeSubjectValue,
    subject,
    schoolSubjectGroups,
  }: {
    index: number;
    onChangeSubjectValue: (
      index: number,
      type: string,
      value: number | string
    ) => void;
    subject: SchoolRecordSelectSubjectInput;
    schoolSubjectGroups: SchoolSubjectGroup[];
  }) => {
    const [openGroup, setOpenGroup] = useState(false);
    const [openSubject, setOpenSubject] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
      subject?.subjectGroupId && subject.subjectGroupId !== 0
        ? subject.subjectGroupId
        : null
    );

    // useMemo 제거하고 직접 계산
    const selectedGroup = schoolSubjectGroups?.find(
      (group) => group.id === selectedGroupId
    );

    const handleGroupSelect = (groupName: string) => {
      const group = schoolSubjectGroups.find((g) => g.name === groupName);
      if (group) {
        setSelectedGroupId(group.id);
        onChangeSubjectValue(index, 'subjectGroupId', group.id);
        onChangeSubjectValue(index, 'subjectName', '');
        setOpenGroup(false);
      }
    };
    return (
      <div className='flex items-center gap-2'>
        <Select
          value={subject.semester.toString() || ''}
          onValueChange={(value) =>
            onChangeSubjectValue(index, 'semester', Number(value))
          }
        >
          <SelectTrigger className='min-w-[80px] max-w-[80px]'>
            <SelectValue placeholder='학기 선택' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>학기 선택</SelectLabel>
              <SelectItem value='1'>1학기</SelectItem>
              <SelectItem value='2'>2학기</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover open={openGroup} onOpenChange={setOpenGroup}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={openGroup}
              className={cn(
                'flex min-w-[120px] max-w-[120px] items-center justify-between overflow-hidden px-3',
                selectedGroup ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {selectedGroup ? selectedGroup.name : '교과 선택'}
              <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='min-w-[120px] p-0'>
            <Command>
              <CommandInput placeholder='교과 검색...' className='h-9' />
              <CommandList>
                <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                <CommandGroup>
                  {schoolSubjectGroups.map((group) => (
                    <CommandItem
                      key={group.id}
                      value={group.name}
                      onSelect={handleGroupSelect}
                    >
                      {group.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedGroupId === group.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openSubject} onOpenChange={setOpenSubject}>
          <PopoverTrigger asChild>
            <Button
              disabled={!selectedGroupId}
              variant='outline'
              role='combobox'
              aria-expanded={openSubject}
              className={cn(
                'line-clamp-1 flex min-w-[120px] max-w-[120px] items-center justify-between overflow-hidden px-3',
                subject.subjectName
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {subject.subjectName || '과목 선택'}
              {subject.subjectName ? null : (
                <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='min-w-[120px] p-0'>
            <Command>
              <CommandInput placeholder='과목 검색...' className='h-9' />
              <CommandList>
                <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                <CommandGroup>
                  {selectedGroup?.subjects.map((subj) => (
                    <CommandItem
                      key={subj.id}
                      value={subj.name}
                      onSelect={() => {
                        onChangeSubjectValue(index, 'subjectName', subj.name);
                        setOpenSubject(false);
                      }}
                    >
                      {subj.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          subject.subjectName === subj.name
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          className='min-w-[70px] max-w-[70px]'
          placeholder='단위수'
          type='text'
          value={subject.units || ''}
          onChange={(e) => onChangeSubjectValue(index, 'units', e.target.value)}
        />
        <Input
          className='min-w-[70px] max-w-[70px]'
          placeholder='원점수'
          type='text'
          value={subject.score || ''}
          onChange={(e) => onChangeSubjectValue(index, 'score', e.target.value)}
        />
        <Input
          className='min-w-[70px] max-w-[70px]'
          placeholder='과목평균'
          type='text'
          value={subject.average || ''}
          onChange={(e) =>
            onChangeSubjectValue(index, 'average', e.target.value)
          }
        />

        <Select
          value={subject.achievement || ''}
          onValueChange={(value) => {
            onChangeSubjectValue(index, 'achievement', value);
          }}
        >
          <SelectTrigger className='min-w-[70px] max-w-[70px]'>
            <SelectValue placeholder='성취도' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>성취도</SelectLabel>
              {['A', 'B', 'C', 'D', 'E'].map((achievement) => (
                <SelectItem key={achievement} value={achievement}>
                  {achievement}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className='min-w-[70px] max-w-[70px]'
          placeholder='수강자수'
          type='text'
          value={subject.numberOfStudents || ''}
          onChange={(e) =>
            onChangeSubjectValue(index, 'numberOfStudents', e.target.value)
          }
        />

        {/* 새로 추가된 필드들 */}
        <Input
          className='min-w-[70px] max-w-[70px]'
          placeholder='A비율'
          type='text'
          value={subject.achievementRatioA || ''}
          onChange={(e) =>
            onChangeSubjectValue(index, 'achievementRatioA', e.target.value)
          }
        />
        <Input
          className='min-w-[70px] max-w-[70px]'
          placeholder='B비율'
          type='text'
          value={subject.achievementRatioB || ''}
          onChange={(e) =>
            onChangeSubjectValue(index, 'achievementRatioB', e.target.value)
          }
        />
        <Input
          className='min-w-[70px] max-w-[70px]'
          placeholder='C비율'
          type='text'
          value={subject.achievementRatioC || ''}
          onChange={(e) =>
            onChangeSubjectValue(index, 'achievementRatioC', e.target.value)
          }
        />
      </div>
    );
  }
);

SelectSubjectInputItem.displayName = 'SelectSubjectInputItem';
