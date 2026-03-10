import React from 'react';
import styles from './index.module.css';

const Button = ({ children, ...props }) => {
    return (
        <button className={styles.select_all} {...props}>
                                {children}
         </button>
    )
}

export default Button;