"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MusicDataItem } from "./main/MusicList";
import { ArtistDataItem } from "./chart/ArtistList";

// ======= BestCommunity 부분 =======
interface UseCommunityFetchDataProps {
  url: string; // api의 url
  key: string; // api 응답에서 데이터를 가리키는 키
}
interface CommunityListItem {
  boardId: number;
  title: string;
  nickname: string;
  view: number;
  dtype: string;
}

function useCommunityFetchData({ url, key }: UseCommunityFetchDataProps) {
  const [data, setData] = useState<CommunityListItem[] | null>(null); //api에서 가져온 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // console.log("use훅에서 전달할 데이터(초기: 빈 배열)", data)

  // useEffect 훅 내에세 데이터를 비동기로 요청
  // ---> 컴포넌트가 렌더링된 이후에 데이터가 로드됨!!
  useEffect(() => {
    const fetchData = async () => {
      console.log("비동기 데이터 호출 시작!(useEffect 불림)");
      setLoading(true); // 데이터 요청 시작 시 loading 상태를 true로 설정
      try {
        const response = await axios.get(url);
        console.log("응답 데이터(JSON파싱 전)", response);

        // JSON으로 변환된 데이터를 response.data에 axios가 자동 저장해줌
        const serverResponse = response.data;
        console.log("응답 데이터(JSON파싱 후)", serverResponse);

        // const resultData = serverResponse.hotBoards;
        const resultData = serverResponse[key];
        console.log(
          "resultData(배열로 데이터 저장 후 setData에 등록): ",
          resultData
        );

        // 데이터를 상태에 저장
        setData(resultData);
        console.log("use훅에서 전달할 데이터(배열)", data);
      } catch (error: unknown) {
        // axios 헬퍼 함수 - isAxiosError(error)를 사용하여 error가 axios 에러인지 확인하고,
        // error.response가 존재하는 경우에만 에러 처리
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 204) {
            console.log("데이터가 존재하지 않습니다.");
            return;
          } else {
            alert("[error] 서버와 통신 오류 발생.");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData(); // 비동기 함수 호출
  }, [url, key]); // 컴포넌트가 마운트 or key or url 변경될 때마다 fetchData 호출
  return { data, loading, error };
}

// ======= BasicCommunity 부분 =======
interface useNewCommunityFetchDataProps {
  url: string; // api의 url
  keys: {
    // 응답 객체의 키
    FreeBoard: string;
    RecruitBoard: string;
  };
}
export interface FreeBoardDto {
  freeBoardId: number;
  title: string;
  nickname: string;
}
export interface RecruitBoardDto {
  recruitBoardId: number;
  title: string;
  nickname: string;
}

function useNewCommunityFetchData({
  url,
  keys,
}: useNewCommunityFetchDataProps) {
  const [freeBoardData, setFreeBoardData] = useState<FreeBoardDto[] | null>(
    null
  );
  const [recruitBoardData, setRecruitBoardData] = useState<
    RecruitBoardDto[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("비동기 데이터 호출 시작!(useEffect 불림)");
      setLoading(true);
      try {
        const response = await axios.get(url);
        console.log("응답 데이터(JSON파싱 전)", response);

        const serverResponse = response.data.newBoard;
        console.log("응답 데이터(JSON파싱 후)", serverResponse);

        const freeBoardData = serverResponse[keys.FreeBoard];
        const recruitBoardData = serverResponse[keys.RecruitBoard];
        // const freeBoardData = serverResponse.freeBoardDtos;
        // const recruitBoardData = serverResponse.recruitBoardDtos;
        console.log("freeBoardData!!!: ", freeBoardData);
        console.log("recruitBoardData!!!: ", recruitBoardData);

        setFreeBoardData(freeBoardData);
        setRecruitBoardData(recruitBoardData);
      } catch (error: unknown) {
        // axios 헬퍼 함수 - isAxiosError(error)를 사용하여 error가 axios 에러인지 확인하고,
        // error.response가 존재하는 경우에만 에러 처리
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 204) {
            console.log("데이터가 존재하지 않습니다.");
            return;
          } else {
            alert("[error] 서버와 통신 오류 발생.");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, keys.FreeBoard, keys.RecruitBoard]); // 의존성 배열에서 keys.free, keys.recruit 사용

  return { freeBoardData, recruitBoardData, loading, error };
}

// ======= 음악 데이터 받는 부분 =======
interface useMusicFetchDataProps {
  url: string; // api의 url
  key: string; // api 응답에서 데이터를 가리키는 키
}
function useMusicFetchData({ url, key }: useMusicFetchDataProps) {
  const [data, setData] = useState<MusicDataItem[] | null>(null); //api에서 가져온 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // console.log("use훅에서 전달할 데이터(초기: 빈 배열)", data)

  // useEffect 훅 내에세 데이터를 비동기로 요청
  // ---> 컴포넌트가 렌더링된 이후에 데이터가 로드된다.
  useEffect(() => {
    const fetchData = async () => {
      console.log("비동기 데이터 호출 시작!(useEffect 불림)");
      setLoading(true); // 데이터 요청 시작 시 loading 상태를 true로 설정
      try {
        const response = await axios.get(url);
        console.log("응답 데이터(JSON파싱 전)", response);

        // JSON으로 변환된 데이터를 response.data에 axios가 자동 저장해줌
        const serverResponse = response.data;
        console.log("응답 데이터(JSON파싱 후)", serverResponse);

        // const resultData = serverResponse.hotBoards;
        const resultData = serverResponse[key];
        console.log(
          "resultData(배열로 데이터 저장 후 setData에 등록): ",
          resultData
        );

        // 데이터를 상태에 저장
        setData(resultData);
        console.log("use훅에서 전달할 데이터(배열)", data);
      } catch (error) {
        console.error("fetching ERROR!!:", error);

        setError(error as Error);
      } finally {
        //비동기 작업이 완료된 후 항상 실행되는 코드
        setLoading(false);
      }
    };

    fetchData(); // 비동기 함수 호출
  }, [url, key]); // url 변경될 때마다 useEffect 호출
  return { data, loading, error };
}

// ======= 아티스트 데이터 받는 부분 =======
interface useArtistFetchDataProps {
  url: string; // api의 url
  key: string; // api 응답에서 데이터를 가리키는 키
}
function useArtistFetchData({ url, key }: useArtistFetchDataProps) {
  const [data, setData] = useState<ArtistDataItem[] | null>(null); //api에서 가져온 데이터
  // const [data, setData] = useState<ArtistDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("비동기 데이터 호출 시작!(useEffect 불림)");
      setLoading(true); // 데이터 요청 시작 시 loading 상태를 true로 설정
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "", // 토큰이 없으면 빈 문자열로 설정
          },
        });
        console.log("응답 데이터(JSON파싱 전)", response);

        // JSON으로 변환된 데이터를 response.data에 axios가 자동 저장해줌
        const serverResponse = response.data;
        console.log("응답 데이터(JSON파싱 후)", serverResponse);

        // const resultData = serverResponse.hotBoards;
        const resultData = serverResponse[key];
        console.log(
          "resultData(배열로 데이터 저장 후 setData에 등록): ",
          resultData
        );
        // 데이터를 상태에 저장
        setData(resultData);
        console.log("use훅에서 전달할 데이터(배열)", data);
      } catch (error: unknown) {
        // axios 헬퍼 함수 - isAxiosError(error)를 사용하여 error가 axios 에러인지 확인하고,
        // error.response가 존재하는 경우에만 에러 처리
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 204) {
            console.log("데이터가 존재하지 않습니다.");
            return;
          } else {
            alert("[error] 서버와 통신 오류 발생.");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, key]);

  return { data, loading, error };
}

export {
  useArtistFetchData,
  useCommunityFetchData,
  useMusicFetchData,
  useNewCommunityFetchData,
};
