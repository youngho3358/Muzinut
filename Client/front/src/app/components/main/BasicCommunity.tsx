"use client";
import styles from "../main/css/BasicCommunity.module.css";
import { useState } from "react";
import {
  FreeBoardDto,
  RecruitBoardDto,
  useNewCommunityFetchData,
} from "../useHook";

export default function BasicCommunity() {
  const [category, setCategory] = useState<"free-boards" | "recruit-boards">(
    "free-boards"
  ); // 초기 카테고리 상태

  const { freeBoardData, recruitBoardData, loading, error } =
    useNewCommunityFetchData({
      url: `http://localhost:8080/muzinut/newboard`, // 데이터 가져올 API 엔드포인트
      keys: {
        FreeBoard: "freeBoardDtos",
        RecruitBoard: "recruitBoardDtos",
      }, // 응답 데이터의 키
    });

  const handleCategoryClick = (
    selectedCategory: "free-boards" | "recruit-boards"
  ) => {
    setCategory(selectedCategory); // 카테고리 변경
  };

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 UI
  if (error) return <p>Error: {error.message}</p>; // 에러 발생 시 UI

  console.log("freeBoardData:", freeBoardData); // 배열 형태로 들어옴.
  console.log("recruitBoardData:", recruitBoardData); // 배열 형태로 들어옴.

  // 현재 카테고리에 맞는 데이터 선택
  const currentData =
    category === "free-boards" ? freeBoardData : recruitBoardData;

  console.log("현재 데이터는", currentData);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2
          className={
            category === "free-boards" ? styles.selected__category : ""
          }
          onClick={() => handleCategoryClick("free-boards")}
        >
          자유
        </h2>
        <h2
          className={
            category === "recruit-boards" ? styles.selected__category : ""
          }
          onClick={() => handleCategoryClick("recruit-boards")}
        >
          모집
        </h2>
      </div>
      {currentData && currentData.length > 0 ? (
        <div className={styles.communityList__container}>
          <div className={styles.list__contents__wrap}>
            <ul>
              {currentData.map((item, index) => (
                <li
                  key={
                    category === "free-boards"
                      ? (item as FreeBoardDto).freeBoardId
                      : (item as RecruitBoardDto).recruitBoardId
                  }
                >
                  <a
                    href={`/community/${category}/${
                      category === "free-boards"
                        ? (item as FreeBoardDto).freeBoardId
                        : (item as RecruitBoardDto).recruitBoardId
                    }`}
                  >
                    <div className={styles.list__container}>
                      <div className={styles.list__title}>
                        <span>
                          {index + 1}. {item.title}
                        </span>
                      </div>
                      <div className={styles.list__name__view}>
                        <span>{item.nickname}</span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className={styles.divided__line}></div>
            <ul className={styles.list__contents__wrap__bottom}>
              <div className={styles.btn__wrap}>
                <a href={`/community/${category}`}>
                  <button>게시판 더 보러가기</button>
                </a>
                <button>글 작성하러 가기</button>
              </div>
            </ul>
          </div>
        </div>
      ) : (
        <p className={styles.ptag}>데이터를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
