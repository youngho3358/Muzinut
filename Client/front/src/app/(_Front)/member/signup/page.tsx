"use client";
// SignUpPage.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./Signup.module.css";
import AuthForm from "@/app/components/loginFormAuth/AuthForm";
import kakao from "@/../../public/social/kakao.png";
import instagram from "@/../../public/social/instagram.png";
import naver from "@/../../public/social/naver.png";
import google from "@/../../public/social/google.png";
import axios from "axios";

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    useremail: "",
    certificationCode: "",
    password: "",
    passwordRe: "",
  });
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number | null>(null);
  const [buttonText, setButtonText] = useState("인증하기");
  // const [authCode] = useState("123456"); // 하드코딩된 인증 코드

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer !== null) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
      }, 1000);
    }
    if (timer === 0) {
      setTimer(null);
    }
    return () => clearInterval(interval);
  }, [timer]);

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

  // 닉네임 중복 확인
  const handleUserNameCheckDuplicate = async () => {
    const inputValue = document.getElementById("nickname") as HTMLInputElement;
    //입력 값이 null 이면
    if (inputValue.value.trim() === "") {
      alert("닉네임을 입력해주세요!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/users/nickname-check`,
        {
          nickname: formData.nickname.trim(), // 보낼 데이터
        }
      );
      // 성공적으로 응답을 받았을 때 처리
      if (response.status === 200) {
        alert("사용 가능한 닉네임입니다.");
      }
    } catch (error: unknown) {
      // axios 헬퍼 함수 - isAxiosError(error)를 사용하여 error가 axios 에러인지 확인하고,
      // error.response가 존재하는 경우에만 에러 처리
      if (axios.isAxiosError(error) && error.response) {
        console.log("서버로부터 받은 에러 데이터", error.response.data);
        console.log("서버로부터 받은 에러 상태코드", error.response.status);
        console.log("서버로부터 받은 에러 headers", error.response.headers);

        if (error.response.status === 409) {
          alert("사용 중인 닉네임입니다.");
          return;
        }
        if (error.response.status === 400) {
          alert("값이 입력되지 않았습니다. 닉네임을 입력해주세요.");
          return;
        } else {
          alert("서버와의 통신오류. 다시 시도해주세요.");
        }
      } else {
        //axios 에러가 아닌 다른 예외가 발생한 경우
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 이메일 중복 확인
  const handleEmailCheckDuplicate = async () => {
    const inputValue = document.getElementById("useremail") as HTMLInputElement;
    //입력 값이 null 이면
    if (inputValue.value.trim() === "") {
      alert("이메일을 입력해주세요!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/mail/send`, {
        username: formData.useremail.trim(), // 보낼 데이터
      });
      // 성공
      if (response.status === 200) {
        alert("사용 가능한 이메일입니다. 인증번호를 입력해주세요!");
      }
      setButtonText("재발송");
      setTimer(300); // 5분 타이머 시작
    } catch (error: unknown) {
      // axios 헬퍼 함수 - isAxiosError(error)를 사용하여
      // error가 axios 에러인지 확인하고,
      // error.response가 존재하는 경우에만 에러 처리
      if (axios.isAxiosError(error) && error.response) {
        console.log("서버로부터 받은 에러 데이터", error.response.data);
        console.log("서버로부터 받은 에러 상태코드", error.response.status);
        console.log("서버로부터 받은 에러 headers", error.response.headers);

        if (error.response.status === 409) {
          alert("사용 중인 이메일입니다.");
          return;
        }
        if (error.response.status === 400) {
          alert("정확한 이메일 주소를 입력해주세요.");
          return;
        } else {
          alert("[error]서버와 통신 오류 발생.");
        }
      } else {
        //axios 에러가 아닌 다른 예외가 발생한 경우
        alert("[error] 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  //회원가입 버튼 눌렀을 때
  const onCLickSingUp = async () => {
    // 입력값 검증 - 비어있는 경우
    if (
      !formData.nickname ||
      !formData.useremail ||
      !formData.certificationCode ||
      !formData.password ||
      !formData.passwordRe
    ) {
      setError("모든 항목을 입력해주세요!!");
      return;
    }

    // 비밀번호 확인 로직
    if (formData.password !== formData.passwordRe) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 모든 입력값이 유효한 경우
    setError("에러X 주석ㄱㄱ"); //에러 메시지 없음

    // 서버로 회원가입 정보 보내기!!
    try {
      const response = await axios.post("http://localhost:8080/users/join", {
        nickname: formData.nickname.trim(),
        username: formData.useremail.trim(),
        authNum: formData.certificationCode.trim(),
        password: formData.password.trim(),
      });

      // 성공
      if (response.status === 200) {
        alert("회원가입을 성공했습니다. 로그인을 해주세요");
        router.push("/member/login"); // 회원가입 성공 시 로그인 페이지로 이동
      } else {
        // response.status !== 200
        console.error("회원가입 실패");
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: unknown) {
      // axios 헬퍼 함수 - isAxiosError(error)를 사용하여
      // error가 axios 에러인지 확인하고,
      // error.response가 존재하는 경우에만 에러 처리
      if (axios.isAxiosError(error) && error.response) {
        console.log("서버로부터 받은 에러 데이터", error.response.data);
        console.log("서버로부터 받은 에러 상태코드", error.response.status);
        console.log("서버로부터 받은 에러 headers", error.response.headers);

        if (error.response.status === 409) {
          alert("이미 가입되어 있는 유저입니다.");
          return;
        }
        if (error.response.status === 400) {
          setError("인증 번호가 일치하지 않습니다.");
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
      <AuthForm title="회원가입" actionText="로그인" actionLink="/member/login">
        <div className={styles.form__container}>
          <ul>
            <li>
              <label htmlFor="nickname"> 닉네임을 입력하세요</label>
              <div className={styles.input__wrapper}>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="닉네임을 입력하세요 -중복체크"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  required
                  className={formData.nickname ? "" : styles.inputError}
                  // ref={usernameRef}
                />
                <button
                  type="button"
                  onClick={() => handleUserNameCheckDuplicate()}
                >
                  중복확인
                </button>
              </div>
            </li>
            <li>
              <label htmlFor="useremail"> 이메일 인증</label>
              <div className={styles.input__wrapper}>
                <input
                  type="text"
                  id="useremail"
                  name="useremail"
                  value={formData.useremail}
                  placeholder="이메일을 입력해주세요."
                  onChange={handleInputChange}
                  required
                  className={formData.useremail ? "" : styles.inputError}
                  // ref={userIdRef}
                />
                {/* 인증하기 -> 클릭하면 "재발송" 으로 바뀜 */}
                <button
                  type="button"
                  onClick={() => handleEmailCheckDuplicate()}
                >
                  {buttonText}
                </button>
              </div>
            </li>
            <li>
              <div className={styles.input__wrapper}>
                <input
                  type="text"
                  id="certificationCode"
                  name="certificationCode"
                  placeholder="인증번호를 입력하세요 - 발송 눌러야 active 유효시간 5분"
                  value={formData.certificationCode}
                  onChange={handleInputChange}
                  required
                  className={
                    formData.certificationCode ? "" : styles.inputError
                  }
                />
                <div className={styles.timer__box}>
                  {timer !== null && (
                    <span>
                      {Math.floor(timer / 60)}:{timer % 60}
                    </span>
                  )}
                </div>
              </div>
            </li>
            <li>
              <label htmlFor="password">비밀번호 입력</label>
              <div className={styles.input__wrapper}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  required
                  className={formData.password ? "" : styles.inputError}
                />
              </div>
            </li>
            <li>
              <div className={styles.input__wrapper}>
                <input
                  type="password"
                  id="passwordRe"
                  name="passwordRe"
                  placeholder="비밀번호 확인"
                  value={formData.passwordRe}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  required
                  className={formData.passwordRe ? "" : styles.inputError}
                />
              </div>
            </li>
          </ul>
          {error && <div className={styles.error__msg}>{error}</div>}
          <div className={styles.signup__btn}>
            <button type="button" onClick={onCLickSingUp}>
              회원 가입
            </button>
          </div>
          <div className={styles.social__signup}>
            <div>SNS 계정으로 회원가입</div>
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

export default SignUpPage;
