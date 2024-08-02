import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Submit } from "@/app/components/icon/icon";
import { getToken } from "@/app/common/common";
import { useParams } from "next/navigation";

interface CommentFormProps {
  boardId: any;
}

// 글쓰기 댓글 폼
const WriteCommentForm: React.FC<CommentFormProps> = ({ boardId }) => {
  const [comment, setComment] = useState(""); //작성할 댓글
  const [commentLength, setCommentLength] = useState(0); // 댓글 길이 상태 추가

  const params: any = useParams();
  const id = params.id;

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
      const token = getToken();
      if (token) {
        const response = await fetch(`http://localhost:8080/comments/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
          body: JSON.stringify({ content: comment }),
        });
        if (response.ok) {
          setComment("");
          setCommentLength(0); // 댓글 제출 후 길이 초기화
          // 댓글 등록 후 추가적인 작업 (예: 댓글 목록 갱신)
          location.reload();
        } else {
          alert("댓글 등록에 실패했습니다.");
        }
      } else {
        alert("로그인이 필요합니다.");
      }
    }
  };

  return (
    <CommentsSection>
      {" "}
      {/* 댓글 작성 폼 */}
      {/* <CommentsCount>댓글 {comments}개</CommentsCount> */}
      <CommentInputContainer>
        <CommentInput
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요..."
          maxLength={200} // 최대 입력 글자 수
        />
        <CommentSubmitButton onClick={handleCommentSubmit}>
          <Submit />
        </CommentSubmitButton>
        <CommentLength>{commentLength}/200</CommentLength>
      </CommentInputContainer>
    </CommentsSection>
  );
};

export default WriteCommentForm;

const CommentsSection = styled.div`
  margin-top: 20px;
  font-family: "esamanru Medium";
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
  margin-bottom: 10px;

  &:focus {
    border-color: #b8b8b8;
  }
`;

// 댓글 제출 버튼
const CommentSubmitButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 7px;
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
  bottom: 20px;
  font-size: 12px;
  padding: 10px;
  color: #888;
`;
