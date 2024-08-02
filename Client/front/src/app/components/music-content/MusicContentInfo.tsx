"use client";
import { useState } from "react";
import styles from "./MusicContentInfo.module.css";
import {CommonButton} from "../button/commonButton";

interface MusicContentProps {
  title: string;
  text: string;
}

const MusicContentInfo: React.FC<MusicContentProps> = ({ title, text }) => {
  // 더 보기 상태 관리
  const [isCLick, setIsClick] = useState(false);

  // 더 보기 버튼 클릭(이벤트 처리)
  const handleSeeMoreBtn = () => {
    setIsClick(!isCLick);
  };

  return (
    <div className={styles.music__content__container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.info}>{isCLick ? text : `${text.substring(0, 700)}...`}</p>
      <CommonButton onClick={handleSeeMoreBtn}>
        {isCLick ? "접기" : "펼치기"}
      </CommonButton>
    </div>
  );
};

export default MusicContentInfo;
