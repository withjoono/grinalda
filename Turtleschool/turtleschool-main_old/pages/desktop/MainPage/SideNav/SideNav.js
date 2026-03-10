import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';

export default function SideNav() {
  return (
    <div className={styles.layout} style={{right: 30, top: '15%', position: 'fixed'}}>
      <div className={styles.contentTitle}>상담 및 예약</div>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdyy7FjOst1KdfNFoYok0FuCtfSHyGPhskb8D0OWqo6gd8ezA/viewform?usp=sf_link"
        style={{
          border: '1px solid #D9D9D9',
          backgroundColor: '#ffffff',
          marginTop: '20px',
          borderRadius: '8px',
        }}
      >
        <div style={{fontSize: '63px', color: '#17d1ea', padding: '20px'}}>
          <Image
            alt=""
            src="https://img.ingipsy.com/assets/reservation.png"
            width="60dp"
            height="60dp"
          />
        </div>
        <div style={{fontSize: '20px', fontWeight: 'bold', color: 'black'}}>
          거북스쿨 수시컨설팅 사전예약 60% 할인(29,000)
        </div>
      </a>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLScs-_3HYfw-dmC0SaruF6RxBclm-Ljpzwosy5mlU-aBv4kUig/viewform?usp=sf_link"
        style={{
          border: '1px solid #D9D9D9',
          backgroundColor: '#ffffff',
          marginTop: '20px',
          borderRadius: '8px',
        }}
      >
        <div style={{fontSize: '63px', color: '#17d1ea', padding: '20px'}}>
          <Image
            alt=""
            src="https://img.ingipsy.com/assets/consulting.png"
            width="60dp"
            height="60dp"
          />
        </div>
        <div style={{fontSize: '20px', fontWeight: 'bold', color: 'black'}}>
          거북쌤 (비)대면 상담 수시 컨설팅 상담
        </div>
      </a>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdftlylkg6tRJV9sJ2K8s7rk0Tukn0Muke9FuWxGRJP-9NX9A/viewform?usp=sf_link"
        style={{
          border: '1px solid #D9D9D9',
          backgroundColor: '#ffffff',
          marginTop: '20px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <div style={{fontSize: '63px', color: '#17d1ea', padding: '20px'}}>
          <Image
            alt=""
            src="https://img.ingipsy.com/assets/logo_turtle.png"
            width="80dp"
            height="60dp"
          />
        </div>
        <div style={{fontSize: '20px', fontWeight: 'bold', color: 'black'}}>
          비대면 클리닉 수업 상담
        </div>
      </a>
    </div>
  );
}
