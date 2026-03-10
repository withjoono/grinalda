import React from 'react';
import Link from 'next/link';
import styles from './index.module.css';
import PropTypes from 'prop-types';



const Buttons = ({prevPage, nextPage}) => {
    
    return (
        <div className={styles.buttonBox}>
            <Link href={prevPage} passHref>
                <button className={`${styles.button} ${styles.disableButton}`}>
                    이전 단계
                </button>
            </Link>
            <Link href={nextPage} passHref>
                <button className={`${styles.button} ${styles.activeButton}`}>
                    다음 단계
                </button>
            </Link>
        </div>
    )
}

Buttons.propTypes = {
    prevPage: PropTypes.string.isRequired,
    nextPage: PropTypes.string.isRequired
}

export default Buttons