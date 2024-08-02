"use client";
import styled from "styled-components";
import threedot from "../../../../public/svgs/threedot.svg";
import { MiniViewIcon } from "@/app/components/icon/icon";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AxiosURL from "@/app/axios/url";
import { getToken } from "@/app/common/common";
import NoticeWriteQuill from "../../(_Front)/community/free-boards/writequill";

// 글 작성 프로필
interface WriterProfileInfoProps {
  profileImg: string;
  writer: string;
  writerId: string;
  createdDt: string;
  view: number;
  isBookmark: boolean;
}

interface WriterProfileInfoProps {
  profileImg: string;
  writer: string;
  writerId: string;
  createdDt: string;
  view: number;
  isBookmark: boolean;
}

const WriterProfileInfo: React.FC<WriterProfileInfoProps> = ({
  profileImg,
  writer,
  writerId,
  createdDt,
  view,
  isBookmark: initialIsBookmark,
}) => {
  const quillRef = useRef<any>(null);
  const [isBookmark, setIsBookmark] = useState<boolean>(initialIsBookmark);
  const authToken = getToken(); // 토큰을 추출합니다.
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [editContent, setEditContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [BoardsModal, setBoardsModal] = useState(false);

  useEffect(() => {
    const savedBookmarkStatus = localStorage.getItem(`bookmark-${id}`);
    if (savedBookmarkStatus !== null) {
      setIsBookmark(JSON.parse(savedBookmarkStatus));
    }
  }, [id]);

  const handleBookmarkClick = async () => {
    try {
      if (id && authToken) {
        const newBookmarkStatus = !isBookmark;
        setIsBookmark(newBookmarkStatus);
        localStorage.setItem(
          `bookmark-${id}`,
          JSON.stringify(newBookmarkStatus)
        );

        const response = await axios.post(
          `${AxiosURL}/bookmark/${id}`,
          {
            isBookmark: newBookmarkStatus,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log("북마크 클릭: ", response.data);
      }
    } catch (error) {
      console.error("북마크 요청 실패: ", error);
      setIsBookmark(!isBookmark); // 요청 실패 시 이전 상태로 롤백
      localStorage.setItem(`bookmark-${id}`, JSON.stringify(!isBookmark));
    }
  };

  const BookMarkIcon = () => {
    return (
      <BookMark onClick={handleBookmarkClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 24 30"
          x="0px"
          y="0px"
          style={{ fill: isBookmark ? "#16be78" : "#a3a3a3" }} // 북마크 상태에 따라 색상 변경
        >
          <path d="m18.19,7.25h-2.19c-.33,0-.65-.13-.88-.37-.24-.23-.37-.55-.37-.88v-2.19l3.44,3.44Z" />
          <path d="m16,8.75c-.74,0-1.43-.29-1.95-.81-.51-.51-.8-1.21-.8-1.94v-2.25h-6.25c-.33,0-.65.13-.88.37-.24.23-.37.55-.37.88v14c0,.33.13.65.37.88.23.24.55.37.88.37h10c.33,0,.65-.13.88-.37.24-.23.37-.55.37-.88v-10.25h-2.25Zm.4,4.86l-1.37,1.76.07,2.22c.01.25-.11.49-.31.64-.2.14-.46.18-.69.09l-2.1-.75-2.1.75c-.08.03-.17.05-.25.05-.16,0-.31-.05-.44-.14-.2-.15-.32-.39-.31-.64l.07-2.22-1.37-1.76c-.15-.2-.19-.46-.12-.7.08-.23.27-.41.51-.48l2.14-.63,1.25-1.84c.14-.21.37-.33.62-.33s.48.12.62.33l1.25,1.84,2.14.63c.24.07.43.25.51.48.07.24.03.5-.12.7Z" />
          <path d="m13.68,14.66c-.11.14-.16.31-.16.48l.05,1.4-1.32-.47c-.16-.06-.34-.06-.5,0l-1.32.47.05-1.4c0-.17-.05-.34-.16-.48l-.86-1.1,1.34-.39c.17-.05.32-.15.41-.3l.79-1.15.78,1.15c.1.15.25.25.42.3l1.34.39-.86,1.1Z" />
        </svg>
      </BookMark>
    );
  };

  const router = useRouter();

  const userMove = () => {
    router.push(`/profile?nickname=${writer}`);
  };

  const BoardsDelete = async () => {
    if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${AxiosURL}/community/free-boards/${id}`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        location.href = "/community/free-boards";
      } catch {
        location.href = "/community/free-boards";
        console.log("게시글이 삭제되었습니다");
      }
    } else {
      location.href = "/community/free-boards";
      console.log("게시글이 삭제되었습니다");
    }
  };

  const toggleModal = () => {
    setBoardsModal(!BoardsModal);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setBoardsModal(false);
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ProfileContainer>
      <ProfileImage
        onClick={userMove}
        src={`data:image/png;base64,${profileImg}`}
        alt="프로필 이미지"
      />
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
        <Image onClick={toggleModal} src={threedot} alt="수정, 삭제" />
      </ShareContainer>

      {BoardsModal && (
        <ModalOverlay>
          <ModalContent ref={modalRef}>
            <label
              onClick={() => {
                setIsEditing(true);
                toggleModal();
              }}
            >
              수정
            </label>
            |
            <label
              onClick={() => {
                BoardsDelete();
                toggleModal();
              }}
            >
              삭제
            </label>
          </ModalContent>
        </ModalOverlay>
      )}

      {isEditing && (
        <>
          <NoticeWriteQuill
            ref={quillRef}
            onPublish={(content) => console.log(content)}
            onClose={() => console.log("닫기")}
            initialContent={editContent}
            boardId={id} // 현재 게시글 ID를 전달
          />
        </>
      )}
    </ProfileContainer>
  );
};

export default WriterProfileInfo;

// 프로필 컨테이너
const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  font-family: "esamanru Medium";
`;

// 프로필 이미지
const ProfileImage = styled.img`
  cursor: pointer;
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
    &:hover {
      background-color: #e7e7e7; /* 배경색을 설정 */
      border-radius: 8px;
    }
  }
`;

const BookMark = styled.div`
  width: 32px;
  height: 32px;
  cursor: pointer;

  &:hover {
    background-color: #e7e7e7; /* 배경색을 설정 */
    border-radius: 8px;
  }
`;

const ModalOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: absolute;
  border-radius: 8px;
  right: -170px;
  border: 1px solid #ccc;
  padding: 20px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100px;
  gap: 10px;
  font-family: "esamanru Bold";
  font-size: 13px;
  cursor: pointer;

  label {
    &:hover {
      transform: scale(1.05);
    }
    cursor: pointer;
  }
`;

const EditModal = styled.div``;
