"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { BannerData, ProfileData, useFileState } from "./boardsEdit";
import ProfileEdit from "../profileEdit";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/LodingSpinner";

const UseridProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("boards");
  const [profileBannerImgName, setProfileBannerImgName] = useState<string>("");
  const [profileImgName, setProfileImgName] = useState<string>("");

  const [boardVisible, setBoardVisible] = useState(5);
  const [showMoreBoard, setShowMoreBoard] = useState(true);

  const [bookmarkedVisible, setBookmarkedVisible] = useState(5);
  const [showMoreBookmark, setShowMoreBookmark] = useState(true);

  const onUpload = (data: {
    profileBannerImgName?: string | object;
    profileImgName?: string | object;
  }) => {
    if (typeof data.profileBannerImgName === "string") {
      setProfileBannerImgName(data.profileBannerImgName);
    }
    if (typeof data.profileImgName === "string") {
      setProfileImgName(data.profileImgName);
    }
  };

  const { profileInfo, boards, BookMarkboards } = useFileState((data) => {
    onUpload({
      profileBannerImgName: data.profileBannerImgName,
      profileImgName: data.profileImgName,
    });
  });

  useEffect(() => {
    if (profileInfo) {
      setProfileBannerImgName(profileInfo.profileBannerImgName || "");
      setProfileImgName(profileInfo.profileImgName || "");
    }
  }, [profileInfo]);

  // 게시글 더보기 함수
  const AddBoard = () => {
    if (showMoreBoard) {
      // 더보기 상태일 때
      if (boardVisible + 5 >= boards.boardsData.length) {
        setBoardVisible(boards.boardsData.length); // 모든 게시글을 표시
        setShowMoreBoard(false); // 더보기 상태 해제
      } else {
        setBoardVisible((prev) => prev + 5); // 게시글 수 증가
      }
    } else {
      // 처음으로 돌아가기 상태일 때
      setBoardVisible(5); // 초기 상태로 돌아감
      setShowMoreBoard(true); // 다시 더보기 상태로 변경
    }
  };

  // 북마크된 게시글 더보기 함수
  const AddBookMark = () => {
    if (showMoreBookmark) {
      // 더보기 상태일 때
      if (bookmarkedVisible + 5 >= BookMarkboards.BookMarkboardsData.length) {
        setBookmarkedVisible(BookMarkboards.BookMarkboardsData.length); // 모든 게시글을 표시
        setShowMoreBookmark(false); // 더보기 상태 해제
      } else {
        setBookmarkedVisible((prev) => prev + 5); // 게시글 수 증가
      }
    } else {
      // 처음으로 돌아가기 상태일 때
      setBookmarkedVisible(5); // 초기 상태로 돌아감
      setShowMoreBookmark(true); // 다시 더보기 상태로 변경
    }
  };

  const router = useRouter();

  const handleClick = (id: number) => {
    const board = boards.boardsData.find((board) => board.id === id);
    if (board) {
      if (board.boardType === "FreeBoard") {
        router.push(`/community/free-boards/${board.id}`);
      } else if (board.boardType === "RecruitBoard") {
        router.push(`/community/recruit-boards/${board.id}`);
      } else if (board.boardType === "AdminBoard") {
        router.push(`/notice/${board.id}`);
      } else if (board.boardType === "EventBoard") {
        router.push(`/event/${board.id}`);
      }

      console.log("게시글 번호:", board.id);
    }
  };

  const handleBookMarkClick = (id: number) => {
    const BookMarkboard = BookMarkboards.BookMarkboardsData.find(
      (BookMarkboard) => BookMarkboard.id === id
    );
    if (BookMarkboard) {
      if (BookMarkboard.boardType === "FreeBoard") {
        router.push(`/community/free-boards/${BookMarkboard.id}`);
      } else if (BookMarkboard.boardType === "RecruitBoard") {
        router.push(`/community/recruit-boards/${BookMarkboard.id}`);
      } else if (BookMarkboard.boardType === "AdminBoard") {
        router.push(`/notice/${BookMarkboard.id}`);
      } else if (BookMarkboard.boardType === "EventBoard") {
        router.push(`/event/${BookMarkboard.id}`);
      }

      console.log("게시글 번호:", BookMarkboard.id);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const nickname = urlParams.get("nickname");

  return (
    <ProfileContainer>
      <Banner>
        {profileBannerImgName ? (
          <Image
            src={`data:image/png;base64,${profileBannerImgName}`}
            alt="배너 이미지"
            width={1280}
            height={210}
          />
        ) : (
          <Spinner />
        )}
        <BannerData onUpload={onUpload} />
      </Banner>
      <Profile>
        <ProfileEdit />
        {profileImgName ? (
          <Image
            src={`data:image/png;base64,${profileImgName}`}
            alt="프로필 이미지"
            width={160}
            height={160}
          />
        ) : (
          <Spinner />
        )}
        <ProfileData onUpload={onUpload} />
        <ProfileInfo>
          <ProfileName>{profileInfo.nickname}</ProfileName>
          <FollowInfo>
            팔로잉 {profileInfo.followingCount} &nbsp; 팔로워{" "}
            {profileInfo.followersCount}
          </FollowInfo>
          <ProfileDescription>
            {profileInfo.intro || "자기소개를 입력하세요"}
          </ProfileDescription>
        </ProfileInfo>
      </Profile>
      <SelectBar>
        <SelectContainer>
          <StyledLink
            href={`/profile?nickname=${nickname}`}
            onClick={() => setSelectedTab("main")}
          >
            <SelectItem selected={selectedTab === "main"}>메인</SelectItem>
          </StyledLink>
          <StyledLink
            href={`/profile/lounge?nickname=${nickname}`}
            onClick={() => setSelectedTab("lounge")}
          >
            <SelectItem selected={selectedTab === "lounge"}>라운지</SelectItem>
          </StyledLink>
          <StyledLink
            href={`/profile/boards?nickname=${nickname}`}
            onClick={() => setSelectedTab("boards")}
          >
            <SelectItem selected={selectedTab === "boards"}>게시글</SelectItem>
          </StyledLink>
          <StyledLink
            href={`/profile/plynut?nickname=${nickname}`}
            onClick={() => setSelectedTab("plynut")}
          >
            <SelectItem selected={selectedTab === "plynut"}>플리넛</SelectItem>
          </StyledLink>
          |
          <StyledLink
            href={`/profile/nuts?nickname=${nickname}`}
            onClick={() => setSelectedTab("nuts")}
          >
            <SelectItem selected={selectedTab === "nuts"}>넛츠</SelectItem>
          </StyledLink>
        </SelectContainer>
      </SelectBar>

      <Boards>
        <BoardsBoards>
          <BoardsTitle>게시글</BoardsTitle>
          <BoardsContainer>
            {boards.boardsData ? (
              boards.boardsData
                .slice(0, boardVisible)
                .filter((board) => board.boardTitle !== null)
                .map((board) => (
                  <Box key={board.id} onClick={() => handleClick(board.id)}>
                    {board.boardTitle}
                  </Box>
                ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </BoardsContainer>
          <BoardsAdd>
            <p onClick={AddBoard}>
              {showMoreBoard ? "더보기" : "처음으로 돌아가기"}
            </p>{" "}
          </BoardsAdd>
        </BoardsBoards>

        <BoardsBoards style={{ marginTop: "50px" }}>
          <BoardsTitle>북마크한 게시글</BoardsTitle>
          <BoardsContainer>
            {BookMarkboards.BookMarkboardsData ? (
              BookMarkboards.BookMarkboardsData.slice(0, bookmarkedVisible)
                .filter((BookMarkboard) => BookMarkboard.bookmarkTitle !== null)
                .map((BookMarkboard) => (
                  <Box
                    key={BookMarkboard.id}
                    onClick={() => handleBookMarkClick(BookMarkboard.id)}
                  >
                    {BookMarkboard.bookmarkTitle}
                  </Box>
                ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </BoardsContainer>
          <BoardsAdd>
            <p onClick={AddBookMark}>
              {showMoreBookmark ? "더보기" : "처음으로 돌아가기"}
            </p>{" "}
            {/* 버튼 텍스트 조건부 렌더링 */}
          </BoardsAdd>
        </BoardsBoards>
      </Boards>
    </ProfileContainer>
  );
};

export default UseridProfile;

// 마이페이지 전체를 감싸는 컨테이너
const ProfileContainer = styled.div``;

// 배너
const Banner = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  position: relative;

  img {
    background-color: white;
    font-size: 60px;
    border-radius: 20px;
    overflow: hidden;
  }

  :nth-child(2) {
    display: flex;
    justify-content: flex-end;
  }
`;

// -------------------------------------------------------------------------------------------------------
// 프로필
const Profile = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
  display: flex;
  align-items: center;
  position: relative;

  // 프로필 이미지
  img {
    border-radius: 100px;
    overflow: hidden;
  }
`;

// 프로필 정보 박스
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-left: 24px;
`;

// 프로필 정보 [닉네임]
const ProfileName = styled.span`
  font-weight: bold;
  font-size: 36px;
`;

// 프로필 정보 [팔로우 팔로워 수]
const FollowInfo = styled.span`
  font-size: 14px;
  margin-top: 8px;
`;

// 프로필 정보 [자기소개]
const ProfileDescription = styled.span`
  font-size: 14px;
  margin-top: 8px;
`;

// -------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------
// 메인, 라운지 선택바
const SelectBar = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
  display: flex;
  gap: 10px;
  font-size: 16px;
`;

// 메인 라운지를 나란히 하기위한 Flex 박스 컨테이너
const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #ccc;
  position: relative;
`;

// 선택된 항목에 하단 밑줄을 추가하는 스타일
const SelectItem = styled.div<{ selected: boolean }>`
  padding-bottom: 10px;
  position: relative;
  cursor: pointer;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--text-color);
    transform: scaleX(${(props) => (props.selected ? 1 : 0)});
    transition: transform 0.3s ease;
  }
`;

// 메인 라운지 링크 태그 스타일을 주기위한 요소 추가
const StyledLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
`;
// -------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------
// 게시글을 감싸는 큰 컨테이너
const Boards = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
`;

// 박스 섹션을 감싸는 컨테이너
const BoardsBoards = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;

// 박스 더보기
const BoardsAdd = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  font-family: "esamanru Light";
  font-size: 14px;

  p {
    cursor: pointer;
    &:hover {
      color: #1bb373;
    }
  }
`;

// 섹션 타이틀
const BoardsTitle = styled.h2`
  font-size: 20px;
`;

// 박스를 감싸는 컨테이너
const BoardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  font-size: 14px;
  cursor: pointer;
`;

// 박스 스타일
const Box = styled.div`
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
  width: 100%; /* Ensure the box takes up the full width of its grid cell */

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    transition: 0.3s ease;
    border-color: #1bb373;
  }
`;

// 프로필 에디터
const EditForm = styled.div`
  position: absolute;
  right: 0;
  top: 52px;
  cursor: pointer;
`;
