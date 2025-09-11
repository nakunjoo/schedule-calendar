import Link from 'next/link';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 40px 20px 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
`;

const LinkSection = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const FooterLink = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  color: #9ca3af;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    text-align: center;
  }
`;

const ServiceInfo = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;

  @media (min-width: 768px) {
    text-align: right;
  }
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        {/* <div> */}
          {/* <Logo>일정 캘린더</Logo> */}
        {/* </div> */}

        <LinkSection>
          <FooterLink href="/privacy">개인정보 처리방침</FooterLink>
          <FooterLink href="/terms">서비스 이용약관</FooterLink>
        </LinkSection>

        <ServiceInfo>
          <div>Google OAuth를 통한 안전한 로그인</div>
          <div>개인 일정 관리 서비스</div>
        </ServiceInfo>
      </FooterContent>

      <Copyright>
        © {currentYear} 일정 캘린더. 모든 권리 보유.
        <br />
        이 서비스는 개인 일정 관리를 위한 무료 서비스입니다.
      </Copyright>
    </FooterContainer>
  );
}