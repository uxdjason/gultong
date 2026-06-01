'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useWorkspaceStore } from '@/stores/workspace';

interface SidebarProps {
  userEmail?: string;
  userPlan?: string;
  userAvatarUrl?: string;
  onNewWork?: () => void;
  onSearch?: () => void;
  onHistory?: () => void;
  onPersona?: () => void;
  onSettingsClick?: () => void;
}

export default function Sidebar({
  userEmail,
  userPlan,
  userAvatarUrl,
  onNewWork,
  onSearch,
  onHistory,
  onPersona,
  onSettingsClick,
}: SidebarProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useWorkspaceStore();
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarDefaultRef = useRef<HTMLDivElement>(null);
  const sidebarCollapsedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect runs whenever sidebarCollapsed state changes
    const sidebar = sidebarRef.current;
    const sidebarDefault = sidebarDefaultRef.current;
    const sidebarCollapsedEl = sidebarCollapsedRef.current;
    if (!sidebar || !sidebarDefault || !sidebarCollapsedEl) return;

    const textClasses = [
      '.logo-text', 
      '.sidebar-menu-text', 
      '.sidebar-subheading', 
      '.menu-text-truncated', 
      '.profile-link-text', 
      '.profile-membership-text'
    ];
    const textElements = sidebar.querySelectorAll<HTMLElement>(textClasses.join(', '));

    if (sidebarCollapsed) {
      // 타블렛 이하 해상도에서는 스크립트 작동 중지
      if (window.innerWidth <= 991) return;
      textElements.forEach(function(el) {
        el.style.opacity = '0';
      });
      sidebarDefault.style.transform = 'translateX(-100%)';
      const timer = setTimeout(() => {
        sidebarDefault.style.display = 'none';
        sidebarCollapsedEl.style.display = 'block';
      }, 200);
      sidebar.style.minWidth = '56px';
      sidebar.style.maxWidth = '56px';
      return () => clearTimeout(timer);
    } else {
      if (window.innerWidth <= 991) return;
      sidebarCollapsedEl.style.display = 'none';
      sidebar.style.minWidth = '300px';
      sidebar.style.maxWidth = '300px';
      sidebarDefault.style.display = 'block';
      
      const timer1 = setTimeout(() => {
        sidebarDefault.style.transform = 'translateX(0%)';
        const timer2 = setTimeout(() => {
          textElements.forEach(function(el) {
            el.style.opacity = '1';
          });
        }, 200);
        return () => clearTimeout(timer2);
      }, 10);
      return () => clearTimeout(timer1);
    }
  }, [sidebarCollapsed]);

  const emailDisplay = userEmail || 'stone-iron@gmail.com';
  const planDisplay = userPlan || '무료 체험 중';

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="sidebar-default" ref={sidebarDefaultRef}>
        <div className="sidebar-padding">
          <div className="sidebar-top">
            <div className="logo-and-close">
              <div className="logo-brand">
                <img src="/images/gultong_logo_260515.png" loading="lazy" sizes="(max-width: 512px) 100vw, 512px" srcSet="/images/gultong_logo_260515-p-500.png 500w, /images/gultong_logo_260515.png 512w" alt="" className="logo-image" />
                <div className="logo-text">글통 Gultong</div>
              </div>
              <a 
                href="#" 
                className="sidebar-icon w-inline-block"
                onClick={(e) => { e.preventDefault(); setSidebarCollapsed(true); }}
              >
                <div className="svg-icon-sidebar w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"></path>
                  </svg>
                </div>
              </a>
            </div>
            <div className="spacer-40"></div>
            <div className="sidebar-menus">
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onNewWork?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path>
                  </svg>
                </div>
                <div className="sidebar-menu-text">새 글 작업을 시작해요</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onSearch?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"></path>
                  </svg>
                </div>
                <div className="sidebar-menu-text">검색해요</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onHistory?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M480-400 40-640l440-240 440 240-440 240Zm0 160L63-467l84-46 333 182 333-182 84 46-417 227Zm0 160L63-307l84-46 333 182 333-182 84 46L480-80Zm0-411 273-149-273-149-273 149 273 149Zm0-149Z"></path>
                  </svg>
                </div>
                <div className="sidebar-menu-text">이전 글 작업들</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onPersona?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M360-120v-200q-62-5-121.5-14T120-360l20-80q83 23 168 31.5t172 8.5q86 0 171-8.5T820-440l20 80q-60 17-119.5 26T600-320v200H360Zm120-320q-34 0-57-23t-23-57q0-33 23-56.5t57-23.5q33 0 56.5 23.5T560-520q0 34-23.5 57T480-440ZM180-560q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T240-620q0 26-17.5 43T180-560Zm600 0q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T840-620q0 26-17.5 43T780-560ZM290-710q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T350-770q0 26-17.5 43T290-710Zm380 0q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T730-770q0 26-17.5 43T670-710Zm-190-50q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T540-820q0 26-17.5 43T480-760Z"></path>
                  </svg>
                </div>
                <div className="sidebar-menu-text">페르소나 저장소</div>
              </a>
            </div>
            <div className="spacer-40"></div>
            <div className="sidebar-fixed">
              <div className="fixed-heading">
                <div className="code-embed-2 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"></path>
                  </svg>
                </div>
                <div className="sidebar-subheading">고정 작업들</div>
              </div>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="menu-text-truncated">여우와 호랑이는 뱀 네 마리를 쫓아가다가 도시락을 먹고 배가 불러 낮잠을 자고 일어나</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="menu-text-truncated">너구리는 사자 앞에서 노래를 부르다가 목이 말라 테이블 위에 놓여있던 막걸리를 들이키고는</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="menu-text-truncated">간장 공장 공장장은 강 공장장인데 진간장과 양조 간장의 차이는 과연 무엇인가</div>
              </a>
            </div>
            <div className="spacer-24"></div>
            <div className="sidebar-previous">
              <div className="previous-heading">
                <div className="code-embed-2 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M480-80q-155 0-269-103T82-440h81q15 121 105.5 200.5T480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-86 0-159.5 42.5T204-640h116v80H88q29-140 139-230t253-90q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm112-232L440-464v-216h80v184l128 128-56 56Z"></path>
                  </svg>
                </div>
                <div className="sidebar-subheading">이전 작업들</div>
              </div>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="menu-text-truncated">까치 두 마리는 퇴근 길에 포장마차에 들러 우동 한 그릇과 소주 한 병을 나눠먹었다</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="menu-text-truncated">개구리는 왜 자기는 두꺼비가 아니라 개구리일까 늘 고민했다</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="menu-text-truncated">곰 세 마리가 설렁탕 한 그릇, 도가니탕 두 그릇을 주문했다</div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="menu-text-truncated">감자는 고구마를 늘 부러워했지만 정작 자신이 더 맛있다는 사실은 까맣게 모르고 살았다</div>
              </a>
            </div>
          </div>
          <div className="sidebar-bottom">
            <div className="profile-section">
              <div className="profile-photo">
                <div className="profile-photo-text">돌쇠</div>
              </div>
              <div className="profile-text">
                <a href="#" className="profile-link-text">{emailDisplay}</a>
                <div className="profile-membership-text">{planDisplay}</div>
              </div>
            </div>
            <a href="#" className="link-icon w-inline-block" onClick={(e) => { e.preventDefault(); onSettingsClick?.(); }}>
              <div className="svg-icon-24 w-embed">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"></path>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="sidebar-collapsed" ref={sidebarCollapsedRef} style={{ display: 'none' }}>
        <div className="sidebar-padding">
          <div className="sidebar-top">
            <a 
              href="#" 
              className="sidebar-icon w-inline-block"
              onClick={(e) => { e.preventDefault(); setSidebarCollapsed(false); }}
            >
              <img src="/images/gultong_logo_260515.png" loading="lazy" sizes="(max-width: 512px) 100vw, 512px" srcSet="/images/gultong_logo_260515-p-500.png 500w, /images/gultong_logo_260515.png 512w" alt="" className="logo-image small" />
              <div className="svg-icon-sidebar-collapsed w-embed">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"></path>
                </svg>
              </div>
            </a>
            <div className="spacer-40"></div>
            <div className="sidebar-menus">
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onNewWork?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path>
                  </svg>
                </div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onSearch?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"></path>
                  </svg>
                </div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onHistory?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M480-400 40-640l440-240 440 240-440 240Zm0 160L63-467l84-46 333 182 333-182 84 46-417 227Zm0 160L63-307l84-46 333 182 333-182 84 46L480-80Zm0-411 273-149-273-149-273 149 273 149Zm0-149Z"></path>
                  </svg>
                </div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block" onClick={(e) => { e.preventDefault(); onPersona?.(); }}>
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M360-120v-200q-62-5-121.5-14T120-360l20-80q83 23 168 31.5t172 8.5q86 0 171-8.5T820-440l20 80q-60 17-119.5 26T600-320v200H360Zm120-320q-34 0-57-23t-23-57q0-33 23-56.5t57-23.5q33 0 56.5 23.5T560-520q0 34-23.5 57T480-440ZM180-560q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T240-620q0 26-17.5 43T180-560Zm600 0q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T840-620q0 26-17.5 43T780-560ZM290-710q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T350-770q0 26-17.5 43T290-710Zm380 0q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T730-770q0 26-17.5 43T670-710Zm-190-50q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T540-820q0 26-17.5 43T480-760Z"></path>
                  </svg>
                </div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"></path>
                  </svg>
                </div>
              </a>
              <a href="#" className="sidebar-menu w-inline-block">
                <div className="svg-icon-24 w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path d="M480-80q-155 0-269-103T82-440h81q15 121 105.5 200.5T480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-86 0-159.5 42.5T204-640h116v80H88q29-140 139-230t253-90q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm112-232L440-464v-216h80v184l128 128-56 56Z"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
          <div className="sidebar-bottom collapsed">
            <a href="#" className="link-icon w-inline-block" onClick={(e) => { e.preventDefault(); onSettingsClick?.(); }}>
              <div className="svg-icon-24 w-embed">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"></path>
                </svg>
              </div>
            </a>
            <div className="profile-section">
              <div className="profile-photo">
                <div className="profile-photo-text">돌쇠</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
