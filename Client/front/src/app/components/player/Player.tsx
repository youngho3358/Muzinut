import { useState, useEffect } from "react";
import styles from "./css/Player.module.css";
import playerImg from "@/../../public/svgs/cd.svg";
import play from "@/../../public/svgs/play/play.svg";
import pause from "@/../../public/svgs/play/pause.svg";
import prev from "@/../../public/svgs/play/prev.svg";
import next from "@/../../public/svgs/play/next.svg";
import volumeImg from "@/../../public/svgs/play/volume.svg";
import menu from "@/../../public/svgs/play/menu.svg";
import menuActive from "@/../../public/svgs/play/menuActive.svg";
import Image from "next/image";
import Modal from "./Menu";
import { MusicDataItem } from "../main/MusicList";
import { Howl } from "howler";
import useAPI from "./useAPI";

interface PlayerProps {
  toggleModal: () => void;
  hidePlayer: () => void;
  currentTrack: MusicDataItem | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  playlist: MusicDataItem[];
  setPlaylist: React.Dispatch<React.SetStateAction<MusicDataItem[]>>;
}

const Player = ({
  toggleModal,
  hidePlayer,
  currentTrack,
  isPlaying,
  onPlayPause,
  playlist,
  setPlaylist,
}: PlayerProps) => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [volume, setVolume] = useState(100); // 음량 상태 (0 - 100)
  const { fetchPlaylist, playlist: apiPlaylist } = useAPI();

  const handleMenuClick = async () => {
    setIsMenuActive(!isMenuActive);
    // 메뉴가 비활성화 상태에서 활성화로 전환될 때만 API 호출
    if (!isMenuActive) {
      await fetchPlaylist(); // 플리 가져오기
    }
  };

  // 음량 슬라이더 값 변경 시 호출되는 함수
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.volume(newVolume / 100); // Howl의 volume 설정 (0.0 - 1.0)
    }
  };

  // 현재 음량을 Howl 객체에 적용
  useEffect(() => {
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.volume(volume / 100);
    }
  }, [currentTrack, volume]);

  return (
    <>
      <div className={styles.player}>
        {/* <button className={styles.close__btn} onClick={hidePlayer}>
          X
        </button> */}

        <div className={styles.album__and__control}>
          {/* 현재 재생 중인 */}
          <div className={styles.album__info}>
            <Image
              className={styles.albumImg}
              src={
                `data:image/png;base64, ${currentTrack?.albumImg}` || playerImg
              }
              alt="Album Image"
              width={100}
              height={100}
            />
            <div>
              <h2 className={styles.title}>
                {currentTrack?.title || "No Track"}
              </h2>
              <p className={styles.artist}>
                {currentTrack?.nickname || "No Artist"}
              </p>
            </div>
          </div>

          <div className={styles.control}>
            <button className={styles.prev__btn}>
              <Image
                className={styles.btn__img}
                src={prev}
                alt="이전"
                width={30}
                height={30}
              />
            </button>
            <button className={styles.play__btn} onClick={onPlayPause}>
              <Image
                src={isPlaying ? pause : play}
                alt={isPlaying ? "멈춤" : "재생"}
                width={50}
                height={50}
              />
            </button>
            <button className={styles.next__btn}>
              <Image
                className={styles.btn__img}
                src={next}
                alt="다음"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.volumn__control}>
            <Image
              className={styles.btn__img}
              src={volumeImg}
              alt="소리"
              width={30}
              height={30}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>

          <button className={styles.menu__btn} onClick={handleMenuClick}>
            <Image
              src={isMenuActive ? menuActive : menu}
              alt="메뉴"
              width={45}
              height={50}
            />
          </button>
        </div>
      </div>

      {isMenuActive && (
        <Modal
          isOpen={isMenuActive}
          onClose={() => setIsMenuActive(false)}
          playlist={apiPlaylist} // API에서 가져온 playlist를 전달
          currentTrack={currentTrack}
        />
      )}
    </>
  );
};

export default Player;
