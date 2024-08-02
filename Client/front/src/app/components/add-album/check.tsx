import styles from "./css/check.module.css";
import Image from "next/image";
import albumThumb from "@/../public/svgs/album_thumb.png";
import peanut from "@/../public/images/sproutPeanut.png";
import nuts from "@/../public/images/Nuts.png";
import { Song } from "./song";

interface AlbumInfoProps {
  title: string;
  songs: Song[]; 
}

 const StepForCheck: React.FC<AlbumInfoProps> = ({
  title,
  songs,
}) => {
  return (
    <div className={styles.step__for__check}>
      {/* 왼쪽 섹션 */}
      <section className={styles.left__section}>
        <Image src={albumThumb} alt="album" width={400} height={400} />

        <div className={styles.album__title}>
          <span>Title: {title}</span>
        </div>
        <div className={styles.album__songs}>
          수록곡: 총 <strong>{songs.length} 곡</strong>
        </div>
      </section>

      <div className={styles.divider}></div>
      {/* 오른쪽 섹션 */}
      <section className={styles.right__section}>
        <div className={styles.img__and__txt}>
          <Image src={peanut} alt="Peanut" width={70} height={70} />

          <h2>음악 업로드 체크리스트</h2>
        </div>
        <div className={styles.ul__container}>
          <ul>
            <li>
              <div className={styles.img__and__txt}>
                <Image src={nuts} alt="nuts" width={30} height={30} />
                <span>저작권 소유자 확인</span>
                <br />
              </div>
              <span className={styles.description}> 
                (저작물 모두 본인의 창작에 의거하여 만들어졌습니다.)
              </span>
            </li>
            <li>
              <div className={styles.img__and__txt}>
                <Image src={nuts} alt="nuts" width={30} height={30} />
                <span>라이센스 동의</span>
              </div>
              <span className={styles.description}> 
                (업로드 한 저작물은 무료로 사용될 것을 동의합니다.)
              </span>
            </li>
            <li>
              <div className={styles.img__and__txt}>
                <Image src={nuts} alt="nuts" width={30} height={30} />
                <span>아티스트와의 협력</span>
              </div>
              <span className={styles.description}> 
                (해당 아티스트의 사용 동의를 얻고 업로드 하였습니다.)</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}


export default StepForCheck;