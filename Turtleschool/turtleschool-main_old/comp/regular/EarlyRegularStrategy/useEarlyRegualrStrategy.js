import {useEffect, useRef, useState} from 'react';
import {QueryClient, useMutation, useQueryClient} from 'react-query';
import {
  getOccasionalUnivList,
  removeOccasionalApply,
  saveOccasionalApply,
} from '../../../src/api/csat';
import {
  useGetOccasionalApply,
  useGetOccasionalApplyAndCalculateScore,
  useGetUnivListFetch,
} from '../../../src/api/query';

const initialUnivOccasional = {
  univ_nm: null,
  recruit_contents: null,
  recruit_type: null,
  major_nm: null,
};

export const useEarlyRegularStrategy = () => {
  const qeuryClient = useQueryClient();
  const {data: univList} = useGetUnivListFetch();
  const {data: occasionalUnivList} = useGetOccasionalApply();
  const {data: occasionalUnivCalculateScoreList} = useGetOccasionalApplyAndCalculateScore();
  const [recruitContentList, setRecruitContentList] = useState([]);
  const [recruitTypeList, setRecruitTypeList] = useState([]);
  const [majorList, setMajorList] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [selectedUnivOccasional, setSelectedUnivOccasional] = useState(initialUnivOccasional);
  const [selectedApply, setSelectedApply] = useState(null);
  const saveOccasionalApplyMutation = useMutation(
    selectedUnivOccasional => saveOccasionalApply(selectedUnivOccasional),
    {
      onSuccess: ({data}) => {
        if (data.success) {
          setIsReset(!isReset);
          qeuryClient.invalidateQueries('occasionalApplyList');
          qeuryClient.invalidateQueries('getOccasionalApplyAndCalculateScore');
        }
      },
    },
  );
  const delOcassionalApplyMutation = useMutation(params => removeOccasionalApply(params), {
    onSuccess: ({data}) => {
      setIsReset(!isReset);
      qeuryClient.invalidateQueries('occasionalApplyList');
      qeuryClient.invalidateQueries('getOccasionalApplyAndCalculateScore');
    },
  });

  useEffect(() => {
    setSelectedUnivOccasional(initialUnivOccasional);
    setRecruitContentList([]);
    setRecruitTypeList([]);
    setMajorList([]);
  }, [isReset]);

  const getOccasionalUnivListFetch = async (univ_nm, recruit_contents, recruit_type = null) => {
    const params = {
      univ_nm,
      recruit_contents,
      recruit_type,
    };

    const {data} = await getOccasionalUnivList(params);

    if (data.success) {
      if (recruit_type === null) {
        const _recruitTypeList = [];

        data.data.forEach(({recruit_type}) => {
          if (_recruitTypeList.indexOf(recruit_type) === -1) {
            _recruitTypeList.push(recruit_type);
          }
        });
        setRecruitTypeList(_recruitTypeList);
      } else {
        // const _majorList = [];
        // data.data.forEach(({major_nm}) => {
        //   _majorList.push(major_nm);
        // });

        setMajorList(data.data);
      }
    }
  };

  const onSelectUniv = univ => {
    setSelectedUnivOccasional(prev => {
      return {univ_nm: univ, recruit_contents: '', recruit_type: ''};
    });
    setRecruitContentList(['학종', '교과', '논술']);
    setMajorList([]);
    setRecruitTypeList([]);
  };

  const onSelectRecruitContents = async ({target}) => {
    setSelectedUnivOccasional(prev => {
      return {...prev, recruit_contents: target.value};
    });

    getOccasionalUnivListFetch(selectedUnivOccasional.univ_nm, target.value);
  };

  const onSelectRecruitType = ({target}) => {
    setSelectedUnivOccasional(prev => {
      return {...prev, recruit_type: target.value};
    });

    getOccasionalUnivListFetch(
      selectedUnivOccasional.univ_nm,
      selectedUnivOccasional.recruit_contents,
      target.value,
    );
  };

  const onSelectMajor = async major => {
    const _selectedApply = majorList.filter(_major => _major.major_nm === major);
    setSelectedApply(_selectedApply[0]);
  };

  const onClickSaveOccasionalUniv = async () => {
    const applyCount = occasionalUnivList?.data?.data?.length ?? 0;
    if (applyCount < 6) {
      const params = {
        occasional_id: selectedApply.occasional_id,
      };
      saveOccasionalApplyMutation.mutate(params);
    } else {
      alert('수시지원은 최대 6개까지 가능합니다.');
    }
  };

  const delOcassionalUniv = occasional_id => {
    const params = {occasional_id};
    delOcassionalApplyMutation.mutate(params);
  };

  return {
    univList: univList?.data?.data.map(({name}) => name) ?? [],
    recruitContentList,
    occasionalUnivList: occasionalUnivList?.data?.data ?? [],
    recruitTypeList,
    selectedUnivOccasional,
    occasionalUnivCalculateScoreList: occasionalUnivCalculateScoreList?.data?.data ?? [],
    onSelectUniv,
    onSelectRecruitContents,
    onSelectRecruitType,
    onSelectMajor,
    onClickSaveOccasionalUniv,
    delOcassionalUniv,
    majorList,
    isReset,
  };
};
