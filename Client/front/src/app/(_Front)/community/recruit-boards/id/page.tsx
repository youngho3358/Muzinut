"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Submit } from "@/app/components/icon/icon";
import {
  MiniViewIcon,
  LikeIcon,
  BookMarkIcon,
} from "@/app/components/icon/icon";
import Image from "next/image";
import threedot from "../../../../../../public/svgs/threedot.svg";
import HeaderBar from "./selectbar";

interface PostProps {
  title: string;
  writer: string;
  createdDt: string;
  view: number;
  like: number;
  image: string;
  write: string;
}

interface UserProfile {
  nickname: string;
  profileImage: string;
}

const Data: PostProps = {
  title: "게시글 제목",
  writer: "작성자 이름",
  createdDt: "2024-07-06",
  view: 1234,
  like: 567,
  image: "http://stimg.afreecatv.com/LOGO/ma/maluckitty/maluckitty.jpg",
  write: "<p>본문 내용입니다.</p>",
};

const PostBox: React.FC = () => {
  const { title, writer, createdDt, view, like, image, write } = Data;
  const [comment, setComment] = useState("");
  const [commentLength, setCommentLength] = useState(0); // 댓글 길이 상태 추가
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        const response = await fetch("/api/user-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: UserProfile = await response.json();
          setUserProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const redirectToEvent = () => {
    window.location.href = "/community/recruit-boards";
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    // 최대 글자 수 체크
    if (text.length <= 500) {
      setComment(text);
      setCommentLength(text.length); // 입력된 글자 수 업데이트
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      const token = localStorage.getItem("userToken");
      if (token) {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        });
        if (response.ok) {
          setComment("");
          setCommentLength(0); // 댓글 제출 후 길이 초기화
          // 댓글 등록 후 추가적인 작업 (예: 댓글 목록 갱신)
        } else {
          alert("댓글 등록에 실패했습니다.");
        }
      } else {
        alert("로그인이 필요합니다.");
      }
    }
  };

  return (
    <>
      <HeaderBar />
      <Container>
        <Header>
          <ListContainer>
            <ListButton onClick={redirectToEvent}>모집게시판 &gt;</ListButton>
          </ListContainer>
          <Title>{title}</Title>
          <ProfileContainer>
            <ProfileImage src={image} alt="프로필 이미지" />
            <ProfileInfo>
              <ProfileName>{writer}</ProfileName>
              <TimeViewsContainer>
                <Time>{createdDt}</Time>
                <Views>
                  <MiniViewIcon /> {view}
                </Views>
              </TimeViewsContainer>
            </ProfileInfo>
            <ShareContainer>
              <BookMarkIcon />
              <Image src={threedot} alt="공유하기, 신고하기"></Image>
            </ShareContainer>
          </ProfileContainer>
        </Header>
        <Body dangerouslySetInnerHTML={{ __html: write }} />
        <Footer>
          <LikeButton>
            <LikeIcon /> {like}
          </LikeButton>
        </Footer>
        <CommentsSection>
          <CommentsCount>댓글 0개</CommentsCount>
          <CommentInputContainer>
            <CommentInput
              value={comment}
              onChange={handleCommentChange}
              placeholder="댓글을 입력하세요..."
              maxLength={500} // 최대 입력 글자 수
            />
            <CommentSubmitButton onClick={handleCommentSubmit}>
              <Submit />
            </CommentSubmitButton>
            <CommentLength>{commentLength}/500</CommentLength>
          </CommentInputContainer>
        </CommentsSection>
      </Container>
    </>
  );
};

export default PostBox;

// 감싸는 컨테이너
const Container = styled.div`
  margin: 24px 0;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: black;
`;

// 헤더
const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border-radius: 12px; /* 동글뱅이 스타일 */
`;

// 목록 컨테이너
const ListContainer = styled.div`
  padding: 5px 0;
`;

// 목록
const ListButton = styled.div`
  color: #16be78;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin: -5px 0 6px -8px;
  padding: 5px 8px 4px 8px;
  display: inline-block;

  &:hover {
    background-color: #e0ffe0; /* 배경색을 설정 */
  }
`;

// 제목
const Title = styled.h1`
  font-size: 22px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-family: "esamanru Medium";
`;

// 프로필 컨테이너
const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  font-family: "esamanru Medium";
`;

// 프로필 이미지
const ProfileImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-right: 10px;
`;

// 프로필 정보
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
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

// 조회수
const Views = styled.div`
  display: flex;
  font-size: 12px;
  color: #888;

  img {
    width: 24px;
    height: 24px;
  }
`;

// 북마크와 삼각바 (공유하기, 신고하기) 컨테이너
const ShareContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 3px;
  cursor: pointer;

  img {
    width: 24px;
    height: 32px;
    &:hover {
      background-color: #e7e7e7; /* 배경색을 설정 */
      border-radius: 8px;
    }
  }
`;

// 바디
const Body = styled.div`
  font-family: "esamanru Medium";
  min-height: 500px;
`;

// 푸터
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-bottom: 1px solid #ddd;
`;

// 좋아요 버튼
const LikeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  margin-bottom: 15px;
  cursor: pointer;
  font-size: 12px;
  font-family: "esamanru Medium";
`;

const CommentsSection = styled.div`
  margin-top: 20px;
  font-family: "esamanru Medium";
`;
const CommentsCount = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

const CommentInputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 10px;
  font-family: "esamanru Light";
  font-size: 14px;
  line-height: 17px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #b8b8b8;
  }
`;

// 댓글 제출 버튼
const CommentSubmitButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 10px;

  &:hover {
    opacity: 0.8;
  }
`;

// 댓글 길이 표시
const CommentLength = styled.div`
  position: absolute;
  right: 45px;
  bottom: 13px;
  font-size: 12px;
  padding: 10px;
  color: #888;
`;
