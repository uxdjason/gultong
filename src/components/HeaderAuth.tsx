"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeaderAuth() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav className="gnb gnb-auth" style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', padding: '12px 24px', height: '64px', position: 'relative' }}>
      {/* Left Section: Logo */}
      <div className="flex-row-center" style={{ flex: '1 0 auto' }}>
        <Link href="/" className="logo flex-row-center" style={{ gap: '8px', fontSize: '22px', fontWeight: 800, textDecoration: 'none', color: '#111827' }}>
          <img src="/images/gultong_logo_260416.svg" alt="글통 로고" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          <span>글통<span style={{ color: 'var(--primary-color)' }}>.</span></span>
        </Link>
      </div>

      {/* Right Section: Desktop */}
      {!isMobile && (
        <div className="flex-row-center gap-16" style={{ flex: '1 0 auto', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}>
          <div className="font-14 text-muted flex-row-center gap-8">
            <span className="flex-row-center gap-4">
              잔여 크레딧: <strong style={{ color: '#111827' }}>50</strong>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '2px' }}>
                <circle cx="12" cy="12" r="10" fill="#FBBF24" />
                <path d="M12 6V18M9 9H15M9 15H15" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <Link href="/pricing" className="btn-outline font-bold-13" style={{ padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}>충전</Link>
          </div>
          <button className="btn-primary flex-row-center gap-8" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', fontWeight: 700 }}>
            ✨ PRO 업그레이드
          </button>
          <div className="avatar flex-row-center justify-center cursor-pointer" style={{ border: '2px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#9ca3af', fontSize: '18px', width: '36px', height: '36px', borderRadius: '50%' }}>
            👤
          </div>
        </div>
      )}

      {/* Right Section: Mobile Burger */}
      {isMobile && (
        <div className="flex-row-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            style={{ backgroundColor: 'transparent', fontSize: '24px', cursor: 'pointer', border: 'none', padding: '4px' }}
          >
            ☰
          </button>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobile && isMenuOpen && (
        <div style={{ position: 'absolute', top: '64px', right: '0', backgroundColor: '#fff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', borderRadius: '0 0 0 12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 100, minWidth: '240px' }}>
          <div className="flex-col gap-12">
            <span className="font-14 text-muted m-b-4 flex-row gap-8 items-center justify-between">
              잔여 크레딧: 
              <span className="flex-row items-center gap-4">
                <strong style={{ color: '#111827' }}>50</strong>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#FBBF24" />
                  <path d="M12 6V18M9 9H15M9 15H15" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </span>
            <Link href="/pricing" className="btn-outline font-bold-13 flex-row-center justify-center" style={{ padding: '10px 16px', borderRadius: '8px', textDecoration: 'none' }}>크레딧 충전하기</Link>
            <button className="btn-primary flex-row-center justify-center gap-8" style={{ padding: '10px 16px', fontSize: '13px', borderRadius: '8px', fontWeight: 700 }}>
              ✨ PRO 업그레이드
            </button>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)' }}></div>
          <div className="flex-col gap-16 font-15 m-t-8">
            <div className="cursor-pointer font-bold-14 flex-row items-center gap-8"><span className="text-muted">👤</span> 프로필 설정</div>
            <div className="cursor-pointer text-muted">결제 내역</div>
            <div className="cursor-pointer text-muted">계정 설정</div>
            <div className="cursor-pointer m-t-8" style={{ color: 'var(--error-color)' }}>로그아웃</div>
          </div>
        </div>
      )}
    </nav>
  );
}
