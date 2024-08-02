"use client";
import styles from "./page.module.css";
import {
  useArtistFetchData,
  useMusicFetchData,
} from "@/app/components/useHook";
import { useState } from "react";
import ArtistList from "@/app/components/chart/ArtistList";

export default function Artist() {
  const [artistDataNum, setArtistDataNum] = useState(100); // 아티스트 차트 리스트 개수
  console.log("아티스트 차트 페이지 시작");
  console.log("업데이트된 artistDataNum 개수 ", artistDataNum); //처음에 100나오고 fetch로 업데이트 된 1로 됨

  const {
    data: listItems,
    loading,
    error,
  } = useArtistFetchData({
    url: `http://localhost:8080/music/hot-artist?page=1`,
    key: "content",
  });

  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("listItems은", listItems);

  return (
    <div className={styles.container}>
      <div>인기아티스트 Top50</div>
      <div className={styles.artist__chart__container}>
        <table border={0}>
          <thead>
            <tr>
              <th>
                <span className={styles.blind}>랭킹</span>
              </th>
              <th>
                <span className={styles.blind}>앨범 썸네일</span>
              </th>
              <th>
                <span className={styles.blind}>가수정보</span>
              </th>
              <th>
                <span className={styles.blind}>팔로잉버튼</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {listItems && listItems.length > 0 ? (
              listItems.map((item, index) => (
                <ArtistList
                  key={item.userId}
                  index={index}
                  artistChartData={item}
                />
              ))
            ) : (
              // 데이터가 없을 때
              <tr>
                <td colSpan={6}>데이터를 불러올 수 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
