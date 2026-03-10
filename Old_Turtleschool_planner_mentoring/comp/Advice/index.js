import React from 'react';

import * as S from './index.style';

const Advice = ({ children, ...props }) => {
    return (
        <S.Container {...props}>
            { children }
        </S.Container>
    )
}

export default Advice