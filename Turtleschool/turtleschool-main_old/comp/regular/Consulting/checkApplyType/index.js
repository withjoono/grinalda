import React, {useState} from 'react';
import Button from '../../../Button';
import * as S from './index.style';
import PropTypes from 'prop-types';

const noneOfTypes = ['해당 사항 없음 (일반전형으로 진행)'];
const inTypes = ['대학별 독자적 기준', '고른기회 특별전형', '특기자'];
const outTypes = {
  early: [
    '농어촌 학생',
    '특성화고교 졸업자',
    '특성화고 등을 졸업한 재직자',
    '기초생활 수급자, 차상위 계층, 한부모가족 지원대상자',
    '장애인 등 대상자',
    '서해5도',
    '제주특별자치도 특별전형',
    '계약학과',
    '위탁교육생',
    '군위탁생',
    '재외국인 및 외국인',
  ],
  regular: [
    '농어촌 학생',
    '특성화고교 졸업자',
    '특성화고 등을 졸업한 재직자',
    '기초생활 수급자, 차상위 계층, 한부모가족 지원대상자',
    '장애인 등 대상자',
    '계약학과',
    '재외국인 및 외국인',
  ],
};

const CheckApplyType = ({type}) => {
  const [selectedType, setSelectedType] = useState('');
  const [submit, setSubmit] = useState(false);
  const typeName = (type === '교과') | (type === '학종') ? 'early' : 'regular';

  const onCheckBoxClick = ({target}) => {
   
    if (target.checked) {
      setSelectedType(target.id);
    } else {
      setSelectedType('');
    }
  };

  const onSubmitClick = () => {
    if (selectedType !== '') {
      setSubmit(prev => !prev);
    } else {
      alert('전형을 선택하세요.');
    }
  };

  const renderCheckBox = title => (
    <S.CheckBoxContent
      //   onClick={() => onCheckBoxClick({target: '가'})}
      key={title}
      active={selectedType === title}
    >
      <S.CheckBoxInput
        type="checkbox"
        id={title}
        checked={selectedType === title}
        onChange={onCheckBoxClick}
      />
      <label htmlFor={title} />
      <S.CheckBoxTitle>{title}</S.CheckBoxTitle>
    </S.CheckBoxContent>
  );
  return (
    <S.Container>
      <S.Section>
        <S.ContentTitle>{'특별 전형 해당 사항 없음'}</S.ContentTitle>
        <S.CheckBoxContainer>{noneOfTypes.map(renderCheckBox)}</S.CheckBoxContainer>
      </S.Section>
      <S.Section>
        <S.ContentTitle>{'특별 전형 정원 내'}</S.ContentTitle>
        <S.CheckBoxContainer>{inTypes.map(renderCheckBox)}</S.CheckBoxContainer>
      </S.Section>
      <S.Section>
        <S.ContentTitle>{'특별 전형 정원 외'}</S.ContentTitle>
        <S.CheckBoxContainer>{outTypes[typeName].map(renderCheckBox)}</S.CheckBoxContainer>
      </S.Section>
      <S.SaveButtonLayout>
        <Button
          onClick={onSubmitClick}
          active={submit}
          style={{
            minWidth: 240,
            margin: '8px 0px',
          }}
        >
          {submit ? '수정하기' : '저장하기'}
        </Button>
      </S.SaveButtonLayout>
    </S.Container>
  );
};

CheckApplyType.propTypes = {
  type: PropTypes.node.isRequired,
};

export default CheckApplyType;
