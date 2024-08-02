import styled from "styled-components";
import Image from "next/image";
import EventIcon from "../../../../public/images/event.png";

export const EventHeader: React.FC = () => {
  return (
    <Header>
      <HeaderIcon>
        <Image src={EventIcon} alt="Event"></Image>
      </HeaderIcon>
      <HeaderCopy>
        <ul>
          <li>뮤지넛</li>
          <li>한정판 아이템을 얻을 수 있다고..?</li>
        </ul>
      </HeaderCopy>
    </Header>
  );
};

// 헤더
const Header = styled.div`
  display: flex;
`;

// 헤더 아이콘
const HeaderIcon = styled.div`
  img {
    margin-right: 24px;
    padding: 24px 0;
    width: 50px;
    height: 50px;
  }
`;

// 헤더 카피
const HeaderCopy = styled.div`
  padding: 8px 0;
  ul {
    list-style-type: none;
    padding: 0;
  }

  li:nth-child(1) {
    font-size: 30px;
  }

  li:nth-child(2) {
    font-size: 14px;
  }
`;
