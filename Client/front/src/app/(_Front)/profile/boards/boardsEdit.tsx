import React, { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import axios from "axios";
import AxiosUrl from "@/app/axios/url";
import { getToken } from "@/app/common/common";

// useFileState 훅과 초기 데이터
export const useFileState = (onUpload: (data: any) => void) => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    profileBannerImgName: null,
    profileImgName: null,
  });

  interface profileInfoProps {
    profileBannerImgName: string;
    profileImgName: string;
    nickname: string;
    followingCount: number;
    followersCount: number;
    intro: string;
  }

  const [profileInfo, setProfileInfo] = useState<profileInfoProps>({
    profileBannerImgName: "",
    profileImgName: "",
    nickname: "닉네임",
    followingCount: 0,
    followersCount: 0,
    intro: "자기소개를 입력하세요",
  });

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
        console.log(res.data);
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

  interface boardsData {
    id: number;
    boardTitle: string;
    boardType: string;
  }

  interface boardsForm {
    boardsData: boardsData[];
  }

  interface BookMarkboardsData {
    id: number;
    bookmarkTitle: string;
    boardType: string;
    bookmarks: string;
  }

  interface BookMarkboardsForm {
    BookMarkboardsData: BookMarkboardsData[];
  }

  const urlParams = new URLSearchParams(window.location.search);
  const nickname = urlParams.get("nickname");

  const [boards, setBoards] = useState<boardsForm>({ boardsData: [] });
  const [BookMarkboards, setBookMarkboards] = useState<BookMarkboardsForm>({
    BookMarkboardsData: [],
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get(`${AxiosUrl}/profile/board`, {
          params: { nickname },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        });
        setProfileInfo(res.data);

        let getboards: boardsData[] = res.data.boards.map((board: any) => ({
          id: board.id,
          boardTitle: board.boardTitle,
          boardType: board.boardType,
        }));

        let getBookMarkboards: BookMarkboardsData[] = res.data.bookmarks.map(
          (board: any) => ({
            id: board.id,
            bookmarkTitle: board.bookmarkTitle,
            boardType: board.boardType,
            bookmarks: board.bookmarks,
          })
        );

        setBoards({ boardsData: getboards });
        setBookMarkboards({ BookMarkboardsData: getBookMarkboards });
      } catch (error) {
        console.error("프로필 데이터를 가져오는데 실패했습니다.", error);
      }
    };

    fetchProfileData();
  }, [nickname, authToken]);

  return {
    files,
    profileInfo,
    handleBannerSubmit,
    handleProfileSubmit,
    boards,
    BookMarkboards,
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

  return (
    <UploadForm>
      <Label>
        <HiddenInput
          type="file"
          onChange={handleFileInputChange}
          id="profileBannerImgName"
        />
        <CustomButton htmlFor="profileBannerImgName">⚙️</CustomButton>
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

  return (
    <>
      <UploadForm>
        <Label>
          <HiddenInput
            type="file"
            onChange={handleFileInputChange}
            id="profileImgName"
          />
          <CustomButton2 htmlFor="profileImgName">⚙️</CustomButton2>
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
