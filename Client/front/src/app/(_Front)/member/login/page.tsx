"use client";
import Link from "next/link";
import styles from "./Login.module.css";
import Image from "next/image";
import kakao from "@/../../public/social/kakao.png";
import instagram from "@/../../public/social/instagram.png";
import naver from "@/../../public/social/naver.png";
import google from "@/../../public/social/google.png";
import AuthForm from "@/app/components/loginFormAuth/AuthForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/components/UserContext";
import axios from "axios";
import { setToken } from "@/app/common/common";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    useremail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();
  const { user, setUser } = useUser(); // 로그인 시 UserContext(유저 정보)를 업데이트

  // 입력필드에 변화가 있을 때 발생하는 이벤트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 비밀번호에 스페이스(공백) 금지
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 입력 필드에서 스페이스바를 눌렀을 때
    if (e.key === " ") {
      e.preventDefault(); // 공백 금지
    }
  };

  const onClickLogin = async () => {
    // 입력값 검증 - 비어있는 경우
    if (!formData.useremail || !formData.password) {
      setError("모든 항목을 입력해주세요!!");
      return;
    }
    // 모든 입력값이 유효한 경우
    // setError("에러X 주석ㄱㄱ"); //에러 메시지 없음

    try {
      const response = await axios.post(
        `http://localhost:8080/users/authenticate`,
        {
          username: formData.useremail.trim(),
          password: formData.password.trim(),
        }
      );
      if (response.status === 200) {
        console.log("로그인 성공");
        console.log("ACCESS 토큰====", response.data.token);
        console.log("REFRESH 토큰====", response.data.refreshToken);
        // 서버로부터 받은 토큰과 사용자 정보를 localStorage에 저장
        setToken(response.data.token, response.data.refreshToken);

        // UserContext에 사용자 정보 설정
        setUser({
          password: formData.password,
          avatar: response.data.profileImg || "", // 서버가 제공하지 않는다면 빈 문자열로 설정하거나 다른 값을 사용
          nickname: response.data.nickname,
          useremail: formData.useremail,
        });

        console.log("사용자 이미지", response.data.profileImg);
        console.log("사용자 닉네임", response.data.nickname);

        router.push("/"); // 회원가입 성공 시 메인 페이지로 이동
      }
    } catch (error: unknown) {
      // axios 헬퍼 함수 - isAxiosError(error)를 사용하여 error가 axios 에러인지 확인하고,
      // error.response가 존재하는 경우에만 에러 처리
      if (axios.isAxiosError(error) && error.response) {
        console.log("서버로부터 받은 에러 데이터", error.response.data);
        console.log("서버로부터 받은 에러 상태코드", error.response.status);
        console.log("서버로부터 받은 에러 headers", error.response.headers);

        if (error.response.status === 401) {
          alert("일치하는 사용자 정보가 없습니다.");
          return;
        }
        if (error.response.status === 400) {
          setError("(3-100사이)글자를 입력해주세요");
          return;
        } else {
          alert("[error] 서버와 통신 오류 발생.");
        }
      } else {
        //axios 에러가 아닌 다른 예외가 발생한 경우
        alert("[error] 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className={styles.login__container}>
      <AuthForm
        title="로그인"
        actionText="회원가입"
        actionLink="/member/signup"
      >
        <div className={styles.form__container}>
          <ul>
            <li>
              <label htmlFor="useremail">
                아이디(이메일 주소)를 입력하세요
              </label>
              <input
                type="text"
                id="useremail"
                name="useremail"
                placeholder="아이디(이메일 주소)를 입력하세요"
                onChange={handleInputChange}
                required
              />
            </li>
            <li>
              <label htmlFor="password">비밀번호를 입력하세요</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                required
              />
            </li>
          </ul>

          <div className={styles.error__forgot}>
            {error && <div className={styles.error__msg}>{error}</div>}
            <div className={styles.forgot__link}>
              <Link href="/member/reset-password">비밀번호를 잊으셨나요?</Link>
            </div>
          </div>

          <div className={styles.login__btn}>
            <button type="button" onClick={onClickLogin}>
              로그인
            </button>
          </div>

          <div className={styles.social__login}>
            <div>SNS 계정으로 로그인</div>
            <div className={styles.social__btn}>
              <ul>
                <li>
                  <Link href="#">
                    <Image src={kakao} alt="카카오" width={60} height={60} />
                  </Link>
                  <span>카카오</span>
                </li>
                <li>
                  <Link href="#">
                    <Image
                      src={instagram}
                      alt="인스타그램"
                      width={60}
                      height={60}
                    />
                  </Link>
                  <span>인스타그램</span>
                </li>
                <li>
                  <Link href="#">
                    <Image src={naver} alt="네이버" width={60} height={60} />
                  </Link>
                  <span>네이버</span>
                </li>
                <li>
                  <Link href="#">
                    <Image src={google} alt="구글" width={65} height={65} />
                  </Link>
                  <span>구글</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AuthForm>
    </div>
  );
};
export default LoginPage;
