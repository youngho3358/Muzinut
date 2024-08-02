import Image from "next/image";
import search from "@/../public/images/favicon.png";
import styles from "../chart/css/ArtistList.module.css";
import Link from "next/link";

export type ArtistDataItem = {
  follower: number;
  id: number;
  img: string;
  nickname: string;
  ifFollow: boolean;

  // 통일시키자
  userId: number;
  profileImg: string;
  followCount: number;
};


interface ArtistDataProps {
  artistChartData: ArtistDataItem;
  index: number;
}

const ArtistList: React.FC<ArtistDataProps> = ({ artistChartData, index }) => (
  <tr className={styles.tr__wrap}>
    <td className={styles.td1__ranking}>
      <span>{index + 1}</span>
    </td>
    <td className={styles.td2__picture}>
      <div>
        <Link href={`/profile/lounge`}>
          <Image
            src={
              artistChartData.img
                ? `data:image/png;base64,${artistChartData.img}`
                : search
            }
            alt="album"
            width={150}
            height={150}
          />
        </Link>
        <a href="#"> </a>
      </div>
    </td>
    <td className={styles.td3__info__section}>
      <div>
        <div className={styles.name}>
          <Link href={`/profile?nickname=${artistChartData.nickname}`}>
            <span>{artistChartData.nickname}</span>
          </Link>
        </div>
        <div className={styles.info}>
          <span className={styles.follow__num}>
            팔로워
            <span className={styles.follow__num__green}>
              {" "}
              {artistChartData.follower}
            </span>
            명
          </span>
          <Link href={`/profile/lounge`}>
            <span className={styles.go__profile}>프로필 보기 →</span>
          </Link>
        </div>
      </div>
    </td>
    <td className={styles.td4__follow__btn}>
      <button>팔로잉</button>
    </td>
  </tr>
);

export default ArtistList;
