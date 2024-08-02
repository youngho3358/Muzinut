"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import MusicContentInfo from "@/app/components/music-content/MusicContentInfo";
import Link from "next/link";
import { HeartButton } from "@/app/components/button/commonButton";
import { useParams } from "next/navigation";
import defaultImg from "@/../../public/images/artist2.png";

export type SongData = {
  albumImg: string;
  title: string;
  nickname: string;
  likeCount: number;
  lyrics: string;
  composer: string;
  lyricist: string;
  albumId: number;
  genres: [];
  like: boolean;
};

type Params = {
  id: string;
};

export default function Song() {
  const params = useParams() as Params;
  const { id } = params;

  console.log("params는", params);

  const [songData, setSongData] = useState<SongData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리(좋아요버튼)
  const [token, setToken] = useState<string | null>(null); // 사용자 토큰 관리

  if (songData) {
    console.log("songData의 like 여부", songData.like);
  }

  // songID가 변경될 때만 렌더링 다시
  useEffect(() => {
    if (id) {
      console.log("id", id)
      const fetchSongData = async () => {
        try {
          const token = localStorage.getItem("token");

          const response = await fetch(`http://localhost:8080/music/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "", // 토큰이 없으면 빈 문자열로 설정
              }
            }
          );
          const data: SongData = await response.json();
          setSongData(data);
        } catch (error) {
          console.error("음악데이터 정보를 가져오는 데 실패했습니다.", error);
        }
      };




     


      fetchSongData();
    }

    //토큰 관리
    const token = localStorage.getItem("token");
    // console.log(token);
    if (token) {
      setIsLoggedIn(true);
      setToken(token); // 토큰 설정
    }
  }, [id]);

  if (!songData) return <div>Loading...</div>;

  // 좋아요 버튼 눌렀을 경우
  const handleLikeBtn = async () => {
    if (songData) {
      const newLikeCount =
        songData.like === true
          ? songData.likeCount - 1
          : songData.likeCount + 1;
      const newLikeStatus = !songData.like;

      //UI 에 우선 업데이트 -> 서버에 전송(렌더링 다시 될 때-접속하거나 새로고침만 상태 업데이트)

      // 프론트에서 songData(좋아요 수, 좋아요 T/F 여부 관리)
      setSongData({
        ...songData,
        likeCount: newLikeCount,
        like: newLikeStatus,
      });

      console.log("like수", songData.likeCount);
      console.log("like상태", songData.like);
      // 서버 요청은 비동기적으로 처리
    // 서버에 데이터 전송
      try {
        const response = await fetch(
          `http://localhost:8080/music/detail/${id}/songlike`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
              songId: id,
            }),
          }
        );

        if (!response.ok) {
          // 서버 응답이 실패한 경우, UI 상태 제자리로
          alert("좋아요 업데이트에 실패했습니다.");
          setSongData({
            ...songData,
            likeCount: songData.likeCount,
            like: songData.like,
          });
          console.log("like수22", songData.likeCount);
          console.log("like상태22", songData.like);
        } else {
          alert("좋아요 업데이트 성공!");
        }
      } catch (error) {
        // 네트워크 오류가 발생한 경우, UI 상태 제자리로
        alert("좋아요 업데이트 중 오류가 발생했습니다.");
        setSongData({
          ...songData,
          likeCount: songData.likeCount,
          like: songData.like,
        });
        console.error("Error updating like:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      음악 사진 눌렀을 때 나오는 상세 페이지 입니다.
      <section className={styles.music__info__section}>
        <h2>음악 정보</h2>
        <div className={styles.music__info__wrap}>
          <div className={styles.album__info__container}>
            <div className={styles.album__img}>
              <Link href={`/details/album/${songData.albumId}`}>
                {/* musicCharData의 이미지가 없으면 기본 이미지(album)으로 설정 */}
                <Image
                  src={
                    songData.albumImg
                      ? `data:image/png;base64,${songData.albumImg}`
                      : defaultImg
                  }
                  alt="album"
                  width={400}
                  height={400}
                />
              </Link>
            </div>
            <div className={styles.song__info}>
              <div className={styles.title__artist}>
                <h1>{songData.title}</h1>
                <h2>
                  <Link href="./">{songData.nickname}</Link>
                </h2>
              </div>

              <div className={styles.song__info__details}>
                <ul>
                  <li>
                    <span>장르:</span> {songData.genres.join(", ")}
                  </li>
                  <li>
                    <span>작사:</span> {songData.lyricist}
                  </li>
                  <li>
                    <span>작곡:</span> {songData.composer}
                  </li>
                </ul>
              </div>
            </div>

            {/* 재생 버튼으로 재생 불가(서버에서 songId 값이 안 넘어옴) */}
            {/* <button className={styles.play__btn}>
              <Image
                src="/svgs/play_btn.svg"
                alt="Services"
                width={60}
                height={60}
              />
            </button> */}
          </div>

          <div className={styles.divider}> </div>

          <div className={styles.btn__container}>
            <div className={styles.btn__heart}>
              <HeartButton
                onClick={handleLikeBtn}
                isLiked={songData.like}
                isLoggedIn={isLoggedIn}
              />
              <span>{songData.likeCount}</span>
            </div>
            <div className={styles.btn__add}>
              <span>플리넛에 추가하기</span>
              <span>
                <a href="#">
                  <Image
                    src="/social/kakao.png"
                    alt="Services"
                    width={30}
                    height={30}
                  />
                </a>
              </span>
            </div>

            <div className={styles.btn__share}>
              <span>공유</span>
              <span>
                <a href="#">
                  <Image
                    src="/social/kakao.png"
                    alt="Services"
                    width={40}
                    height={40}
                  />
                </a>
                <a href="#">
                  <Image
                    src="/social/instagram.png"
                    alt="Services"
                    width={40}
                    height={40}
                  />
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.lyrics__section}>
        <MusicContentInfo title="가사" text={songData.lyrics} />
      </section>
    </div>
  );
}
