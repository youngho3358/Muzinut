"use client";
import { useContext, useState } from "react";
import styles from "../chart/css/Tab.module.css";
import { TabContext } from "./TabProvider";

export default function Tab() {
  const { tab, setTab } = useContext(TabContext);

  const onClickFirst = () => {
    setTab("one");
  };
  const onClickSecond = () => {
    setTab("two");
  };
  const onClickThird = () => {
    setTab("three");
  };
  return (
    <div className={styles.homeFixed}>
      <div className={styles.homText}>아티스트 차트</div>
      <div className={styles.homeTab}>
        <div onClick={onClickFirst}>
          인기 아티스트 Top 50
          <div className={styles.tabIndicator} hidden={tab !== "one"}></div>
        </div>

        <div onClick={onClickSecond}>
          팔로우 수
          <div className={styles.tabIndicator} hidden={tab !== "two"}></div>
        </div>
        <div onClick={onClickThird}>
          음원 수
          <div className={styles.tabIndicator} hidden={tab !== "three"}></div>
        </div>
      </div>
    </div>
  );
}
