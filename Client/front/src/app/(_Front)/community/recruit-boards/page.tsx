"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Headers } from "../header";
import RecruitBoardsBody from "./recruit-boards-body";

const RecruitBoards: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("recruit-boards");

  return (
    <>
      <OverlayBox>
        <OverlayMessage>준비중인 페이지 입니다</OverlayMessage>
        <SelectBar2>
          <SelectContainer2>
            <StyledLink2
              href={"/community/free-boards"}
              onClick={() => setSelectedTab("free-boards")}
            >
              <SelectItem2 selected={selectedTab === "free-boards"}>
                자유
              </SelectItem2>
            </StyledLink2>
            <StyledLink2
              href={"/community/recruit-boards"}
              onClick={() => setSelectedTab("recruit-boards")}
            >
              <SelectItem2 selected={selectedTab === "recruit-boards"}>
                모집
              </SelectItem2>
            </StyledLink2>
            <StyledLink2
              href={"/community/request-boards"}
              onClick={() => setSelectedTab("request-boards")}
            >
              <SelectItem2 selected={selectedTab === "request-boards"}>
                게시판 요청
              </SelectItem2>
            </StyledLink2>
          </SelectContainer2>
        </SelectBar2>
      </OverlayBox>

      <RecruitBoardsContainer>
        <Headers />
        <SelectBar>
          <SelectContainer>
            {/* <StyledLink
            href={"/community"}
            onClick={() => setSelectedTab("community")}
          >
            <SelectItem selected={selectedTab === "community"}>메인</SelectItem>
          </StyledLink> */}
            <StyledLink
              href={"/community/free-boards"}
              onClick={() => setSelectedTab("free-boards")}
            >
              <SelectItem selected={selectedTab === "free-boards"}>
                자유
              </SelectItem>
            </StyledLink>
            <StyledLink
              href={"/community/recruit-boards"}
              onClick={() => setSelectedTab("recruit-boards")}
            >
              <SelectItem selected={selectedTab === "recruit-boards"}>
                모집
              </SelectItem>
            </StyledLink>
            <StyledLink
              href={"/community/request-boards"}
              onClick={() => setSelectedTab("request-boards")}
            >
              <SelectItem selected={selectedTab === "request-boards"}>
                게시판 요청
              </SelectItem>
            </StyledLink>
          </SelectContainer>
        </SelectBar>
        <RecruitBoardsBody />
      </RecruitBoardsContainer>
    </>
  );
};

export default RecruitBoards;

// 모집 게시판 데이터 준비중
const SelectBar2 = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
  display: flex;
  gap: 10px;
  font-size: 16px;
`;

// 모집 게시판을 나란히 하기위한 Flex 박스 컨테이너
const SelectContainer2 = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #ccc;
  position: relative;
  margin-bottom: 150px;

  :last-child {
    margin-left: auto;
  }

  img {
    position: absolute;
    right: 0;
    top: -10px;
    padding: 7px;

    &:hover {
      background-color: #e7e7e7;
      border-radius: 8px;
    }
  }
`;

// 선택된 항목에 하단 밑줄을 추가하는 스타일
const SelectItem2 = styled.div<{ selected: boolean }>`
  padding-bottom: 10px;
  position: relative;
  cursor: pointer;

  &:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #16be78;
    transform: scaleX(${(props) => (props.selected ? 1 : 0)});
    transition: transform 0.3s ease;
  }
`;

// 메인 라운지 링크 태그 스타일을 주기위한 요소 추가
const StyledLink2 = styled(Link)`
  color: #16be78;
  text-decoration: none;
`;

const OverlayBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8); // 반투명한 검정색 배경
  z-index: 1000; // 높은 z-index 값으로 다른 요소들 위에 표시
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16be78;
  font-size: 50px;
  font-family: "esamanru bold";
  pointer-events: auto; // 오버레이 메시지 클릭 가능
`;
const OverlayMessage = styled.div`
  position: absolute;
`;

// 마이페이지 전체를 감싸는 컨테이너
const RecruitBoardsContainer = styled.div``;

// -------------------------------------------------------------------------------------------------------
// 메인, 라운지 선택바
const SelectBar = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
  display: flex;
  gap: 10px;
  font-size: 16px;
`;

// 메인 라운지를 나란히 하기위한 Flex 박스 컨테이너
const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #ccc;
  position: relative;
`;

// 선택된 항목에 하단 밑줄을 추가하는 스타일
const SelectItem = styled.div<{ selected: boolean }>`
  padding-bottom: 10px;
  position: relative;
  cursor: pointer;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--text-color);
    transform: scaleX(${(props) => (props.selected ? 1 : 0)});
    transition: transform 0.3s ease;
  }
`;

// 메인 라운지 링크 태그 스타일을 주기위한 요소 추가
const StyledLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
`;
// -------------------------------------------------------------------------------------------------------
