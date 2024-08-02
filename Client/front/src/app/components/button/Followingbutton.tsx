import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useUser } from "../UserContext";
import { useFileState } from "@/app/(_Front)/profile/mainEdit";
import AxiosURL from "@/app/axios/url";
import axios from "axios";
import { getToken } from "@/app/common/common";

const FollowButton: React.FC = () => {
  const { profileInfo } = useFileState((data) => {
    profileInfo.followStatus;
    profileInfo.userId;
  });

  const authToken = getToken();

  const FollowData = async () => {
    const res = await axios.post(
      `${AxiosURL}/follow/${profileInfo.userId}`,
      {},
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    );
    window.location.reload();
  };

  const [buttonVisible, setButtonVisible] = useState(true);

  const { user } = useUser();
  const UserData = user?.nickname;
  const urlParams = new URLSearchParams(window.location.search);

  // 현재 사용자 토큰에 있는 닉네임
  const myNickname = UserData;

  // 파람스에 있는 경로의 유저 닉네임
  const ParamsNickname = urlParams.get("nickname");

  useEffect(() => {
    if (myNickname === ParamsNickname) {
      setButtonVisible(false); // 동일한 경우 버튼 숨기기
    } else {
      setButtonVisible(true); // 다른 경우 버튼 보이기
    }
  }, [myNickname, ParamsNickname]);

  return (
    <>
      {buttonVisible &&
        (profileInfo.followStatus ? (
          <FollowAfter onClick={FollowData}>팔로우 취소</FollowAfter>
        ) : (
          <FollowBefore onClick={FollowData}>팔로우</FollowBefore>
        ))}
    </>
  );
};

export default FollowButton;

const FollowBefore = styled.button`
  background-color: white;
  border: 1px solid #16be78;
  border-radius: 15px;
  padding: 10px;
  margin: 10px 0 3px 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    color: black;
    cursor: pointer;
  }

  transition: transform 0.3s ease; /* 스케일 변화에 대한 부드러운 전환 효과 추가 */
`;

const FollowAfter = styled.button`
  background-color: white;
  border: 1px solid #16be78;
  border-radius: 15px;
  padding: 10px;
  margin: 10px 0 3px 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    color: black;
    cursor: pointer;
  }

  transition: transform 0.3s ease; /* 스케일 변화에 대한 부드러운 전환 효과 추가 */
`;
