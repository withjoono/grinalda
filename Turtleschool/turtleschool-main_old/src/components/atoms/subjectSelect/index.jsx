import {FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import {useEffect} from 'react';
import {useState} from 'react';
import {useSavedUserSubjectsFetch, useSelectSubjectFetch} from '../../../api/query';
import {divideDataFromSubject} from '../../../utils/divideDataFromSubject';

const SubjectSelect = ({
  subjectKey,
  onChangeSelectSubject,
  isFrist,
  savedCode = '',
  isScoreSaved,
}) => {
  const {data: subjects, isLoading} = useSelectSubjectFetch({
    select: res => {
      if (subjectKey === 'res1' || subjectKey === 'res2') {
        return [
          {code_cd: 'soci', code_nm: '사회탐구'},
          {code_cd: 'sci', code_nm: '과학탐구'},
        ];
      } else {
        return divideDataFromSubject(res.data.data)[subjectKey];
      }
    },
  });
  //   const {data: userSubjects} = useSavedUserSubjectsFetch();

  //  MenuItem 리스트중 value와 동일하면
  const [selectedSubject, setSelectedSubject] = useState('');
  useEffect(() => {
    setSelectedSubject(savedCode);
  }, [savedCode]);

  const handleChange = ({target}) => {
    if (target.name === 'sci' || target.name === 'soci') target.isFrist = isFrist;
    onChangeSelectSubject(target);
    setSelectedSubject(target.value);
  };

  if (isLoading) return <div />;

  return (
    <FormControl>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedSubject}
        disabled={isScoreSaved}
        onChange={handleChange}
        name={subjectKey}
        SelectProps={{
          renderValue: value => value,
        }}
      >
        {subjectKey === '' ? (
          <MenuItem disabled>탐구과목을 선택해주세요.</MenuItem>
        ) : (
          subjects.map(item => {
            return <MenuItem value={item.code_cd}>{item.code_nm}</MenuItem>;
          })
        )}
      </Select>
    </FormControl>
  );
};
export default SubjectSelect;
