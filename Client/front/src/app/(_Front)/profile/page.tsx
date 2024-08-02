"use client";
import React, { useState, useEffect, Suspense } from "react";
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { BannerData, ProfileData, useFileState } from "./mainEdit";
import { BaseImgBox } from "@/app/components/icon/icon";
import ProfileEdit from "./profileEdit";
import Spinner from "@/app/components/LodingSpinner";
import FollowButton from "@/app/components/button/Followingbutton";
import { getToken } from "@/app/common/common";
import { useUser } from "@/app/components/UserContext";

const UseridProfile: React.FC = () => {
  const { user } = useUser();
  const UserData = user?.nickname;

  const [selectedTab, setSelectedTab] = useState("main");
  const [profileBannerImgName, setProfileBannerImgName] = useState<string>("");
  const [profileImgName, setProfileImgName] = useState<string>("");

  const onUpload = (data: {
    profileBannerImgName?: string | object;
    profileImgName?: string | object;
  }) => {
    if (typeof data.profileBannerImgName === "string") {
      console.log("배너 이미지가 변경되었습니다:", data.profileBannerImgName);
      setProfileBannerImgName(data.profileBannerImgName);
    }
    if (typeof data.profileImgName === "string") {
      console.log("프로필 이미지가 변경되었습니다:", data.profileImgName);
      setProfileImgName(data.profileImgName);
    }
  };

  const { profileInfo, albumInfo, albumArrayInfo } = useFileState((data) => {
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

  const limitedAlbums = albumArrayInfo.slice(0, 5); // 최대 5곡

  const Token = getToken();

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
        <Suspense fallback={<Spinner />}>
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
        </Suspense>
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
      <MainMusicContainer>
        <Suspense fallback={<Spinner />}>
          {albumInfo.mainSongAlbumImage ? (
            <>
              <QuestionContainer>
                <Image
                  src={`data:image/png;base64,${albumInfo.mainSongAlbumImage}`}
                  alt="main-song"
                  width={1280}
                  height={720}
                />
              </QuestionContainer>
              <AlbumInfoBox>
                <Like>💚 {albumInfo.likeCount}</Like>
                <AlbumInformation>
                  <Info1>{albumInfo.songTitle}</Info1>
                  <Info2>{albumInfo.genre}</Info2>
                  <AlbumMusician>
                    <AlbumLyricist>작사 : {albumInfo.lyricist}</AlbumLyricist>
                    <AlbumComposer>작곡 : {albumInfo.composer}</AlbumComposer>
                  </AlbumMusician>
                </AlbumInformation>
              </AlbumInfoBox>
            </>
          ) : (
            <QuestionContainer>
              <BaseImgBox />
              <MusicTitle>나만의 앨범을 만들어 보세요</MusicTitle>
            </QuestionContainer>
          )}
        </Suspense>
      </MainMusicContainer>
      <BodyAlbum>
        <Suspense fallback={<Spinner />}>
          {limitedAlbums.length > 0 && (
            <AlbumList>
              {limitedAlbums.map((album, index) => (
                <AlbumItem key={index}>
                  <Image
                    src={`data:image/png;base64,${album.albumImage}`}
                    alt={`albumImage${index}`}
                    width={200}
                    height={200}
                  />
                  <AlbumTitle>{album.albumTitle}</AlbumTitle>
                </AlbumItem>
              ))}
            </AlbumList>
          )}
        </Suspense>
      </BodyAlbum>
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
    background-color: white;
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
// 메인 곡

// 곡 이미지와 설명을 감싸는 컨테이너
const MainMusicContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;

  gap: 5%;
  border-bottom: 1px solid #ccc;

  padding: 25px 0 22px 0;

  img {
    border: none;
    border-radius: 8px;
    width: 100%;
    height: auto;
  }
`;

// 곡
const MusicTitle = styled.div`
  position: absolute;
  top: 46%;
  right: 10%;
  font-size: 40px;
`;

// 퀘스쳔 박스 컨테이너
const QuestionContainer = styled.div`
  width: 50%;
  max-width: 50%;
  max-height: auto;
  height: auto;

  img {
    max-width: 610px;
    max-height: 343px;
    min-width: 610px;
    min-height: 343px;
  }
`;

// 그림자 애니메이션
const shadowAnimation = keyframes`
  0% {
    box-shadow: 0 2px 12px var(--text-color);
  }
  50% {
    box-shadow: 0 6px 20px var(--text-color);
  }
  100% {
    box-shadow: 0 2px 12px var(--text-color);
  }
`;

// 메인 곡 Json Box
const AlbumInfoBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
  /* margin-right: 55px; */
  border-radius: 8px;
  box-shadow: 0 2px 12px var(--text-color);
  transition: 0.3s ease;

  &:hover {
    animation: ${shadowAnimation} 1.2s infinite;
  }
`;

// 좋아요
const Like = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  color: #16be78;
  font-weight: bold;
  padding: 20px;
`;

// 앨범 설명 세로 정렬
const AlbumInformation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 앨범 제목
const Info1 = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: var(--text-color);
`;

// 앨범 장르
const Info2 = styled.div`
  font-size: 20px;
  color: var(--text-color);
  padding: 5px 0;
`;

// 작사 작곡 컨테이너
const AlbumMusician = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: var(--text-color);
  gap: 5px;
`;

// 작사
const AlbumLyricist = styled.div``;

// 작곡
const AlbumComposer = styled.div``;

// -------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------
// 바디 앨범
const BodyAlbum = styled.div`
  padding-top: 16px;
  position: relative;
`;

// 앨범 목록
const AlbumList = styled.div`
  display: flex;
  padding: 15px 35px 0 34px;
`;

// 앨범 설명
const AlbumTitle = styled.div`
  font-size: 20px;
  margin-bottom: 15px;
`;

// 앨범 이미지
const AlbumItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 0 1.75em 0;
  margin: 0 54px 0 0;
  gap: 30px;

  img {
    border-radius: 12px;
  }
`;
// -------------------------------------------------------------------------------------------------------
