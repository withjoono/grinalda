import {useState} from 'react';
import styled from 'styled-components';
import {StyledRow} from '../../box/row';
import {useInput} from '../../../../hooks/useInput';
import {useFuzzyMatching} from './useFuzzyMatching';
import {useEffect} from 'react';
import Modal from 'react-modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
export const RegularTD = styled.td`
  border: 1px solid #c2c2c2;
  font-weight: normal;
  font-size: 0.6rem;
  line-height: 18px;
  text-align: center;
  color: black;
  padding: 0.2rem;
  background-color: ${props => (props.dark ? '#EAEAEA' : '#fff')};
  position: relative;
  &:first-child {
    padding: 0.7rem 0px;
  }
`;

export const InputButton = styled.button`
  width: 80%;
  border: 1px solid #e77536;
  color: #9a9a9a;
  border-radius: 0.15rem;
  font-size: 0.6rem;
  padding: 0.3rem 0.6rem;
  display: flex;
  margin: auto;
`;

export const SearchScreen = styled.div`
  padding: 2rem;
  position: absolute;
  border: 1px solid;
  top: 3rem;
  /* left: 1.5rem; */
  background-color: #fff;
  width: 18rem;
  border: 1px solid #e77536;
  ${props => (props.searchType === 'univ' ? {left: '1.5rem'} : {right: '1.5rem'})};
`;

const UnivInputLabel = styled.label`
  display: flex;
  font-size: 1rem;
`;

const InputLabelText = styled.span`
  font-size: 0.8rem;
  text-align: start;
  padding: 0 0.31rem;
  width: 4rem;
  font-weight: bold;
`;

const SearchInput = styled.input`
  border-left: 1px solid #9a9a9a;
  padding: 0 0.5rem;
  font-size: 0.7rem;
`;

const Row = styled(StyledRow)`
  border-bottom: 2px solid #3d94de;
  padding: 0 0 0.2rem 0;
`;

const UnivsDataRow = styled(StyledRow)`
  flex-wrap: wrap;
  margin: 2rem 0 0 0;
`;

const UnivItem = styled.button`
  background-color: #fff2ed;
  color: #f45119;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.5rem;
  height: 1.5rem;
  font-size: 0.6rem;
  margin: 0.2rem;
`;

const FuzzyMatchingTd = ({label, items, searchType = 'univ', onSelectItem, isReset = true}) => {
  const searchingItem = useInput('');
  const {
    filteredItems,
    isSeachScreenOpen,
    selecteditem,
    isMobleModalVisible,
    onClickUnivNameSearch,
    onClickItemBtn,
  } = useFuzzyMatching(items, searchingItem.value, onSelectItem);

  useEffect(() => {
    searchingItem.setValue('');
  }, [isReset]);

  console.log('items', items);

  return (
    <RegularTD>
      <InputButton onClick={onClickUnivNameSearch}>{selecteditem ?? '입력'}</InputButton>
      {isSeachScreenOpen && (
        <SearchScreen searchType={searchType}>
          <Row>
            <UnivInputLabel>
              <InputLabelText>{label}</InputLabelText>
              <SearchInput {...searchingItem}></SearchInput>
            </UnivInputLabel>
          </Row>
          <UnivsDataRow>
            {filteredItems.map(item => {
              return (
                <UnivItem onClick={() => onClickItemBtn(item)} key={item}>
                  {item}
                </UnivItem>
              );
            })}
          </UnivsDataRow>
        </SearchScreen>
      )}
      <Modal isOpen={isMobleModalVisible} style={customStyles} contentLabel="Example Modal">
        <div style={{width: '18rem', height: '70vh'}}>
          <SearchScreen searchType={searchType}>
            <Row>
              <UnivInputLabel>
                <InputLabelText>{label}</InputLabelText>
                <SearchInput {...searchingItem}></SearchInput>
              </UnivInputLabel>
            </Row>
            <UnivsDataRow>
              {filteredItems.map(item => {
                return (
                  <UnivItem onClick={() => onClickItemBtn(item)} key={item}>
                    {item}
                  </UnivItem>
                );
              })}
            </UnivsDataRow>
          </SearchScreen>
        </div>
      </Modal>
    </RegularTD>
  );
};

export default FuzzyMatchingTd;
