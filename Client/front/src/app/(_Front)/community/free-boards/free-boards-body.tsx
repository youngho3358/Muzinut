import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import FreeBoardsPost from "./free-boards-post";
import Image from "next/image";
import FreeBoardsbanner from "../../../../../public/images/eventbanner.png";
import WriteQuill from "./writequill";

const FreeBoardsBody: React.FC = () => {
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

  const openWriteForm = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setWriteVisible(true);
    } else {
      alert("로그인이 필요합니다.");
      router.push("/member/login");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <FreeBoardsContainer>
      <FreeBoardsBanner>
        <Image src={FreeBoardsbanner} alt="free-boards-banner"></Image>
      </FreeBoardsBanner>
      <FreeBoardsController>
        <FreeBoardsOptions>
          <ul>
            {["인기순", "최신순", "좋아요순"].map((option, index) => (
              <li key={option}>
                <FreeBoardsOption
                  isSelected={selected === option}
                  onClick={() => handleSelect(option)}
                >
                  {selected === option && "✔ "}
                  {option}
                </FreeBoardsOption>
                {index < 2 && <Dot />}
              </li>
            ))}
          </ul>
        </FreeBoardsOptions>
        <SearchContainer>
          <Write onClick={openWriteForm}>글쓰기</Write>
          <ControllerSearch
            placeholder="게시글 바로 검색"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchIcon />
        </SearchContainer>
      </FreeBoardsController>
      <FreeBoardsPost selected={selected} searchQuery={searchQuery} />
      {writeVisible && (
        <WriteQuill
          onPublish={() => setWriteVisible(false)}
          onClose={() => setWriteVisible(false)}
        />
      )}
    </FreeBoardsContainer>
  );
};

export default FreeBoardsBody;

// 이벤트 페이지 가장 바깥을 감싸는 컨테이너
const FreeBoardsContainer = styled.div``;

// 이벤트 페이지 헤더 제목
const FreeBoardsBanner = styled.div`
  margin-top: 24px;

  img {
    border: 1px;
    border-radius: 12px;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06);
  }
`;

// 이벤트 선택바 인기순, 최신순, 좋아요순, 제목 [ 검색하기 부분 ]
const FreeBoardsController = styled.div`
  padding: 10px 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FreeBoardsOptions = styled.div`
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

// 이벤트 선택바 옵션
const FreeBoardsOption = styled.div<{ isSelected: boolean }>`
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
  cursor: pointer;
`;
