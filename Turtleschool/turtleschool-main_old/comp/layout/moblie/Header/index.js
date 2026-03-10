import Image from 'next/image';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import SideNav from '../SideNav';
import styles from './index.module.css';
import PropTypes from 'prop-types';

const Header = ({redirectMenu}) => {
  const [leftMenuVisible, setLeftMenuVisible] = useState(false);

  const onMenuClick = () => {
    setLeftMenuVisible(prev => !prev);
  };

  useEffect(() => {
    document.documentElement.style.overflow = leftMenuVisible ? 'hidden' : 'auto';
    document.body.scroll = leftMenuVisible ? 'no' : 'yes';
  }, [leftMenuVisible]);

  useEffect(() => {
    if (redirectMenu !== '') {
      setLeftMenuVisible(true);
    }
  }, [redirectMenu]);

  return (
    <div className={styles.container}>
      <button onClick={onMenuClick} className={styles.left_container}>
        <Image alt='' src="https://img.ingipsy.com/assets/header/menu@3x.png" width="24px" height="24px" />
      </button>
      <div className={styles.center}>
        <Link href="/" passHref>
          <Image
            alt=""
            src="https://img.ingipsy.com/assets/header/logo@3x.png"
            width="130px"
            height="52px"
          />
        </Link>
      </div>
      <div className={styles.right_container}></div>
      <SideNav
        right={leftMenuVisible ? '0px' : '100%'}
        onDismiss={() => setLeftMenuVisible(false)}
        redirectMenu={redirectMenu}
      />
    </div>
  );
};

Header.propTypes = {
  redirectMenu: PropTypes.node.isRequired
};

export default Header;
