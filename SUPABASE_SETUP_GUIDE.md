# Supabase 설정 가이드

Google OAuth가 작동하지 않는 주요 원인들과 해결 방법:

## 1. Supabase 프로젝트 설정

### Authentication 설정
1. Supabase 대시보드 → Authentication → Providers
2. Google 활성화
3. Google OAuth 설정:
   - Client ID: Google Cloud Console에서 생성한 OAuth 클라이언트 ID
   - Client Secret: Google Cloud Console에서 생성한 OAuth 클라이언트 Secret

### Site URL 설정
1. Authentication → Settings → General
2. Site URL: `http://localhost:3000` (개발), `https://yourdomain.com` (프로덕션)
3. Additional Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

## 2. Google Cloud Console 설정

### OAuth 2.0 클라이언트 ID 생성
1. Google Cloud Console → APIs & Services → Credentials
2. Create Credentials → OAuth 2.0 Client IDs
3. Application type: Web application
4. Authorized redirect URIs:
   - `https://[your-supabase-project].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`

## 3. 환경 변수 확인

`.env.local` 파일에서 다음 확인:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. 데이터베이스 스키마 적용

Supabase SQL Editor에서 `supabase-schema.sql` 파일의 내용을 실행하세요.

## 5. 일반적인 문제들

### 문제: Google 로그인은 되지만 Supabase Auth에 저장되지 않음
**해결책:**
- Supabase 프로젝트의 Google OAuth 설정이 올바른지 확인
- Google Cloud Console의 Redirect URI가 Supabase callback URL과 일치하는지 확인
- Site URL과 Redirect URL이 정확히 설정되었는지 확인

### 문제: "Invalid redirect URL" 오류
**해결책:**
- Supabase Authentication Settings에서 Redirect URL 추가
- Google Cloud Console에서 Authorized redirect URIs 확인

### 문제: 콘솔에서 세션은 있지만 Auth 테이블에 없음
**해결책:**
- RLS 정책이 올바르게 설정되었는지 확인
- `auth.users` 테이블 직접 확인 (SQL Editor에서 `SELECT * FROM auth.users;`)

## 6. 디버깅 방법

개발자 콘솔에서 다음 로그를 확인:
1. "Starting Google OAuth flow..." - OAuth 시작
2. "Auth callback started" - 콜백 페이지 도달
3. "Auth state changed: SIGNED_IN" - 로그인 성공
4. "User ID: ..." - 사용자 정보 확인

문제가 계속되면 브라우저 개발자 도구의 Network 탭에서 실제 API 호출을 확인하세요.