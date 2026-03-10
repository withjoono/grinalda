import React from 'react';
import * as S from './index.style'
const Button = ({ children, ...props }) => {
    return (
        <S.Container>
            <S.Button {...props}>
                { children }
            </S.Button>
        </S.Container>
    )
}

export default Button