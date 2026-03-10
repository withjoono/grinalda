import {useEffect, useRef, useState} from 'react';
import {useGetUnivListFetch} from '../../../../api/query';
import {createFuzzyMatcher} from '../../../../utils/fuzzyMatchers';
import {isMobile} from 'react-device-detect';

export const useFuzzyMatching = (items, searchingItem, onSelectItem) => {
  const [selecteditem, setSelectedItem] = useState('입력');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isSeachScreenOpen, setIsSearchScreenOpen] = useState(false);

  const [isMobleModalVisible, setIsMobileModalVisible] = useState(false);

  useEffect(() => {
    getUnivsBaseOnUserInput(searchingItem);
  }, [searchingItem]);

  const getUnivsBaseOnUserInput = searchingItem => {
    if (searchingItem !== '') {
      const _filterItems = filterItem(searchingItem);
      setFilteredItems(_filterItems);
    } else {
      setSelectedItem('입력');
      setFilteredItems(() => []);
    }
  };

  const filterItem = searchingItem => {
    if (searchingItem !== '') {
      const filterData = items.filter(item => {
        return createFuzzyMatcher(searchingItem).test(item);
      });
      return filterData;
    } else {
      return [];
    }
  };

  const onClickUnivNameSearch = () => {
    isMobile
      ? setIsMobileModalVisible(!isMobleModalVisible)
      : setIsSearchScreenOpen(!isSeachScreenOpen);
  };

  const onClickItemBtn = selecteditem => {
    console.log('선택', selecteditem);
    console.log(onSelectItem);
    onSelectItem(selecteditem);
    setSelectedItem(selecteditem);
    setIsSearchScreenOpen(false);
    setIsMobileModalVisible(false);
  };

  return {
    filteredItems,
    isSeachScreenOpen,
    selecteditem,
    isMobleModalVisible,
    onClickUnivNameSearch,
    onClickItemBtn,
  };
};
