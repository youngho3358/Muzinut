import axios from "axios";
import AxiosURL from "../axios/url";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 로컬 스토리지에 있는  토큰을 가져오는 메서드
function getToken() {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null; // 토큰이 없으면 null 반환
}

function getRefreshToken() {
  return "Bearer " + localStorage.getItem("refreshToken");
}

// 토큰들을 셋팅하는 메서드
function setToken(token: string, refreshToken: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
}

const TokenInfo = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const refreshResponse = await axios.post(
          `${AxiosURL}/users/re-authenticate`,
          tokenData,
          {
            headers: {
              Authorization: getRefreshToken(),
            },
          }
        );

        setToken(refreshResponse.data.token, refreshResponse.data.refreshToken);
      } catch (refreshError) {
        // 리프레시 토큰이 만료된 경우
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
      }
    };

    fetchTokenData();
  }, []);

  return tokenData;
};

export { getToken, getRefreshToken, setToken, TokenInfo };
