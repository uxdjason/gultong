export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '60px 0 40px' }}>
      <div className="container grid-footer">
        <div>
          <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '20px', fontWeight: 800, color: '#111827', cursor: 'pointer' }}>
            <img src="/images/gultong_logo_260416.svg" alt="글통 로고" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
            <span>글통<span className="text-primary">.</span></span>
          </a>
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>상호: 오페듀</p>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>대표: 아무개 (개인정보보호책임자: 아무개)</p>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>사업자등록번호: 000-00-00000</p>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>통신판매업신고: 제0000-0000-0000호</p>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>경기도 안산시 단원구 광덕2로 241 808-1102</p>
        </div>
        <div>
          <a href="#"><p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8', cursor: 'pointer' }}>이용약관</p></a>
          <a href="#"><p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8', cursor: 'pointer' }}>개인정보처리방침</p></a>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8', cursor: 'pointer' }}>support@gultong.com</p>
        </div>
      </div>
      <div className="container text-muted" style={{ fontSize: '14px', borderTop: '1px solid #e5e7eb', paddingTop: '24px', margin: '40px auto 0 auto' }}>
        © 2026 Gultong. All rights reserved.
      </div>
    </footer>
  );
}
