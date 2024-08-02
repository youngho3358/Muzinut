"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Login from "../../../../../public/images/login.png";
import banner from "../../../../../public/images/banner.png";
import plynutAdd from "../../../../../public/svgs/PlyNutAdd.svg";
import Link from "next/link";
import {
  BannerData,
  ProfileData,
  useFileState,
  ProfileEditForm,
} from "./plynutEdit";
import axios from "axios";
import AxiosURL from "@/app/axios/url";

interface PlynutDataProps {
  title: string;
}

interface Track {
  id: number;
  album: string;
  artist: string;
  title: string;
}

const UseridProfile: React.FC<PlynutDataProps> = () => {
  const [selectedTab, setSelectedTab] = useState("plynut");
  const [bannerUrl, setBannerUrl] = useState<string>(banner.src);
  const [profileUrl, setProfileUrl] = useState<string>(Login.src);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [addPlynut, setAddPlynut] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [PlyNutData, setPlyNutData] = useState([
    { id: 1, title: "~" },
    { id: 2, title: "~" },
    { id: 3, title: "~" },
    { id: 4, title: "~" },
    { id: 5, title: "~" },
    { id: 6, title: "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" },
    { id: 7, title: "~" },
    { id: 8, title: "~" },
    { id: 9, title: "~" },
    { id: 10, title: "~" },
  ]);
  const [PlyNutVisible, setPlyNutVisible] = useState(10);
  const [selectedPlyNutId, setSelectedPlyNutId] = useState<number | null>(null);
  const [openPlyNutId, setOpenPlyNutId] = useState<number | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  // 데이터가 변경될 때마다 플리넛의 곡 정보를 업데이트합니다.
  useEffect(() => {
    if (selectedPlyNutId !== null) {
      fetchTracks(selectedPlyNutId);
    }
  }, [selectedPlyNutId]);

  if (PlyNutVisible > 10) {
    alert("플리넛은 10개까지 생성 가능합니다");
  }

  const authToken = "your-auth-token-here";

  const PlyNutDatas = async () => {
    try {
      const res = await axios.post(`${AxiosURL}/mypage/playnut`, PlyNutData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.error("플리넛 데이터를 가져오지 못했습니다", error);
    }
  };

  const fetchTracks = async (plynutId: number) => {
    try {
      const res = await axios.get(
        `${AxiosURL}/mypage/playnut/${plynutId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setTracks(res.data);
    } catch (error) {
      console.error("곡 정보를 가져오지 못했습니다", error);
    }
  };

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

  const { profileInfo, handleProfileInfoChange, handleSubmit } =
    useFileState(onUpload);

  const openEditForm = () => {
    setEditFormVisible(true);
  };

  const closeEditForm = () => {
    setEditFormVisible(false);
  };

  const addPlyNut = () => {
    setAddPlynut(true);
  };

  const closePlyNut = () => {
    setAddPlynut(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    if (value.trim().length < 2) {
      setTitleError("제목은 2글자 이상 입력 가능합니다.");
    } else if (value.trim().length > 15) {
      setTitleError("제목은 15글자까지만 입력 가능합니다.");
    } else {
      setTitleError("");
    }
  };

  const isFormValid = title.trim().length >= 2 && title.trim().length <= 15;

  const handlePlyNutClick = (index: number) => {
    setSelectedPlyNutId(index);
    window.location.hash = `${index}`;
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
      {/* <ProfileContainer> */}
      <Banner>
        <Image src={bannerUrl} alt="banner-image" width={1280} height={210} />
        <BannerData onUpload={onUpload} />
      </Banner>
      <Profile>
        <EditForm onClick={openEditForm}>⚙️</EditForm>
        <Image src={profileUrl} alt="profile-image" width={160} height={160} />
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
          <StyledLink href={`/profile/plynut?nickname=${nickname}`}>
            <SelectItem selected={selectedTab === "#Addplynut"}>
              <Image onClick={addPlyNut} src={plynutAdd} alt="Addplynut" />
            </SelectItem>
          </StyledLink>
        </SelectContainer>
      </SelectBar>
      {/*}
        {addPlynut && (
          <ModalOverlay>
            <ModalContent>
              <h2>플리넛 추가</h2>
              <AddPlyNutContent>
                <InputLabel2>
                  제목
                  <InputField2
                    name="addplynut"
                    value={title}
                    onChange={handleTitleChange}
                    style={{ borderColor: titleError ? "red" : "#ccc" }}
                  />
                  {titleError && (
                    <NameErrorMessage>{titleError}</NameErrorMessage>
                  )}
                </InputLabel2>
              </AddPlyNutContent>
              <ButtonContainer>
                <CloseButton
                  onClick={closePlyNut}
                  style={{ marginRight: "10px" }}
                >
                  닫기
                </CloseButton>
                <SaveButton disabled={!isFormValid} onClick={PlyNutDatas}>
                  추가
                </SaveButton>
              </ButtonContainer>
            </ModalContent>
          </ModalOverlay>
        )}
        <PlyNutContainer>
          <PlyNutTitle>내 플리넛</PlyNutTitle>
          <PlyNutBox>
            {PlyNutData.slice(0, PlyNutVisible).map((PlyNut, index) => (
              <Box key={PlyNut.id} onClick={() => handlePlyNutClick(PlyNut.id)}>
                {PlyNut.title}
              </Box>
            ))}
          </PlyNutBox>
        </PlyNutContainer>
        {selectedPlyNutId !== null && (
          <TracksContainer>
            <ul>
              <li>앨범</li>
              <li>아티스트</li>
              <li>곡명</li>
              <li>삭제하기</li>
            </ul>
            {tracks.length > 0 ? (
              <TracksList>
                {tracks.map((track) => (
                  <TrackItem key={track.id}>
                    <TrackDetail>{track.album}</TrackDetail>
                    <TrackDetail>{track.artist}</TrackDetail>
                    <TrackDetail>{track.title}</TrackDetail>
                    <DeleteButton>삭제하기</DeleteButton>
                  </TrackItem>
                ))}
              </TracksList>
            ) : (
              <p>곡이 없습니다.</p>
            )}
          </TracksContainer>
        )}
        <ProfileEditForm
          profileInfo={profileInfo}
          onChange={handleProfileInfoChange}
          onSubmit={handleSubmit}
          onCancel={closeEditForm}
          visible={editFormVisible}
        />
      </ProfileContainer> */}
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
// 플리넛 데이터 준비중

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

const ProfileContainer = styled.div`
  position: relative;
  pointer-events: none; // 오버레이 메시지 외의 다른 요소 클릭 불가
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

// 박스 섹션을 감싸는 컨테이너
const PlyNutContainer = styled.div`
  position: absolute;
  right: 0;
  top: 460px;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 20px 20px 20px;
  background-color: white;
`;

// 섹션 타이틀
const PlyNutTitle = styled.h2`
  font-size: 18px;
  text-align: center;
`;

// 박스를 감싸는 컨테이너
const PlyNutBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  max-width: 300px;
  gap: 10px;
  font-size: 12px;
`;

// 박스 스타일
const Box = styled.div`
  background-color: none;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
  width: 100%;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    transition: 0.3s ease;
    border-color: #1bb373;
  }
`;

// 플리넛 추가 모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const ModalContent = styled.div`
  width: 300px;
  background-color: white;
  color: black;
  padding: 10px 30px 20px 30px;
  border-radius: 10px;
  position: relative;
  z-index: 4;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
`;

const AddPlyNutContent = styled.div`
  color: black;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  border-radius: 25px;
  padding: 10px 20px;
  background-color: #16be78;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-family: "esamanru Medium";

  &:hover {
    background-color: #13a86a;
  }
`;

const SaveButton = styled.button<{ disabled: boolean }>`
  border-radius: 25px;
  padding: 10px 20px;
  background-color: ${(props) => (props.disabled ? "#b0dab9" : "#16be78")};
  color: white;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 16px;
  font-family: "esamanru Medium";

  &:hover {
    background-color: ${(props) => (props.disabled ? "#b0dab9" : "#13a86a")};
  }

  &:disabled {
    background-color: #b0dab9;
    cursor: not-allowed;
  }
`;

const InputLabel2 = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  font-family: "esamanru Medium";
  color: black;
`;

const InputField2 = styled.input`
  padding: 8px;
  font-size: 14px;
  font-family: "esamanru Light";
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  resize: none;
`;

const NameErrorMessage = styled.p`
  position: absolute;
  right: 32px;
  top: 67px;
  color: red;
  font-size: 12px;
  font-family: "esamanru Medium";
`;

const TracksContainer = styled.div`
  margin-top: 20px;
`;

const TracksList = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
`;

const TrackItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const TrackDetail = styled.span`
  flex: 1;
`;

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e60000;
  }
`;

// 프로필 에디터
const EditForm = styled.div`
  position: absolute;
  right: 0;
  top: 52px;
  cursor: pointer;
`;
