"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import album from "@/../../public/svgs/album_thumb.png";
import AlbumForm from "@/app/components/add-album/album";
import SongForm, { Song } from "@/app/components/add-album/song";
import StepForCheck from "@/app/components/add-album/check";
import SubmitModal from "@/app/components/add-album/submitModal";
import axios from "axios";

export default function AddAlbumModal() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [albumErrors, setAlbumErrors] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });
  const [songs, setSongs] = useState<Song[]>([]); // 곡 정보 배열 상태
  const [imageClick, setImageClick] = useState(false); // 이미지 클릭 시 imageClick 상태변경
  const [isHovered, setIsHovered] = useState(false); // 이미지 hover 여부를 나타내는 상태
  const [isChecked, setIsChecked] = useState(false); // isChecked 상태 추가
  const [showModal, setShowModal] = useState(false); // 체크박스 선택하고 제출 눌렀을 때 모달창
  const [albumImg, setAlbumImg] = useState<File | null>(null);

  useEffect(() => {
    // URL 업데이트
    window.history.pushState(null, "", `/add-album?step=${step + 1}`);
  }, [step]);

  // 다음 버튼 클릭 시 step 이동
  const isButtonClicked = () => {
    if (step === 0 && validateAlbumForm()) {
      setStep(step + 1);
    } else if (step === 1) {
      setStep(step + 1);
    }
  };
  // 이전 버튼 클릭 시 step 이동
  const isButtonClickedBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  //유효성 검증
  const validateAlbumForm = (): boolean => {
    let valid = true;
    const newErrors = { title: "", description: "" };
    if (!title) {
      newErrors.title = "앨범 이름을 입력해주세요!";
      valid = false;
    }
    if (!description) {
      newErrors.description = "앨범 소개를 입력해주세요!";
      valid = false;
    }
    setAlbumErrors(newErrors);
    return valid;
  };

  // 두 번쨰 form 의 상태
  const handleSongsChange = (updatedSongs: Song[]) => {
    console.log("업데이트된 곡 리스트:", updatedSongs);
    setSongs(updatedSongs); // 곡 정보 배열 상태 업데이트
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  // 제출하기 버튼 눌렸을 때
  const handleSubmit = () => {
    if (!isChecked) {
      alert("위 사실에 대해 모두 인지하고, 동의해 주세요.");
    } else {
      console.log("모달 열려야 함");
      setShowModal(true);
      sendToServer();
    }
  };
  // 모달 창 닫기(곡 수록하는)
  const closeModal = () => {
    setShowModal(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAlbumImg(e.target.files[0]);
    }
  };

  //서버로 보낼 데이터
  // 앨범 및 곡 데이터를 서버로 전송하는 함수
  const sendToServer = async () => {
    if (!validateAlbumForm()) {
      console.log("앨범 폼 데이터가 유효하지 않습니다.");
      return;
    }
    const albumData = {
      albumName: title,
      albumBio: description,
      songs: songs.map((song) => ({
        songName: song.songName,
        lyricist: song.lyricist,
        composer: song.composer,
        lyrics: song.lyrics,
        genres: song.genres,
        originFilename: song.originFilename,
      })),
    };

    const formData = new FormData();
    if (albumImg) {
      formData.append("albumImg", albumImg);
    }
    songs.forEach((song) => {
      console.log("songfile 붙이기!!!!!!!!!!!!!!!!");
      if (song.file) {
        formData.append("songFiles", song.file);
      }
    });

    // songs.forEach((song, index) => {
    //   if (song.file) {
    //     formData.append(`songfiles[${index}]`, song.file);
    //   }
    // });

    // JSON 데이터를 Blob으로 변환하여 FormData에 추가
    const albumDataBlob = new Blob([JSON.stringify(albumData)], {
      type: "application/json",
    });
    formData.append("albumData", albumDataBlob);
    // formData.append('albumData', JSON.stringify(albumData));

    try {
      const response = await axios.post(
        "http://localhost:8080/album/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            //나중에 이 부분 공통 컴포넌트화하기
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 200) {
        console.log("!!!!!!!앨범 데이터 전송 성공!!!!!!!");
        console.log("응답 데이터====", response.data);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("서버로부터 받은 에러 데이터", error.response.data);
        console.log("서버로부터 받은 에러 상태코드", error.response.status);
        console.log("서버로부터 받은 에러 headers", error.response.headers);

        if (error.response.status === 503) {
          alert("앨범 등록에 실패하였습니다.");
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
  // 보낼 데이터
  const dataSubmit = () => {
    console.log("보낼 Form Data:", { title, description });
  };

  const handleNextStep = () => {
    console.log("다음 버튼 클릭 - 현재 곡 리스트:", songs);
    // 다음 로직 수행
  };

  //============================================================================

  const isImageClicked = () => {
    setImageClick(true);
  };

  return (
    <>
      <div className={styles.Title}>앨범 만들기</div>

      <div className={styles.container}>
        <div className={styles.steps__container}>
          <div
            className={`${styles.step} ${step >= 0 ? styles.selected : ""} ${
              step > 0 ? styles.completed : ""
            }`}
          >
            <span className={styles.steps__index}>1</span>
            <div className={styles.steps__contents}>
              <span className={styles.steps__label}>단계 1</span>
              <span className={styles.steps__description}>앨범 업로드하기</span>
            </div>
          </div>
          <div
            className={`${styles.step} ${step >= 1 ? styles.selected : ""} ${
              step > 1 ? styles.completed : ""
            }`}
          >
            <span className={styles.steps__index}>2</span>
            <div className={styles.steps__contents}>
              <span className={styles.steps__label}>단계 2</span>
              <span className={styles.steps__description}>
                원하는 음악 추가
                <br />
                (최대 10곡)
              </span>
            </div>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.selected : ""}`}>
            <span className={styles.steps__index}>3</span>
            <div className={styles.steps__contents}>
              <span className={styles.steps__label}>단계 3</span>
              <span className={styles.steps__description}>제출 완료</span>
            </div>
          </div>
        </div>

        {/* ______________ FORM 부분 ______________ */}

        <div className={styles.album__container}>
          {step === 0 && (
            <div
              className={styles.img__container}
              onClick={isImageClicked}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {!imageClick && (
                <Image src={album} alt="album" width={530} height={530} />
              )}

              {isHovered && !imageClick && (
                <div className={styles.image__over__text}>
                  <span>이미지를 클릭해서 Form을 입력해보세요!</span>
                </div>
              )}
              {imageClick && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              )}
            </div>
          )}

          {step === 0 && imageClick && (
            <div className={styles.form__container}>
              <AlbumForm
                title={title}
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
                validateForm={validateAlbumForm}
                errors={albumErrors}
              />
            </div>
          )}

          {step === 1 && (
            <div className={styles.form__container}>
              <SongForm onSongsChange={handleSongsChange} />
            </div>
          )}

          {step === 2 && (
            <div className={styles.form__container}>
              <StepForCheck title={title} songs={songs} />
              <label className={isChecked ? "" : styles.checkboxError}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className={styles.agree}>
                  위 사실에 대해 모두 인지하였고 동의합니다.
                </span>
              </label>
            </div>
          )}

          <div className={styles.bottom__container}>
            <div className={styles.btn__container}>
              {step === 0 && !imageClick && (
                <div className={styles.album__descrption}>
                  * 앨범 기본 이미지 입니다 * <br />
                  이미지를 선택하지 않을 시, 다음 이미지로 제공됩니다.
                </div>
              )}
              {step > 0 && (
                <button
                  onClick={isButtonClickedBack}
                  className={styles.prev__btn}
                >
                  이전 단계
                </button>
              )}
              {(step === 1 || (step === 0 && imageClick)) && (
                <button
                  onClick={() => {
                    isButtonClicked();
                    dataSubmit();
                    handleNextStep();
                  }}
                  className={styles.next__btn}
                >
                  다음 단계
                </button>
              )}
              {step === 2 && (
                <button
                  onClick={() => {
                    handleSubmit();
                  }}
                  className={`${styles.submit__btn} ${
                    isChecked ? styles.active : ""
                  }`}
                >
                  생성하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubmitModal show={showModal} handleClose={closeModal}>
        <h2>앨범을 생성했습니다!</h2>
      </SubmitModal>
    </>
  );
}
