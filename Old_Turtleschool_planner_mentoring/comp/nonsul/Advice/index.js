import React from 'react';
import styles from './index.module.css';

const Advice = ({ children }) => {
    return (
        <div className={styles.advice}>
            {children}                  
        </div>
    )
}

export default Advice;