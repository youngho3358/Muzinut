"use client";
import styles from "../main/css/NewMusic.module.css";
import Image from "next/image";
import search from "../../../../public/images/addMusic.png";
import { useMusicFetchData } from "../useHook";
import { useEffect, useState } from "react";
import useMusicPlayer from "../player/useMusicPlayer"; // useMusicPlayer 훅 가져오기
import Player from "../player/Player";
import playBtn from "@/../../public/svgs/play_btn.svg";
import Link from "next/link";

export default function NewMusic() {
  const {
    data: listItems,
    loading,
    error,
  } = useMusicFetchData({
    url: "http://localhost:8080/muzinut/newsong",
    key: "newSongs",
  });

  // 재생 기능 불러오기================
  const {
    currentTrack,
    isPlaying,
    playlist,
    setPlaylist,
    handlePlayButtonClick,
    handlePlayPause,
  } = useMusicPlayer();

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  // const nextSlide = () => {
  //   if (listItems) {
  //     setCurrentIndex((prevIndex) =>
  //       prevIndex === listItems.length - itemsPerPage ? 0 : prevIndex + 1
  //     );
  //   }
  // };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000); // 1초마다 이동

    return () => clearInterval(intervalId);
  }, [currentIndex, listItems]);

  const nextSlide = () => {
    if (listItems) {
      setCurrentIndex((prevIndex) =>
        prevIndex === listItems.length - itemsPerPage ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (listItems) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? listItems.length - itemsPerPage : prevIndex - 1
      );
    }
  };

  const handlePlay = (songId: number) => {
    if (listItems) {
      handlePlayButtonClick(songId, listItems); // 리스트가 null이 아닌 경우에만 호출
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      {listItems && listItems.length > 0 ? (
        <div className={styles.slider}>
          <button className={styles.arrow} onClick={prevSlide}>
            &lt;
          </button>
          <div className={styles.sliderContainer}>
            {listItems
              .slice(currentIndex, currentIndex + itemsPerPage)
              .map((item) => (
                <div key={item.songId} className={styles.item}>
                  <div className={styles.thumbnail}>
                    <Image
                      src={
                        item.albumImg
                          ? `data:image/png;base64,${item.albumImg}`
                          : search
                      }
                      alt="album"
                      width={200}
                      height={200}
                    />
                    <button
                      className={styles.playButton}
                      onClick={() => handlePlay(item.songId)}
                    >
                      <Image
                        src={playBtn}
                        alt="play"
                        width={150}
                        height={150}
                      />
                    </button>
                  </div>
                  <div className={styles.info}>
                  <h2>
                      <Link href={`/details/song/${item.songId}`}>{item.title}</Link>
                    </h2>

                    <h3><Link href={`/profile?nickname=${item.nickname}`}>{item.nickname}</Link></h3>
                  </div>
                </div>
              ))}
          </div>
          <button className={styles.arrow} onClick={nextSlide}>
            &gt;
          </button>
        </div>
      ) : (
        <p>데이터를 불러올 수 없습니다.</p>
      )}

      {currentTrack && (
        <Player
          toggleModal={() => {}}
          hidePlayer={() => {}}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          playlist={playlist}
          setPlaylist={setPlaylist}
        />
      )}
    </div>
  );
}
