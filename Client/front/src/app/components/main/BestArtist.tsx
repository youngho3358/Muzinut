// 렌더링 하는 부분

"use client";
import { useEffect, useRef } from "react";

import styles from "../main/css/BestArtist.module.css";
import Image from "next/image";
import search from "../../../../public/images/favicon.png";
import Link from "next/link";
import { useArtistFetchData } from "../useHook";
import gsap from "gsap";

// export type ArtistDataItem = {
//   userId: number;
//   nickname: string;
//   profileImg: string;
// };

export default function BestArtist() {
  // use훅으로 데이터 가져오는 부분
  const {
    data: listItems, //서버에서 받아온 데이터
    loading,
    error,
  } = useArtistFetchData({
    url: "http://localhost:8080/muzinut/hotartist",
    key: "top5Artists",
  });

  const listRef = useRef<HTMLUListElement>(null);

  // 컴포넌트 렌더링 후 gsap으로 애니메이션 작업 추가
  useEffect(() => {
    if (listRef.current) {
      const items = gsap.utils.toArray(
        listRef.current.children
      ) as HTMLElement[]; // 타입 단언
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 2 }); // 무한 반복/각 반복 사이클 지연 시간

      timeline.call(() => {
        items.forEach((item) => {
          gsap.set(item, { clearProps: "all" });
        });
      });

      items.forEach((item, index) => {
        timeline
          .to(item, {
            scaleX: 1.08,
            scaleY: 1.08,
            color: "green",
            transformOrigin: "center",
            ease: "power2.inOut",
            duration: 0,
            delay: 0, // 각 항목의 지연 시간 조정
          })
          .to(item, {
            duration: 3, // 강조 유지 시간
          })
          .to(item, {
            scaleX: 1,
            scaleY: 1,
            color: "black",
            backgroundColor: "transparent",
            ease: "power2.inOut",
            duration: 0,
          });
      });
      // 타임라인이 끝난 후 스타일을 명확히 복원하기 위한 후처리
      timeline.call(() => {
        items.forEach((item) => {
          gsap.set(item, { clearProps: "all" });
        });
      });
    }
  }, [listItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("listItems은", listItems);

  return (
    <div className={styles.container}>
      {listItems && listItems.length > 0 ? (
        <div className={styles.list__contents__wrap}>
          <ul ref={listRef}>
            {listItems.map((item, index) => (
              <li key={item.id}>
                <div className={styles.list__container}>
                  <div className={styles.contents__container}>
                    <div className={styles.ranking__Img}>
                      <h1 className={styles.ranking}>{index + 1}.</h1>
                      <Link href={`/profile?nickname=${item.nickname}`}>
                        <Image
                          src={
                            item.profileImg
                              ? `data:image/png;base64,${item.profileImg}`
                              : search
                          }
                          alt="album"
                          width={80}
                          height={80}
                        />
                      </Link>
                    </div>

                    <Link href={`/profile?nickname=${item.nickname}`}>
                      {/* musicCharData의 이미지가 없으면 기본 이미지(album)으로 설정 */}
                      <h4>{item.nickname}</h4>
                    </Link>
                  </div>
                  <div className={styles.details__artist}>
                    
                    <Link href={`/profile`}>
                      <Image src={search} alt="search" width={30} height={30} />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>데이터를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
