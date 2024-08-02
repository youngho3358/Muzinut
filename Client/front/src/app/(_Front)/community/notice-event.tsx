import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import BaseBanner from "../../../../public/images/BaseBanner.png";
import ProfileImages from "../../../../public/images/BaseImg.png";
import Link from "next/link";
import { LikeIcon, ViewIcon } from "@/app/components/icon/icon";
import axios from "axios";
import AxiosURL from "@/app/axios/url";

interface NoticeEventDataProps {
  title: string;
  eventImage: string;
  profileImage: string;
  profileName: string;
  likes: number;
  views: number;
  isNew?: boolean;
}

const NoticeEvent: React.FC = () => {
  const [eventToShow, setEventToShow] = useState(4);
  const [NoticeEventData, setNoticeEventData] = useState<
    NoticeEventDataProps[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/community/event-boards`);
        const data = response.data;

        // 데이터가 배열인지 확인합니다.
        if (Array.isArray(data)) {
          setNoticeEventData(data);
        } else {
          console.error("응답 데이터가 배열이 아닙니다:", data);
        }
      } catch (error) {
        console.error("데이터를 가져오지 못했습니다:", error);
      }
    };

    fetchData();
  }, []);

  // 더 많은 이벤트를 보여주기 위한 함수입니다.
  const handleShowMoreEvents = () => {
    // 현재 보여주는 이벤트 수가 전체 이벤트 수보다 크거나 같으면, 초기값으로 다시 설정합니다.
    if (eventToShow >= NoticeEventData.length) {
      setEventToShow(4);
    } else {
      // 남은 이벤트 수를 계산합니다.
      const remainingEvents = NoticeEventData.length - eventToShow;
      // 한 번에 추가로 보여줄 이벤트 수를 계산합니다. (최대 4개 또는 남은 이벤트 수 중 작은 값)
      const increment = Math.min(4, remainingEvents);

      // 현재 보여줄 이벤트 수를 업데이트합니다.
      setEventToShow(eventToShow + increment);
    }
  };

  return (
    <Container>
      <Banner>
        <Image src={BaseBanner} alt="banner-image" />
      </Banner>
      <Event>
        <Title>
          <ul>
            <Link href={"/event"}>
              <li>이벤트</li>
            </Link>
            <li onClick={handleShowMoreEvents}>더보기</li>
          </ul>
        </Title>
        <EventData>
          {NoticeEventData.slice(0, eventToShow).map((event, i) => (
            <Content key={i}>
              <Link href={`/event/${i}`}>
                <EventImage>{event.eventImage}</EventImage>
                <EventTitle>{event.title}</EventTitle>
              </Link>
            </Content>
          ))}
        </EventData>
      </Event>
      <Notice>
        <Title>공지사항</Title>
        <NoticeData>
          {NoticeEventData.length > 0 ? (
            NoticeEventData.map((notice, i) => (
              <NoticeContent key={i}>
                <Link href={`/notice/${i}`}>
                  <NoticeTitle>
                    {notice.title}
                    {notice.isNew && <NewBadge />}
                  </NoticeTitle>
                </Link>
                <ProfileSection>
                  <ProfileImage
                    src={`data:image/png;base64,${ProfileImages}`}
                    alt="profile-image"
                  />
                  <ProfileName>{notice.profileName}</ProfileName>
                  <Stats>
                    <Likes>
                      <LikeIcon /> {notice.likes}
                    </Likes>
                    <Views>
                      <ViewIcon /> {notice.views}
                    </Views>
                  </Stats>
                </ProfileSection>
              </NoticeContent>
            ))
          ) : (
            <div>공지사항 데이터가 없습니다</div>
          )}
        </NoticeData>
      </Notice>
    </Container>
  );
};

export default NoticeEvent;

// 넓이를 지정하는 바깥 테두리
const Container = styled.div`
  width: 100%;
  margin-top: 30px;
  border-radius: 12px;
`;

// 최상단 배너 [공고 or 유료 배너]
const Banner = styled.div`
  img {
    border-radius: 12px;
    margin-bottom: 32px;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06);
  }
`;

// 이벤트 섹션
const Event = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 이벤트 타이틀
const Title = styled.div`
  font-size: 24px;
  cursor: pointer;

  ul {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    list-style-type: none;
    padding: 0;
    margin: 0;

    :link {
      text-decoration: none;
    }
  }

  li {
    color: var(--text-color);
  }

  li:nth-child(2) {
    font-size: 14px;
    font-family: "esamanru Light";
    cursor: pointer;
  }
`;

// 이벤트 데이터 컨테이너
const EventData = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 15px;
`;

// 이벤트 데이터
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(25% - 22.5px); // 4개의 아이템이 한 줄에 들어가도록 너비 조정
  cursor: pointer;

  :link {
    text-decoration: none;
    color: var(--text-color);

    &:hover {
      transform: scale(1.01);
    }
  }
`;

// 이벤트 데이터 이름
const EventImage = styled.div`
  height: 160px;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06);
`;

// 이벤트 데이터 타이틀
const EventTitle = styled.div`
  font-family: "esamanru Medium";
  margin-top: 10px;
  margin-bottom: 45px;
  padding: 0 0 0 5px;
`;

// 공지사항 섹션
const Notice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 38px;
`;

// 공지사항 데이터 컨테이너
const NoticeData = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

// 공지사항 항목
const NoticeContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  width: calc(50% - 10px); // 50% 너비에서 간격을 뺀 값
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    transform: scale(1.01);
  }

  :link {
    text-decoration: none;
    color: var(--text-color);
  }
`;

// 공지사항 제목
const NoticeTitle = styled.div`
  font-size: 16px;
  font-family: "esamanru Medium";
  display: flex;
  align-items: center;
`;

// "N" 배지
const NewBadge = styled.div`
  margin-left: 7px;
  margin-bottom: 1px;
  background-image: url(data:image/png;base64,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);
  background-size: 56px 29px;
  background-repeat: no-repeat;
  background-position: -43px -16px;
  width: 12px;
  height: 12px;
`;

// 프로필 섹션
const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

// 프로필 이미지
const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

// 프로필 이름
const ProfileName = styled.div`
  margin-left: 10px;
  font-weight: bold;
`;

// 좋아요 및 조회수 섹션
const Stats = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 10px;
`;

// 좋아요
const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
`;

// 조회수
const Views = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
`;
