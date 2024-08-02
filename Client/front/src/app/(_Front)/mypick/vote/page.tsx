"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { StarIcon } from "../../../components/icon/icon";
import Image from "next/image";
import artist from "../../../../../public/images/BaseImg.png";
import { MoneyIcon, VoteBox } from "../../../components/icon/icon";
import AxiosURL from "@/app/axios/url";
import { getRefreshToken, setToken, getToken } from "@/app/common/common";
import axios from "axios";

interface Artist {
  id: number;
  name: string;
  imageUrl: string;
}

interface Give {
  money: number;
  nut: number;
}

const Vote: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [artistData, setArtistData] = useState<Artist | null>(null);
  const [giveData, setGiveData] = useState<Give>({
    money: 1000,
    nut: 1000,
  });
  const [vote, setVote] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const getMyVote = async () => {
      try {
        if (getToken()) {
          const res = await axios.get(`${AxiosURL}/mypick/remainVote`, {
            headers: {
              Authorization: getToken(),
            },
          });
          setVote(res.data.remainVote);
        }
      } catch (error) {
        console.error("데이터를 받지 못했습니다", error);
      }
    };

    getMyVote();
  }, []);

  // 투표하기 기능
  const handleClickEvent = () => {
    if (artistData) {
      // artistData가 있는 경우에만 투표 가능
      alert(`${artistData.name}에게 투표가 완료되었습니다.`);

      // 서버에 투표 데이터 전송 예시 (실제로 필요한 로직에 맞게 수정 필요)
      fetch(`/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artistId: artistData.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("투표 결과:", data);
          // 투표 결과에 따른 추가적인 처리 가능
        })
        .catch((error) => {
          console.error("투표 중 오류 발생:", error);
          // 오류 처리 로직 추가
        });
    } else {
      alert("아티스트를 선택해주세요.");
    }
  };

  // -----------------------------------------------------------------------

  const handleSearchClick = async () => {
    try {
      const response = await fetch(`/api/search?query=${inputValue}`);
      const data = await response.json();

      if (data.results.length > 0) {
        setArtistData(data.results[0]);
      } else {
        alert("검색된 아티스트가 없습니다.");
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  return (
    <VoteContainer>
      <VoteSearch>
        <VoteInputMargin>
          <StarIcon />
          {/* 검색창 */}
          <StyledInput
            type="text"
            placeholder="나의 아티스트 찾기"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Search onClick={handleSearchClick}>검색</Search>
        </VoteInputMargin>
      </VoteSearch>
      {artistData ? (
        <VoteArtistContainer>
          <VoteImage>
            <Image
              src={artistData.imageUrl}
              alt={artistData.name}
              layout="fill"
              objectFit="cover"
            />
          </VoteImage>
          <VoteText>{artistData.name}</VoteText>
        </VoteArtistContainer>
      ) : (
        <VoteArtistContainer>
          <VoteImage>
            <Image src={artist} alt="artist" layout="fill" objectFit="cover" />
          </VoteImage>
          <VoteText>너의 아티스트에게 투표해봐!</VoteText>
        </VoteArtistContainer>
      )}
      <VoteButton onClick={handleClickEvent}>투표하기</VoteButton>
      <VoteGive>
        <VoteMoney>
          <VoteMoneyText>보유 투표권</VoteMoneyText>
          <VoteBoxData>
            <VoteBoxStyle>
              <VoteBox />
            </VoteBoxStyle>
            {vote}
          </VoteBoxData>
        </VoteMoney>
      </VoteGive>
    </VoteContainer>
  );
};
export default Vote;

// 투표하기 컨테이너
const VoteContainer = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

// 투표하기 검색창
const VoteSearch = styled.div`
  position: relative;
  border: 2px solid #eeeeee;
  border-radius: 12px;
  width: 50%;
  height: 50px;
  display: flex;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px #8dd9b9;
    border-color: transparent;
  }
`;

// 투표하기 인풋박스 내부 마진
const VoteInputMargin = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px;
`;

// 투표하기 인풋 박스
const StyledInput = styled.input`
  flex: 1;
  padding: 7px 7px 6px 7px;
  border: none;
  width: 300px;
  height: auto;
  line-height: 1.5;
  &:focus {
    outline: none;
  }
`;

// 투표하기 검색 버튼
const Search = styled.div`
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid rgba(90, 101, 119, 0.15);
  color: #ccc;
  cursor: pointer;

  &:hover {
    transform: scale(1.01);
    color: #0f0f0f;
    transition: 0.3s ease;
  }
`;

// VoteArtist 컴포넌트 스타일링
const VoteArtistContainer = styled.div`
  padding-right: calc(50% - 642px);
  padding-left: calc(50% - 642px);
  margin: 50px 0;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 500px;

  border: 2px solid #eeeeee;
  border-radius: 12px;
  padding: 50px;
`;

// 아티스트 이미지 컨테이너 스타일링
const VoteImage = styled.div`
  position: relative;
  width: 400px; // 원하는 크기로 설정
  height: 400px; // 원하는 크기로 설정
  border-radius: 50%;
  overflow: hidden;
  filter: grayscale(100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// "너의 아티스트에게 투표해봐!" 텍스트 스타일링
const VoteText = styled.div`
  font-size: 20px;
  margin-top: 50px;
`;

// 아티스트 투표 버튼
const VoteButton = styled.div`
  width: 20%;
  padding: 20px 0;
  margin: 0 0 50px 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid #1bd185;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: #16be78;
  }
`;

// 투표권, 넛츠 전체 요소를 묶는 컨테이너
const VoteGive = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  position: fixed;
  right: 100px;
  top: 196px;
  border: 2px solid #eeeeee;
  border-radius: 12px;
  padding: 25px 35px 15px 35px;

  &:hover {
    border: 2px solid #1bd185;
    cursor: pointer;
  }

  // 미디어 쿼리 추가
  @media (max-width: 1500px) {
    flex-direction: column;
    left: 90%;
    transform: translateX(-50%);
    top: auto;
    bottom: 420px;
    width: 15%;
    padding: 20px;
    gap: 10px;
  }
`;

// 투표권을 전체를 묶는 컨테이너
const VoteMoney = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
`;

// 투표권 텍스트랑 스타일박스를 묶는 컨테이너
const VoteBoxData = styled.div`
  display: flex;
  padding: 10px 0 0 0;
  align-items: center;
  gap: 5px;
`;

// 투표권 텍스트
const VoteMoneyText = styled.div``;

// 투표권을 꾸미는 스타일 박스
const VoteBoxStyle = styled.div`
  margin-bottom: 10px;
`;

// 넛츠 전체를 묶는 컨테이너
const VoteNut = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
`;

// 넛츠 텍스트랑 스타일박스를 묶는 컨테이너
const VoteNutData = styled.div`
  display: flex;
  padding: 8px 0 0 0;
  align-items: center;
  gap: 5px;
`;

// 넛츠 텍스트
const VoteNutText = styled.div``;

// 넛츠를 꾸미는 스타일 박스
const VoteNutStyle = styled.div`
  margin-top: 3px;
`;
