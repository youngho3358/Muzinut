"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import MuzinutIcon from "../../../public/images/Spinner.png";
import Image from "next/image";

const Spinner = () => {
  return (
    <SpinnerContainer>
      <SpinnerIcon>
        <Image src={MuzinutIcon} alt="Loading..." width={300} height={300} />
      </SpinnerIcon>
    </SpinnerContainer>
  );
};

export default Spinner;

// 회전 애니메이션
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 점프 애니메이션
const jump = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px); /* 점프 높이 */
  }
`;

// 전체 화면을 덮는 컨테이너
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* 전체 화면에 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* 반투명 배경 */
  z-index: 9999; /* 다른 요소 위에 표시 */
`;

// 로딩 아이콘 스타일
const SpinnerIcon = styled.div`
  img {
    display: flex; /* 자식 요소를 중앙에 정렬 */
    justify-content: center;
    align-items: center;
    animation: ${spin} 2s infinite linear, ${jump} 0.5s infinite ease-in-out;
  }
`;
