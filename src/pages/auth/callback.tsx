import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('처리 중...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started');
        console.log('Current URL:', window.location.href);
        console.log('Router query:', router.query);
        
        // Parse URL hash for auth data
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('Hash params:', Object.fromEntries(hashParams));
        console.log('Access token exists:', !!accessToken);
        
        if (accessToken) {
          // Set session with tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setStatus('로그인 실패: ' + error.message);
            setTimeout(() => router.push('/'), 3000);
            return;
          }
          
          console.log('Session set successfully:', data);
          setStatus('로그인 성공! 리디렉션 중...');
          setTimeout(() => router.push('/'), 1000);
        } else {
          // Fallback: try to get existing session
          const { data, error } = await supabase.auth.getSession();
          
          console.log('Current session:', data);
          
          if (error) {
            console.error('Auth callback error:', error);
            setStatus('인증 오류: ' + error.message);
            setTimeout(() => router.push('/'), 3000);
            return;
          }

          if (data.session) {
            console.log('Existing session found');
            setStatus('로그인 확인됨! 리디렉션 중...');
            setTimeout(() => router.push('/'), 1000);
          } else {
            console.log('No session found');
            setStatus('세션을 찾을 수 없습니다. 홈으로 이동...');
            setTimeout(() => router.push('/'), 2000);
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('인증 처리 중 오류가 발생했습니다.');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    // Wait for router to be ready
    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router, router.isReady]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      gap: '20px'
    }}>
      <div>로그인 처리 중...</div>
      <div style={{ fontSize: '14px', color: '#666' }}>{status}</div>
    </div>
  );
}