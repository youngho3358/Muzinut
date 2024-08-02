import styles from "./css/submitModal.module.css";
import React, { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import loadingImage from "@/../public/record.gif";
import successImage from "@/../public/svgs/success.svg";
import closeBtn from "@/../../public/svgs/close_btn.svg";
import goBtn from "@/../../public/svgs/go.svg";

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  children?: ReactNode;
}

const SubmitModal: React.FC<ModalProps> = ({ show, handleClose }) => {
  // 이건 나중에 진짜 백엔드로 정보 전달하고 성공 응답 오면
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modal__container}>
        <div className={styles.modal__close__btn} onClick={handleClose}>
          {/* &times; */}
          <Image src={closeBtn} alt="album" width={30} height={30} />
        </div>
        <div className={styles.contents}>
          {isLoading ? (
            <>
              <Image
                src={loadingImage}
                alt="Loading..."
                width={200}
                height={200}
              />
              <span className={styles.text}>앨범 정보를 등록 중입니다...</span>
            </>
          ) : (
            <>
              <Image
                src={successImage}
                alt="Success"
                width={100}
                height={100}
              />

              <div className={styles.go__album__detail}>
                <span className={styles.text}>앨범 보러 가기</span>
                <Image src={goBtn} alt="goBtn" width={80} height={80} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
