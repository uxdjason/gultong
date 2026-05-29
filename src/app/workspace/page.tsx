import WorkspaceShell from '@/components/workspace/WorkspaceShell';

/**
 * /workspace 페이지
 *
 * Stage 0: 더미 사용자 데이터로 WorkspaceShell 렌더링.
 * Stage 0 이후: NextAuth 세션 + D1 users 테이블에서 실 데이터 주입.
 *
 * 인증 보호: src/middleware.ts 에서 처리.
 * 비로그인 접근 시 /login 리다이렉트 (개발 환경은 bypass).
 */
export default function WorkspacePage() {
  // TODO (Stage 0 인프라): NextAuth 세션에서 사용자 정보 주입
  // const session = await getServerSession(authOptions);
  // const user = session?.user;

  // 개발용 더미 데이터
  const dummyUser = {
    email: 'dev@gultong.kr',
    plan: '무료 체험 중',
    creditBalance: 50,
  };

  return (
    <WorkspaceShell
      userEmail={dummyUser.email}
      userPlan={dummyUser.plan}
      creditBalance={dummyUser.creditBalance}
    />
  );
}
