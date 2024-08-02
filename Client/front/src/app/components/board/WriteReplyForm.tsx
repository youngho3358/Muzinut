import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Submit } from "@/app/components/icon/icon";
import { getToken, getRefreshToken, setToken } from "@/app/common/common";

// 대댓글 폼
const WriteReplyForm: React.FC<{ commentId: any }> = ({ commentId }) => {
  const [reply, setReply] = useState(""); //작성할 댓글
  const [replyLength, setReplyLength] = useState(0); // 대댓글 길이 상태 추가

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    // 최대 글자 수 체크
    if (text.length <= 500) {
      setReply(text);
      setReplyLength(text.length); // 입력된 글자 수 업데이트
    }
  };

  const handleCommentSubmit = async () => {
    if (reply.trim()) {
      const token = getToken();
      if (token) {
        const response = await fetch(
          `http://localhost:8080/replies/${commentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: getToken(),
            },
            body: JSON.stringify({ content: reply }),
          }
        );
        if (response.ok) {
          setReply("");
          setReplyLength(0); // 댓글 제출 후 길이 초기화
          // 댓글 등록 후 추가적인 작업 (예: 댓글 목록 갱신)
          location.reload();
        } else {
          alert("대댓글 등록에 실패했습니다.");
        }
      } else {
        alert("로그인이 필요합니다.");
      }
    }
  };

  return (
    <CommentsSection>
      <CommentInputContainer>
        <CommentInput
          value={reply}
          onChange={handleCommentChange}
          placeholder="대댓글을 입력하세요..."
          maxLength={100} // 최대 입력 글자 수
        />
        <CommentSubmitButton onClick={handleCommentSubmit}>
          <Submit />
        </CommentSubmitButton>
        <CommentLength>{replyLength}/100</CommentLength>
      </CommentInputContainer>
    </CommentsSection>
  );
};

export default WriteReplyForm;

const CommentsSection = styled.div`
  position: absolute;
  right: -250px;
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
  padding: 15px;
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
  padding: 5px;

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
  padding: 5px;
  color: #888;
`;
