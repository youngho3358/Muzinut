"use client";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import styles from "./MessageInputForm.module.css";

export default function MessageInputForm() {
  // 메시지 입력해야 전송 버튼 보이게 하려고
  const [isContent, setIsContent] = useState("");
  const onChangeContent: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setIsContent(e.target.value);
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsContent("hh"); //보내면 비워주기
  };
  return (
    <div className={styles.form__zone}>
      <form className={styles.form}>
        <textarea name="" id="" onChange={onChangeContent}></textarea>
        <button
          className={styles.submit__btn}
          type="submit"
          disabled={!isContent}
        >
          전송
        </button>
      </form>
    </div>
  );
}
