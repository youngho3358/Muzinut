"use client";
import styles from "./ResetPwd.module.css";
import AuthForm from "@/app/components/loginFormAuth/AuthForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ResetPwdPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    useremail: "",
    certificationCode: "",
    password: "",
    passwordRe: "",
  });

  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number | null>(null);
  const [buttonText, setButtonText] = useState("인증하기");

  // 입력필드에 변화가 있을 때 발생하는 이벤트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value, //name: input의 name/value: 입력한 값
    }));
  };
  // 비밀번호에 스페이스(공백) 금지
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 입력 필드에서 스페이스바를 눌렀을 때
    if (e.key === " ") {
      e.preventDefault(); // 공백 금지
    }
  };

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

  // 가입한 이메일로 인증번호 보냄(post)
  const handleEmailForFindPwd = async () => {
    const inputValue = document.getElementById("useremail") as HTMLInputElement;

    if (inputValue.value.trim() === "") {
      alert("이메일을 입력해주세요!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/users/find-password`,
        {
          username: formData.useremail.trim(), // 보낼 데이터
        }
      );
      // 성공적으로 응답을 받았을 때 처리
      if (response.status === 200) {
        alert("가입하신 메일로 인증번호를 보냈습니다..");
      }
      setButtonText("재발송");
      setTimer(300); // 5분 타이머 시작
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("서버로부터 받은 에러 데이터", error.response.data);
        console.log("서버로부터 받은 에러 상태코드", error.response.status);
        console.log("서버로부터 받은 에러 headers", error.response.headers);

        if (error.response.status === 403) {
          alert("가입된 회원이 아닙니다. 회원가입을 해주세요.");
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

  //비밀번호 초기화버튼 눌렀을 때 -> 서버로 보낼 부분(put)
  const onClickModifyPwd = async () => {
    // 입력값 검증 - 비어있는 경우
    if (
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
      const response = await axios.put(
        "http://localhost:8080/users/find-password",
        {
          username: formData.useremail.trim(),
          password: formData.password.trim(),
          authNum: formData.certificationCode.trim(),
        }
      );
      //성공
      if (response.status === 200) {
        alert("비밀번호가 초기화되었습니다. 로그인을 해주세요");
        router.push("/member/login");
      } else {
        // response.status !== 200
        console.error("초기화 실패");
        setError("비밀번호 초기화에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: unknown) {
      // axios 헬퍼 함수 - isAxiosError(error)를 사용하여 error가 axios 에러인지 확인하고,
      // error.response가 존재하는 경우에만 에러 처리
      if (axios.isAxiosError(error) && error.response) {
        console.log("서버로부터 받은 에러 데이터", error.response.data);
        console.log("서버로부터 받은 에러 상태코드", error.response.status);
        console.log("서버로부터 받은 에러 headers", error.response.headers);

        if (error.response.status === 400) {
          alert("인증번호가 일치하지 않습니다.");
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
    <div className={styles.reset__container}>
      <AuthForm
        title="비밀번호 변경하기"
        actionText="로그인"
        actionLink="/member/login"
      >
        <div className={styles.form__container}>
          <ul>
            <li>
              <label htmlFor="userId"> 이메일 인증</label>
              <div className={styles.input__wrapper}>
                <input
                  type="text"
                  id="useremail"
                  name="useremail"
                  placeholder="아이디를 입력하세요(이메일 주소)- 중복체크 --발송/재발송"
                  onChange={handleInputChange}
                  required
                />
                <button type="button" onClick={() => handleEmailForFindPwd()}>
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
          <div className={styles.pwd__modify__btn} onClick={onClickModifyPwd}>
            <button type="button">비밀번호 변경하기</button>
          </div>
        </div>
      </AuthForm>
    </div>
  );
};

export default ResetPwdPage;
