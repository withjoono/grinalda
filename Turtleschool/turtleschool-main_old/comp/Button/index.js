import React from 'react';
import * as S from './index.style';
import PropTypes from 'prop-types';

const Button = ({children, ...props}) => {
  return (
    <S.Container>
      <S.Button {...props}>{children}</S.Button>
    </S.Container>
  );
};

//This is for eslint
Button.propTypes = {
  children: PropTypes.node.isRequired
};

export default Button;
