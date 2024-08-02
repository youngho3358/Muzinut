import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import NoticePost from "./noticepost";
import Image from "next/image";
import Noticebanner from "../../../../public/images/eventbanner.png";
import WriteQuill from "./noticewritequill";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/components/UserContext";

const NoticeBody: React.FC = () => {
  const [selected, setSelected] = useState<string>("최신순");
  const [writeVisible, setWriteVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  useEffect(() => {
    const queryParams: any = {
      인기순: "HOT",
      최신순: "RECENT",
      좋아요순: "LIKE",
    };

    router.push(`?sort=${queryParams[selected]}`);
  }, [router, selected]);

  const { user } = useUser();
  const username = user?.nickname;

  const openWriteForm = () => {
    if (username === "muzi") {
      setWriteVisible(true);
    } else {
      setWriteVisible(false);
      alert("글작성 권한이 없습니다");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <NoticeContainer>
      <NoticeBanner>
        <Image src={Noticebanner} alt="event-banner"></Image>
      </NoticeBanner>
      <NoticeController>
        <NoticeOptions>
          <ul>
            {["인기순", "최신순", "좋아요순"].map((option, index) => (
              <li key={option}>
                <NoticeOption
                  isSelected={selected === option}
                  onClick={() => handleSelect(option)}
                >
                  {selected === option && "✔ "}
                  {option}
                </NoticeOption>
                {index < 2 && <Dot />}
              </li>
            ))}
          </ul>
        </NoticeOptions>
        <SearchContainer>
          {username === "muzi" ? (
            <Write onClick={openWriteForm}>글쓰기</Write>
          ) : null}
          <ControllerSearch
            placeholder="바로 검색"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchIcon />
        </SearchContainer>
      </NoticeController>
      <NoticePost selected={selected} searchQuery={searchQuery} />
      {writeVisible && (
        <WriteQuill
          onPublish={() => setWriteVisible(false)}
          onClose={() => setWriteVisible(false)}
        />
      )}
    </NoticeContainer>
  );
};

export default NoticeBody;

// 공지사항 페이지 가장 바깥을 감싸는 컨테이너
const NoticeContainer = styled.div``;

// 공지사항 페이지 헤더 제목
const NoticeBanner = styled.div`
  margin-top: 24px;

  img {
    border: 1px;
    border-radius: 12px;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06);
  }
`;

// 공지사항 선택바 인기순, 최신순, 좋아요순, 제목 [ 검색하기 부분 ]
const NoticeController = styled.div`
  padding: 10px 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NoticeOptions = styled.div`
  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    align-items: center;
  }

  li {
    display: flex;
    align-items: center;
  }
`;

// 공지사항 선택바 옵션
const NoticeOption = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  color: ${(props) => (props.isSelected ? "#16be78" : "inherit")};
  font-family: ${(props) =>
    props.isSelected ? "esamanru Bold" : "esamanru Medium"};
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.isSelected ? "3px" : "0")};
`;

// 옵션 사이의 작은 동그라미
const Dot = styled.div`
  width: 5px;
  height: 5px;
  background-color: var(--text-color);
  border-radius: 50%;
  margin: 0 10px;
`;

// 검색 컨테이너
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

// 글쓰기
const Write = styled.div`
  background-color: #16be78;
  padding: 10px 15px;
  border-radius: 8px;
  margin-right: 8px;
  font-size: 14px;
  font-family: "esamanru Bold";
  cursor: pointer;

  &:hover {
    background-color: #1bb373;
  }
`;

const ControllerSearch = styled.input`
  background-color: #e9ebf1;
  color: black;
  width: 250px;
  padding: 10px 10px;
  padding-right: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: "esamanru Medium";
  letter-spacing: -0.3px;
  text-overflow: ellipsis;

  &:focus {
    box-shadow: 0 0 0 1px #16be78;
    border-color: #16be78;
    outline: none;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 10px;
  color: #888;
`;
