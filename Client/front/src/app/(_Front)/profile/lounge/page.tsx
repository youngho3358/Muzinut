"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Image from "next/image";
import threedot from "../../../../../public/svgs/threedot.svg";
import Link from "next/link";
import { CommentIcon } from "../../../components/icon/icon";
import OpenComment from "./comment";
import WriteEditor from "./WriteEditor";
import { BannerData, ProfileData, useFileState } from "./loungeEdit";
import ProfileEdit from "../profileEdit";
import { LikeIcon } from "../../../components/LikePost/like";
import AxiosURL from "@/app/axios/url";
import { getToken } from "@/app/common/common";
import { useUser } from "@/app/components/UserContext";
import FollowButton from "@/app/components/button/Followingbutton";
import Spinner from "@/app/components/LodingSpinner";

const UseridProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("lounge");
  const [profileBannerImgName, setProfileBannerImgName] = useState<string>("");
  const [profileImgName, setProfileImgName] = useState<string>("");
  const [writeVisible, setWriteVisible] = useState(false);
  const [LoungePost, setLoungePost] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [threedotopen, setThreeDotOpen] = useState<boolean[]>([]);
  const [openComments, setOpenComments] = useState<boolean[]>([]);
  const threedotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { user } = useUser();
  const UserData = user?.nickname;
  const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const postTime = new Date(timestamp);

    const diffTime = now.getTime() - postTime.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 30) {
      return `${diffDays}일 전`;
    } else if (diffMonths < 12) {
      return `${diffMonths}달 전`;
    } else {
      return `${diffYears}년 전`;
    }
  };

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

  const { profileInfo, LoungeForm, quiilFiles } = useFileState((data) => {
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

  useEffect(() => {
    if (LoungeForm.length > 0) {
      const loungeContents = LoungeForm.map((item) => item.content);
      setLoungePost(loungeContents);
      setThreeDotOpen(Array(LoungeForm.length).fill(false));
      setOpenComments(Array(LoungeForm.length).fill(false));
      threedotRefs.current = Array(LoungeForm.length).fill(null);
    }
  }, [LoungeForm]);

  const handleThreeDotClick = (index: number, postId: number) => {
    // 게시글 ID를 사용하여 라우트 변경
    const url = `/profile/lounge?nickname=${nickname}#${postId}`;
    window.history.replaceState(null, "", url);

    // 해당 요소로 스크롤
    setTimeout(() => {
      const element = document.getElementById(postId.toString());
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 0);

    // 메뉴 열기/닫기 로직
    setThreeDotOpen((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  useEffect(() => {
    // 페이지 새로고침 감지
    const currentUrl = window.location.href;
    if (window.performance.navigation.type === 1) {
      // 새로고침 시 URL 유지
      window.location.href = currentUrl;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        threedotRefs.current.some(
          (ref) => ref && ref.contains(event.target as Node)
        )
      ) {
        return; // 삼각형 버튼 내부 클릭 시 무시
      }

      // 삼각형 버튼 외부 클릭 시 해시값 제거
      window.history.replaceState(
        null,
        "",
        `/profile/lounge?nickname=${nickname}`
      );
      setThreeDotOpen(Array(LoungePost.length).fill(false));
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [LoungePost.length]);

  const handleCommentToggle = (index: number) => {
    setOpenComments((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const handleWriteClick = () => {
    setWriteVisible(true);
    setEditingIndex(null);
  };

  const handlePublish = (content: string) => {
    if (editingIndex !== null) {
      const updatedContent = [...LoungePost];
      updatedContent[editingIndex] = content;
      setLoungePost(updatedContent);
      setEditingIndex(null);
    } else {
    }
    setWriteVisible(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setWriteVisible(true);
  };

  const authToken = getToken();

  const handleDelete = async (index: number) => {
    const postId = LoungeForm[index]?.id;
    if (!postId) return;

    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`${AxiosURL}/profile/lounge#${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `${authToken}`,
          },
        });

        if (response.ok) {
          // 성공적으로 삭제된 경우
          alert("게시글이 성공적으로 삭제되었습니다.");
          window.location.reload();

          const updatedContent = LoungePost.filter((_, i) => i !== index);
          setLoungePost(updatedContent);
          setThreeDotOpen((prev) => prev.filter((_, i) => i !== index));
          setOpenComments((prev) => prev.filter((_, i) => i !== index));
          threedotRefs.current = threedotRefs.current.filter(
            (_, i) => i !== index
          );
        } else {
          console.error("삭제 요청에 실패했습니다.");
          const errorData = await response.json();
          console.error("Error details:", errorData);
          alert("게시글 삭제에 실패했습니다. 오류: " + errorData.message);
        }
      } catch (error) {
        console.error("삭제 요청 중 오류 발생:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handlePostClick = (postId: number) => {
    const url = `/profile/lounge?nickname=${nickname}#${postId}`;
    window.history.replaceState(null, "", url);

    setTimeout(() => {
      const element = document.getElementById(postId.toString());
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 0);
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
          <FollowButton />
          <ProfileDescription>
            {profileInfo.intro || "자기소개를 입력하세요"}
          </ProfileDescription>
        </ProfileInfo>
      </Profile>
      <SelectBar>
        <SelectContainer>
          {nickname === UserData ? (
            <>
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
                <SelectItem selected={selectedTab === "lounge"}>
                  라운지
                </SelectItem>
              </StyledLink>
              <StyledLink
                href={`/profile/boards?nickname=${nickname}`}
                onClick={() => setSelectedTab("boards")}
              >
                <SelectItem selected={selectedTab === "boards"}>
                  게시글
                </SelectItem>
              </StyledLink>
              <StyledLink
                href={`/profile/plynut?nickname=${nickname}`}
                onClick={() => setSelectedTab("plynut")}
              >
                <SelectItem selected={selectedTab === "plynut"}>
                  플리넛
                </SelectItem>
              </StyledLink>
              |
              <StyledLink
                href={`/profile/nuts?nickname=${nickname}`}
                onClick={() => setSelectedTab("nuts")}
              >
                <SelectItem selected={selectedTab === "nuts"}>넛츠</SelectItem>
              </StyledLink>
              <Write onClick={handleWriteClick}>Talk</Write>
            </>
          ) : (
            <>
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
                <SelectItem selected={selectedTab === "lounge"}>
                  라운지
                </SelectItem>
              </StyledLink>
            </>
          )}
        </SelectContainer>
      </SelectBar>
      <Lounge>
        {LoungePost.map((content, index) => {
          const loungeItem = LoungeForm[index];
          const postId = loungeItem?.id; // 게시글 ID를 가져옵니다.
          return (
            <LoungeContainer
              key={postId}
              id={postId.toString()}
              onClick={() => handlePostClick(postId)}
            >
              <LoungeProfileInfo>
                <LoungeProfileImage>
                  <Image
                    src={`data:image/png;base64,${profileImgName}`}
                    alt="profile-image"
                    width={40}
                    height={40}
                  />
                </LoungeProfileImage>
                <LoungeProfileName>{profileInfo.nickname}</LoungeProfileName>
                <LoungeProfileUploadTime>
                  {timeAgo(loungeItem.createdDt)}
                </LoungeProfileUploadTime>
                <LoungeProfileDetail
                  ref={(el) => {
                    threedotRefs.current[index] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThreeDotClick(index, postId);
                  }}
                >
                  <Image
                    src={threedot}
                    alt="수정, 삭제"
                    width={24}
                    height={24}
                  />
                  {threedotopen[index] && (
                    <ThreeDotOpen>
                      <label onClick={() => handleEdit(index)}>수정</label>|
                      <label onClick={() => handleDelete(index)}>삭제</label>
                    </ThreeDotOpen>
                  )}
                </LoungeProfileDetail>
              </LoungeProfileInfo>
              <LoungeWriteContainer>
                <LoungeWrite
                  dangerouslySetInnerHTML={{ __html: quiilFiles[index] }}
                />
              </LoungeWriteContainer>
              {loungeItem && (
                <LoungeLikeCommentContainer>
                  <LoungeLike>
                    <LikeIcon postId={LoungeForm[index]?.id || 0} />
                    {loungeItem.like}
                  </LoungeLike>
                  <LoungeComment onClick={() => handleCommentToggle(index)}>
                    <CommentIcon />
                    {loungeItem.commentSize}
                  </LoungeComment>
                </LoungeLikeCommentContainer>
              )}
              {openComments[index] && <OpenComment loungeId={postId} />}
            </LoungeContainer>
          );
        })}
      </Lounge>
      {writeVisible && (
        <WriteEditor
          onPublish={handlePublish}
          onClose={() => setWriteVisible(false)}
          initialContent={editingIndex !== null ? LoungePost[editingIndex] : ""}
        />
      )}
    </ProfileContainer>
  );
};

export default UseridProfile;

// 마이페이지 전체를 감싸는 컨테이너
const ProfileContainer = styled.div``;

// 글쓰기
const Write = styled.div`
  font-size: 18px;
  margin-left: auto;
  cursor: pointer;

  &:hover {
    color: #16be78;
  }
`;
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
// 라운지를 감싸는 큰 컨테이너
const Lounge = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding: 24px 0;
`;

// 라운지 Border 컨테이너
const LoungeContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  margin: 0 0 16px 0;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06);
`;

// -------------------------------------------------------------------------------------------------------
// 라운지 프로필 정보를 감싸는 컨테이너
const LoungeProfileInfo = styled.div`
  display: flex;
  padding: 15px 15px 15px 15px;
  gap: 7px;
  font-size: 13px;
  align-items: center;
`;

// 라운지 게시글 프로필 정보
const LoungeProfileImage = styled.div`
  img {
    border-radius: 32px;
    margin-top: 2px;
  }
`;

// 라운지 프로필 닉네임
const LoungeProfileName = styled.div`
  margin-bottom: 2px;
`;

// 라운지 프로필 업로드 시간 ~ 기간
const LoungeProfileUploadTime = styled.div`
  margin-bottom: 0px;
`;

// 라운지 프로필 삼각점바 (공유하기, 신고하기 기능)
const LoungeProfileDetail = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto; /* 오른쪽 끝으로 이동 */
  position: relative;
  cursor: pointer;

  img {
    &:hover {
      border: 1px;
      border-radius: 7px;
      background-color: #e7e7e7;
    }
  }
`;
// -------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------
// 라운지 글쓰기 컨테이너
const LoungeWriteContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px 15px;
`;

// 라운지 글쓰기
const LoungeWrite = styled.div`
  padding: 0 0 10px 0;

  img {
    margin-top: 5px;
    max-width: 100%;
    border-radius: 10px;
  }
`;
// -------------------------------------------------------------------------------------------------------
// 라운지 좋아요, 댓글 컨테이너
const LoungeLikeCommentContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 15px 10px 15px;
  gap: 20px;
  font-size: 14px;
`;

// 라운지 좋아요
const LoungeLike = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

// 라운지 댓글
const LoungeComment = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

// 쓰리닷 오픈 시
const ThreeDotOpen = styled.div`
  position: absolute;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  bottom: -17px;
  left: 50px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100px;

  label {
    padding: 4px 8px;
    border-radius: 12px;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

// 프로필 에디터
const EditForm = styled.div`
  position: absolute;
  right: 0;
  top: 52px;
  cursor: pointer;
`;
