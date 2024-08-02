"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";
import Image from "next/image";
import MusicList from "@/app/components/main/MusicList";
import useMusicPlayer from "@/app/components/player/useMusicPlayer";
import Player from "@/app/components/player/Player";
import Link from "next/link";

type ArtistData = {
  followCount: number;
  nickname: string;
  profileImg: string;
  userId: number;
};

type SongData = {
  songId: number;
  albumImg: string;
  title: string;
  nickname: string;
};

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [artistData, setArtistData] = useState<ArtistData[] | null>(null);
  const [songData, setSongData] = useState<SongData[] | null>(null);
  // 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState<"all" | "artist" | "song">(
    "all"
  );
  const searchParams = useSearchParams();

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
    if (searchParams) {
      const query = searchParams.get("query");
      setSearchTerm(query || undefined);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchTerm) {
      const fetchData = async () => {
        try {
          let url = "";

          // 전체 탭인 경우 아티스트와 음악 정보를 모두 요청
          if (selectedTab === "all") {
            url = `http://localhost:8080/muzinut/${searchTerm}?artistpage=1&songpage=1`;
          }
          // 탭에 따라 데이터 요청
          else if (selectedTab === "artist") {
            url = `http://localhost:8080/muzinut/${searchTerm}/artist?page=1`;
          } else if (selectedTab === "song") {
            url = `http://localhost:8080/muzinut/${searchTerm}/song?page=1`;
          }

          const response = await axios.get(url);
          console.log("응답 데이터(JSON파싱 전)", response.data);

          if (selectedTab === "all") {
            setArtistData(response.data.searchArtistDtos?.content || []);
            console.log("artistData===", artistData);
            setSongData(response.data.searchSongDtos?.content || []);
            console.log("songData===", songData);
          } else if (selectedTab === "artist") {
            setArtistData(response.data.totalData?.content || []);
            // setSongData(null);
          } else if (selectedTab === "song") {
            // setArtistData(null);
            setSongData(response.data.totalData?.content || []);
          }
        } catch (error) {
          console.error("데이터를 가져오는 데 실패했습니다.", error);
        }
      };
      fetchData();
    }
  }, [searchTerm, selectedTab]);

  return (
    <div className={styles.container}>
      {/* 전체/앨범/아티스트 탭 부분 */}
      <div className={styles.selected__tab}>
        <button
          className={selectedTab === "all" ? styles.selected : ""}
          onClick={() => setSelectedTab("all")}
        >
          전체
        </button>
        <button
          className={selectedTab === "artist" ? styles.selected : ""}
          onClick={() => setSelectedTab("artist")}
        >
          아티스트
        </button>
        <button
          className={selectedTab === "song" ? styles.selected : ""}
          onClick={() => setSelectedTab("song")}
        >
          음악
        </button>
      </div>

      {/* 검색 결과 INFO */}
      <div className={styles.info__text}>
        <a href="#">{searchTerm}</a> 에 대한 검색 결과 입니다.
      </div>

      {selectedTab === "all" || selectedTab === "artist" ? (
        <div className={styles.artist__wrapper}>
          <h2>아티스트</h2>
          {/* <ArtistView /> */}
          <>
            <ul>
              {artistData && artistData.length > 0 ? (
                artistData.map((item) => (
                  <li key={item.userId} className={styles.list__container}>
                    <div className={styles.contents__container}>
                      <div className={styles.ranking__Img}>
                        <Image
                          src={
                            item.profileImg
                              ? `data:image/png;base64,${item.profileImg}`
                              : "/path/to/placeholder.png"
                          }
                          alt="artist image"
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className={styles.artist__info}>
                        <h4><Link href={`/profile?nickname=${item.nickname}`}>{item.nickname}</Link></h4>
                        <p>팔로워: {item.followCount}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>일치하는 정보가 없습니다.</p>
              )}
            </ul>
          </>
        </div>
      ) : null}

      {selectedTab === "all" || selectedTab === "song" ? (
        <div className={styles.music__wrapper}>
          <h2>음악</h2>
          {/* <MusicView /> */}
          <>
            <div className={styles.play__option__container}>
              <a href="#">
                <button>전체 재생</button>
              </a>
              <a href="#">
                <button>선택 재생</button>
              </a>
            </div>

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
                  {songData && songData.length > 0 ? (
                    songData.map((item, index) => (
                      <MusicList
                        key={item.songId}
                        musicChartData={item}
                        index={index}
                        showCheckbox={true}
                        onPlayButtonClick={(songId) =>
                          handlePlayButtonClick(songId, songData)
                        }
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className={styles.null__info}>
                        {" "}
                        일치하는 정보가 없습니다.{" "}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        </div>
      ) : null}

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
};

const ArtistView = () => {
  return <div>glgl</div>;
};

const MusicView = () => {
  return <></>;
};

export default SearchPage;
