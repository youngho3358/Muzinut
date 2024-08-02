import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import AxiosURL from "@/app/axios/url";
import { getToken } from "@/app/common/common";

interface LikeIconProps {
  postId: number;
  initialLiked?: boolean;
}

const LikeIcon: React.FC<LikeIconProps> = ({
  postId,
  initialLiked = false,
}) => {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const authToken = getToken();

  useEffect(() => {
    const savedLikedStatus = localStorage.getItem(`like-${postId}`);
    if (savedLikedStatus !== null) {
      setLiked(JSON.parse(savedLikedStatus));
    } else {
      setLiked(initialLiked);
    }
  }, [postId, initialLiked]);

  const handleLikeClick = async () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    localStorage.setItem(`like-${postId}`, JSON.stringify(newLikedStatus));

    try {
      await axios.post(
        `${AxiosURL}/likes/${postId}`,
        { liked: newLikedStatus },
        {
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("좋아요 상태 업데이트 실패:", error);
      setLiked(!newLikedStatus);
      localStorage.setItem(`like-${postId}`, JSON.stringify(!newLikedStatus));
    }
  };

  return (
    <Like onClick={handleLikeClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        style={{ fill: liked ? "#16be78" : "var(--text-color)" }}
      >
        <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
      </svg>
    </Like>
  );
};

interface CommentLikeIconProps {
  commentId: number;
  initialLiked?: boolean;
}

const CommentLikeIcon: React.FC<CommentLikeIconProps> = ({
  commentId,
  initialLiked = false,
}) => {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const authToken = getToken();

  useEffect(() => {
    const savedLikedStatus = localStorage.getItem(`comment-like-${commentId}`);
    if (savedLikedStatus !== null) {
      setLiked(JSON.parse(savedLikedStatus));
    } else {
      setLiked(initialLiked);
    }
  }, [commentId, initialLiked]);

  const handleLikeClick = async () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    localStorage.setItem(
      `comment-like-${commentId}`,
      JSON.stringify(newLikedStatus)
    );

    try {
      await axios.post(
        `${AxiosURL}/comment-like/${commentId}`,
        { liked: newLikedStatus },
        {
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("댓글 좋아요 상태 업데이트 실패:", error);
      setLiked(!newLikedStatus);
      localStorage.setItem(
        `comment-like-${commentId}`,
        JSON.stringify(!newLikedStatus)
      );
    }
  };

  return (
    <CommentLike onClick={handleLikeClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        style={{ fill: liked ? "#16be78" : "var(--text-color)" }}
      >
        <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
      </svg>
    </CommentLike>
  );
};

const Like = styled.div``;

const CommentLike = styled.div``;

export { LikeIcon, CommentLikeIcon };
