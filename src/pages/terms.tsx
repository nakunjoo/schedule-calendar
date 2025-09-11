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

export default function TermsOfService() {
  return (
    <PageWrapper>
    <Container>
      <Title>서비스 이용약관</Title>
      <UpdateDate>최종 업데이트: 2025년 1월 11일</UpdateDate>

      <Section>
        <SectionTitle>제1조 (목적)</SectionTitle>
        <Paragraph>
          이 약관은 일정 캘린더 서비스(&quot;서비스&quot;)의 이용조건 및 절차에 관한 사항과 
          기타 필요한 사항을 규정함을 목적으로 합니다.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>제2조 (정의)</SectionTitle>
        <Paragraph>이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</Paragraph>
        <List>
          <ListItem>&quot;서비스&quot;라 함은 일정 관리, 캘린더, 카테고리 설정 등의 기능을 제공하는 웹 서비스를 의미합니다.</ListItem>
          <ListItem>&quot;이용자&quot;라 함은 이 약관에 따라 서비스를 이용하는 회원을 의미합니다.</ListItem>
          <ListItem>&quot;계정&quot;이라 함은 서비스 이용을 위해 Google OAuth를 통해 생성된 이용자의 고유 식별 정보를 의미합니다.</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제3조 (약관의 효력 및 변경)</SectionTitle>
        <List>
          <ListItem>이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</ListItem>
          <ListItem>회사는 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</ListItem>
          <ListItem>약관이 개정되는 경우 적용일자 7일 전부터 적용일자 전일까지 공지합니다.</ListItem>
          <ListItem>이용자가 개정약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제4조 (서비스의 제공)</SectionTitle>
        <Paragraph>서비스는 다음과 같은 기능을 제공합니다:</Paragraph>
        <List>
          <ListItem>개인 일정 관리 및 캘린더 서비스</ListItem>
          <ListItem>일정 카테고리 설정 및 관리</ListItem>
          <ListItem>일정 알림 및 검색 기능</ListItem>
          <ListItem>개인 설정 및 테마 커스터마이징</ListItem>
          <ListItem>기타 서비스와 관련된 부가 기능</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제5조 (서비스 이용)</SectionTitle>
        <List>
          <ListItem>서비스 이용을 위해서는 Google 계정을 통한 로그인이 필요합니다.</ListItem>
          <ListItem>이용자는 서비스를 개인적인 용도로만 사용해야 합니다.</ListItem>
          <ListItem>서비스는 24시간 이용 가능함을 원칙으로 하나, 시스템 정비 등 필요한 경우 서비스를 일시 중단할 수 있습니다.</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제6조 (이용자의 의무)</SectionTitle>
        <Paragraph>이용자는 다음 행위를 하여서는 안됩니다:</Paragraph>
        <List>
          <ListItem>타인의 정보 도용</ListItem>
          <ListItem>서비스의 운영을 방해하는 행위</ListItem>
          <ListItem>다른 이용자의 개인정보를 수집, 저장, 공개하는 행위</ListItem>
          <ListItem>서비스의 취약점을 악용하는 행위</ListItem>
          <ListItem>관련 법령에 위배되는 행위</ListItem>
          <ListItem>기타 미풍양속에 어긋나는 행위</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제7조 (서비스의 중단)</SectionTitle>
        <List>
          <ListItem>서비스는 다음의 경우 서비스 제공을 일시적으로 중단할 수 있습니다:
            <List>
              <ListItem>시스템 정기점검, 증설 및 교체</ListItem>
              <ListItem>네트워크 장애</ListItem>
              <ListItem>기타 기술적 사유</ListItem>
            </List>
          </ListItem>
          <ListItem>서비스 중단 시에는 사전에 공지합니다. 다만, 불가피한 사유가 있는 경우 사후에 공지할 수 있습니다.</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제8조 (계정 해지)</SectionTitle>
        <List>
          <ListItem>이용자는 언제든지 계정을 삭제할 수 있습니다.</ListItem>
          <ListItem>계정 삭제 시 해당 계정의 모든 데이터는 즉시 삭제되며 복구할 수 없습니다.</ListItem>
          <ListItem>서비스는 다음의 경우 사전 통보 후 계정을 삭제할 수 있습니다:
            <List>
              <ListItem>약관 위반 시</ListItem>
              <ListItem>서비스 운영 방해 시</ListItem>
              <ListItem>3개월 이상 미이용 시</ListItem>
            </List>
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제9조 (개인정보보호)</SectionTitle>
        <Paragraph>
          서비스는 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하기 위해 
          노력합니다. 개인정보의 처리에 대해서는 별도의 개인정보처리방침에 따릅니다.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>제10조 (면책조항)</SectionTitle>
        <List>
          <ListItem>서비스는 무료로 제공되는 서비스로, 법령에서 정하는 경우를 제외하고는 서비스에 대해 어떠한 보증도 하지 않습니다.</ListItem>
          <ListItem>서비스는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임지지 않습니다.</ListItem>
          <ListItem>서비스는 이용자 간 또는 이용자와 제3자 간에 발생한 분쟁에 대해 개입할 의무가 없습니다.</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제11조 (준거법 및 관할법원)</SectionTitle>
        <Paragraph>
          이 약관에 관하여 분쟁이 생긴 경우, 대한민국 법을 적용하며, 
          서비스의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>부칙</SectionTitle>
        <Paragraph>이 약관은 2025년 1월 11일부터 적용됩니다.</Paragraph>
      </Section>
    </Container>
    <Footer />
    </PageWrapper>
  );
}