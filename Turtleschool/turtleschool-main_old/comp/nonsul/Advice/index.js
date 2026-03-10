import React from 'react';
import styles from './index.module.css';
import PropTypes from 'prop-types';

const Advice = ({children}) => {
  return <div className={styles.advice}>{children}</div>;
};

Advice.propTypes = {
  children: PropTypes.node.isRequired
};

export default Advice;
