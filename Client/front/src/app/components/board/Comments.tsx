import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReplyIcon } from "@/app/components/icon/icon";
import Reply from "@/app/components/board/Reply";
import WriteReplyForm from "../board/WriteReplyForm";
import axios from "axios";
import { getToken } from "@/app/common/common";
import AxiosURL from "@/app/axios/url";
import { CommentLikeIcon } from "../LikePost/like";

// 댓글 컴포넌트
interface CommentProps {
  profileImg: string;
  writer: string;
  createdDt: string;
  content: string;
  // boardLikeStatus: boolean;
  likeCount: number;
  replies: any[];
  commentId: any;
}

const Comments: React.FC<CommentProps> = ({
  profileImg,
  writer,
  createdDt,
  content,
  // boardLikeStatus,
  likeCount,
  commentId,
  replies,
}) => {
  let [modal, setModal] = useState(false); //대댓글 모달창

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

  const replyButtonHandler = () => {
    modal == true ? setModal(false) : setModal(true);
  };

  return (
    <>
      <CommentContainer>
        <ProfileImage
          src={`data:image/png;base64,${profileImg}`}
          alt="프로필 이미지"
        />
        <ProfileInfo>
          <ProfileName>{writer}</ProfileName>
          <TimeViewsContainer>
            <Time>{createdDt}</Time>
          </TimeViewsContainer>
        </ProfileInfo>
        <Content>{content}</Content>
        <Option>
          <LikeButton>
            <CommentLikeIcon commentId={commentId} />
            <LikeCount>{likeCount}</LikeCount>
          </LikeButton>
          <span> | </span>
          <ReplyButton onClick={replyButtonHandler}>
            <ReplyIcon></ReplyIcon>
          </ReplyButton>
        </Option>
        {modal == true ? (
          <WriteReplyForm commentId={commentId}></WriteReplyForm>
        ) : null}
      </CommentContainer>

      {replies.map((reply, index) => (
        <Reply
          key={index}
          id={reply.id}
          content={reply.content}
          replyWriter={reply.replyWriter}
          replyProfileImg={reply.replyProfileImg}
          createdDt={timeAgo(reply.createdDt)}
        />
      ))}
    </>
  );
};

export default Comments;

// 댓글 컨테이너
const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
  font-family: "esamanru Medium";
`;

//댓글 내용
const Content = styled.span`
  max-width: 820px;
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
`;

//댓글 좋아요 버튼
const Option = styled.div`
  display: flex;
  gap: 10px;
  border-radius: 20px;
  padding: 6px 8px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 12px;
  align-items: center;
  font-family: "esamanru Medium";
  margin-left: auto;
`;

// 프로필 이미지
const ProfileImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0; /* 프로필 이미지 고정 */
  padding-right: 10px;
  padding-left: 10px;
`;

// 프로필 정보
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  gap: 5px;
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

// 좋아요 버튼
const LikeButton = styled.button`
  display: flex;
  border: 0;
  background-color: transparent;
  align-items: center;
  font-family: "esamanru Medium";
`;

const LikeCount = styled.span`
  padding-left: 5px;
`;

const ReplyButton = styled.button`
  display: flex;
  border: 0;
  background-color: transparent;
  align-items: center;
  cursor: pointer;
`;
