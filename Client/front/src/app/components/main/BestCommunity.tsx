"use client";
import Link from "next/link";
import styles from "../main/css/BestCommunity.module.css";
import { useCommunityFetchData } from "../useHook";
import { styled } from "styled-components";
/*
const listItems = [
  { id: 1, titleName: "게시판 이름", authorName: "작성자", views: 100 },
  { id: 2, titleName: "게시판 이름", authorName: "작성자", views: 100 },
  { id: 3, titleName: "게시판 이름", authorName: "작성자", views: 100 },
  { id: 4, titleName: "게시판 이름", authorName: "작성자", views: 100 },
  { id: 5, titleName: "게시판 이름", authorName: "작성자", views: 100 }
];
*/
const modifyPath = (dtype: string): string => {
  switch (dtype) {
    case "FreeBoard":
      return "free-boards";
    case "RecruitBoard":
      return "recruit-boards";
    default:
      return dtype;
  }
};

export default function BestCommunity() {
  // use훅으로 데이터 가져오는 부분
  const {
    data: listItems, //서버에서 받아온 데이터
    loading,
    error,
  } = useCommunityFetchData({
    url: `http://localhost:8080/muzinut/hotboard`, //데이터 가져올 api 엔드포인트
    key: "hotBoards", // 응답 데이터의 키
  });
  if (loading) return <p>Loading...</p>; // 로딩 중일 때 UI
  if (error) return <p>Error: {error.message}</p>; // 에러 발생 시 UI

  console.log("listItems은", listItems); //배열 형태로 들어옴.

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>인기 게시판</h2>
        <h4>모든 게시판 중 조회수가 높은 순서로 노출됩니다.</h4>
      </div>
      {listItems && listItems.length > 0 ? (
        <div className={styles.communityList__container}>
          <div className={styles.list__contents__wrap}>
            <ul>
              {listItems.map((item, index) => {
                const modifiedPath = modifyPath(item.dtype);
                return (
                  <li key={item.boardId}>
                    <Link href={`/community/${modifiedPath}/${item.boardId}`}>
                      <LinkSytle>
                        <div className={styles.list__container}>
                          <div className={styles.list__title}>
                            <span>
                              {index + 1}. {item.title}
                            </span>
                          </div>
                          <div className={styles.list__name__view}>
                            <span>{item.nickname}</span>
                            <span>{item.view}</span>
                          </div>
                        </div>
                      </LinkSytle>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <p className={styles.p}>데이터를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
const LinkSytle = styled.div`
  text-decoration: none;
  color: black;
`;
