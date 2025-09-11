import styled from 'styled-components';
import Footer from '@/components/Footer';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.6;
  color: #333;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2563eb;
`;

const Paragraph = styled.p`
  margin-bottom: 15px;
`;

const List = styled.ul`
  margin-left: 20px;
  margin-bottom: 15px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const UpdateDate = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 30px;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default function PrivacyPolicy() {
  return (
    <PageWrapper>
    <Container>
      <Title>개인정보 처리방침</Title>
      <UpdateDate>최종 업데이트: 2025년 1월 11일</UpdateDate>

      <Section>
        <SectionTitle>1. 개인정보의 처리 목적</SectionTitle>
        <Paragraph>
          일정 캘린더 서비스(&apos;서비스&apos;)는 다음의 목적을 위하여 개인정보를 처리합니다:
        </Paragraph>
        <List>
          <ListItem>서비스 제공 및 계약 이행</ListItem>
          <ListItem>회원 식별 및 인증</ListItem>
          <ListItem>개인맞춤 서비스 제공</ListItem>
          <ListItem>고객지원 및 문의사항 처리</ListItem>
          <ListItem>서비스 개선 및 통계 분석</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>2. 처리하는 개인정보 항목</SectionTitle>
        <Paragraph>
          서비스는 Google OAuth를 통해 다음과 같은 최소한의 개인정보를 수집합니다:
        </Paragraph>
        <List>
          <ListItem>이메일 주소</ListItem>
          <ListItem>이름</ListItem>
          <ListItem>프로필 사진</ListItem>
          <ListItem>Google 계정 고유 식별자</ListItem>
          <ListItem>서비스 이용 기록 (일정 데이터, 카테고리 설정 등)</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>3. 개인정보의 처리 및 보유기간</SectionTitle>
        <Paragraph>
          개인정보는 수집 및 이용목적이 달성된 후에는 지체없이 파기합니다. 다만, 다음과 같은 경우에는 명시한 기간 동안 보존합니다:
        </Paragraph>
        <List>
          <ListItem>회원 탈퇴 시까지: 서비스 이용을 위한 기본 정보</ListItem>
          <ListItem>법령에 따른 보관: 관련 법령에서 정한 기간</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>4. 개인정보의 제3자 제공</SectionTitle>
        <Paragraph>
          원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
        </Paragraph>
        <List>
          <ListItem>정보주체가 사전에 동의한 경우</ListItem>
          <ListItem>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위해 불가피한 경우</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>5. 개인정보 처리의 위탁</SectionTitle>
        <Paragraph>
          서비스는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
        </Paragraph>
        <List>
          <ListItem>Supabase (데이터베이스 서비스): 개인정보 저장 및 관리</ListItem>
          <ListItem>Google (인증 서비스): OAuth 인증 처리</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>6. 정보주체의 권리·의무 및 행사방법</SectionTitle>
        <Paragraph>
          이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
        </Paragraph>
        <List>
          <ListItem>개인정보 처리정지 요구권</ListItem>
          <ListItem>개인정보 열람요구권</ListItem>
          <ListItem>개인정보 정정·삭제요구권</ListItem>
          <ListItem>개인정보 처리정지 요구권</ListItem>
        </List>
        <Paragraph>
          위의 권리 행사는 서비스 내 설정에서 직접 하거나, 고객센터를 통해 요청할 수 있습니다.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>7. 개인정보의 안전성 확보조치</SectionTitle>
        <Paragraph>
          개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
        </Paragraph>
        <List>
          <ListItem>개인정보 취급 직원의 최소화 및 교육</ListItem>
          <ListItem>정기적인 자체 감사 실시</ListItem>
          <ListItem>개인정보에 대한 접근 제한</ListItem>
          <ListItem>암호화를 통한 개인정보 보호</ListItem>
          <ListItem>해킹 등에 대비한 기술적 대책</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>8. 쿠키의 사용</SectionTitle>
        <Paragraph>
          서비스는 이용자의 편의성 향상을 위해 쿠키를 사용할 수 있습니다. 
          이용자는 웹브라우저에서 쿠키에 대한 허용·차단 등을 설정할 수 있습니다.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>9. 개인정보보호책임자</SectionTitle>
        <Paragraph>
          개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
          불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
        </Paragraph>
        <Paragraph>
          개인정보보호 관련 문의사항이 있으시면 언제든지 연락주시기 바랍니다.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>10. 개인정보처리방침의 변경</SectionTitle>
        <Paragraph>
          이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 
          추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 
          통하여 고지할 것입니다.
        </Paragraph>
      </Section>
    </Container>
    <Footer />
    </PageWrapper>
  );
}