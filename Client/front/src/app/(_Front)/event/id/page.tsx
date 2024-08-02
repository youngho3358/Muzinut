"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { EventHeader } from "../eventheader";
import PostBox from "./postbox";

const EventPostID: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("event");

  return (
    <MainContainer>
      <EventHeader />
      <SelectBar>
        <SelectContainer>
          <StyledLink href={"/event"} onClick={() => setSelectedTab("event")}>
            <SelectItem selected={selectedTab === "event"}>이벤트</SelectItem>
          </StyledLink>
          <StyledLink href={"/notice"} onClick={() => setSelectedTab("notice")}>
            <SelectItem selected={selectedTab === "notice"}>
              공지사항
            </SelectItem>
          </StyledLink>
        </SelectContainer>
      </SelectBar>
      <PostBox />
    </MainContainer>
  );
};

export default EventPostID;

// 메인 전체를 감싸는 컨테이너
const MainContainer = styled.div``;

// -------------------------------------------------------------------------------------------------------
// 선택 네비바
const SelectBar = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 16px;
  display: flex;
  gap: 10px;
  font-size: 16px;
`;

// 나란히 하기위한 Flex 박스 컨테이너
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

// 링크 태그 스타일을 주기위한 요소 추가
const StyledLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
`;
// -------------------------------------------------------------------------------------------------------
