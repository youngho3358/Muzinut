"use client";
import Image from "next/image";
import cd from "@/../../public/svgs/cd.svg";
import styles from "./css/song.module.css";
import { useState } from "react";
import closeBtn from "@/../../public/svgs/close_btn.svg";
import deleteBtn from "@/../../public/svgs/delete_btn.svg";
import musicIcon from "@/../../public/svgs/music_note.svg";

// modal에 들어갈 내용
export type Song = {
  songName: string;
  lyricist: string; //작사가
  composer: string; //작곡가
  lyrics: string;
  genres: string[]; //최대 3개까지
  originFilename: string;
  file: File | null;
};
interface SongFormProps {
  onSongsChange: (songs: Song[]) => void; // 콜백 함수 prop 추가
}

//________ SongForm Component ________
export default function SongForm({ onSongsChange }: SongFormProps) {
  // 모달 상태 변경 (초기에는 안 보임 클릭했을 때만 나오게)
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    if (songs.length >= 10) {
      alert("최대 10개의 곡만 추가할 수 있습니다.");
      return;
    }
    setShowModal(true);
  };

  // 모달 창 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  const [songName, setSongName] = useState("");
  const [lyricist, setLyricist] = useState("");
  const [composer, setComposer] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [originFilename, setOriginFilename] = useState("");
  // 백엔드로 정보 보낼 때 --- 각 곡의 정보를 배열로 감싸서
  const [songs, setSongs] = useState<Song[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // 사용자가 선택할 수 있는 장르들
  const genreListView = [
    "케이팝",
    "발라드",
    "알앤비",
    "트로트",
    "기타",
    "팝송",
    "인디",
    "힙합",
    "버튜버",
  ];
  const genreMap: { [key: string]: string } = {
    케이팝: "KPOP",
    발라드: "BALLAD",
    알앤비: "RNB",
    트로트: "TROT",
    기타: "ETC",
    팝송: "POP",
    인디: "INDIE",
    힙합: "HIPHOP",
    버튜버: "VIRTUBER",
  };

  /* 장르 개수 제한 3개
  1. 장르 개수가 3개인지 검증
  2. 취소하고 다른 장르 선택할 수 있어야 함.
  */
  const limitGenreSelect = (genre: string) => {
    // -----------장르 상태 업데이트
    setGenres((arrayGenres) => {
      /* 선택한 장르가 현재 배열에 있는지 확인하고,
       배열에 있는 장르와 다르면(true) arrayGenres에 추가(filter로 반환됨), 
       같다면(false) 삭제 */
      const translatedGenre = genreMap[genre];
      if (!translatedGenre) return arrayGenres;

      if (arrayGenres.includes(translatedGenre)) {
        console.log("장르 다시 추가할거임.");
        return arrayGenres.filter((g) => g !== translatedGenre);
      }
      // 선택된 장르가 3개 미만이면 새로운 장르 추가
      if (arrayGenres.length < 3) {
        console.log("첫 번째 if 문 통과! 두 번 째 if문 시작");
        return [...arrayGenres, translatedGenre];
      } else {
        alert("장르는 3가지 이상 설정할 수 없습니다.")
        return arrayGenres;
      }
    });
  };

  const onChangeMP3 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      console.log("선택된 파일:", selectedFile);

      // 파일 이름 중복 검사
      const isDuplicate = songs.some(
        (song) => song.originFilename === selectedFile.name
      );
      if (isDuplicate) {
        alert("이미 같은 파일 이름을 가진 곡이 존재합니다.");

        //파일 입력 상태 초기화
        setFile(null);
        setOriginFilename("");
        event.target.value = ""; // 파일 선택 input 초기화
        return;
      }

      // 파일 유효성 검사 -> isValid = false>true
      const isValidFile = checkValidationFile(selectedFile);

      if (isValidFile) {
        setFile(selectedFile);
        setOriginFilename(selectedFile.name); // 파일 이름 추가
        console.log("*********************파일 이름", selectedFile.name); // 파일 이름 추가
        return;
      }
    }
    // !isValid => true 인 경우
    // 제출 버튼 활성화 시키기!!
  };

  //업로드 할 음원 파일 검증 로직
  const checkValidationFile = (file?: File): boolean => {
    // 선택된 파일이 없을 때
    if (typeof file === "undefined") {
      alert("선택된 음원 파일이 없습니다!!");
      setFile(null);
      setOriginFilename("");
      return false;
    }
    // 음원 파일 용량 검증 (MB = 1024*1024)
    if (file.size > 15 * 1024 * 1024) {
      alert("파일 용량이 너무 큽니다. (제한: 1MB)");
      setFile(null);
      setOriginFilename("");
      return false;
    }
    // 음원 파일 형식 검증 -  MP3 파일만 허용
    //  if (!file.type.includes("audio/mp3")) {
    //   alert("MP3 파일만 업로드 가능합니다.");
    //   return false;
    // }
    return true;
  };

  /* 제출 버튼 누르면
      ------------> 백엔드로 정보 보내기
      */
  const onSubmitBtn = (event: React.FormEvent) => {
    event.preventDefault();
    if (songs.length >= 10) {
      alert("최대 10개의 곡만 추가할 수 있습니다.");
      return;
    }

    const sendSong: Song = {
      songName,
      lyricist,
      composer,
      lyrics,
      genres,
      originFilename,
      file,
    };
    const updatedSongs = [...songs, sendSong];
    // setSongs([...songs, sendSong]);
    setSongs(updatedSongs);

    console.log("곡 업데이트 됨");
    onSongsChange(updatedSongs); // 부모 컴포넌트로 데이터 전달
    console.log("부모(page.tsx)로 전달됨");
    console.log("요소 초기화 전");

    //전달 후 값들 초기화
    setSongName("");
    setLyricist("");
    setComposer("");
    setLyrics("");
    setGenres([]);
    setOriginFilename("");
    setFile(null);
    closeModal();

    console.log("요소 초기화 후");
  };

  // 삭제 버튼 클릭 시 songs 배열에서 삭제
  const onClickSongDeleteBtn = (index: number) => {
    console.log("들어온 index 번호는 ======", index);
    console.log(songs);
    // filter를 사용하여 새로운 배열로 반환
    const updatedSongs = songs.filter((song, idx) => idx !== index);
    setSongs(updatedSongs);
    console.log("업데이트 된 송 리스트", updatedSongs);

    onSongsChange(updatedSongs); // 부모 컴포넌트로 데이터 전달
  };

  /* ___________________________________________________________________________ */

  return (
    <div className={styles.songForm__container}>
      <div className={styles.add__song} onClick={openModal}>
        <div>
          <h2>수록 곡 추가하기</h2>
        </div>
        <div>
          <span className={styles.arrow}>☞</span>{" "}
        </div>
        <Image src={cd} alt="album" width={80} height={80} />
      </div>
      {/* ///////////////////////////////////////////////////////// */}
      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modal__container}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 제목 부분  (새로고침 제목 닫기 버튼) */}
            <div className={styles.modal__container__top}>
              <div className={styles.modal__close__btn} onClick={closeModal}>
                {/* &times; */}
                {/* <Image src={closeBtn} alt="album" width={30} height={30} /> */}
              </div>
              <div>
                <h3>음원 추가하기</h3>
              </div>
              <div className={styles.modal__close__btn} onClick={closeModal}>
                {/* &times; */}
                {/* <Image src={closeBtn} alt="album" width={30} height={30} /> */}
              </div>
            </div>

            {/* __________ form 모달 시작 __________ */}
            <div className={styles.modal__container__contents}>
              <form onSubmit={onSubmitBtn}>
                <div className={styles.left__and__right}>
                  <div className={styles.left}>
                    <div className={styles.form__label}>
                      <label>
                        이름
                        <input
                          type="text"
                          value={songName}
                          onChange={(e) => setSongName(e.target.value)}
                          className={styles.text__input}
                          required
                        />
                      </label>
                    </div>

                    {/* 구분선 추가 */}
                    <div className={styles.divider__row}></div>

                    <div className={styles.together}>
                      <div className={styles.form__label}>
                        <label>
                          작사가
                          <input
                            type="text"
                            value={lyricist}
                            onChange={(e) => setLyricist(e.target.value)}
                            className={styles.text__input}
                            required
                          />
                        </label>
                      </div>
                      <div className={styles.form__label}>
                        <label>
                          작곡가
                          <input
                            type="text"
                            value={composer}
                            onChange={(e) => setComposer(e.target.value)}
                            className={styles.text__input}
                            required
                          />
                        </label>
                      </div>
                    </div>

                    {/* 구분선 추가 */}
                    <div className={styles.divider__row}></div>

                    <div className={styles.form__label}>
                      <label>
                        장르
                        <div>
                          (최대 <strong>3개 까지</strong>선택 가능 합니다!!)
                        </div>
                      </label>

                      <div className={styles.genre__btn}>
                        {genreListView.map((genre) => (
                          <button
                            type="button"
                            key={genre}
                            className={`${
                              genres.includes(genre)
                                ? styles.selected__genre
                                : ""
                            }
                               ${
                                 genre === "기타" && !genres.includes(genre)
                                   ? styles.genre__etc__btn
                                   : ""
                               }

                                ${
                                  genre === "기타" && genres.includes(genre)
                                    ? styles.tail
                                    : ""
                                }`}
                            onClick={() => limitGenreSelect(genre)}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 구분선 추가 */}
                  <div className={styles.divider}></div>

                  <div className={styles.right}>
                    <div className={styles.form__label}>
                      <label>
                        MP3 파일
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={onChangeMP3}
                          className={styles.file__input}
                          required
                        />
                      </label>
                    </div>
                    <div className={styles.form__label}>
                      <label>
                        가사
                        <textarea
                          value={lyrics}
                          onChange={(e) => setLyrics(e.target.value)}
                          className={styles.textarea__input}
                          required
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 구분선 추가 */}
                {/* <div className={styles.divider}></div> */}

                {/* 버튼 부분 */}
                <div className={styles.modal__container__bottom}>
                  <div className={styles.btns}>
                    <button onClick={closeModal} className={styles.submit__close__btn}>
                      닫 기
                    </button>
                    <button type="submit" className={styles.submit__btn}>
                      제 출
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className={styles.songList__title}>
        <h3>제출된 곡 리스트</h3>
      </div>
      <div className={styles.songList__wrap}>
        {songs.map((song, index) => (
          <div
            key={index}
            className={`${styles.songList} ${
              index < 5 ? styles.leftColumn : styles.rightColumn
            }`}
            style={{ gridRow: `${(index % 5) + 1}` }} // 왼쪽 0-4, 오른쪽 5-9까지
          >
            <div>
              <Image src={musicIcon} alt="delete" width={30} height={30} />
            </div>
            <div className={styles.songInfo}>
              <strong>곡 이름:</strong> {song.songName}, <strong>장르:</strong>{" "}
              {song.genres.join(", ")}
            </div>
            <button
              onClick={() => onClickSongDeleteBtn(index)}
              className={styles.delete__btn}
            >
              <Image src={deleteBtn} alt="delete" width={30} height={30} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
