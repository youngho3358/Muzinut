import { ChangeEvent, useRef } from "react";
import styles from "./css/album.module.css";
import uploadBtn from "@/../../public/svgs/add_photo.svg";
import Image from "next/image";

interface AlbumProps {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (artist: string) => void;
  validateForm: () => boolean; // 유효성 검증 함수 prop 추가
  errors: { title: string; description: string }; //에러 메시지 상태 추가
}

const AlbumForm: React.FC<AlbumProps> = ({
  title,
  description,
  setTitle,
  setDescription,
  validateForm,
  errors,
}) => {
  //useRef로 태그 상태 저장
  const fileRef = useRef<HTMLInputElement>(null);

  const onClickImage = (): void => {
    fileRef.current?.click();
    console.log("클릭됨!!!!!!!");
  };
  const onChangeFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("선택된 파일:", file);
    }

    /*검증 로직
        !isValid => false로 오면 여기서 끝냄.
        !isValid => true로 오면 다음 로직 실행
    */
    const isValid = checkValidationFile(file);
    if (!isValid) return;

    // !isValid => true 인 경우
    //  이후에 사진 결과를 화면에 보여주는 로직 짜야 함.
  };

  return (
    <>
      <div className={styles.form__container}>
        <form>
          <div
            className={styles.picture__upload__btn__new}
            onClick={onClickImage}
          >
            <Image src={uploadBtn} alt="album" width={60} height={60} />
          </div>
          {/* 앨범 이름 */}
          <div className={styles.title}>
            <label>
              앨범 이름
              <div>
                <input
                  type="text"
                  value={title}
                  className={styles.title__label}
                  placeholder="앨범 이름을 입력해주세요"
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={validateForm} // 유효성 검증 함수 호출
                  // required
                />
              </div>
            </label>
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          {/* 앨범 소개 */}
          <div className={styles.description}>
            <label>
              앨범 소개
              <div>
                <textarea
                  typeof="text"
                  className={styles.description__label}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={validateForm} // 유효성 검증 함수 호출
                  // required
                />
              </div>
            </label>
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
          <div className={styles.picture}>
            {/* <span>앨범 사진</span> */}

            <div className={styles.picture__upload__btn}>
              <input
                type="file"
                ref={fileRef}
                onChange={onChangeFile}
                accept="image/jpeg,image/png"
              ></input>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

//업로드 할 이미지 파일 검증 로직
const checkValidationFile = (file?: File): boolean => {
  // 선택된 파일이 없을 때
  if (typeof file === "undefined") {
    alert("선택된 이미지 파일이 없습니다!!");
    return false;
  }
  // 이미지 파일 용량 검증 (MB = 1024*1024)
  if (file.size > 15 * 1024 * 1024) {
    alert("파일 용량이 너무 큽니다. (제한: 5MB)");
    return false;
  }
  // 이미지 파일 형식 검증
  if (!file.type.includes("png") && !file.type.includes("jpeg")) {
    alert("jpeg 또는 png 파일만 업로드 가능합니다!!");
    return false;
  }
  return true;
};

export default AlbumForm;
