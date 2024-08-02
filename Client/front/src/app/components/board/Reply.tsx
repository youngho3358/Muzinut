import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { redirect } from "next/navigation";
import { LikeIcon, ReplyIcon } from "@/app/components/icon/icon";
import { useOutData } from "./AxiosData";

// 대댓글 컴포넌트
interface ReplyProps {
  replyProfileImg: string;
  replyWriter: string;
  createdDt: string;
  content: string;
  id: any;
}

// 대댓글 내용
const Reply: React.FC<ReplyProps> = ({
  id,
  content,
  replyWriter,
  replyProfileImg,
  createdDt,
}) => {
  return (
    <>
      <ReplyContainer>
        <ReplyIcon />

        <ProfileImage
          src={`data:image/png;base64,${replyProfileImg}`}
          alt="프로필 이미지"
        />
        <ProfileInfo>
          <ProfileName>{replyWriter}</ProfileName>
          <TimeViewsContainer>
            <Time>{createdDt}</Time>
          </TimeViewsContainer>
        </ProfileInfo>
        <Content>{content}</Content>
      </ReplyContainer>
    </>
  );
};

export default Reply;

// 댓글 컨테이너
const ReplyContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  font-family: "esamanru Medium";
  min-width: 200px;
`;

// 프로필 이미지
const ProfileImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0; /* 프로필 이미지 고정 */
  padding-left: 10px;
`;

// 프로필 정보
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-right: 10px;
`;

// 프로필 이름
const ProfileName = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

// 시간과 조회수 컨테이너
const TimeViewsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

// 업로드 시간
const Time = styled.div`
  font-size: 12px;
  color: #888;
`;

//댓글 내용
const Content = styled.span`
  padding: 15px 15px 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
`;
