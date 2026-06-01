import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#490D0E',     // 로고 심볼 메인 (와인)
          paper: '#EEEAF5',   // 로고 심볼 보조 (라이트 퍼플)
        },
        surface: {
          main: '#F9F9FB',    // 우측 메인 영역 배경 (Figma Rectangle 2238)
          sidebar: '#F8F8FA', // 사이드바 배경 (Figma Rectangle 2237)
          card: '#FFFFFF',    // 카드·입력 박스 배경 (Figma Frame 334)
          divider: 'rgba(70, 48, 17, 0.2)', // 0.5px 구분선
        },
        text: {
          primary: '#333333',   // 본문·주요 라벨·로고 워드마크
          secondary: '#505050', // 보조·아이콘·버튼 라벨
          tertiary: '#737373',  // placeholder
          inverse: '#FEFEFE',   // 아바타 위 텍스트
        },
        state: {
          success: '#0A7C3A',
          warning: '#B8730A',
          danger: '#B23A3A',
          info: '#2C5BB8',
        },
      },
      fontFamily: {
        myungjo: ['KimjungchulMyungjo', 'Nanum Myeongjo', 'Noto Serif KR', 'serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      boxShadow: {
        card: '0px 0px 4px rgba(70, 48, 17, 0.1)',
      },
      fontSize: {
        '11': '11px',
        '12': '12px',
        '13': '13px',
        '14': '14px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
      },
      spacing: {
        '300': '300px',
      },
      gridTemplateColumns: {
        'workspace': '300px 1fr',
      },
      height: {
        'topbar': '48px',
        'sidebar-footer': '72px',
      },
    },
  },
  plugins: [],
};

export default config;
