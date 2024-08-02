// MusicList.tsx
import styles from "./css/BestMusic.module.css";
import Image from "next/image";
import Link from "next/link";
import playBtn from "@/../../public/svgs/play_btn.svg";
import threeDot from "@/../../public/svgs/threedot.svg";
import albumDefaultImg from "@/../../public/images/Muzinut.png";

export type MusicDataItem = {
  songId: number;
  albumImg: string;
  title: string;
  nickname: string;
  audio?: Howl | null; // 추가: 오디오 객체
};

interface MusicListProps {
  musicChartData: MusicDataItem;
  index: number;
  showCheckbox: boolean;
  onPlayButtonClick: (songId: number) => void; // 재생 버튼 클릭 핸들러 추가
}

const MusicList: React.FC<MusicListProps> = ({
  musicChartData,
  index,
  showCheckbox,
  onPlayButtonClick, // 핸들러 props 추가
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const nickname = urlParams.get("nickname");
  return (
    <tr className={styles.tr__styles}>
      {showCheckbox && (
        <td className={styles.td1__select}>
          <input type="checkbox" />
        </td>
      )}
      <td className={styles.thumb__picture}>
        <Image
          src={
            `data:image/png;base64, ${musicChartData.albumImg}` ||
            albumDefaultImg
          }
          alt="album"
          width={50}
          height={50}
        />
      </td>
      <td className={styles.ranking}>
        <span>{index + 1}</span>
      </td>
      <td className={styles.song}>
        <Link href={`/details/song/${musicChartData.songId}`}>
          <span>{musicChartData.title}</span>
        </Link>
      </td>
      <td className={styles.artist}>
        <Link href={`/profile?nickname=${musicChartData.nickname}`}>
          <span>{musicChartData.nickname}</span>
        </Link>
      </td>
      <td className={styles.play__btn}>
        <button
          className={styles.btn}
          onClick={() => onPlayButtonClick(musicChartData.songId)}
        >
          <Image src={playBtn} alt="play" width={30} height={30} />
        </button>
      </td>
      <td className={styles.option}>
        <button className={styles.btn}>
          <Image src={threeDot} alt="option" width={30} height={30} />
        </button>
      </td>
    </tr>
  );
};

export default MusicList;
