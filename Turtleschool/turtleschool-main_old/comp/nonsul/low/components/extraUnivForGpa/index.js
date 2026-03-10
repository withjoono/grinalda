import classNames from 'classnames/bind';
import React, {useCallback, useState} from 'react';
import Components from './components';
import styles from './index.module.css';

const cx = classNames.bind(styles);

const ExtraUnivForGpa = () => {
  const [index, setIndex] = useState(0);

  const renderComponent = useCallback(() => {
    switch (index) {
      case 0:
        return <Components.LibNonsulUniv />;
      case 1:
        return <Components.SciNonsulUniv />;
      default:
        return <div></div>;
    }
  }, [index]);

  return (
    <div id={cx('contents')}>
      <div id={cx('discuss')}>
        <div id={cx('discuss_contents')}>
          <div className={cx('discuss_col2', 'section1')}>
            <div
              onClick={() => setIndex(0)}
              className={cx('discuss_row1', 'button_index', {button_active: index === 0})}
            >
              (문과 수학 범위) 수리논술 대학
            </div>
            <div
              onClick={() => setIndex(1)}
              className={cx('discuss_row1', 'button_index', {button_active: index === 1})}
            >
              언어논술 알아보기
            </div>
          </div>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default ExtraUnivForGpa;
