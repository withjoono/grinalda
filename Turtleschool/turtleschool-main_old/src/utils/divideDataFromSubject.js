export const divideDataFromSubject = subjects => {
  const _Subjects = {
    soci: [],
    sci: [],
    kor: [],
    mat: [],
    eng: [],
    for: [],
  };

  subjects.forEach(subject => {
    console.log();
    switch (subject.lar_subject_nm) {
      case '사회탐구':
        _Subjects.soci = [..._Subjects.soci, subject];
        break;
      case '과학탐구':
        _Subjects.sci = [..._Subjects.sci, subject];
        break;
      case '국어':
        _Subjects.kor = [..._Subjects.kor, subject];
        break;
      case '수학':
        _Subjects.mat = [..._Subjects.mat, subject];
        break;
      case '영어':
        _Subjects.eng = [..._Subjects.eng, subject];
        break;
      case '제2외국어':
        _Subjects.for = [..._Subjects.for, subject];
        break;
    }
  });

  return _Subjects;
};
