"use client";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import menu from "../../../public/svgs/menu.svg";
import addalbum from "../../../public/svgs/addalbum.svg";
import chat from "../../../public/svgs/chat.svg";
import alarm from "../../../public/svgs/alarm.svg";
import profile from "../../../public/svgs/profile.svg";
import search from "../../../public/svgs/search.svg";
import downarrow from "../../../public/svgs/downarrow.svg";
import Link from "next/link";
import DarkMode from "./darkmode/globalstyle";

export const navbar = () => {
  return (
    <Navcontainer>
      <LeftSection>
        <Menu>
          <Image src={menu} alt="Menu" width={24} height={24} />
        </Menu>
        <Logo>
          <Link href={"/"}>
            <span>MuziNut</span>
          </Link>
        </Logo>
      </LeftSection>
      <SearchBar>
        <Image src={search} alt="search" width={24} height={24} />
        <input type="text" placeholder="찾으려는 음악을 검색하세요!"></input>
        <Image src={downarrow} alt="downarrow" width={24} height={24} />
      </SearchBar>
      <MusicFunction>
        <Image src={addalbum} alt="addalbum" width={36} height={36} />
        <Image src={chat} alt="chat" width={40} height={40} />
        <Image src={alarm} alt="alarm" width={40} height={40} />
        <Image src={profile} alt="profile" width={36} height={36} />
        <DarkMode />
      </MusicFunction>
    </Navcontainer>
  );
};

export default navbar;

// 네비를 감싸는 가장 밖의 컨테이너
const Navcontainer = styled.div`
  background-color: white;
  height: 60px;
  left: 0;
  min-width: 800px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc; // 바텀 라인
`;

// 햄버거 바 메뉴
const Menu = styled.button`
  padding: 13px 4px 10px 19px;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  align-items: center;

  &:hover {
    img {
      background-color: #f0f0f0; /* 회색 배경 */
    }
  }

  &:focus {
    outline: none; /* 포커스 시 외곽선 제거 */
  }
`;

// 로고
const Logo = styled.div`
  margin-left: 15px;
  span {
    color: black;
    text-decoration: none;
  }
`;

// 좌측 섹션 (메뉴와 로고)
const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

// 검색창
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid black;
  border-radius: 15px;
  padding: 5px;

  img:first-child {
    padding-left: 10px;
    padding-right: 10px;
  }

  img:last-child {
    padding-left: 10px;
    padding-right: 10px;
  }

  input {
    flex: 1;
    padding: 7px;
    border: none;
    width: 300px; // 원하는 너비로 설정
    &:focus {
      outline: none;
      border: none;
    }
  }
`;

// 앨범 추가, 채팅, 알림, 프로필
const MusicFunction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    padding: 0 10px;
  }
`;
