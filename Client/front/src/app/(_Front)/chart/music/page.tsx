"use client";
import React, { useContext, useState } from "react";
import styles from "./page.module.css";
import { TabContext, TabProvider } from "@/app/components/chart/TabProvider";
import MusicTab from "@/app/components/chart/MusicTab";
import MusicList from "@/app/components/main/MusicList";
import { useMusicFetchData } from "@/app/components/useHook";
import useMusicPlayer from "@/app/components/player/useMusicPlayer";
import Player from "@/app/components/player/Player";

const MusicInner = () => {
  const { url } = useContext(TabContext); // 현재 URL 가져오기

  const {
    data: listItems,
    loading,
    error,
  } = useMusicFetchData({
    url: url,
    key: "content",
  });


// 재생 로직==============

const {
  currentTrack,
  isPlaying,
  playlist,
  setPlaylist,
  handlePlayButtonClick,
  handlePlayPause,
} = useMusicPlayer();


if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

console.log("현재 URL은:", url); // 현재 url 콘솔로 출력

console.log("listItems은", listItems);
console.log("listItem 사이즈", listItems?.length);
  return (
    <div className={styles.container}>
      {/* <TabProvider> */}
      <MusicTab />
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
            {!loading && listItems && listItems.length > 0 ? (
              listItems.map((item, index) => (
                <MusicList
                  key={item.songId}
                  musicChartData={item}
                  index={index}
                  showCheckbox={true}
                  onPlayButtonClick={(songId) => handlePlayButtonClick(songId, listItems)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7}>데이터를 불러올 수 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
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
      {/* </TabProvider> */}
    </div>
  );
};

const Music = () => (
  <TabProvider>
    <MusicInner />
  </TabProvider>
);
export default Music;
