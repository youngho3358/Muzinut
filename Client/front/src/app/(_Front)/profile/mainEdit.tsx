import React, { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import axios from "axios";
import AxiosUrl from "@/app/axios/url";
import { getToken } from "@/app/common/common";
import { useUser } from "@/app/components/UserContext";

// useFileState 훅과 초기 데이터
export const useFileState = (onUpload: (data: any) => void) => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    profileBannerImgName: null,
    profileImgName: null,
    mainSongAlbumImage: null,
    albumImage: null,
  });

  interface profileInfoProps {
    userId: number;
    profileBannerImgName: string;
    profileImgName: string;
    nickname: string;
    followStatus: boolean;
    followingCount: number;
    followersCount: number;
    intro: string;
  }

  interface albumInfoProps {
    mainSongAlbumImage: string;
    songTitle: string;
    albumTitle: string;
    genre: string;
    lyricist: string;
    composer: string;
    likeCount: number;
  }

  interface albumArrayInfoProps {
    albumImage: string;
    albumTitle: string;
  }

  const [profileInfo, setProfileInfo] = useState<profileInfoProps>({
    userId: 0,
    profileBannerImgName: "",
    profileImgName: "",
    nickname: "닉네임",
    followStatus: false,
    followingCount: 0,
    followersCount: 0,
    intro: "자기소개를 입력하세요",
  });

  const [albumInfo, setAlbumInfo] = useState<albumInfoProps>({
    mainSongAlbumImage: "",
    songTitle: "곡 명",
    albumTitle: "앨범제목",
    genre: "장르",
    lyricist: "작사가",
    composer: "작곡가",
    likeCount: 0,
  });

  const [albumArrayInfo, setAlbumArrayInfo] = useState<albumArrayInfoProps[]>(
    []
  );

  // 이미지 사이즈 체크 함수
  const checkImageSize = (file: File, maxWidth: number, maxHeight: number) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const img = new Image();
        img.onload = function () {
          if (img.width >= maxWidth && img.height >= maxHeight) {
            resolve(true); // 권장 사이즈 이상일 경우 true 반환
          } else {
            resolve(false); // 권장 사이즈 이하일 경우 false 반환
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const authToken = getToken();

  const handleBannerSubmit = async (
    e: ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    // 파일이 선택되었는지 확인
    if (e.target.files && e.target.files.length > 0) {
      // 선택된 파일
      const file = e.target.files[0];
      console.log(file);

      // 이미지 사이즈 체크 (권장 사이즈: 1280x210)
      const isSizeValid = await checkImageSize(file, 1280, 210);
      if (!isSizeValid) {
        alert("배너 이미지는 1280x210를 권장 합니다!");
        return;
      }

      // FormData에 파일 추가
      const BannernewFiles = { ...files, [key]: file };
      setFiles(BannernewFiles);

      // key를 통해 FormData에 파일 추가
      const formData = new FormData();
      formData.append("bannerImg", file);
      console.log(formData);

      // 프로필 배너 이미지 업로드
      try {
        const res = await axios.post(
          `${AxiosUrl}/users/set-profile-bannerImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${authToken}`,
            },
          }
        );
        onUpload({ [key]: res.data }); // 업로드 성공 시 데이터 처리
        window.location.reload(); // 페이지 새로고침 (필요에 따라 변경)
      } catch (error) {
        console.error("배너 이미지 업로드 실패:", error);
      }
    } else {
      console.error("업로드 파일이 존재하지 않음");
    }
  };

  // 프로필 이미지 데이터
  const handleProfileSubmit = async (
    e: ChangeEvent<HTMLInputElement> | null,
    key: string
  ) => {
    // 파일이 선택되었는지 확인
    if (e && e.target.files && e.target.files.length > 0) {
      // 선택된 파일
      const file = e.target.files[0];
      console.log(file);

      // 이미지 사이즈 체크 (권장 사이즈: 160x160)
      const isSizeValid = await checkImageSize(file, 160, 160);
      if (!isSizeValid) {
        alert("프로필 이미지는 160x160 이상을 권장 합니다!");
        return;
      }

      // FormData에 파일 추가
      const profileFormData = new FormData();
      profileFormData.append("profileImg", file);

      try {
        // 프로필 이미지 업로드
        const res = await axios.post(
          `${AxiosUrl}/users/set-profile`,
          profileFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${authToken}`,
            },
          }
        );
        console.log(res.data);
        onUpload({ [key]: res.data }); // 업로드 성공 시 데이터 처리
        window.location.reload(); // 페이지 새로고침 (필요에 따라 변경)
      } catch (error) {
        console.error("프로필 이미지 업로드 실패:", error);
      }
    } else {
      console.error("업로드 파일이 존재하지 않음");
    }
  };

  // userId가 업데이트될 때마다 데이터를 가져옵니다.
  useEffect(() => {
    const fetchProfileData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const nickname = urlParams.get("nickname");

      try {
        const response = await axios.get(`${AxiosUrl}/profile`, {
          params: { nickname },
          headers: {
            Authorization: `${authToken}`,
          },
        });
        const data = response.data;

        setProfileInfo({
          userId: data.userId,
          profileBannerImgName: data.profileBannerImgName,
          profileImgName: data.profileImgName,
          nickname: data.nickname,
          followStatus: data.followStatus,
          followingCount: data.followingCount,
          followersCount: data.followersCount,
          intro: data.intro,
        });

        setAlbumInfo({
          mainSongAlbumImage: data.mainSongAlbumImage,
          songTitle: data.songTitle,
          albumTitle: data.albumTitle,
          genre: data.genre,
          lyricist: data.lyricist,
          composer: data.composer,
          likeCount: data.likeCount,
        });

        let AlbumData: any = [];
        for (var i = 0; i < data.profileAlbumDtos.length; i++) {
          AlbumData.push(data.profileAlbumDtos[i]);
          console.log(data.profileAlbumDtos[i]);
        }

        setAlbumArrayInfo(AlbumData);
      } catch (error) {
        console.error("프로필 데이터를 가져오는데 실패했습니다.", error);
      }
    };

    fetchProfileData();
  }, []);

  return {
    profileInfo,
    albumInfo,
    albumArrayInfo,
    setProfileInfo,
    handleBannerSubmit,
    handleProfileSubmit,
  };
};

// 배너 데이터 컴포넌트
const BannerData: React.FC<{ onUpload: (data: any) => void }> = ({
  onUpload,
}) => {
  const { handleBannerSubmit } = useFileState(onUpload);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    await handleBannerSubmit(e, "profileBannerImgName");
  };

  const { user } = useUser();
  const UserData = user?.nickname;
  const urlParams = new URLSearchParams(window.location.search);
  const nickname = urlParams.get("nickname");
  return (
    <UploadForm>
      <Label>
        <HiddenInput
          type="file"
          onChange={handleFileInputChange}
          id="profileBannerImgName"
        />
        {UserData === nickname ? (
          <CustomButton htmlFor="profileBannerImgName">⚙️</CustomButton>
        ) : null}
      </Label>
    </UploadForm>
  );
};

// 프로필 데이터 컴포넌트
const ProfileData: React.FC<{ onUpload: (data: any) => void }> = ({
  onUpload,
}) => {
  const { handleProfileSubmit } = useFileState(onUpload);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    await handleProfileSubmit(e, "profileImgName");
  };

  const { user } = useUser();
  const UserData = user?.nickname;
  const urlParams = new URLSearchParams(window.location.search);
  const nickname = urlParams.get("nickname");

  return (
    <>
      <UploadForm>
        <Label>
          <HiddenInput
            type="file"
            onChange={handleFileInputChange}
            id="profileImgName"
          />
          {UserData === nickname ? (
            <CustomButton2 htmlFor="profileImgName">⚙️</CustomButton2>
          ) : null}
        </Label>
      </UploadForm>
    </>
  );
};

// 스타일드 컴포넌트 정의
const UploadForm = styled.form`
  opacity: 1;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const HiddenInput = styled.input`
  display: none;
`;

const CustomButton = styled.label`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 98%;
  height: 90%;
  opacity: 0;
  padding: 10px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
  font-size: 18px;
`;

const CustomButton2 = styled.label`
  cursor: pointer;
  position: absolute;
  top: 13.5%;
  left: 0.8%;
  opacity: 0;
  padding: 60px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
  font-size: 18px; /* 아이콘 크기 조정 */
`;

export { BannerData, ProfileData };
