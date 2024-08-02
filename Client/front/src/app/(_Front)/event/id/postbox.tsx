"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LikeIcon } from "@/app/components/icon/icon";
import Comments from "../../../components/board/Comments";
import WriterProfileInfo from "../../../components/board/WriterProfileInfo";
import WriteCommentForm from "../../../components/board/WriteCommentForm";
import AxiosURL from "@/app/axios/url";
import { getToken } from "@/app/common/common";

import { useParams } from "next/navigation";
import axios from "axios";

interface BoardsDataProps {
  id: number;
  title: string;
  quillFilename: string;
  boardLikeStatus: boolean;
  likeCount: number;
}

interface CommentProps {
  commentProfileImg: string;
  commentWriter: string;
  id: any;
  createdDt: string;
  content: string;
  boardLikeStatus: boolean;
  likeCount: number;
  replies: any[];
}

interface QuillProps {
  Quill: string;
}

const PostBox: React.FC = () => {
  const [boardsData, setBoardsData] = useState<BoardsDataProps>({
    id: 0,
    title: "",
    quillFilename: "",
    boardLikeStatus: false,
    likeCount: 0,
  });

  const [profileInfo, setProfileInfo] = useState({
    profileImg: "",
    writer: "",
    createdDt: "",
    view: 0,
    isBookmark: false,
  });

  const [commentForm, setCommentForm] = useState({
    comments: 0,
  });

  const [QuillData, setQuillData] = useState<QuillProps>({
    Quill: "",
  });

  const [comments, setComments] = useState<CommentProps[]>([]); // 댓글 목록
  const [boardId, setBoardId] = useState(); //게시판 pk

  const authToken = getToken();

  const params = useParams();
  const id: any = params?.id;

  useEffect(() => {
    const DetailBoards = async () => {
      try {
        if (id) {
          const res = await axios.get(
            `${AxiosURL}/community/event-boards/${id}`,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );

          setBoardId(res.data.id);

          const profileData = {
            profileImg: res.data.profileImg,
            writer: res.data.writer,
            createdDt: res.data.createdDt,
            view: res.data.view,
            isBookmark: res.data.isBookmark,
          };

          setProfileInfo(profileData);

          const boardsData = {
            id: res.data.id,
            title: res.data.title,
            quillFilename: res.data.quillFilename,
            boardLikeStatus: res.data.boardLikeStatus,
            likeCount: res.data.likeCount,
          };

          setBoardsData(boardsData);

          console.log(res.data.quillFilename);
          setCommentForm({
            comments: res.data.comments,
          });

          setComments(res.data.comments);

          // 두 번째 요청을 첫 번째 요청의 결과를 사용하여 수행
          const resdata = await axios.get(
            `http://localhost:8080/boards/get-file?filename=${boardsData.quillFilename}`
          );
          setQuillData(resdata.data);
        }
      } catch (error) {
        console.error("데이터를 받지 못했습니다", error);
      }
    };

    DetailBoards();
  }, []);

  const redirectToEvent = () => {
    window.location.href = "/event";
  };

  return (
    <Container>
      <Header>
        <ListContainer>
          <ListButton onClick={redirectToEvent}>이벤트 &gt;</ListButton>
        </ListContainer>
        <Title>{boardsData.title}</Title>
        <WriterProfileInfo
          profileImg={profileInfo.profileImg}
          writer={profileInfo.writer}
          createdDt={profileInfo.createdDt}
          view={profileInfo.view}
          isBookmark={profileInfo.isBookmark ? true : false}
        />
      </Header>
      <Body dangerouslySetInnerHTML={{ __html: QuillData }} />
      {/* 본문 내용 출력 */}
      <Footer>
        <LikeButton>
          <LikeIcon /> {boardsData.boardLikeStatus ? true : false}
          {boardsData.likeCount}
        </LikeButton>
      </Footer>
      <WriteCommentForm boardId={boardId} />
      {comments.map((comment, index) => (
        <Comments
          key={index}
          profileImg={comment.commentProfileImg}
          writer={comment.commentWriter}
          createdDt={comment.createdDt}
          content={comment.content}
          boardLikeStatus={comment.boardLikeStatus}
          likeCount={comment.likeCount}
          replies={comment.replies}
          commentId={comment.id}
        />
      ))}
    </Container>
  );
};

export default PostBox;

// ------------------------------------------ 스타일드 컴포넌트-------------------------------------------------------------
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

// 바디
const Body = styled.div`
  font-family: "esamanru Medium";
  min-height: 500px;

  img {
    margin-top: 5px;
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
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
