import React from 'react';
import * as S from './index.style';
import PropTypes from 'prop-types';

const Advice = ({children, ...props}) => {
  return <S.Container {...props}>{children}</S.Container>;
};

//This is for eslint
Advice.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Advice;
