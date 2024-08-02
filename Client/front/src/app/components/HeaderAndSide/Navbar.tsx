"use client";
import { useState } from "react";
import styles from "../HeaderAndSide/css/Navbar.module.css";
import Image from "next/image";
import search from "@/../public/svgs/search.svg";
import addalbum from "@/../public/svgs/addalbum.svg";
import chat from "@/../public/svgs/chat.svg";
import alarm from "@/../public/svgs/alarm.svg";
import menuBar from "@/../public/svgs/menu.svg";
import DarkMode from "../darkmode/globalstyle";
import Link from "next/link";
import LoginBtn from "./loginButton/loginBtn";
import { useUser } from "../UserContext";
import { useRouter } from "next/navigation";

interface NavbarProps {
  toggleSidebar: () => void;
}

// toggleSidebar 함수를 prop으로 받아와서 클릭 이벤트( handleMenuClick ) 에 연결
export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1) 클릭되는 순간(이벤트가 발생하는 순간 toggleSidebar 함수 호출)
  function handleMenuClick() {
    setIsSidebarOpen(!isSidebarOpen); // 2) Sidebar의 열림/닫힘 상태를 반전
    toggleSidebar();
  }

  const { user } = useUser(); // UserContext로부터 현재 사용자 정보 가져오기

  /* 검색 기능 */
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로 고침 방지
    if (searchTerm.trim() === "") {
      return; // 검색어가 비어 있으면 리디렉션 XX
    }
    //encodeURIComponent- 인코딩하여 URL-safe한 형식으로 변환
    router.push(`/details/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  return (
    <div className={styles.header__container}>
      {/* 왼쪽(메뉴 바, 로고) */}
      <div className={styles.left__section}>
        <div className={styles.menu__bar} onClick={handleMenuClick}>
          <Image src={menuBar} alt="addalbum" width={36} height={36} />
        </div>
        <div className={styles.logo}>
          <a href="/">MuziNut</a>
        </div>
      </div>

      {/* 가운데(검색 창) */}
      <div className={styles.search__section}>
        <form onSubmit={handleSearchSubmit} className={styles.search__bar}>
          <div>
            <input
              type="text"
              placeholder="찾으려는 음악을 검색하세요!"
              value={searchTerm}
              onChange={handleSearchChange}
            ></input>
          </div>
          <button className={styles.search__btn}>
            <Image src={search} alt="search" width={24} height={24} />
          </button>
        </form>
      </div>

      {/* 오른쪽 nav 메뉴 */}
      <div className={styles.right__section}>
        <div className={styles.album__upload}>
          {/* 로그인 상태에 따라 다른 링크 설정 */}
          {user ? (
            <Link href="/add-album/[step]" as="/add-album/1">
              <Image src={addalbum} alt="addalbum" width={40} height={40} />
            </Link>
          ) : (
            <Link href="/member/login">
              <Image src={addalbum} alt="addalbum" width={40} height={40} />
            </Link>
          )}
          <span>업로드</span>
        </div>

        <DarkMode />
        {/* <Image src={light_mode} alt="chat" width={30} height={30} /> */}

        <div className={styles.divided__line}></div>

        {/* 로그인 상태에 따라 다른 링크 설정 */}
        {user ? (
          <Link href="/friends-list/chat">
            <Image src={chat} alt="chat" width={40} height={40} />
          </Link>
        ) : (
          <Link href="/member/login">
            <Image src={chat} alt="chat" width={40} height={40} />
          </Link>
        )}

        {/* 로그인 상태에 따라 다른 링크 설정 */}
        {user ? (
          <Link href="/test">
            <Image src={alarm} alt="alarm" width={40} height={40} />
          </Link>
        ) : (
          <Link href="/member/login">
            <Image src={alarm} alt="alarm" width={40} height={40} />
          </Link>
        )}

        {/* 로그인 버튼 */}
        <div className={styles.login__btn}>
          <LoginBtn />
        </div>
      </div>
    </div>
  );
}
