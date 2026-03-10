import React from 'react';
import styles from './index.module.css';

const Banner = ({...props}) => {
    return (
        <img className={styles.container} {...props}/>
    )
}

export default Banner;