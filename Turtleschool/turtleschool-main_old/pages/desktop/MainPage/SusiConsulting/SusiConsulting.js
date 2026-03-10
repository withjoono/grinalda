import React from 'react';
import styles from './index.module.css';

export default function SusiConsulting() {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.textbox}>
          <div className={styles.title}>
            <p>
              <span>거북쌤</span> 강준원장의
            </p>
            <p>
              비대면 <span>수시 컨설팅</span>
            </p>
          </div>
          <div className={styles.content}>
            <p>수시컨설팅 플랫폼 제작자의 직접 컨설팅</p>

            <p>대치동 학원장, 컨설턴트 20년 경력의 노하우</p>

            <p>무료 수시모의지원 앱에서 귀중한 데이터 이용</p>
          </div>
          <div className={styles.button}>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScs-_3HYfw-dmC0SaruF6RxBclm-Ljpzwosy5mlU-aBv4kUig/viewform?usp=sf_link">
              상담하기
            </a>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSccRNelVWdoe4r2fKyVajRrrRGVUdZxMWLfIEMVFps4_rH6sA/viewform?usp=sf_link">
              예약하기
            </a>
          </div>
        </div>
        <div className={styles.youtubebox}>
          <div>
            <iframe
              width="100%"
              height="360"
              src="https://www.youtube.com/embed/D8qSI8X2ro8"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
