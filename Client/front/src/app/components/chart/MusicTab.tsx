"use client";
import { useContext, useState } from "react";
import styles from "../chart/css/Tab.module.css";
import { TabContext } from "./TabProvider";
import GenreTabs from "./Genre";

export default function MusicTab() {
  // 상위 TAB
  const { tab, setTab, setUrl } = useContext(TabContext);
  const [showGenreTabs, setShowGenreTabs] = useState(false);
  // 하위 TAB ___ 초기값으로 k-pop을 설정
  const [activeGenreTab, setActiveGenreTab] = useState("k-pop");

  const onClickFirst = () => {
    setTab("one");
    setUrl("http://localhost:8080/music/newsong");
    console.log("첫 번쨰 Tab 눌림");
    setShowGenreTabs(false); // 다른 탭 클릭 시 하위 장르 탭 숨기기
  };
  const onClickSecond = () => {
    setTab("two");
    setUrl("http://localhost:8080/music/hotsong");
    console.log("두 번쨰 Tab 눌림");
    setShowGenreTabs(false); // 다른 탭 클릭 시 하위 장르 탭 숨기기
  };
  // const onClickThird = () => {
  //   setTab("three");
  //   setUrl("http://localhost:9999/Chart-genre");
  //   console.log("세 번쨰 Tab 눌림");
  // };
  const onClickThird = () => {
    setTab("three");
    setUrl("http://localhost:8080/music/genresong/kpop");
    console.log("세 번째 Tab 눌림");
    setShowGenreTabs((prev) => !prev); // 장르별 음악 클릭 시 하위 장르 탭 보이기/숨기기 토글
  };

  const onClickGenreTab = (genreId: string) => {
    setActiveGenreTab(genreId); // 클릭한 장르 탭을 활성화 상태로 설정

    setTab(`${genreId}`);
    setUrl(`http://localhost:8080/music/genresong/${genreId}`);
    console.log(`장르 ${genreId} 클릭`);
  };

  return (
    <div className={styles.homeFixed}>
      <div className={styles.homText}>뮤직 차트</div>
      <div className={styles.homeTab}>
        <div onClick={onClickFirst}>
          최신 음악
          <div className={styles.tabIndicator} hidden={tab !== "one"}></div>
        </div>

        <div onClick={onClickSecond}>
          주간 Top 100
          <div className={styles.tabIndicator} hidden={tab !== "two"}></div>
        </div>

        <div onClick={onClickThird}>
          장르별 음악
          <div className={styles.tabIndicator} hidden={tab !== "three"}></div>
        </div>
      </div>
      {/* 장르별 음악 클릭 시 GenreTabs 컴포넌트 보여주기 */}
      {showGenreTabs && (
        <GenreTabs activeTab={activeGenreTab} onTabClick={onClickGenreTab} />
      )}
    </div>
  );
}
