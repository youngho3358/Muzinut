import React, { FC } from "react";
import styles from "./css/Menu.module.css";
import Image from "next/image";
import { MusicDataItem } from "../main/MusicList";

interface ModalProps {
  isOpen: boolean; // 모달의 열림 여부
  onClose: () => void; // 모달을 닫는 콜백
  playlist: MusicDataItem[]; // 재생목록 데이터
  currentTrack: MusicDataItem | null; // 현재 실행 중인 트랙
}

const Modal = ({ isOpen, onClose, playlist, currentTrack }: ModalProps) => {
    // 모달이 열려 있지 않으면 아무것도 렌더링하지 않는다.
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
            {/* 모달의 배경을 클릭하면 모달이 닫히도록 설정 */}

      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              {/* 모달의 콘텐츠 영역 (배경 클릭 이벤트 전파 방지) */}

        <button className={styles.closeBtn} onClick={onClose}>
          X
        </button>
        <h2>Playlist</h2>
        <div className={styles.modalLeft}>
                    {/* 현재 실행 중인 곡 정보 */}

          {currentTrack && (
            <div>
              <Image
                src={`data:image/png;base64, ${currentTrack.albumImg}`}
                alt={`Album cover of ${currentTrack.title}`}
                className={styles.albumImg}
                width={500}
                height={500}
              />
              <div className={styles.trackInfo}>
                <h2 className={styles.trackTitle}>{currentTrack.title}</h2>
                <p className={styles.trackArtist}>{currentTrack.nickname}</p>
              </div>
              </div>
          )}
        </div>
        <div className={styles.modalRight}>
                    {/* 플레이리스트 내용 */}

          <ul className={styles.playlist}>
            {playlist.map((track) => (
              <li key={track.songId} className={styles.trackItem}>
                <Image
                  src={`data:image/png;base64, ${track.albumImg}`}
                  alt={`Album cover of ${track.title}`}
                  className={styles.albumImg}
                  width={50}
                  height={50}
                />
                <div>
                  <span className={styles.title}>{track.title}</span>
                  <span className={styles.artist}>{track.nickname}</span>{" "}
                  {/* 'nickname'을 'artist'로 변경 */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;
