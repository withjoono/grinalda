import React from 'react';
import styles from './index.module.css';
import PropTypes from 'prop-types';

const Button = ({children, ...props}) => {
  return (
    <button className={styles.select_all} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired
};

export default Button;
