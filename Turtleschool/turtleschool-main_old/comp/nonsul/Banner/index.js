import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';

const Banner = ({...props}) => {
  return <Image alt='' className={styles.container} {...props} />;
};

export default Banner;
