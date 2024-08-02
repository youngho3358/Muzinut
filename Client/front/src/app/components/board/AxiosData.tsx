"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AxiosURL from "@/app/axios/url";

interface BoardsDataProps {
  boardsID: number;
  boardstitle: string;
  boardsprofileImg: string;
  boardswriter: string;
  boardscreatedDt: string;
  boardsview: number;
  boardscontents: string;
  boardsisLike: boolean;
  boardsisBookmark: boolean;
}

interface BoardsCommentDataProps {
  commentsID: number;
  commentsSize: number;
  commentProfileImg: string;
  commentWriter: string;
  commentcreatedDt: string;
  commentContent: string;
  commentlike: boolean;
  commentlikeCount: number;
}

interface BoardsCommentReplyDataProps {
  ReplyID: number;
  ReplyProfileImg: string;
  ReplyWriter: string;
  ReplycreatedDt: string;
  ReplyContent: string;
  Replylike: boolean;
  ReplylikeCount: number;
}

export const useOutData = () => {
  const [boardsData, setBoardsData] = useState<BoardsDataProps>({
    boardsID: 1,
    boardstitle: "제목",
    boardsprofileImg: "프로필 이미지",
    boardswriter: "작성자",
    boardscreatedDt: "2024 / 07 / 19",
    boardsview: 0,
    boardscontents: "내용",
    boardsisLike: false,
    boardsisBookmark: false,
  });

  const [commentData, setCommentData] = useState<BoardsCommentDataProps>({
    commentsID: 1,
    commentsSize: 10,
    commentProfileImg: "프로필 이미지",
    commentWriter: "작성자",
    commentcreatedDt: "2024 / 07 / 19",
    commentContent: "내용",
    commentlike: false,
    commentlikeCount: 10,
  });
  const [replyData, setReplyData] = useState<BoardsCommentReplyDataProps>({
    ReplyID: 1,
    ReplyProfileImg: "프로필 이미지",
    ReplyWriter: "작성자",
    ReplycreatedDt: "2024 / 07 / 19",
    ReplyContent: "내용",
    Replylike: false,
    ReplylikeCount: 10,
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const id = window.location.pathname.split("/")[2];
  //     try {
  //       const res = await axios.get(
  //         `${AxiosURL}/community/admin-boards/${id}`,
  //         {
  //           headers: { "Content-Type": "multipart-form-data" },
  //         }
  //       );

  //       setBoardsData(res.data);
  //       setCommentData(res.data);
  //       setReplyData(res.data);
  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return { boardsData, commentData, replyData };
};
