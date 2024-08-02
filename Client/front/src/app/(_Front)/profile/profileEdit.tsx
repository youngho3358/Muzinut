import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import axios from "axios";
import AxiosURL from "@/app/axios/url";
import { useFileState } from "./mainEdit";
import { useUser } from "@/app/components/UserContext";

const ProfileEdit: React.FC = () => {
  const { profileInfo } = useFileState((data) => {
    console.log("Uploaded data:", data);
  });

  const [nickname, setNickname] = useState(profileInfo.nickname || "");
  const [intro, setIntro] = useState(profileInfo.intro || "");
  const [nameError, setNameError] = useState(false);
  const [introduceError, setIntroduceError] = useState(false);
  const [nameDuplicateError, setNameDuplicateError] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [visible, setVisible] = useState(false);

  const authToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQG5hdmVyLmNvbSIsImF1dGgiOiJST0xFX1VTRVIiLCJleHAiOjE3MjQ2MDczMzh9.BbvfPZE8fzZNQNJdyq0XQz7GaIUYhhLUhoup35KwlfC-92MHXOi3jkILH19lFdDVQkuwtFWRlyRbVZQW8a8QUA";

  // 유효성 검사
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "nickname") {
      setNickname(value);
      // 닉네임이 비어 있는지 여부 검사 추가
      setNameError(value.trim().length === 0 || value.trim().length > 10);
      // profileInfo의 닉네임과 비교하여 중복 여부 판단
      setNameDuplicateError(value === profileInfo.nickname);
    } else if (name === "intro") {
      setIntro(value);
      setIntroduceError(value.trim().length === 0 || value.trim().length > 70);
    }
  };

  useEffect(() => {
    // 유효성 검사 상태에 따라 변경 여부 업데이트
    setIsChanged(!(nameError || introduceError || nameDuplicateError));
  }, [nickname, intro, nameError, introduceError, nameDuplicateError]);

  const handleSubmit = async () => {
    const editData = {
      nickname: nickname,
      intro: intro,
    };

    try {
      const profileEdit = await axios.patch(
        `${AxiosURL}/users/set-profile-nickname-intro`,
        editData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // setNickname(profileEdit.data.nickname);
      // setIntro(profileEdit.data.intro);
      // console.log("프로필 닉네임 및 소개 업로드 성공:", profileEdit.data);
      alert("프로필이 수정되었습니다😆");
      window.location.reload();
    } catch (error) {
      console.error("프로필 닉네임 및 소개 업로드 실패:", error);
    }
  };

  const handleCancel = () => {
    if (window.confirm("정말로 취소하시겠습니까?")) {
      setVisible(false);
    }
  };

  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    setNickname(profileInfo.nickname || "");
    setIntro(profileInfo.intro || "");
    setNameError(false);
    setIntroduceError(false);
    setIsChanged(false);
    setNameDuplicateError(false);
  }, [profileInfo, visible]);

  const { user } = useUser();
  const UserData = user?.nickname;
  const urlParams = new URLSearchParams(window.location.search);
  const nicknames = urlParams.get("nickname");

  return (
    <ShowBox>
      {UserData === nicknames ? <Icon onClick={openModal}>⚙️</Icon> : null}
      <OutContainer visible={visible}>
        <ProfileEditContainer visible={visible}>
          <Title>프로필 수정</Title>
          <InputLabel1>
            닉네임
            <InputField1
              type="text"
              name="nickname"
              value={nickname}
              onChange={handleChange}
              style={{
                borderColor: nameError || nameDuplicateError ? "red" : "#ccc",
              }}
            />
          </InputLabel1>
          {nameError ? (
            <NameErrorMessage>
              최소 1글자 이상, 최대 10글자까지 입력할 수 있습니다.
            </NameErrorMessage>
          ) : nameDuplicateError ? (
            <NameErrorMessage>이미 사용중인 닉네임 입니다.</NameErrorMessage>
          ) : null}
          <InputLabel2>
            자기소개
            <InputField2
              name="intro"
              value={intro}
              onChange={handleChange}
              style={{ borderColor: introduceError ? "red" : "#ccc" }}
            />
          </InputLabel2>
          {introduceError && (
            <IntroduceErrorMessage>
              최소 1글자 이상, 최대 70글자까지 입력할 수 있습니다.
            </IntroduceErrorMessage>
          )}
          <ButtonContainer>
            <CancelButton onClick={handleCancel}>취소</CancelButton>
            <SaveButton
              disabled={
                !isChanged || nameError || introduceError || nameDuplicateError
              }
              onClick={handleSubmit}
            >
              저장
            </SaveButton>
          </ButtonContainer>
        </ProfileEditContainer>
      </OutContainer>
    </ShowBox>
  );
};

export default ProfileEdit;

// 스타일드 컴포넌트 ------------------------------------------------------------------------------------------
const ShowBox = styled.div`
  position: relative;
  display: inline-block;
`;

const Icon = styled.span`
  position: absolute;
  left: 1260px;
  bottom: 23px;
  cursor: pointer;
`;

const OutContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: ${({ visible }) => (visible ? "block" : "none")};
  animation: ${({ visible }) =>
    visible
      ? ""
      : css`
          ${fadeOutAnimation} 0.5s forwards
        `};
`;

const ProfileEditContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  padding: 30px 45px 10px 45px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
  z-index: 2;
  display: ${({ visible }) => (visible ? "block" : "none")};
  animation: ${({ visible }) =>
    visible
      ? ""
      : css`
          ${fadeOutAnimation} 0.5s forwards
        `};
`;

const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Title = styled.div`
  text-align: center;
  font-size: 24px;
  margin-bottom: 25px;
  color: black;
`;

const InputLabel1 = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  font-family: "esamanru Medium";
  color: black;
`;

const InputLabel2 = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  font-family: "esamanru Medium";
  color: black;
`;

const InputField1 = styled.input`
  padding: 8px;
  font-size: 14px;
  font-family: "esamanru Light";
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
`;

const InputField2 = styled.textarea`
  height: 50px;
  padding: 8px;
  font-size: 14px;
  font-family: "esamanru Light";
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  resize: none; /* 사용자 크기 조절 비활성화 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled.button<{ disabled: boolean }>`
  background-color: ${(props) => (props.disabled ? "#b0dab9" : "#16be78")};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  font-family: "esamanru Medium";
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#b0dab9" : "#13a86a")};
  }

  &:disabled {
    background-color: #b0dab9;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: black;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  font-family: "esamanru Medium";
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background-color: #bbb;
  }
`;

const NameErrorMessage = styled.p`
  position: absolute;
  right: 47px;
  top: 74px;
  color: red;
  font-size: 12px;
  font-family: "esamanru Medium";
`;

const IntroduceErrorMessage = styled.p`
  position: absolute;
  right: 47px;
  top: 161px;
  color: red;
  font-size: 12px;
  font-family: "esamanru Medium";
`;
