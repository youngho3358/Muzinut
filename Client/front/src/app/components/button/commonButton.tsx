"use client";
import React, { ReactNode, useState } from "react";
import styles from "./commonButton.module.css";
import Image from "next/image";
import likeTrue from "@/../../public/svgs/like/LikeTrue.svg";
import likeFalse from "@/../../public/svgs/like/LikeFalse.svg";
import { useRouter } from "next/navigation";

/*일반 버튼
버튼 안에 텍스트
클릭 여부만 판단(클릭 이벤트는 따로 사용하는 컴포넌트에서 구현)
*/
interface CommonButtonProps {
  onClick: () => void;
  children: ReactNode;
}
const CommonButton: React.FC<CommonButtonProps> = ({ onClick, children }) => {
  return (
    <button className={styles.common__button} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

/* 좋아요 버튼
버튼 누르면 빨간색 하트로,
버튼 해제하면 일반 빈 하트로
*/
interface HeartButtonProps {
  onClick: () => void;
  isLiked: boolean;
  isLoggedIn: boolean;

}

const HeartButton: React.FC<HeartButtonProps> = ({
  onClick,
  isLiked,
  isLoggedIn
}) => {
  //버튼 기능테스트 - 서버 연동 전
  // const [heart, setHeart] = useState(true); 
  // const [isUser, setIsUser] = useState(false);

  // 실제 서버로부터 온 true/false 상태
  const [heart, setHeart] = useState(isLiked);

  console.log("버튼 컴포넌트로 이동, like 상태는???", heart);
  console.log("버튼 컴포넌트로 이동, Login 상태는???", isLoggedIn)
  const handleClickBtn = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다!!");
      return;
    }
    setHeart(!heart);
    console.log("버튼 컴포넌트에서 like 버튼 누름. like 상태는???", heart);

    onClick(); //부모컴포넌트에서 전달한 함수 호출
  };

  return (
    <button onClick={handleClickBtn} className={styles.heart__button}>
      <Image
        src={heart === true ? likeTrue : likeFalse}
        alt="Like button"
        width={24}
        height={24}
      />
    </button>
  );
};

const BackButton = () => {
  const router = useRouter();

  const onClickClose = () => {
    router.back();
  };

  return (
    <button onClick={onClickClose}>
      <Image
        src="../../../public/svgs/close_btn.svg"
        alt="close_btn"
        width={30}
        height={30}
      />
    </button>
  );
};

export { CommonButton, HeartButton, BackButton };
