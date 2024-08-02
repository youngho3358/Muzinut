"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import MusicList, { MusicDataItem } from "@/app/components/main/MusicList";
import { useParams } from "next/navigation";
import closeBtn from "@/../../public/svgs/close_btn.svg"
import useMusicPlayer from "@/app/components/player/useMusicPlayer";
import Player from "@/app/components/player/Player";

type SongData = {
  nickname: string;
  songId: number;
  title: string;
};
type AlbumData = {
  name: string;
  albumImg: string;
  nickname: string;
  intro: string;
  songs: Array<SongData>;
};
type Params = {
  id: string;
};

export default function Album() {
  const params = useParams() as Params;
  const { id } = params;
  console.log("params는", params);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const [albumData, setAlbumData] = useState<AlbumData | null>(null);
  console.log(albumData?.songs);


    // 재생 기능 불러오기================
    const {
      currentTrack,
      isPlaying,
      playlist,
      setPlaylist,
      handlePlayButtonClick,
      handlePlayPause,
    } = useMusicPlayer();
  

    
    
  useEffect(() => {
    if (id) {
      const fetchSongData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/album/${id}`);
          const data: AlbumData = await response.json();
          setAlbumData(data);
        } catch (error) {
          console.error("앨범데이터 정보를 가져오는 데 실패했습니다.", error);
        }
      };

      fetchSongData();
    }
  }, [id]);

  if (!albumData) return <div>Loading...</div>;

  console.log("음악 정보들", albumData.songs);


    //SongData[] 를 MusicDataItem[]형식으로 변환
    const musicDataItems: MusicDataItem[] = albumData.songs.map(song => ({
      songId: song.songId,
      albumImg: albumData.albumImg, 
      title: song.title,
      nickname: song.nickname,
    }));

    

  return (
    <div className={styles.container}>
      <h2 className={styles.section__title}>앨범 정보</h2>
      <section className={styles.music__info__section}>
        <div className={styles.music__info__wrap}>
          <div className={styles.album__info__container}>
            <div className={styles.album__img}>
              <Image
                src="/svgs/album_thumb.png"
                alt="Album Thumbnail"
                width={200}
                height={200}
              />
            </div>
            <div className={styles.song__info}>
              <div className={styles.title__artist}>
                <h1 onClick={handleOpenModal} style={{ cursor: "pointer" }}>
                  {albumData.name}
                  <span>자세히 ▼</span>
                </h1>

                <div className={styles.artist__song}>
                  <h2>
                    <Link href="./">{albumData.nickname}</Link>
                  </h2>
                  <div className={styles.divider}></div>

                  <h4>
                    수록곡 <span>{albumData.songs.length}</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.share}>
            <div>공유하기</div>
            <div className={styles.social__btn}>
              <a href="#">
                <Image
                  src="/social/kakao.png"
                  alt="Kakao"
                  width={40}
                  height={40}
                />
              </a>
              <a href="#">
                <Image
                  src="/social/instagram.png"
                  alt="Instagram"
                  width={40}
                  height={40}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <h2 className={styles.section__title}>
        수록곡 (<span> {albumData.songs.length} </span>)
      </h2>
      <div className={styles.play__option__container}>
        <a href="#">
          <button>전체 재생</button>
        </a>
        <a href="#">
          <button>선택 재생</button>
        </a>
      </div>

      <section className={styles.song__info__section}>
        <div className={styles.music__chart__container}>
          <table className={styles.table__container}>
            <thead>
              <tr className={styles.blind}>
                <th>체크박스</th>
                <th>썸네일</th>
                <th>랭킹</th>
                <th>음악이름</th>
                <th>가수 이름</th>
                <th>재생</th>
                <th>옵션</th>
              </tr>
            </thead>
            <tbody className={styles.table__row}>
            {musicDataItems.length > 0 ? (
                musicDataItems.map((song, index) => (
                  <MusicList
                    key={song.songId}
                    musicChartData={song}
                    index={index}
                    showCheckbox={true}
                    onPlayButtonClick={(songId) => handlePlayButtonClick(songId, musicDataItems)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7}>데이터를 불러올 수 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className={`${styles.modal} ${isModalOpen ? styles.open : ""}`}>
        <div className={styles.modal__content}>
          <h2 className={styles.section__title}>앨범 소개 </h2>

          {albumData.intro}

          <button className={styles.close__btn} onClick={handleCloseModal}>
          <Image
                src={closeBtn}
                alt="닫기"
                width={20}
                height={20}
              />
          </button>
        </div>
      </div>

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
