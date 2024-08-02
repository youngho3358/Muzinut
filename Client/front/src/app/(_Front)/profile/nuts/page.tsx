"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Login from "../../../../../public/images/login.png";
import banner from "../../../../../public/images/banner.png";
import nut from "../../../../../public/images/Nuts.png";
import Link from "next/link";
import { VoteBox } from "../../../components/icon/icon";
import { Cash, cashData, PurChaseCash, purchaseData } from "./cash";
import Charge from "./charge";
import {
  BannerData,
  ProfileData,
  useFileState,
  ProfileEditForm,
} from "./nutsEdit";

// UseridProps를 props로 받습니다.
const UseridProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("nuts");
  const [subTab, setSubTab] = useState<string | null>(null);

  useEffect(() => {
    // 페이지가 로드될 때 초기 하위 탭 설정
    setSubTab("#cash");
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  // 팝업 처리 ------------------------------------------
  const [chargeOpen, setChargeOpen] = useState(false);

  // 팝업 열기 함수
  const handleOpenCharge = () => {
    setChargeOpen(true);
  };

  // 팝업 닫기 함수
  const handleCloseCharge = () => {
    setChargeOpen(false);
  };
  // 팝업 처리 ------------------------------------------

  const [bannerUrl, setBannerUrl] = useState<string>(banner.src);
  const [profileUrl, setProfileUrl] = useState<string>(Login.src);
  const [editFormVisible, setEditFormVisible] = useState(false);

  // onUpload 함수 정의
  const onUpload = (data: { bannerUrl?: string; profileUrl?: string }) => {
    if (data.bannerUrl) {
      console.log("배너 이미지가 변경되었습니다:", data.bannerUrl);
      setBannerUrl(data.bannerUrl);
    }
    if (data.profileUrl) {
      console.log("프로필 이미지가 변경되었습니다:", data.profileUrl);
      setProfileUrl(data.profileUrl);
    }
  };

  // useFileState 훅을 이용하여 상태와 함수들을 가져옵니다.
  const { profileInfo, handleProfileInfoChange, handleSubmit } =
    useFileState(onUpload);

  // 프로필 정보 수정 폼 열기
  const openEditForm = () => {
    setEditFormVisible(true);
  };

  // 프로필 정보 수정 폼 닫기
  const closeEditForm = () => {
    setEditFormVisible(false);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const nickname = urlParams.get("nickname");

  return (
    <>
      <OverlayBox>
        <OverlayMessage>준비중인 페이지 입니다</OverlayMessage>
        <SelectBox>
          <SelectBar2>
            <SelectContainer2>
              <StyledLink2
                href={`/profile?nickname=${nickname}`}
                onClick={() => setSelectedTab("main")}
              >
                <SelectItem2 selected={selectedTab === "main"}>
                  메인
                </SelectItem2>
              </StyledLink2>
              <StyledLink2
                href={`/profile/lounge?nickname=${nickname}`}
                onClick={() => setSelectedTab("lounge")}
              >
                <SelectItem2 selected={selectedTab === "lounge"}>
                  라운지
                </SelectItem2>
              </StyledLink2>
              <StyledLink2
                href={`/profile/boards?nickname=${nickname}`}
                onClick={() => setSelectedTab("boards")}
              >
                <SelectItem2 selected={selectedTab === "boards"}>
                  게시글
                </SelectItem2>
              </StyledLink2>
            </SelectContainer2>
          </SelectBar2>
        </SelectBox>
      </OverlayBox>
      <ProfileContainer>
        <Banner>
          <Image src={bannerUrl} alt="banner-image" width={1280} height={210} />
          <BannerData onUpload={onUpload} />
        </Banner>
        <Profile>
          <EditForm onClick={openEditForm}>⚙️</EditForm>
          <Image
            src={profileUrl}
            alt="profile-image"
            width={160}
            height={160}
          />
          <ProfileData onUpload={onUpload} />
          <ProfileInfo>
            <ProfileName>{profileInfo.nickname}</ProfileName>
            <FollowInfo>
              팔로잉 {profileInfo.followingCount} &nbsp; 팔로워{" "}
              {profileInfo.followersCount}
            </FollowInfo>
            <ProfileDescription>{profileInfo.intro}</ProfileDescription>
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
              onClick={() => {
                setSelectedTab("nuts");
                setSubTab(null);
              }}
            >
              <SelectItem selected={selectedTab === "nuts"}>넛츠</SelectItem>
            </StyledLink>
          </SelectContainer>
        </SelectBar>
        <NutsContainer>
          <NutsTitle>내 넛츠</NutsTitle>
          <NutsBodyContainer>
            <NutsVotes>
              <Nuts>
                <NutsImage>
                  <Image src={nut} alt="Nuts"></Image>
                </NutsImage>
                <MyNuts>
                  보유중인 넛츠 &nbsp;<p>n개</p>
                </MyNuts>
                <NutsCharge onClick={handleOpenCharge}>
                  <p>충전하기</p>
                </NutsCharge>
                {/* 충전 팝업 */}
                {chargeOpen && <Charge onClose={handleCloseCharge} />}
              </Nuts>
              <Votes>
                <VotesImage>
                  <VoteBox />
                </VotesImage>

                <MyVotes>
                  {" "}
                  보유중인 투표권 &nbsp;<p>n개</p>
                </MyVotes>
                <VotesCharge>
                  <p>구매하기</p>
                </VotesCharge>
              </Votes>
            </NutsVotes>

            <NutsReceipt>
              <ul>
                <StyledLink
                  href={"/profile/nuts"}
                  onClick={() => setSubTab("#cash")}
                >
                  <SelectItem selected={subTab === "#cash"}>
                    <li>사용 내역</li>
                  </SelectItem>
                </StyledLink>

                <StyledLink
                  href={"/profile/nuts/#cash_purchase"}
                  onClick={() => setSubTab("#cash_purchase")}
                >
                  <SelectItem selected={subTab === "#cash_purchase"}>
                    <li>구매 내역</li>
                  </SelectItem>
                </StyledLink>
              </ul>
              {subTab === "#cash" && <Cash data={cashData} />}
              {subTab === "#cash_purchase" && (
                <PurChaseCash purchasedata={purchaseData} />
              )}
            </NutsReceipt>
          </NutsBodyContainer>
        </NutsContainer>
        <ProfileEditForm
          profileInfo={profileInfo}
          onChange={handleProfileInfoChange}
          onSubmit={handleSubmit}
          onCancel={closeEditForm}
          visible={editFormVisible}
        />
      </ProfileContainer>
    </>
  );
};

export default UseridProfile;

// 플리넛 데이터 준비중
const SelectBar2 = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
  display: flex;
  gap: 10px;
  font-size: 16px;
`;

// 메인 라운지를 나란히 하기위한 Flex 박스 컨테이너
const SelectContainer2 = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #ccc;
  position: relative;

  :last-child {
    margin-left: auto;
  }

  img {
    position: absolute;
    right: 0;
    top: -10px;
    padding: 7px;

    &:hover {
      background-color: #e7e7e7;
      border-radius: 8px;
    }
  }
`;

// 선택된 항목에 하단 밑줄을 추가하는 스타일
const SelectItem2 = styled.div<{ selected: boolean }>`
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
const StyledLink2 = styled(Link)`
  color: #16be78;
  text-decoration: none;
`;

// 넛츠 페이지 데이터 준비중

const SelectBox = styled.div`
  margin-bottom: 150px;
`;
const OverlayBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8); // 반투명한 검정색 배경
  z-index: 1000; // 높은 z-index 값으로 다른 요소들 위에 표시
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16be78;
  font-size: 50px;
  font-family: "esamanru bold";
  pointer-events: auto; // 오버레이 메시지 클릭 가능
`;
const OverlayMessage = styled.div`
  position: absolute;
`;
// 넛츠 페이지 데이터 준비중

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
// 넛츠를 감싸는 큰 컨테이너
const NutsContainer = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
  padding-bottom: 24px;
`;

// 넛츠 페이지 제목
const NutsTitle = styled.div`
  font-size: 18px;
  padding: 10px 0;
`;

// 넛츠 바디 컨테이너
const NutsBodyContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 30px;
`;

// 넛츠, 투표권 컨테이너
const NutsVotes = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
`;

// 넛츠 컨테이너 --------------------

// 내 넛츠
const Nuts = styled.div`
  width: 50%;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 15px 20px;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06),
    rgba(0, 0, 0, 0.05) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 0px 2px 0px;
`;

// 넛츠 이미지
const NutsImage = styled.div`
  img {
    width: 36px;
    height: 36px;
    margin-top: 1px;
  }
`;

// 넛츠 충전하기
const NutsCharge = styled.div`
  display: flex;
  margin-left: auto;
  border: 1px;
  border-radius: 5px;
  padding: 0 30px;
  background-color: #16be78;
  cursor: pointer;
  p {
    color: white;
  }
  &:hover {
    background-color: #1bb373;
  }
`;

// 넛츠 박스 텍스트
const MyNuts = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;

  p {
    font-size: 18px;
    color: rgb(0, 206, 130);
  }
`;

// 넛츠 컨테이너 --------------------

// 투표권 컨테이너 --------------------

// 내 투표권
const Votes = styled.div`
  width: 50%;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 15px 20px;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.06),
    rgba(0, 0, 0, 0.05) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 0px 2px 0px;
`;

// 투표권 이미지
const VotesImage = styled.div`
  margin-bottom: 3px;
`;

// 투표권 충전하기
const VotesCharge = styled.div`
  margin-left: auto;
  border: 1px;
  border-radius: 5px;
  padding: 0 30px;
  background-color: #16be78;
  cursor: pointer;
  p {
    color: white;
  }
  &:hover {
    background-color: #1bb373;
  }
`;

// 투표박스 텍스트
const MyVotes = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;

  p {
    font-size: 18px;
    color: rgb(0, 206, 130);
  }
`;

// 투표권 컨테이너 --------------------

// 넛츠 영수증 [사용내역, 구매내역 + 세부사항]
const NutsReceipt = styled.div`
  padding: 4px 4px 0 4px;
  font-size: 18px;

  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    gap: 1.75rem;
  }
`;

// 프로필 에디터
const EditForm = styled.div`
  position: absolute;
  right: 0;
  top: 52px;
  cursor: pointer;
`;
